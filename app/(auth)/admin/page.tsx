"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminAliasPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/company")
  }, [router])

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>企業管理画面へ移動中…</main>
}
