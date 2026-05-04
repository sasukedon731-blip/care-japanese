// app/lib/guards.ts
import type { BillingStatus } from "@/app/lib/plan"

export type AccessCheck =
  | { ok: true; userDoc: any; billingStatus: BillingStatus }
  | { ok: false; reason: "no_user" | "inactive"; billingStatus: BillingStatus }

export async function assertActiveAccess(uid: string): Promise<AccessCheck> {
  // このアプリではプラン選択・課金ゲートを使わないため、ログイン済みなら常に利用可能にする。
  return { ok: true, userDoc: { uid }, billingStatus: "active" }
}
