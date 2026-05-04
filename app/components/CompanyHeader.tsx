"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/app/lib/firebase"
import { useState } from "react"

type CompanyHeaderProps = {
  companyName?: string | null
}

export default function CompanyHeader({ companyName }: CompanyHeaderProps) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    try {
      setLoggingOut(true)
      await signOut(auth)
      router.replace("/company/login")
    } catch (e) {
      console.error("logout failed", e)
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          href="/company"
          className="min-w-0 text-sm font-extrabold tracking-tight text-slate-900 md:text-base"
        >
          {companyName && companyName.trim()
            ? `${companyName} 管理画面`
            : "企業管理画面"}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? "ログアウト中..." : "ログアウト"}
        </button>
      </div>
    </header>
  )
}