"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useAuth } from "@/app/lib/useAuth"
import { parseQuizType } from "@/app/lib/quizTypeGuard"
import { getQuizByType } from "@/app/lib/getQuizByType"

export default function QuizPage() {
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

  if (loading) return <div className="p-4">Loading...</div>
  if (!user) return null
  if (!quizType || !quiz) return null

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">教材モード選択</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{quiz.title}</h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          学び方を選んでください。通常学習、模擬試験、復習モードに進めます。
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <ModeLink href={`/normal?type=${encodeURIComponent(quizType)}`} title="通常" description="基礎を固める" />
          <ModeLink href={`/exam?type=${encodeURIComponent(quizType)}`} title="模擬試験" description="本番形式で学ぶ" />
          <ModeLink href={`/review?type=${encodeURIComponent(quizType)}`} title="復習" description="苦手をやり直す" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/select-mode" className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            学習選択へ戻る
          </Link>
          <Link href="/contents" className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            教材一覧へ戻る
          </Link>
        </div>
      </div>
    </main>
  )
}

function ModeLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-base font-bold text-gray-900">{title}</div>
      <div className="mt-1 text-xs text-gray-500">{description}</div>
    </Link>
  )
}
