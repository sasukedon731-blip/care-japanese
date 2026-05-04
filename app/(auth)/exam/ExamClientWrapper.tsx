"use client"

import { useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ExamClient from "./ExamClient"
import { useAuth } from "@/app/lib/useAuth"
import { parseQuizType } from "@/app/lib/quizTypeGuard"
import { getQuizByType } from "@/app/lib/getQuizByType"

export default function ExamClientWrapper() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, loading } = useAuth()

  const quizType = useMemo(() => parseQuizType(params.get("type")), [params])
  const quiz = useMemo(() => (quizType ? getQuizByType(quizType) : null), [quizType])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }
    if (!quizType || !quiz) {
      router.replace("/select-mode")
    }
  }, [loading, user, quizType, quiz, router])

  if (loading) return null
  if (!user) return null
  if (!quizType) return null
  if (!quiz) return null

  return <ExamClient quiz={quiz} />
}
