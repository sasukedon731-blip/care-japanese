"use client"

import { useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ReviewClient from "./ReviewClient"
import { quizzes } from "@/app/data/quizzes"
import type { QuizType } from "@/app/data/types"
import { useAuth } from "@/app/lib/useAuth"

function isQuizType(v: string): v is QuizType {
  return (quizzes as any)[v] != null
}

export default function ReviewClientWrapper() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, loading } = useAuth()

  const typeRaw = params.get("type")
  const quizType = useMemo(() => {
    if (!typeRaw) return null
    if (!isQuizType(typeRaw)) return null
    return typeRaw as QuizType
  }, [typeRaw])

  const quiz = useMemo(() => {
    if (!quizType) return null
    return quizzes[quizType]
  }, [quizType])

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

  return <ReviewClient quiz={quiz} />
}
