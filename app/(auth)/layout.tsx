// app/(auth)/layout.tsx
"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/useAuth"
import { ensureUserProfile } from "@/app/lib/firestore"
import AchievementUnlockViewport from "@/app/components/achievements/AchievementUnlockViewport"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [ready, setReady] = useState(false)

  const isGame = pathname === "/game"

  useEffect(() => {
    if (loading) return

    if (isGame && !user) {
      setReady(true)
      return
    }

    if (!user) {
      router.replace("/login")
      return
    }

    let alive = true
    setReady(false)

    ;(async () => {
      try {
        await ensureUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      } catch (e) {
        console.error("AuthLayout init failed:", e)
      } finally {
        if (alive) setReady(true)
      }
    })()

    return () => {
      alive = false
    }
  }, [user?.uid, user?.email, user?.displayName, loading, router, isGame])

  if (loading) return <p style={{ textAlign: "center" }}>読み込み中…</p>
  if (!user && !isGame) return null
  if (!ready) return <p style={{ textAlign: "center" }}>読み込み中…</p>

  return (
    <>
      {children}
      <AchievementUnlockViewport />
    </>
  )
}
