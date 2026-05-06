"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { auth, db } from "@/app/lib/firebase"

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyCode, setCompanyCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setError("")
    setLoading(true)

    const trimmedName = username.trim()
    const trimmedEmail = email.trim()
    const trimmedCompanyCode = companyCode.trim().toUpperCase()

    if (!trimmedName) {
      setError("ユーザーネームを入力してください")
      setLoading(false)
      return
    }

    if (!trimmedEmail) {
      setError("メールアドレスを入力してください")
      setLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setError("パスワードは6文字以上で入力してください")
      setLoading(false)
      return
    }

    try {
      let companyName: string | null = null

      if (trimmedCompanyCode) {
        const companyRef = doc(db, "companies", trimmedCompanyCode)
        const companySnap = await getDoc(companyRef)

        if (!companySnap.exists()) {
          setError("企業コードが正しくありません")
          setLoading(false)
          return
        }

        const companyData = companySnap.data()
        if (companyData?.status && companyData.status !== "active") {
          setError("この企業コードは現在利用できません")
          setLoading(false)
          return
        }

        companyName = companyData?.name ?? null
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      )

      await userCredential.user.getIdToken(true)

      await updateProfile(userCredential.user, { displayName: trimmedName })

      const uid = userCredential.user.uid
      const isCompanyUser = !!trimmedCompanyCode

      await setDoc(doc(db, "users", uid), {
        email: userCredential.user.email ?? trimmedEmail,
        displayName: trimmedName,

        accountType: isCompanyUser ? "company" : "personal",
        role: "learner",

        companyCode: isCompanyUser ? trimmedCompanyCode : null,
        companyName: isCompanyUser ? companyName : null,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      router.push("/home")
    } catch (err: any) {
      console.error(err)
      const code = err?.code ?? ""

      if (code === "auth/email-already-in-use") {
        setError("このメールアドレスは既に登録されています")
      } else if (code === "auth/invalid-email") {
        setError("メールアドレスの形式が正しくありません")
      } else if (code === "auth/weak-password") {
        setError("パスワードが弱すぎます（6文字以上）")
      } else if (code === "permission-denied") {
        setError("登録権限がありません。Firestoreルールを確認してください")
      } else {
        setError(code || "登録に失敗しました")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <main className="page-shell flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="eyebrow">CREATE ACCOUNT</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              新規登録
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              個人利用の方は企業コードを空欄のまま登録できます。
              企業から案内された方は企業コードを入力してください。
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="ユーザーネーム"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="パスワード（6文字以上）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="text"
              placeholder="企業コード（任意）例：OUTIN001"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value)}
            />

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="btn-green w-full min-h-[56px]"
            >
              {loading ? "登録中..." : "新規登録"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            <p>すでにアカウントをお持ちですか？</p>
            <Link
              href="/login"
              className="mt-2 inline-flex font-bold text-blue-700 underline underline-offset-4"
            >
              ログインはこちら
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}