"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore"

import { auth, db } from "@/app/lib/firebase"
import CompanyHeader from "@/app/components/CompanyHeader"
import LegalFooter from "@/app/components/LegalFooter"

type UserDoc = {
  displayName?: string
  email?: string
  role?: "admin" | "company_admin" | "learner"
  accountType?: "personal" | "company"
  companyCode?: string | null
  companyName?: string
  createdAt?: any
  updatedAt?: any
}

type ResultDoc = {
  score?: number
  correctCount?: number
  totalQuestions?: number
  accuracy?: number
  quizType?: string
  mode?: string
  createdAt?: any
  updatedAt?: any
}

type ProgressDoc = {
  quizType?: string
  completedCount?: number
  totalCount?: number
  totalSessions?: number
  todaySessions?: number
  streak?: number
  bestStreak?: number
  accuracy?: number
  lastStudyDate?: string
  lastStudiedAt?: any
  updatedAt?: any
}

type AchievementDoc = {
  title?: string
  name?: string
  badge?: string
  createdAt?: any
  updatedAt?: any
}

function formatDate(value: any) {
  if (!value) return "—"

  try {
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleString("ja-JP")
    }
    if (value instanceof Date) {
      return value.toLocaleString("ja-JP")
    }
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return "—"
    return d.toLocaleString("ja-JP")
  } catch {
    return "—"
  }
}

function formatPercent(value: number | null) {
  if (value == null || Number.isNaN(value)) return "—"
  return `${Math.round(value)}%`
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function getUserDocWithRetry(uid: string, maxRetry = 5) {
  for (let i = 0; i < maxRetry; i += 1) {
    const snap = await getDoc(doc(db, "users", uid))
    if (snap.exists()) return snap
    await sleep(250 * (i + 1))
  }

  return getDoc(doc(db, "users", uid))
}

function formatQuizTypeLabel(quizType?: string) {
  if (!quizType) return "未設定"

  const map: Record<string, string> = {
    "japanese-n4": "日本語検定 N4",
    "japanese-n3": "日本語検定 N3",
    "japanese-n2": "日本語検定 N2",
    "care-terms": "介護用語",
    "care-listening": "介護リスニング",
    "care-conversation": "介護現場会話",
    "care-worker-exam": "介護福祉士試験",
  }

  return map[quizType] ?? quizType
}

export default function CompanyLearnerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const targetUid = String(params?.uid ?? "")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [viewerCompanyCode, setViewerCompanyCode] = useState("")
  const [viewerCompanyName, setViewerCompanyName] = useState("企業管理画面")

  const [userData, setUserData] = useState<UserDoc | null>(null)
  const [results, setResults] = useState<ResultDoc[]>([])
  const [progressList, setProgressList] = useState<ProgressDoc[]>([])
  const [achievements, setAchievements] = useState<AchievementDoc[]>([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/company/login")
        return
      }

      try {
        setLoading(true)
        setError("")

        await firebaseUser.getIdToken(true)

        const viewerSnap = await getUserDocWithRetry(firebaseUser.uid)

        if (!viewerSnap.exists()) {
          setError("管理者情報が見つかりません。")
          setLoading(false)
          return
        }

        const viewer = viewerSnap.data() as UserDoc
        const role = viewer.role ?? ""
        const companyCode = viewer.companyCode ?? ""
        const companyName = viewer.companyName ?? "企業管理画面"

        setViewerCompanyCode(companyCode)
        setViewerCompanyName(companyName)

        if (role !== "admin" && role !== "company_admin") {
          setError("この画面を見る権限がありません。")
          setLoading(false)
          return
        }

        const targetRef = doc(db, "users", targetUid)
        const targetSnap = await getDoc(targetRef)

        if (!targetSnap.exists()) {
          setError("学習者が見つかりません。")
          setLoading(false)
          return
        }

        const targetUser = targetSnap.data() as UserDoc

        if (role === "company_admin" && targetUser.companyCode !== companyCode) {
          setError("この学習者を見る権限がありません。")
          setLoading(false)
          return
        }

        setUserData(targetUser)

        const resultsRef = collection(db, "users", targetUid, "results")
        let resultsDocs: ResultDoc[] = []

        try {
          const resultsSnap = await getDocs(
            query(resultsRef, orderBy("createdAt", "desc"), limit(20))
          )
          resultsDocs = resultsSnap.docs.map((d) => d.data() as ResultDoc)
        } catch {
          const resultsSnap = await getDocs(resultsRef)
          resultsDocs = resultsSnap.docs.map((d) => d.data() as ResultDoc)
        }

        setResults(resultsDocs)

        const progressRef = collection(db, "users", targetUid, "progress")
        const progressSnap = await getDocs(progressRef)
        setProgressList(progressSnap.docs.map((d) => ({ quizType: d.id, ...(d.data() as ProgressDoc) })))

        const achievementsRef = collection(db, "users", targetUid, "achievements")
        const achievementsSnap = await getDocs(achievementsRef)
        setAchievements(
          achievementsSnap.docs.map((d) => d.data() as AchievementDoc)
        )
      } catch (e) {
        console.error(e)
        setError("学習者データの読み込みに失敗しました。")
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [router, targetUid])

  const summary = useMemo(() => {
    const normalStudyCount = progressList.reduce((sum, p) => sum + (typeof p.totalSessions === "number" ? p.totalSessions : 0), 0)
    const studyCount = results.length + normalStudyCount

    let totalCorrect = 0
    let totalQuestions = 0
    let accuracySum = 0
    let accuracyCount = 0
    let latestDateMs = 0

    for (const r of results) {
      if (typeof r.correctCount === "number") totalCorrect += r.correctCount
      if (typeof r.totalQuestions === "number") totalQuestions += r.totalQuestions

      if (typeof r.accuracy === "number") {
        accuracySum += r.accuracy
        accuracyCount += 1
      } else if (
        typeof r.correctCount === "number" &&
        typeof r.totalQuestions === "number" &&
        r.totalQuestions > 0
      ) {
        accuracySum += (r.correctCount / r.totalQuestions) * 100
        accuracyCount += 1
      }

      const rawDate =
        typeof r.createdAt?.toDate === "function"
          ? r.createdAt.toDate().getTime()
          : r.createdAt
            ? new Date(r.createdAt).getTime()
            : 0

      if (rawDate > latestDateMs) latestDateMs = rawDate
    }

    for (const p of progressList) {
      const rawDate =
        typeof p.lastStudiedAt?.toDate === "function"
          ? p.lastStudiedAt.toDate().getTime()
          : typeof p.updatedAt?.toDate === "function"
            ? p.updatedAt.toDate().getTime()
            : p.lastStudiedAt
              ? new Date(p.lastStudiedAt).getTime()
              : p.updatedAt
                ? new Date(p.updatedAt).getTime()
                : typeof p.lastStudyDate === "string"
                  ? new Date(`${p.lastStudyDate}T00:00:00+09:00`).getTime()
                  : 0

      if (rawDate > latestDateMs) latestDateMs = rawDate
    }

    const averageAccuracy =
      accuracyCount > 0
        ? accuracySum / accuracyCount
        : totalQuestions > 0
          ? (totalCorrect / totalQuestions) * 100
          : null

    return {
      studyCount,
      averageAccuracy,
      lastStudiedAt: latestDateMs ? new Date(latestDateMs) : null,
      badgeCount: achievements.length,
    }
  }, [results, progressList, achievements])

  const sortedProgress = useMemo(() => {
    return [...progressList].sort((a, b) => {
      const aName = a.quizType ?? ""
      const bName = b.quizType ?? ""
      return aName.localeCompare(bName, "ja")
    })
  }, [progressList])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CompanyHeader companyName={viewerCompanyName || viewerCompanyCode || "企業管理画面"} />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-500">読み込み中...</p>
          </div>
        </main>
        <LegalFooter />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CompanyHeader companyName={viewerCompanyName || viewerCompanyCode || "企業管理画面"} />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-red-600">{error}</p>
            <div className="mt-6">
              <Link
                href="/company"
                className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                TOPへ戻る
              </Link>
            </div>
          </div>
        </main>
        <LegalFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CompanyHeader companyName={viewerCompanyName || viewerCompanyCode || "企業管理画面"} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">LEARNER DETAIL</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              学習者詳細
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              学習状況、進捗、獲得バッジを確認できます。
            </p>
          </div>

          <Link
            href="/company"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← 一覧へ戻る
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">学習者名</p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {userData?.displayName || "未設定"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">メールアドレス</p>
            <p className="mt-2 text-lg font-bold text-slate-900 break-all">
              {userData?.email || "未設定"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">所属企業</p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {userData?.companyName || userData?.companyCode || "未設定"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">最終更新</p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {formatDate(userData?.updatedAt ?? userData?.createdAt)}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">学習回数</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">
              {summary.studyCount}回
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">平均正答率</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">
              {formatPercent(summary.averageAccuracy)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">最終学習日時</p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {summary.lastStudiedAt
                ? summary.lastStudiedAt.toLocaleString("ja-JP")
                : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">獲得バッジ数</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">
              {summary.badgeCount}件
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">教材ごとの進捗</h2>
              <span className="text-sm text-slate-500">{sortedProgress.length} 件</span>
            </div>

            {sortedProgress.length === 0 ? (
              <p className="text-sm text-slate-500">
                進捗データはまだありません。
              </p>
            ) : (
              <div className="space-y-3">
                {sortedProgress.map((item, idx) => (
                  <div
                    key={`${item.quizType ?? "quiz"}-${idx}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {formatQuizTypeLabel(item.quizType)}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          学習回数: {item.totalSessions ?? item.completedCount ?? 0}回 / 今日: {item.todaySessions ?? 0}回
                        </div>
                      </div>

                      <div className="text-sm text-slate-600">
                        連続学習: {item.streak ?? 0}日 / 最高: {item.bestStreak ?? 0}日
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      最終学習: {formatDate(item.lastStudiedAt ?? item.updatedAt ?? item.lastStudyDate)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">獲得バッジ</h2>
              <span className="text-sm text-slate-500">
                {achievements.length} 件
              </span>
            </div>

            {achievements.length === 0 ? (
              <p className="text-sm text-slate-500">
                バッジはまだありません。
              </p>
            ) : (
              <div className="space-y-3">
                {achievements.map((badge, idx) => (
                  <div
                    key={`${badge.title ?? badge.name ?? "badge"}-${idx}`}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
                  >
                    <div className="font-semibold text-slate-900">
                      {badge.title || badge.name || badge.badge || "バッジ"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatDate(badge.createdAt ?? badge.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">最近の学習履歴</h2>
            <span className="text-sm text-slate-500">{results.length} 件</span>
          </div>

          {results.length === 0 ? (
            <p className="text-sm text-slate-500">
              学習履歴はまだありません。
            </p>
          ) : (
            <div className="space-y-3">
              {results.map((item, idx) => {
                const accuracy =
                  typeof item.accuracy === "number"
                    ? item.accuracy
                    : typeof item.correctCount === "number" &&
                      typeof item.totalQuestions === "number" &&
                      item.totalQuestions > 0
                    ? (item.correctCount / item.totalQuestions) * 100
                    : null

                return (
                  <div
                    key={`${item.quizType ?? "quiz"}-${idx}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {formatQuizTypeLabel(item.quizType)}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {item.mode || "normal"} / {formatDate(item.createdAt ?? item.updatedAt)}
                        </div>
                      </div>

                      <div className="text-sm text-slate-600">
                        スコア: {typeof item.score === "number" ? item.score : "—"} / 正答率: {formatPercent(accuracy)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <LegalFooter />
    </div>
  )
}