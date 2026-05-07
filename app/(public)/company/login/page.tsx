"use client"

import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

import { auth, db } from "@/app/lib/firebase"

type AllowedRole = "admin" | "company_admin"
type UserDoc = {
  role?: string
  accountType?: "personal" | "company"
  companyCode?: string | null
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

function isAllowedRole(role?: string): role is AllowedRole {
  return role === "admin" || role === "company_admin"
}

export default function CompanyLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let alive = true
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!alive) return
      if (!user) {
        setChecking(false)
        return
      }
      try {
        await user.getIdToken(true)
        const snap = await getUserDocWithRetry(user.uid)
        const data = snap.exists() ? (snap.data() as UserDoc) : null
        if (isAllowedRole(data?.role)) {
          router.replace("/company")
          return
        }
        await signOut(auth)
        if (alive) setError("企業管理者アカウントでログインしてください。")
      } catch (e) {
        console.error("company login auth check failed:", e)
        if (alive) setError("ログイン状態の確認に失敗しました。")
      } finally {
        if (alive) setChecking(false)
      }
    })
    return () => {
      alive = false
      unsub()
    }
  }, [router])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      await cred.user.getIdToken(true)
      const snap = await getUserDocWithRetry(cred.user.uid)
      const data = snap.exists() ? (snap.data() as UserDoc) : null
      const role = data?.role
      if (!isAllowedRole(role)) {
        await signOut(auth)
        setError("このアカウントは企業管理画面に入れません。")
        return
      }
      if (role === "company_admin" && !data?.companyCode) {
        await signOut(auth)
        setError("企業管理者アカウントに企業コードが設定されていません。")
        return
      }
      router.replace("/company")
    } catch (err: any) {
      const code = err?.code ?? ""
      if (code === "auth/invalid-email") {
        setError("メールアドレスの形式が正しくありません。")
      } else if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setError("メールアドレスまたはパスワードが違います。")
      } else if (code === "auth/too-many-requests") {
        setError("試行回数が多いため一時的に制限されています。少し待ってからお試しください。")
      } else {
        console.error("company login failed:", err)
        setError("ログインに失敗しました。時間をおいて再度お試しください。")
      }
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
        <p className="text-sm text-slate-500">確認中...</p>
      </main>
    )
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">FOR BUSINESS</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">企業管理者ログイン</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">企業アカウントでログインすると管理画面へ入れます。</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">メールアドレス</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@abc-company.jp" autoComplete="email" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">パスワード</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワードを入力" autoComplete="current-password" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500" />
          </div>
          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
          <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "ログイン中..." : "企業管理画面へログイン"}
          </button>
        </form>
        <div className="mt-5 grid gap-3">
          <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">通常ログインはこちら</Link>
          <Link href="/for-business" className="text-center text-sm font-semibold text-blue-600">← 企業向けページに戻る</Link>
        </div>
      </div>
    </main>
  )
}
