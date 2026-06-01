"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { auth } from "@/app/lib/firebase"
import CheckoutResultNotice from "@/app/components/billing/CheckoutResultNotice"
import KonbiniGuideNotice from "@/app/components/billing/KonbiniGuideNotice"

type DurationDays = 30 | 90 | 180
type PaymentMethod = "card" | "convenience"

type PlanOption = {
  durationDays: DurationDays
  label: string
  sub: string
  price: number
  badge?: string
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    durationDays: 30,
    label: "1ヶ月プラン",
    sub: "まず試したい方向け",
    price: 500,
  },
  {
    durationDays: 90,
    label: "3ヶ月プラン",
    sub: "1ヶ月より300円お得",
    price: 1200,
    badge: "おすすめ",
  },
  {
    durationDays: 180,
    label: "6ヶ月プラン",
    sub: "1ヶ月ずつより1,000円お得",
    price: 2000,
    badge: "お得",
  },
]

const AI_ADDON_PRICE: Record<DurationDays, number> = {
  30: 500,
  90: 1500,
  180: 3000,
}

function yen(n: number) {
  return `¥${n.toLocaleString("ja-JP")}`
}

export default function PlansPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkout = searchParams.get("checkout")

  const [durationDays, setDurationDays] = useState<DurationDays>(90)
  const [method, setMethod] = useState<PaymentMethod>("convenience")
  const [addAiConversation, setAddAiConversation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const selected = useMemo(
    () => PLAN_OPTIONS.find((p) => p.durationDays === durationDays) ?? PLAN_OPTIONS[1],
    [durationDays]
  )

  const aiPrice = addAiConversation ? AI_ADDON_PRICE[durationDays] : 0
  const total = selected.price + aiPrice

  const handleCheckout = async () => {
    setError("")
    setLoading(true)

    try {
      const user = auth.currentUser
      if (!user) {
        router.push("/login")
        return
      }

      const idToken = await user.getIdToken(true)

      const res = await fetch("/api/komoju/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          plan: "7",
          method,
          durationDays,
          industry: "care",
          addAiConversation,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "決済ページの作成に失敗しました")
      }

      window.location.href = data.url
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? "決済ページの作成に失敗しました")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-500">Care Japanese App</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">プラン購入</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              介護日本語・日本語学習・ゲーム機能を、期間を選んで利用できます。
              AI会話は必要な方だけ追加できます。
            </p>
          </div>

          <Link
            href="/mypage"
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm"
          >
            マイページへ
          </Link>
        </div>

        <CheckoutResultNotice checkout={checkout} showAiCta={addAiConversation} />
        <KonbiniGuideNotice />

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">利用期間を選択</h2>
              <p className="mt-1 text-sm text-slate-600">AI以外の基本機能は、1ヶ月・3ヶ月・6ヶ月から選べます。</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {PLAN_OPTIONS.map((p) => {
              const active = p.durationDays === durationDays
              return (
                <button
                  key={p.durationDays}
                  type="button"
                  onClick={() => setDurationDays(p.durationDays)}
                  className={[
                    "relative rounded-3xl border p-5 text-left transition",
                    active
                      ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                      : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
                  ].join(" ")}
                >
                  {p.badge ? (
                    <span
                      className={[
                        "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-black",
                        active ? "bg-white text-slate-900" : "bg-slate-100 text-slate-700",
                      ].join(" ")}
                    >
                      {p.badge}
                    </span>
                  ) : null}

                  <div className="text-lg font-black">{p.label}</div>
                  <div className={active ? "mt-2 text-sm text-slate-200" : "mt-2 text-sm text-slate-500"}>{p.sub}</div>
                  <div className="mt-5 text-3xl font-black">{yen(p.price)}</div>
                  <div className={active ? "mt-1 text-xs text-slate-300" : "mt-1 text-xs text-slate-500"}>税込表示 / 買い切り型</div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">AI会話オプション</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              AI会話・AIスピークを使う場合だけ追加してください。AI追加は1ヶ月500円で、長期プランでも割引なしです。
            </p>

            <button
              type="button"
              onClick={() => setAddAiConversation((v) => !v)}
              className={[
                "mt-5 flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left",
                addAiConversation ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50",
              ].join(" ")}
            >
              <div>
                <div className="font-black">AI会話を追加する</div>
                <div className="mt-1 text-sm text-slate-600">選択期間と同じ期間だけAI機能が利用できます。</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black">+{yen(AI_ADDON_PRICE[durationDays])}</div>
                <div className="text-xs text-slate-500">{addAiConversation ? "追加中" : "未追加"}</div>
              </div>
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">お支払い方法</h2>
            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => setMethod("convenience")}
                className={[
                  "rounded-2xl border p-4 text-left font-black",
                  method === "convenience" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white",
                ].join(" ")}
              >
                🏪 コンビニ決済
                <div className={method === "convenience" ? "mt-1 text-xs text-slate-300" : "mt-1 text-xs text-slate-500"}>
                  入金確認後に利用開始
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={[
                  "rounded-2xl border p-4 text-left font-black",
                  method === "card" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white",
                ].join(" ")}
              >
                💳 クレジットカード
                <div className={method === "card" ? "mt-1 text-xs text-slate-300" : "mt-1 text-xs text-slate-500"}>
                  決済完了後すぐ利用可能
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-500">合計金額</div>
              <div className="mt-1 text-4xl font-black">{yen(total)}</div>
              <div className="mt-2 text-sm text-slate-600">
                {selected.label} {addAiConversation ? "+ AI会話オプション" : ""}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-base font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "決済ページを作成中..." : "購入へ進む"}
            </button>
          </div>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            デジタルコンテンツの性質上、購入後の返金は原則としてお受けしておりません。
            コンビニ決済の場合、入金確認後に反映されます。
          </p>
        </section>
      </div>
    </main>
  )
}
