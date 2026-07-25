/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"

import { auth, db } from "@/app/lib/firebase"
import { quizCatalog } from "@/app/data/quizCatalog"

type RecordData = Record<string, any>
type Tab = "Dashboard" | "Learners" | "Analytics" | "Reports" | "Company"
type Status = "未学習" | "学習中" | "要フォロー"
type LoadState = "loading" | "ready" | "permission" | "missing-company" | "error"

type CourseMetric = {
  id: string
  count: number
  correct: number
  answered: number
  last: Date | null
}

type Learner = {
  id: string
  name: string
  email: string
  count: number
  correct: number
  answered: number
  accuracy: number | null
  last: Date | null
  status: Status
  courses: CourseMetric[]
}

type CourseStat = {
  id: string
  title: string
  learners: number
  count: number
  accuracy: number | null
  studying: number
  followUp: number
  notStarted: number
}

const tabs: Tab[] = ["Dashboard", "Learners", "Analytics", "Reports", "Company"]
const activeCourses = quizCatalog
  .filter((course) => course.enabled)
  .sort((a, b) => a.order - b.order)
const activeCourseIds = new Set(activeCourses.map((course) => course.id))

function parseDate(value: any): Date | null {
  if (!value) return null
  try {
    let parsed: Date
    if (value instanceof Date) parsed = value
    else if (typeof value?.toDate === "function") parsed = value.toDate()
    else if (typeof value?.seconds === "number") parsed = new Date(value.seconds * 1000)
    else if (typeof value === "number") {
      parsed = new Date(value < 100_000_000_000 ? value * 1000 : value)
    } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      parsed = new Date(`${value}T00:00:00+09:00`)
    } else parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return null
    if (parsed.getTime() > Date.now() + 86_400_000) return null
    return parsed
  } catch {
    return null
  }
}

function resultParts(result: RecordData) {
  if (result.byTimeout === true || result.completed === false || result.finished === false) return null
  const completedAt = parseDate(result.completedAt ?? result.createdAt ?? result.updatedAt)
  if (!completedAt) return null
  const correct = Number(result.correctCount ?? result.score)
  const answered = Number(result.totalQuestions ?? result.answeredCount ?? result.total)
  if (
    !Number.isFinite(correct) ||
    !Number.isFinite(answered) ||
    answered <= 0 ||
    correct < 0 ||
    correct > answered
  ) return null
  return { correct, answered, completedAt }
}

function progressParts(progress: RecordData) {
  if (progress.completed === false || progress.finished === false) return null
  const count = Number(progress.totalSessions)
  const completedAt = parseDate(
    progress.lastStudiedAt ??
      progress.lastStudyAt ??
      progress.completedAt ??
      progress.updatedAt ??
      progress.lastStudyDate,
  )
  if (!Number.isFinite(count) || count <= 0 || !completedAt) return null
  return { count: Math.floor(count), completedAt }
}

function newest(a: Date | null, b: Date | null) {
  if (!a) return b
  if (!b) return a
  return a.getTime() >= b.getTime() ? a : b
}

function jstDay(value: Date) {
  return Math.floor((value.getTime() + 9 * 60 * 60 * 1000) / 86_400_000)
}

function learnerStatus(count: number, last: Date | null): Status {
  if (count <= 0 || !last) return "未学習"
  return jstDay(new Date()) - jstDay(last) >= 7 ? "要フォロー" : "学習中"
}

function formatDate(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(value)
    : "—"
}

function percent(value: number | null) {
  return value == null ? "採点対象外" : `${Math.round(value)}%`
}

function csvCell(value: unknown) {
  let text = String(value ?? "")
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }
  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand("copy")
  textarea.remove()
  if (!copied) throw new Error("copy command failed")
}

export default function BusinessDashboard({
  appName,
  appHomeHref,
  appHomeLabel = "アプリへ戻る",
  loginHref = "/company/login",
}: {
  appName: string
  appHomeHref: string
  appHomeLabel?: string
  loginHref?: string
}) {
  const router = useRouter()
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [tab, setTab] = useState<Tab>("Dashboard")
  const [state, setState] = useState<LoadState>("loading")
  const [rows, setRows] = useState<Learner[]>([])
  const [company, setCompany] = useState<RecordData>({})
  const [companyCode, setCompanyCode] = useState("")
  const [role, setRole] = useState("")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"すべて" | Status>("すべて")
  const [sort, setSort] = useState<"last" | "name" | "count" | "accuracy">("last")
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace(loginHref)
        return
      }
      try {
        const viewerSnapshot = await getDoc(doc(db, "users", user.uid))
        if (!viewerSnapshot.exists()) {
          setState("permission")
          return
        }
        const viewer = viewerSnapshot.data() as RecordData
        const viewerRole = String(viewer.role ?? "")
        const code = String(viewer.companyCode ?? "")
        setRole(viewerRole)
        setCompanyCode(code)
        if (!["admin", "company_admin"].includes(viewerRole)) {
          router.replace(appHomeHref)
          return
        }
        if (viewerRole === "company_admin" && !code) {
          setCompany({ name: viewer.companyName })
          setRows([])
          setState("missing-company")
          return
        }

        if (code) {
          const companySnapshot = await getDoc(doc(db, "companies", code))
          if (!companySnapshot.exists() && viewerRole === "company_admin") {
            setCompany({ name: viewer.companyName })
            setRows([])
            setState("missing-company")
            return
          }
          setCompany(
            companySnapshot.exists()
              ? companySnapshot.data()
              : { name: viewer.companyName },
          )
        } else {
          setCompany({ name: "全企業" })
        }

        const usersRef = collection(db, "users")
        const usersSnapshot =
          viewerRole === "admin"
            ? await getDocs(usersRef)
            : await getDocs(query(usersRef, where("companyCode", "==", code)))

        const learners = usersSnapshot.docs
          .map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }) as RecordData)
          .filter(
            (person) =>
              person.id !== user.uid &&
              !["admin", "company_admin"].includes(String(person.role ?? "")),
          )

        const builtRows = await Promise.all(
          learners.map(async (person): Promise<Learner> => {
            const [resultsSnapshot, progressSnapshot] = await Promise.all([
              getDocs(collection(db, "users", person.id, "results")),
              getDocs(collection(db, "users", person.id, "progress")),
            ])
            const courseMap = new Map<string, CourseMetric>()
            const ensure = (id: string) => {
              const current = courseMap.get(id)
              if (current) return current
              const next = { id, count: 0, correct: 0, answered: 0, last: null }
              courseMap.set(id, next)
              return next
            }

            for (const snapshot of resultsSnapshot.docs) {
              const result = snapshot.data() as RecordData
              const id = String(result.quizType ?? result.courseId ?? result.materialId ?? "")
              if (!activeCourseIds.has(id)) continue
              const parts = resultParts(result)
              if (!parts) continue
              const metric = ensure(id)
              metric.count += 1
              metric.correct += parts.correct
              metric.answered += parts.answered
              metric.last = newest(metric.last, parts.completedAt)
            }

            for (const snapshot of progressSnapshot.docs) {
              const progress = { id: snapshot.id, ...snapshot.data() } as RecordData
              const id = String(
                progress.quizType ?? progress.courseId ?? progress.materialId ?? progress.id,
              )
              if (!activeCourseIds.has(id)) continue
              const parts = progressParts(progress)
              if (!parts) continue
              const metric = ensure(id)
              metric.count += parts.count
              metric.last = newest(metric.last, parts.completedAt)
            }

            const courses = [...courseMap.values()]
            const count = courses.reduce((sum, course) => sum + course.count, 0)
            const correct = courses.reduce((sum, course) => sum + course.correct, 0)
            const answered = courses.reduce((sum, course) => sum + course.answered, 0)
            const last = courses.reduce<Date | null>(
              (latest, course) => newest(latest, course.last),
              null,
            )
            return {
              id: person.id,
              name: String(person.displayName ?? person.name ?? "名称未設定"),
              email: String(person.email ?? ""),
              count,
              correct,
              answered,
              accuracy: answered > 0 ? (correct / answered) * 100 : null,
              last,
              status: learnerStatus(count, last),
              courses,
            }
          }),
        )
        setRows(builtRows)
        setState("ready")
      } catch (error) {
        console.error("Business Dashboard data load failed", error)
        const code =
          typeof error === "object" && error && "code" in error
            ? String((error as { code?: unknown }).code)
            : ""
        setState(
          code === "permission-denied" || code === "firestore/permission-denied"
            ? "permission"
            : "error",
        )
      }
    })
  }, [appHomeHref, loginHref, reloadKey, router])

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current)
    },
    [],
  )

  const shown = useMemo(
    () =>
      rows
        .filter(
          (row) =>
            (filter === "すべて" || row.status === filter) &&
            `${row.name} ${row.email}`.toLowerCase().includes(search.trim().toLowerCase()),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.name.localeCompare(b.name, "ja")
            : sort === "count"
              ? b.count - a.count
              : sort === "accuracy"
                ? (b.accuracy ?? -1) - (a.accuracy ?? -1)
                : (b.last?.getTime() ?? 0) - (a.last?.getTime() ?? 0),
        ),
    [filter, rows, search, sort],
  )

  const totalCorrect = rows.reduce((sum, row) => sum + row.correct, 0)
  const totalAnswered = rows.reduce((sum, row) => sum + row.answered, 0)
  const overallAccuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : null

  const courseStats = useMemo<CourseStat[]>(
    () =>
      activeCourses.map((course) => {
        let learners = 0
        let count = 0
        let correct = 0
        let answered = 0
        let studying = 0
        let followUp = 0
        let notStarted = 0
        for (const row of rows) {
          const metric = row.courses.find((item) => item.id === course.id)
          if (!metric?.count) {
            notStarted += 1
            followUp += 1
            continue
          }
          learners += 1
          count += metric.count
          correct += metric.correct
          answered += metric.answered
          if (learnerStatus(metric.count, metric.last) === "学習中") studying += 1
          else followUp += 1
        }
        return {
          id: course.id,
          title: course.title,
          learners,
          count,
          accuracy: answered > 0 ? (correct / answered) * 100 : null,
          studying,
          followUp,
          notStarted,
        }
      }),
    [rows],
  )

  async function handleCopy() {
    if (!companyCode) return
    try {
      await copyText(companyCode)
      setCopyError("")
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2500)
    } catch (error) {
      console.error("Company code copy failed", error)
      setCopyError("コピーできませんでした。企業コードを選択してコピーしてください。")
    }
  }

  function exportCsv() {
    const headers = [
      "氏名",
      "メール",
      "状態",
      "学習回数",
      "加重平均正答率",
      "最終学習日",
      "企業コード",
    ]
    const lines = shown.map((row) =>
      [
        row.name,
        row.email,
        row.status,
        row.count,
        percent(row.accuracy),
        formatDate(row.last),
        companyCode,
      ]
        .map(csvCell)
        .join(","),
    )
    const csv = `\uFEFF${[headers.map(csvCell).join(","), ...lines].join("\r\n")}`
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const anchor = document.createElement("a")
    anchor.href = url
    const safeName = appName.replace(/[\\/:*?"<>|]/g, "-")
    const date = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date())
    anchor.download = `${safeName}-企業学習レポート-${date}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function selectTab(next: Tab) {
    setTab(next)
    setMenuOpen(false)
  }

  function retryLoad() {
    setState("loading")
    setReloadKey((value) => value + 1)
  }

  const companyName = String(company.name ?? company.companyName ?? "")

  return (
    <div className="bdShell">
      <style>{dashboardCss}</style>
      <aside className={`bdSide ${menuOpen ? "open" : ""}`} aria-label="企業管理メニュー">
        <div className="bdSideTop">
          <h2>OutIN Academy</h2>
          <small>Business Dashboard<br />企業向け学習管理画面</small>
          <b>{appName}</b>
          {role === "company_admin" && (
            <CompanyCodeCard
              companyName={companyName}
              code={companyCode}
              copied={copied}
              copyError={copyError}
              onCopy={handleCopy}
            />
          )}
          <Link href={appHomeHref}>{appHomeLabel}</Link>
        </div>
        <nav className="bdNav" aria-label="Dashboard navigation">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              aria-current={tab === item ? "page" : undefined}
              className={tab === item ? "active" : ""}
              onClick={() => selectTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="bdLogout">
          <button type="button" onClick={() => signOut(auth)}>ログアウト</button>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="bdScrim"
          aria-label="メニューを閉じる"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="bdMain">
        <header>
          <button
            type="button"
            className="bdHamburger"
            aria-label="メニューを開く"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
          <b>{tab}</b>
          <span>{companyName || companyCode}</span>
        </header>
        <div className="bdContent">
          {state === "loading" && <Info title="読み込み中" body="企業の学習状況を読み込んでいます。" />}
          {state === "permission" && (
            <ErrorCard
              body="企業管理画面の閲覧権限を確認してください。問題が続く場合は管理者へお問い合わせください。"
              onRetry={retryLoad}
            />
          )}
          {state === "missing-company" && (
            <Info
              title="企業情報が登録されていません"
              body="企業コードと企業情報の設定を管理者へ確認してください。"
            />
          )}
          {state === "error" && (
            <ErrorCard
              body="企業管理画面の読み込み中に問題が発生しました。時間をおいて再度お試しください。"
              onRetry={retryLoad}
            />
          )}

          {state === "ready" && (
            <>
              <h1>{tab}</h1>
              {rows.length === 0 && tab !== "Company" && (
                <Info
                  title="学習データはまだありません"
                  body="企業へ学習者が登録され、学習を完了するとここへ反映されます。"
                />
              )}
              {tab === "Dashboard" && (
                <>
                  <div className="bdGrid">
                    <Card label="登録学習者数" value={rows.length} />
                    <Card label="学習中" value={rows.filter((row) => row.status === "学習中").length} />
                    <Card label="要フォロー" value={rows.filter((row) => row.status !== "学習中").length} />
                    <Card label="平均正答率" value={percent(overallAccuracy)} />
                  </div>
                  <AccuracyNote />
                  <CourseProgress stats={courseStats} />
                </>
              )}
              {tab === "Learners" && (
                <>
                  <div className="bdTools">
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="氏名・メールで検索"
                      aria-label="氏名またはメールで検索"
                    />
                    <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} aria-label="状態フィルター">
                      {["すべて", "未学習", "学習中", "要フォロー"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="並び替え">
                      <option value="last">最終学習日</option>
                      <option value="name">氏名</option>
                      <option value="count">学習回数</option>
                      <option value="accuracy">平均正答率</option>
                    </select>
                    <button type="button" onClick={exportCsv}>CSV出力</button>
                  </div>
                  <LearnerTable rows={shown} />
                  {shown.length === 0 && rows.length > 0 && (
                    <Info title="該当する学習者はいません" body="検索条件またはフィルターを変更してください。" />
                  )}
                </>
              )}
              {tab === "Analytics" && (
                <>
                  <section className="bdCard">
                    <b>全体加重平均正答率：{percent(overallAccuracy)}</b>
                    <AccuracyNote />
                  </section>
                  <CourseAnalytics stats={courseStats} />
                </>
              )}
              {tab === "Reports" && (
                <section className="bdCard">
                  <p>現在の検索・フィルター結果：{shown.length}件</p>
                  <button type="button" onClick={exportCsv}>学習者一覧CSVを出力</button>
                  <p>PDFレポートは準備中です。</p>
                </section>
              )}
              {tab === "Company" && (
                <section className="bdCard">
                  <p>会社名：{companyName || "—"}</p>
                  <p>企業コード：{companyCode || "—"}</p>
                  <p>契約状態：{String(company.status ?? "有効")}</p>
                  <p>登録学習者数：{rows.length}名</p>
                  <p>利用中のアプリ：{appName}</p>
                  {role === "company_admin" && (
                    <>
                      <button type="button" onClick={handleCopy} disabled={!companyCode}>
                        {copied ? "コピーしました" : "企業コードをコピー"}
                      </button>
                      {copyError && <p role="alert">{copyError}</p>}
                    </>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function CompanyCodeCard({
  companyName,
  code,
  copied,
  copyError,
  onCopy,
}: {
  companyName: string
  code: string
  copied: boolean
  copyError: string
  onCopy: () => void
}) {
  return (
    <section className="bdCompanyCode" aria-label="企業情報">
      {companyName && <b title={companyName}>{companyName}</b>}
      <span>企業コード</span>
      <code>{code || "企業コードが登録されていません"}</code>
      <button
        type="button"
        onClick={onCopy}
        disabled={!code}
        aria-label={code ? "企業コードをコピー" : "企業コードが登録されていません"}
      >
        <span aria-live="polite">{copied ? "コピー済み" : "コピー"}</span>
      </button>
      {copyError && <small role="alert">{copyError}</small>}
    </section>
  )
}

function Card({ label, value }: { label: string; value: string | number }) {
  return <article className="bdCard"><span>{label}</span><strong>{value}</strong></article>
}

function Info({ title, body }: { title: string; body: string }) {
  return <section className="bdInfo"><b>{title}</b><p>{body}</p></section>
}

function ErrorCard({ body, onRetry }: { body: string; onRetry: () => void }) {
  return (
    <section className="bdError" role="alert">
      <h1>データを読み込めませんでした</h1>
      <p>{body}</p>
      <button type="button" onClick={onRetry}>再読み込み</button>
    </section>
  )
}

function AccuracyNote() {
  return <p className="bdNote">正答率は、正解数と回答数を取得できるクイズ・テストから集計しています。</p>
}

function LearnerTable({ rows }: { rows: Learner[] }) {
  return (
    <div className="bdTable">
      <table>
        <thead><tr><th>氏名</th><th>状態</th><th>学習回数</th><th>平均正答率</th><th>最終学習日</th><th>教材</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><b>{row.name}</b><small>{row.email}</small></td>
              <td>{row.status}</td>
              <td>{row.count}</td>
              <td>{percent(row.accuracy)}</td>
              <td>{formatDate(row.last)}</td>
              <td>{row.courses.map((course) => activeCourses.find((item) => item.id === course.id)?.title ?? course.id).join("、") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CourseProgress({ stats }: { stats: CourseStat[] }) {
  return (
    <section className="bdCard">
      <h2>教材別進捗</h2>
      <div className="bdCourseGrid">
        {stats.map((stat) => (
          <article key={stat.id}>
            <b>{stat.title}</b>
            <p>学習中 {stat.studying}名 ／ 要フォロー {stat.followUp}名 ／ 未学習 {stat.notStarted}名</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function CourseAnalytics({ stats }: { stats: CourseStat[] }) {
  return (
    <section className="bdCard">
      <h2>教材別分析</h2>
      <div className="bdTable">
        <table>
          <thead><tr><th>教材</th><th>学習者数</th><th>学習回数</th><th>加重平均正答率</th><th>学習中</th><th>要フォロー</th><th>未学習</th></tr></thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.id}>
                <td><b>{stat.title}</b></td>
                <td>{stat.learners}</td>
                <td>{stat.count}</td>
                <td>{percent(stat.accuracy)}</td>
                <td>{stat.studying}</td>
                <td>{stat.followUp}</td>
                <td>{stat.notStarted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const dashboardCss = `
  .bdShell{min-height:100dvh;background:#f5f7fb;color:#10213b;font-family:system-ui,sans-serif}
  .bdSide{position:fixed;inset:0 auto 0 0;z-index:30;width:250px;height:100dvh;box-sizing:border-box;padding:20px 20px max(14px,env(safe-area-inset-bottom));background:#102342;color:#fff;display:flex;flex-direction:column;overflow:hidden}
  .bdSideTop{flex:0 0 auto;display:grid;gap:9px}.bdSideTop h2{margin:0}.bdSideTop small{color:#b8c5d8}.bdSideTop>a{color:#fff;padding:8px 0;font-weight:700}
  .bdCompanyCode{display:grid;gap:5px;min-width:0;padding:10px;border:1px solid #ffffff30;border-radius:10px;background:#ffffff10}
  .bdCompanyCode>b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bdCompanyCode>span{font-size:11px;color:#b8c5d8}.bdCompanyCode code{overflow-wrap:anywhere;color:#fff}.bdCompanyCode button{justify-self:start}
  .bdNav{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;display:grid;align-content:start;gap:7px;padding:8px 1px}
  .bdNav button,.bdLogout button{padding:11px;border:0;border-radius:9px;background:transparent;color:#d6dfed;text-align:left}.bdNav button.active{background:#fff;color:#102342}
  .bdLogout{flex:0 0 auto;padding-top:9px;border-top:1px solid #ffffff25}.bdLogout button{width:100%}
  .bdMain{margin-left:250px}.bdMain>header{height:68px;padding:0 26px;display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff}.bdMain>header span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .bdContent{max-width:1200px;margin:auto;padding:26px}.bdContent h1{font-size:30px}
  .bdGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}
  .bdCard,.bdInfo,.bdError{padding:20px;margin-bottom:14px;border:1px solid #e2e8f0;border-radius:16px;background:#fff}.bdCard>strong{display:block;margin-top:8px;font-size:29px}
  .bdInfo{background:#eef5ff}.bdError{border-color:#f1b7b7}.bdNote{color:#64748b;font-size:13px;line-height:1.6}
  .bdTools{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:14px}.bdTools input,.bdTools select,.bdTools button,.bdCard button,.bdError button,.bdCompanyCode button{min-height:42px;padding:8px 11px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#10213b}
  .bdTable{overflow-x:auto;background:#fff;border-radius:14px}.bdTable table{width:100%;min-width:760px;border-collapse:collapse}.bdTable th,.bdTable td{padding:11px;text-align:left;border-bottom:1px solid #e5e7eb}.bdTable td small{display:block;color:#64748b}
  .bdCourseGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}.bdCourseGrid article{padding:14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}
  .bdHamburger,.bdScrim{display:none}
  button{cursor:pointer}button:disabled{cursor:not-allowed;opacity:.55}
  button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #ff9a65;outline-offset:2px}
  @media(max-width:800px){
    .bdSide{transform:translateX(-105%);transition:transform .2s;width:min(250px,calc(100vw - 28px))}
    .bdSide.open{transform:none}.bdMain{margin-left:0}.bdHamburger{display:block}.bdScrim{display:block;position:fixed;inset:0;z-index:20;border:0;border-radius:0;background:#09142688}
  }
  @media(max-width:430px){.bdMain>header{padding:0 12px}.bdContent{padding:16px}.bdContent h1{font-size:26px}}
  @media(max-height:650px){.bdSide{padding-top:10px}.bdSideTop{gap:4px}.bdSideTop h2{font-size:18px}.bdCompanyCode{padding:7px}.bdNav{gap:3px}.bdNav button{padding:8px}}
  @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
`
