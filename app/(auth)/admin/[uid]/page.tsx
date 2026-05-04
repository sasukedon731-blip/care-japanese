"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function AdminUserAliasPage() {
  const router = useRouter()
  const params = useParams<{ uid: string }>()

  useEffect(() => {
    if (!params?.uid) return
    router.replace(`/company/${params.uid}`)
  }, [params?.uid, router])

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>企業管理画面へ移動中…</main>
}
