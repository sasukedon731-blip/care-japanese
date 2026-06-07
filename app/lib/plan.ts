import { quizzes } from "@/app/data/quizzes"
import type { QuizType } from "@/app/data/types"

export type PlanId = "trial" | "free" | "3" | "5" | "7" | "standard"
export type SelectLimit = number | "ALL"

export function getSelectLimit(_plan: PlanId): SelectLimit {
  return "ALL"
}

export function buildEntitledQuizTypes(_plan: PlanId): QuizType[] {
  return Object.keys(quizzes) as QuizType[]
}

export function normalizeSelectedForPlan(
  selected: QuizType[],
  entitled: QuizType[],
  _plan: PlanId
): QuizType[] {
  const uniq = Array.from(new Set(selected)).filter((q) => entitled.includes(q))
  return uniq.length > 0 ? uniq : entitled
}

export type BillingStatus = "inactive" | "pending" | "active" | "past_due" | "canceled"
export type BillingMethod = "convenience" | "card" | "bank_transfer" | "company_contract"
export type AccountType = "personal" | "company"

function toDate(value: any): Date | null {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value?.toDate === "function") {
    const d = value.toDate()
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null
  }
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000)
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function getBillingStatus(userDoc: any): BillingStatus {
  const status = userDoc?.billing?.status
  if (status === "active" || status === "pending" || status === "past_due" || status === "canceled") return status
  return "inactive"
}

export function isAccessActive(userDoc: any): boolean {
  const billing = userDoc?.billing
  if (billing?.status !== "active") return false

  if (
    billing?.accountType === "company" ||
    billing?.method === "company_contract" ||
    userDoc?.accountType === "company" ||
    (typeof userDoc?.companyCode === "string" && userDoc.companyCode.trim())
  ) {
    return true
  }

  const end = toDate(billing?.currentPeriodEnd)
  return !!end && end.getTime() > Date.now()
}

export function getEffectivePlanId(userDoc: any): PlanId {
  const plan = userDoc?.billing?.currentPlan ?? userDoc?.plan
  return isPlanId(plan) ? plan : "trial"
}
