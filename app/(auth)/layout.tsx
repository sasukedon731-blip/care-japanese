// app/(auth)/layout.tsx
"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { usePathname, useRouter } from "next/navigation"

import AchievementUnlockViewport from "@/app/components/achievements/AchievementUnlockViewport"
import { db } from "@/app/lib/firebase"
import { ensureUserProfile } from "@/app/lib/firestore"
import { isBillingActive, type BillingLike } from "@/app/lib/billingAccess"
import { useAuth } from "@/app/lib/useAuth"

const FREE_AUTH_PATHS = [
  "/plans",
  "/mypage",
  "/ai",
  "/admin",
  "/company",
]

function isFreeAuthPath(pathname: string) {
  return FREE_AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function canUseWithoutPersonalPayment(data: any) {
  const role = data?.role
  const accountType = data?.accountType

  // 管理者・企業管理者は管理画面のため個人決済不要
  if (role === "admin" || role === "company_admin") return true

  // 企業契約ユーザーは会社契約側で利用させる想定
  if (accountType === "company") return true
  if (typeof data?.companyCode === "string" && data.companyCode.trim()) return true

  return false
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    let alive = true
    setReady(false)

    ;(async () => {
      let didRedirect = false

      try {
        await ensureUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })

        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.exists() ? userSnap.data() : {}

        const paymentExempt = isFreeAuthPath(pathname) || canUseWithoutPersonalPayment(userData)
        const billing = (userData as any)?.billing as BillingLike | null | undefined
        const hasActiveBilling = isBillingActive(billing)

        if (!paymentExempt && !hasActiveBilling) {
          didRedirect = true
          router.replace("/plans")
          return
        }
      } catch (e) {
        console.error("AuthLayout init failed:", e)
      } finally {
        if (alive && !didRedirect) setReady(true)
      }
    })()

    return () => {
      alive = false
    }
  }, [user?.uid, user?.email, user?.displayName, loading, router, pathname])

  if (loading) return <p style={{ textAlign: "center" }}>読み込み中…</p>
  if (!user) return null
  if (!ready) return <p style={{ textAlign: "center" }}>読み込み中…</p>

  return (
    <>
      {children}
      <AchievementUnlockViewport />
    </>
  )
}
