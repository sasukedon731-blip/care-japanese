"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import SpeakingClient from "./SpeakingClient"
import { useAuth } from "@/app/lib/useAuth"

export default function SpeakingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) router.replace("/login")
  }, [loading, router, user])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">読み込み中...</p>
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <SpeakingClient />
    </main>
  )
}
