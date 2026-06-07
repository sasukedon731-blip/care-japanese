"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"

import { auth, db } from "@/app/lib/firebase"
import CompanyHeader from "@/app/components/CompanyHeader"
import LegalFooter from "@/app/components/LegalFooter"
import { getQuizDef } from "@/app/data/quizCatalog"

type CompanyDoc = {
  name?: string
  status?: string
}

type UserDoc = {
  displayName?: string
  email?: string
  role?: "admin" | "company_admin" | "learner"
  accountType?: "personal" | "company"
  companyCode?: string | null
  companyName?: string | null
  createdAt?: any
  updatedAt?: any
}

type ResultDoc = {
  score?: number
  total?: number
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
  totalSessions?: number
  todaySessions?: number
  streak?: number
  bestStreak?: number
  lastStudyDate?: string
  lastStudiedAt?: any
  updatedAt?: any
}

type QuizSummary = {
  quizType: string
  label: string
  sessions: number
  averageAccuracy: number | null
  lastStudiedAt: Date | null
}

type AchievementDoc = {
  title?: string
  name?: string
  badge?: string
  createdAt?: any
  updatedAt?: any
}

type LearnerRow = {
  uid: string
  displayName: string
  email: string
  role: string
  companyCode: string
  companyName: string
  studyCount: number
  averageAccuracy: number | null
  lastStudiedAt: Date | null
  badgeCount: number
  mainLearning: string
  quizSummaries: QuizSummary[]
  status: "未学習" | "学習中" | "7日以上未学習"
}

function parseDateValue(value: any): Date | null {
  if (!value) return null
  try {
    if (typeof value?.toDate === "function") return value.toDate()
    if (value instanceof Date) return value
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  } catch {
    return null
  }
}

function formatDate(value: Date | null) {
  if (!value) return "—"
  try {
    return value.toLocaleString("ja-JP")
  } catch {
    return "—"
  }
}

function formatPercent(value: number | null) {
  if (value == null || Number.isNaN(value)) return "—"
  return `${Math.round(value)}%`
}

function getStatus(
  lastStudiedAt: Date | null,
  studyCount: number
): LearnerRow["status"] {
  if (studyCount === 0 || !lastStudiedAt) return "未学習"

  const diff = Date.now() - lastStudiedAt.getTime()
  const sevenDays = 1000 * 60 * 60 * 24 * 7

  if (diff > sevenDays) return "7日以上未学習"
  return "学習中"
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function formatQuizLabel(quizType?: string) {
  if (!quizType) return "未設定"
  const def = getQuizDef(quizType)
  return def?.title ?? quizType
}

function getResultAccuracy(r: ResultDoc) {
  if (typeof r.accuracy === "number") return r.accuracy
  if (typeof r.correctCount === "number" && typeof r.totalQuestions === "number" && r.totalQuestions > 0) {
    return (r.correctCount / r.totalQuestions) * 100
  }
  if (typeof r.score === "number" && typeof r.total === "number" && r.total > 0) {
    return (r.score / r.total) * 100
  }
  return null
}

function getProgressDate(p: ProgressDoc) {
  if (p.lastStudiedAt) return parseDateValue(p.lastStudiedAt)
  if (p.updatedAt) return parseDateValue(p.updatedAt)
  if (typeof p.lastStudyDate === "string") {
    const d = new Date(`${p.lastStudyDate}T00:00:00+09:00`)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

function buildQuizSummaries(results: ResultDoc[], progresses: ProgressDoc[]) {
  const map = new Map<string, { sessions: number; accSum: number; accCount: number; latest: Date | null }>()

  function ensure(quizType: string) {
    const key = quizType || "unknown"
    if (!map.has(key)) map.set(key, { sessions: 0, accSum: 0, accCount: 0, latest: null })
    return map.get(key)!
  }

  for (const p of progresses) {
    const entry = ensure(p.quizType || "unknown")
    entry.sessions += typeof p.totalSessions === "number" ? p.totalSessions : 0
    const d = getProgressDate(p)
    if (d && (!entry.latest || d.getTime() > entry.latest.getTime())) entry.latest = d
  }

  for (const r of results) {
    const entry = ensure(r.quizType || "unknown")
    entry.sessions += 1
    const acc = getResultAccuracy(r)
    if (typeof acc === "number") {
      entry.accSum += acc
      entry.accCount += 1
    }
    const d = parseDateValue(r.createdAt ?? r.updatedAt)
    if (d && (!entry.latest || d.getTime() > entry.latest.getTime())) entry.latest = d
  }

  return Array.from(map.entries())
    .map(([quizType, v]) => ({
      quizType,
      label: formatQuizLabel(quizType),
      sessions: v.sessions,
      averageAccuracy: v.accCount > 0 ? v.accSum / v.accCount : null,
      lastStudiedAt: v.latest,
    }))
    .filter((v) => v.sessions > 0 || v.lastStudiedAt)
    .sort((a, b) => {
      const at = a.lastStudiedAt ? a.lastStudiedAt.getTime() : 0
      const bt = b.lastStudiedAt ? b.lastStudiedAt.getTime() : 0
      return bt - at
    })
}

async function getUserDocWithRetry(uid: string, maxRetry = 5) {
  for (let i = 0; i < maxRetry; i += 1) {
    const snap = await getDoc(doc(db, "users", uid))
    if (snap.exists()) return snap
    await sleep(250 * (i + 1))
  }

  return getDoc(doc(db, "users", uid))
}

function badgeClass(status: LearnerRow["status"]) {
  if (status === "未学習") return "bg-slate-100 text-slate-700 border-slate-200"
  if (status === "7日以上未学習") return "bg-amber-50 text-amber-700 border-amber-200"
  return "bg-emerald-50 text-emerald-700 border-emerald-200"
}

export default function CompanyDashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const [viewerRole, setViewerRole] = useState("")
  const [viewerCompanyCode, setViewerCompanyCode] = useState("")
  const [viewerCompanyName, setViewerCompanyName] = useState("")

  const [rows, setRows] = useState<LearnerRow[]>([])

  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "all" | "未学習" | "学習中" | "7日以上未学習"
  >("all")
  const [sortBy, setSortBy] = useState<
    "name" | "studyCount" | "accuracy" | "lastStudiedAt"
  >("lastStudiedAt")

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
        let companyName = viewer.companyName ?? ""

        setViewerRole(role)
        setViewerCompanyCode(companyCode)
        setViewerCompanyName(companyName)

        if (role !== "company_admin" && role !== "admin") {
          router.replace("/company/login")
          return
        }

        if (role === "company_admin" && !companyCode) {
          setError("企業情報が設定されていません。")
          setLoading(false)
          return
        }

        if (companyCode) {
          try {
            const companySnap = await getDoc(doc(db, "companies", companyCode))
            if (companySnap.exists()) {
              const company = companySnap.data() as CompanyDoc
              companyName = company.name ?? companyName
              setViewerCompanyName(companyName)
            }
          } catch (e) {
            console.error("company fetch error:", e)
          }
        }

        const usersRef = collection(db, "users")
        const usersSnap =
          role === "admin"
            ? await getDocs(usersRef)
            : await getDocs(query(usersRef, where("companyCode", "==", companyCode)))

        const userDocs = usersSnap.docs
          .map((d) => ({
            uid: d.id,
            ...(d.data() as UserDoc),
          }))
          .filter((u) => u.role === "learner")

        const builtRows = await Promise.all(
          userDocs.map(async (u) => {
            let studyCount = 0
            let averageAccuracy: number | null = null
            let lastStudiedAt: Date | null = null
            let badgeCount = 0

            try {
              const resultsRef = collection(db, "users", u.uid, "results")
              const resultsSnap = await getDocs(resultsRef)
              const results = resultsSnap.docs.map((d) => d.data() as ResultDoc)

              studyCount = results.length

              let accuracySum = 0
              let accuracyCount = 0
              let latestMs = 0
              let totalCorrect = 0
              let totalQuestions = 0

              for (const r of results) {
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

                if (typeof r.correctCount === "number") totalCorrect += r.correctCount
                if (typeof r.totalQuestions === "number") totalQuestions += r.totalQuestions

                const d = parseDateValue(r.createdAt ?? r.updatedAt)
                if (d && d.getTime() > latestMs) latestMs = d.getTime()
              }

              averageAccuracy =
                accuracyCount > 0
                  ? accuracySum / accuracyCount
                  : totalQuestions > 0
                    ? (totalCorrect / totalQuestions) * 100
                    : null

              if (latestMs > 0) lastStudiedAt = new Date(latestMs)
            } catch (e) {
              console.error("results read error:", u.uid, e)
            }

            try {
              const achievementsRef = collection(db, "users", u.uid, "achievements")
              const achievementsSnap = await getDocs(achievementsRef)
              badgeCount = achievementsSnap.docs.length
            } catch (e) {
              console.error("achievements read error:", u.uid, e)
            }

            const status = getStatus(lastStudiedAt, studyCount)

            return {
              uid: u.uid,
              displayName: u.displayName || "名称未設定",
              email: u.email || "—",
              role: u.role || "learner",
              companyCode: u.companyCode || "",
              companyName: u.companyName || "",
              studyCount,
              averageAccuracy,
              lastStudiedAt,
              badgeCount,
              mainLearning,
              quizSummaries,
              status,
            } satisfies LearnerRow
          })
        )

        setRows(builtRows)
      } catch (e) {
        console.error(e)
        setError("企業管理画面の読み込みに失敗しました。")
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [router])

  async function handleCopyCompanyCode() {
    if (!viewerCompanyCode) return

    try {
      await navigator.clipboard.writeText(viewerCompanyCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      console.error("copy failed:", e)
    }
  }


  function handleDownloadCsv() {
    const headers = [
      "氏名",
      "メール",
      "状態",
      "学習回数",
      "平均正答率",
      "進行中教材",
      "教材別状況",
      "バッジ",
      "最終学習日",
    ]

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`
    const lines = filteredRows.map((row) =>
      [
        row.displayName,
        row.email,
        row.status,
        String(row.studyCount),
        formatPercent(row.averageAccuracy),
        row.mainLearning,
        row.quizSummaries
          .map((q) => `${q.label}: ${q.sessions}回 / 平均${formatPercent(q.averageAccuracy)}`)
          .join(" | "),
        String(row.badgeCount),
        formatDate(row.lastStudiedAt),
      ]
        .map(escapeCsv)
        .join(",")
    )

    const csv = [`\uFEFF${headers.map(escapeCsv).join(",")}`, ...lines].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `care-company-learning-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredRows = useMemo(() => {
    const q = searchText.trim().toLowerCase()

    let data = rows.filter((row) => {
      const matchSearch =
        q.length === 0 ||
        row.displayName.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q)

      const matchStatus = statusFilter === "all" || row.status === statusFilter

      return matchSearch && matchStatus
    })

    data = [...data].sort((a, b) => {
      if (sortBy === "name") return a.displayName.localeCompare(b.displayName, "ja")
      if (sortBy === "studyCount") return b.studyCount - a.studyCount
      if (sortBy === "accuracy") return (b.averageAccuracy ?? -1) - (a.averageAccuracy ?? -1)

      const at = a.lastStudiedAt ? a.lastStudiedAt.getTime() : 0
      const bt = b.lastStudiedAt ? b.lastStudiedAt.getTime() : 0
      return bt - at
    })

    return data
  }, [rows, searchText, statusFilter, sortBy])

  const summary = useMemo(() => {
    const total = rows.length
    const studying = rows.filter((r) => r.status === "学習中").length
    const inactive = rows.filter((r) => r.status === "7日以上未学習").length
    const notStarted = rows.filter((r) => r.status === "未学習").length

    let accuracySum = 0
    let accuracyCount = 0

    for (const r of rows) {
      if (typeof r.averageAccuracy === "number") {
        accuracySum += r.averageAccuracy
        accuracyCount += 1
      }
    }

    return {
      total,
      studying,
      inactive,
      notStarted,
      averageAccuracy: accuracyCount > 0 ? accuracySum / accuracyCount : null,
    }
  }, [rows])


  const quizSummaryRows = useMemo(() => {
    const map = new Map<string, { label: string; sessions: number; accSum: number; accCount: number }>()
    for (const row of rows) {
      for (const q of row.quizSummaries) {
        if (!map.has(q.quizType)) {
          map.set(q.quizType, { label: q.label, sessions: 0, accSum: 0, accCount: 0 })
        }
        const entry = map.get(q.quizType)!
        entry.sessions += q.sessions
        if (typeof q.averageAccuracy === "number") {
          entry.accSum += q.averageAccuracy
          entry.accCount += 1
        }
      }
    }

    return Array.from(map.values())
      .map((v) => ({
        label: v.label,
        sessions: v.sessions,
        averageAccuracy: v.accCount > 0 ? v.accSum / v.accCount : null,
      }))
      .sort((a, b) => b.sessions - a.sessions)
  }, [rows])

  const followTargetCount = useMemo(() => {
    return rows.filter(
      (r) =>
        r.status === "7日以上未学習" ||
        (r.averageAccuracy != null && r.averageAccuracy < 60)
    ).length
  }, [rows])

  const goodConditionCount = useMemo(() => {
    return rows.filter(
      (r) =>
        r.status === "学習中" &&
        r.averageAccuracy != null &&
        r.averageAccuracy >= 80
    ).length
  }, [rows])

  const displayCompanyName =
    viewerRole === "admin"
      ? "全企業表示"
      : viewerCompanyName || viewerCompanyCode || "企業管理画面"

  const headerCompanyName = displayCompanyName || "企業管理画面"

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CompanyHeader companyName={headerCompanyName} />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
        <CompanyHeader companyName={headerCompanyName} />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-red-600">{error}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/company/login" className="btn-dark min-h-[48px]">
                企業ログインへ戻る
              </Link>

              <Link href="/home" className="btn-secondary min-h-[48px]">
                学習TOPへ
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
      <CompanyHeader companyName={headerCompanyName} />

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <section className="mb-6">
          <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm md:px-7 md:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  COMPANY DASHBOARD
                </p>

                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                  企業管理画面
                </h1>

                <p className="mt-2 text-sm leading-7 text-slate-500 md:text-[15px]">
                  学習者一覧・進捗確認・フォロー対象の把握ができます
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <InlineBadge label="学習者数" value={`${summary.total}名`} />
                  <InlineBadge label="学習中" value={`${summary.studying}名`} />
                  <InlineBadge label="要フォロー候補" value={`${followTargetCount}名`} />
                  <InlineBadge label="企業コード" value={viewerCompanyCode || "—"} />
                </div>
              </div>

              <div className="w-full max-w-[400px] rounded-[24px] border border-blue-100 bg-slate-50 p-4 md:p-5 lg:w-[400px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  COMPANY
                </p>

                <div className="mt-2 break-words text-2xl font-extrabold leading-tight text-slate-900 md:text-[30px]">
                  {displayCompanyName}
                </div>

                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        COMPANY CODE
                      </p>

                      <div className="mt-2 break-all text-3xl font-black tracking-[0.08em] text-blue-600">
                        {viewerRole === "admin" ? "管理者表示" : viewerCompanyCode || "未設定"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCompanyCode}
                      disabled={!viewerCompanyCode || viewerRole === "admin"}
                      className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {copied ? "コピー済み" : "コードをコピー"}
                    </button>
                  </div>

                  <p className="text-xs leading-6 text-slate-500 md:text-sm">
                    {viewerRole === "admin"
                      ? "admin は全企業の学習者一覧を確認できます"
                      : "学習者登録時にこの企業コードを入力してもらってください"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="学習者数" value={`${summary.total}`} />
          <SummaryCard label="学習中" value={`${summary.studying}`} />
          <SummaryCard label="7日以上未学習" value={`${summary.inactive}`} />
          <SummaryCard label="平均正答率" value={formatPercent(summary.averageAccuracy)} />
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                検索
              </label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="名前またはメールで検索"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                状態フィルタ
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "未学習" | "学習中" | "7日以上未学習"
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="all">すべて</option>
                <option value="未学習">未学習</option>
                <option value="学習中">学習中</option>
                <option value="7日以上未学習">7日以上未学習</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                並び替え
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "name" | "studyCount" | "accuracy" | "lastStudiedAt"
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="lastStudiedAt">最終学習日順</option>
                <option value="studyCount">学習回数順</option>
                <option value="accuracy">正答率順</option>
                <option value="name">名前順</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">学習者一覧</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {filteredRows.length} / {rows.length} 件
              </span>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex min-h-[40px] items-center rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                CSV出力
              </button>
            </div>
          </div>

          {filteredRows.length === 0 ? (
            <div className="p-8">
              <p className="text-sm text-slate-500">
                条件に一致する学習者はいません。
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="px-5 py-4 font-semibold">学習者</th>
                      <th className="px-5 py-4 font-semibold">状態</th>
                      <th className="px-5 py-4 font-semibold">学習回数</th>
                      <th className="px-5 py-4 font-semibold">平均正答率</th>
                      <th className="px-5 py-4 font-semibold">進行中教材</th>
                      <th className="px-5 py-4 font-semibold">バッジ</th>
                      <th className="px-5 py-4 font-semibold">最終学習日</th>
                      <th className="px-5 py-4 font-semibold">詳細</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.uid} className="border-b border-slate-100 last:border-b-0">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">
                            {row.displayName}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">{row.email}</div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(row.status)}`}
                          >
                            {row.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-900">
                          {row.studyCount}
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-900">
                          {formatPercent(row.averageAccuracy)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">{row.mainLearning}</div>
                          <div className="mt-1 text-xs leading-5 text-slate-500">
                            {row.quizSummaries.slice(0, 2).map((q) => `${q.label} ${q.sessions}回`).join(" / ") || "—"}
                          </div>
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-900">
                          {row.badgeCount}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {formatDate(row.lastStudiedAt)}
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            href={`/company/${row.uid}`}
                            className="btn-dark min-h-[40px] px-3 py-2 text-xs"
                          >
                            詳細を見る
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {filteredRows.map((row) => (
                  <div
                    key={row.uid}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900">
                          {row.displayName}
                        </div>
                        <div className="mt-1 break-all text-xs text-slate-500">
                          {row.email}
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${badgeClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <MobileStat label="学習回数" value={`${row.studyCount}`} />
                      <MobileStat
                        label="平均正答率"
                        value={formatPercent(row.averageAccuracy)}
                      />
                      <MobileStat label="進行中教材" value={row.mainLearning} />
                      <MobileStat label="バッジ" value={`${row.badgeCount}`} />
                      <MobileStat label="最終学習日" value={formatDate(row.lastStudiedAt)} />
                    </div>

                    <Link
                      href={`/company/${row.uid}`}
                      className="btn-dark mt-4 min-h-[48px] w-full"
                    >
                      詳細を見る
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">教材別の学習状況</h2>
            <span className="text-sm text-slate-500">どの教材を進めているか確認できます</span>
          </div>

          {quizSummaryRows.length === 0 ? (
            <p className="text-sm text-slate-500">まだ教材別の進捗はありません。</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {quizSummaryRows.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="font-bold text-slate-900">{item.label}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <MobileStat label="学習回数" value={`${item.sessions}回`} />
                    <MobileStat label="平均正答率" value={formatPercent(item.averageAccuracy)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <SummaryBox label="未学習" value={`${summary.notStarted}`} note="初回学習がまだの学習者です" />
          <SummaryBox label="要フォロー候補" value={`${followTargetCount}`} note="長期未学習または正答率60%未満" />
          <SummaryBox label="好調" value={`${goodConditionCount}`} note="継続中かつ高い正答率の学習者" />
        </section>
      </main>

      <LegalFooter />
    </div>
  )
}

function InlineBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function SummaryBox({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{note}</p>
    </div>
  )
}

function MobileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-slate-900">{value}</div>
    </div>
  )
}