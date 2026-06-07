// app/lib/billingAccess.ts

export type BillingLike = Partial<{
  accountType: "personal" | "company"
  method: "convenience" | "card" | "bank_transfer" | "company_contract"
  status: "inactive" | "pending" | "active" | "past_due" | "canceled"
  currentPlan: "trial" | "free" | "3" | "5" | "7" | "standard"
  currentPeriodEnd: any
  aiConversationEnabled: boolean
  aiConversationExpiresAt: any
}>

function toDate(value: any): Date | null {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value?.toDate === "function") {
    const d = value.toDate()
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null
  }

  if (typeof value?.seconds === "number") {
    return new Date(value.seconds * 1000)
  }

  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function isCompanyContractBilling(billing?: BillingLike | null) {
  if (!billing) return false
  return (
    billing.status === "active" &&
    (billing.accountType === "company" || billing.method === "company_contract")
  )
}

export function isBillingActive(billing?: BillingLike | null) {
  if (!billing) return false
  if (billing.status !== "active") return false

  // 企業契約は会社側の契約で利用するため、個人ごとの有効期限は持たせない
  if (isCompanyContractBilling(billing)) return true

  const end = toDate(billing.currentPeriodEnd)
  if (!end) return false

  return end.getTime() > Date.now()
}

export function canUseAiConversation(billing?: BillingLike | null) {
  if (!billing) return false
  if (!billing.aiConversationEnabled) return false
  if (billing.status !== "active") return false

  // 企業契約のAIは会社単位で切り替える想定。期限は個人には持たせない。
  if (isCompanyContractBilling(billing)) return true

  const end = toDate(billing.aiConversationExpiresAt)
  if (!end) return false

  return end.getTime() > Date.now()
}

export function getBillingDaysLeft(billing?: BillingLike | null) {
  if (isCompanyContractBilling(billing)) return null

  const end = toDate(billing?.currentPeriodEnd)
  if (!end) return 0

  const diff = end.getTime() - Date.now()
  if (diff <= 0) return 0

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getAiConversationDaysLeft(billing?: BillingLike | null) {
  if (isCompanyContractBilling(billing) && billing?.aiConversationEnabled) return null

  const end = toDate(billing?.aiConversationExpiresAt)
  if (!end) return 0

  const diff = end.getTime() - Date.now()
  if (diff <= 0) return 0

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getBillingEndDate(billing?: BillingLike | null) {
  return toDate(billing?.currentPeriodEnd)
}

export function getAiConversationEndDate(billing?: BillingLike | null) {
  return toDate(billing?.aiConversationExpiresAt)
}

export function getBillingViewState(billing?: BillingLike | null) {
  if (isCompanyContractBilling(billing)) return "company_contract" as const
  if (!billing) return "none" as const
  if (billing.status === "inactive") return "none" as const
  if (billing.status === "pending") return "pending" as const
  if (billing.status === "past_due") return "past_due" as const
  if (billing.status === "canceled") return "canceled" as const
  if (isBillingActive(billing)) return "active" as const
  return "expired" as const
}

export function getPlanLabel(plan?: string | null) {
  switch (plan) {
    case "3":
    case "5":
    case "7":
    case "standard":
      return "Care Japanese App"
    case "trial":
      return "1日無料体験"
    case "free":
      return "無料プラン"
    default:
      return "未契約"
  }
}

export function formatDateJP(date?: Date | null) {
  if (!date) return "-"
  return date.toLocaleDateString("ja-JP")
}
