// app/lib/firestore.ts
"use client"

import { db } from "@/app/lib/firebase"
import { deleteField, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export type UserRole = "admin" | "company_admin" | "learner"

type EnsureParams = {
  uid: string
  email?: string | null
  displayName?: string | null
}

export async function ensureUserProfile(params: EnsureParams) {
  const { uid } = params
  const email = params.email ?? null
  const displayName = params.displayName ?? null

  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      email,
      displayName,
      accountType: "personal",
      role: "learner" as UserRole,
      companyCode: null,
      companyName: null,
      billing: {
        accountType: "personal",
        method: "convenience",
        status: "inactive",
        currentPlan: null,
        currentPeriodEnd: null,
        aiConversationEnabled: false,
        aiConversationExpiresAt: null,
      },
      selectedQuizTypes: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return
  }

  const data = snap.data() as any
  const patch: Record<string, any> = {
    uid,
    updatedAt: serverTimestamp(),
  }

  if (email && !data?.email) patch.email = email
  if (displayName && !data?.displayName) patch.displayName = displayName
  if (!data?.accountType) patch.accountType = "personal"
  if (!data?.role) patch.role = "learner"
  if (!("companyCode" in data)) patch.companyCode = null
  if (!("companyName" in data)) patch.companyName = null
  if (typeof data?.quizLimit === "number") patch.quizLimit = deleteField()
  if (!Array.isArray(data?.selectedQuizTypes)) patch.selectedQuizTypes = []
  if (!data?.billing) {
    patch.billing = {
      accountType: data?.accountType === "company" ? "company" : "personal",
      method: "convenience",
      status: "inactive",
      currentPlan: null,
      currentPeriodEnd: null,
      aiConversationEnabled: false,
      aiConversationExpiresAt: null,
    }
  }

  await setDoc(ref, patch, { merge: true })
}

export async function getUserRole(uid: string): Promise<UserRole> {
  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return "learner"
  const role = (snap.data() as any)?.role
  if (role === "admin" || role === "company_admin") return role
  return "learner"
}
