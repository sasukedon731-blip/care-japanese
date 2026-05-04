"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PlansPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/select-mode")
  }, [router])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-600">このアプリではプラン選択は不要です。学習メニューへ移動しています...</p>
      </div>
    </main>
  )
}
