// app/api/stripe/checkout/route.ts
import Stripe from "stripe"
import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/app/lib/firebaseAdmin"
import { setUserBillingMerge } from "@/app/lib/billingServer"

export const runtime = "nodejs"

type IndustryId = "care" | "undecided"

type Body = {
  idToken: string
  plan: "3" | "5" | "7"
  method: "convenience" | "card"
  durationDays: 30 | 90 | 180
  industry?: IndustryId | null
  addAiConversation?: boolean
}

// ✅ 買い切り型：1ヶ月・3ヶ月・6ヶ月
// 介護アプリでは基本機能を「Care Japanese App」として販売するため、
// フロントからは plan="7"（全教材）で送る。旧3/5プラン互換のため価格定義は残す。
const PRICE_TABLE: Record<Body["plan"], Record<30 | 90 | 180, number>> = {
  "3": {
    30: 500,
    90: 1200,
    180: 2000,
  },
  "5": {
    30: 500,
    90: 1200,
    180: 2000,
  },
  "7": {
    30: 500,
    90: 1200,
    180: 2000,
  },
}


const PRICE_TABLE_ADDON: Record<30 | 90 | 180, number> = {
  30: 500,
  90: 1500,
  180: 3000,
}

function isValidDuration(v: any): v is 30 | 90 | 180 {
  return v === 30 || v === 90 || v === 180
}


function hasFuturePeriodEnd(value: any) {
  if (!value) return false

  let date: Date | null = null

  if (value instanceof Date) {
    date = value
  } else if (typeof value?.toDate === "function") {
    date = value.toDate()
  } else {
    const d = new Date(value)
    date = Number.isNaN(d.getTime()) ? null : d
  }

  return !!date && date.getTime() > Date.now()
}
function isIndustryId(v: any): v is IndustryId {
  return (
    v === "care" ||
    v === "undecided"
  )
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body

    if (!body?.idToken || !body?.plan || !body?.method) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 })
    }
    if (body.plan !== "3" && body.plan !== "5" && body.plan !== "7") {
      return NextResponse.json({ error: "Bad plan" }, { status: 400 })
    }
    if (body.method !== "convenience" && body.method !== "card") {
      return NextResponse.json({ error: "Bad method" }, { status: 400 })
    }
    if (!isValidDuration(body.durationDays)) {
      return NextResponse.json({ error: "Bad durationDays" }, { status: 400 })
    }

    // industry は任意（未選択OK）
    const industry = isIndustryId(body.industry) ? body.industry : undefined

    // ✅ Verify Firebase user
    const decoded = await adminAuth().verifyIdToken(body.idToken)
    const uid = decoded.uid

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    })

    const amount = PRICE_TABLE[body.plan][body.durationDays]
    const aiConversationAmount = body.addAiConversation ? PRICE_TABLE_ADDON[body.durationDays] : 0
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

if (!appUrl) {
  throw new Error("Missing NEXT_PUBLIC_APP_URL")
}

    const planName = "Care Japanese App"

    // ✅ Create Checkout Session (one-time payment)
    // Konbini is async: webhook flips pending -> active.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `${planName}（${body.durationDays}日）`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
        ...(body.addAiConversation
          ? [{
              price_data: {
                currency: "jpy",
                product_data: {
                  name: `AI会話オプション（${body.durationDays}日）`,
                },
                unit_amount: aiConversationAmount,
              },
              quantity: 1,
            }]
          : []),
      ],
      payment_method_types:
        body.method === "convenience" ? ["konbini"] : ["card"],
      success_url: `${appUrl}/plans?checkout=success`,
      cancel_url: `${appUrl}/plans?checkout=cancel`,
      client_reference_id: uid,

      // ✅ ここに industry を入れて webhook で確実に拾う
      metadata: {
        uid,
        plan: body.plan,
        method: body.method,
        durationDays: String(body.durationDays),
        ...(industry ? { industry } : {}),
        addAiConversation: body.addAiConversation ? "true" : "false",
      },

      payment_intent_data: {
        metadata: {
          uid,
          plan: body.plan,
          method: body.method,
          durationDays: String(body.durationDays),
          ...(industry ? { industry } : {}),
          addAiConversation: body.addAiConversation ? "true" : "false",
        },
      },
    })

    // ✅ 既存の有効期限は消さない
    //    - 更新購入時に残り日数をリセットしない
    //    - すでに有効な契約中なら access は active のまま保つ
    const userSnap = await adminDb().collection("users").doc(uid).get()
    const currentBilling = userSnap.exists
      ? (userSnap.data()?.billing ?? {})
      : {}

    const keepActive =
      currentBilling?.status === "active" &&
      hasFuturePeriodEnd(currentBilling?.currentPeriodEnd)

    await setUserBillingMerge(uid, {
      accountType: "personal",
      method: body.method,
      status: keepActive ? "active" : "pending",
      currentPlan: body.plan,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    )
  }
}