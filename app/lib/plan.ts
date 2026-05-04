import { quizzes } from "@/app/data/quizzes"
import type { QuizType } from "@/app/data/types"

export type PlanId = "trial" | "free" | "3" | "5" | "7"
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

export type BillingStatus = "pending" | "active" | "past_due" | "canceled"
export type BillingMethod = "convenience" | "card" | "bank_transfer"
export type AccountType = "personal" | "company"

export function getBillingStatus(_userDoc: any): BillingStatus {
  return "active"
}

export function isAccessActive(_userDoc: any): boolean {
  return true
}

export function getEffectivePlanId(_userDoc: any): PlanId {
  return "7"
}
