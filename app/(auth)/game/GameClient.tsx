"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import type { QuizType } from "@/app/data/types"
import { quizzes } from "@/app/data/quizzes"
import TileDropGame from "./TileDropGame"
import SpeedChoiceGame from "./SpeedChoiceGame"
import FlashJudgeGame from "./FlashJudgeGame"
import MemoryBurstGame from "./MemoryBurstGame"
import type { GameKind } from "./types"

import { useAuth } from "@/app/lib/useAuth"
import { canGuestPlayToday, markGuestPlayedToday } from "./guestLimit"
import { db } from "@/app/lib/firebase"
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore"
import { enqueueAchievementToasts } from "@/app/lib/achievementToastQueue"
import { getBadgeMeta } from "@/app/lib/badges"

function isQuizType(v: any): v is QuizType {
  if (typeof v !== "string") return false
  return v in quizzes
}

function isGameKind(v: any): v is GameKind {
  return (
    v === "tile-drop" ||
    v === "speed-choice" ||
    v === "flash-judge" ||
    v === "memory-burst" ||
    v === "sentence-build"
  )
}

function readStoredKind(): GameKind | null {
  try {
    if (typeof window === "undefined") return null
    const v = window.sessionStorage.getItem("lastGameKind")
    return isGameKind(v) ? v : null
  } catch {
    return null
  }
}

function GuestBlocked({ onLogin }: { onLogin: () => void }) {
  return (
    <main style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>
      <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 16 }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>今日はもうプレイ済み！</div>
        <div style={{ marginTop: 8, opacity: 0.8, lineHeight: 1.6 }}>
          ゲストは <b>1日1回（ノーマルのみ）</b> まで。
          <br />
          ログインするとプレイ履歴が保存されるぜ。
        </div>
        <button
          onClick={onLogin}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "none",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          ログインする
        </button>
      </div>
    </main>
  )
}

export default function GameClient() {
  const params = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const rawType = params.get("type")
  const rawMode = params.get("mode")
  const rawKind = params.get("kind")

  const quizType: QuizType = useMemo(() => {
    return isQuizType(rawType) ? rawType : "japanese-n4"
  }, [rawType])

  const modeParam = rawMode === "attack" ? "attack" : "normal"
  const awardOnceRef = useRef(false)

  const kind: GameKind = useMemo(() => {
    if (isGameKind(rawKind)) return rawKind
    const stored = readStoredKind()
    return stored ?? "tile-drop"
  }, [rawKind])

  useEffect(() => {
    try {
      sessionStorage.setItem("lastGameKind", kind)
    } catch {}
  }, [kind])

  const [guestOk, setGuestOk] = useState(true)

  useEffect(() => {
    if (modeParam !== "normal") return
    if (user) return
    setGuestOk(canGuestPlayToday())
  }, [modeParam, user])

  useEffect(() => {
    if (modeParam !== "normal") return
    if (user) return
    if (!guestOk) return
    markGuestPlayedToday()
  }, [modeParam, user, guestOk])

  const checkingUserLimit = false
  const userOk = true

  useEffect(() => {
    if (!user || checkingUserLimit || !userOk || awardOnceRef.current) return
    awardOnceRef.current = true

    ;(async () => {
      try {
        const userRef = doc(db, "users", user.uid)
        const snap = await getDoc(userRef)
        const badges = Array.isArray(snap.data()?.badges)
          ? snap.data()!.badges.filter((x: unknown): x is string => typeof x === "string")
          : []

        const nextIds: string[] = []
        if (!badges.includes("battle-first-play")) nextIds.push("battle-first-play")
        if (modeParam === "attack" && !badges.includes("battle-attack-first")) {
          nextIds.push("battle-attack-first")
        }

        if (!nextIds.length) return

        await setDoc(userRef, { badges: arrayUnion(...nextIds) }, { merge: true })

        enqueueAchievementToasts(
          nextIds.map((id) => {
            const meta = getBadgeMeta(id)
            return { id, icon: meta.icon, label: meta.label, rarity: meta.rarity }
          })
        )
      } catch (e) {
        console.error("game achievement award failed:", e)
      }
    })()
  }, [user, checkingUserLimit, userOk, modeParam])

  if (modeParam === "normal" && !user && !guestOk) {
    return <GuestBlocked onLogin={() => router.push("/login")} />
  }

  if (user && checkingUserLimit) {
    return (
      <main style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>
        <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>読み込み中…</div>
          <div style={{ marginTop: 8, opacity: 0.8, lineHeight: 1.6 }}>
            プレイ制限を確認しているぜ。
          </div>
        </div>
      </main>
    )
  }

  if (kind === "speed-choice") {
    return <SpeedChoiceGame quizType={quizType} modeParam={modeParam} />
  }

  if (kind === "flash-judge") {
    return <FlashJudgeGame quizType={quizType} modeParam={modeParam} />
  }

  if (kind === "memory-burst") {
    return <MemoryBurstGame quizType={quizType} modeParam={modeParam} />
  }

  return <TileDropGame quizType={quizType} modeParam={modeParam} />
}
