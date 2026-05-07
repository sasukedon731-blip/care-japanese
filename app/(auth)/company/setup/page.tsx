"use client"

import Link from "next/link"

const codeBlock = `1. Firebase Authentication で企業管理者用アカウントを新規作成
   - 例: admin@abc-company.jp

2. Authentication の UID を確認

3. Firestore の companies コレクションに企業コードを作成
   - ドキュメントID例: OUTIN001

4. Firestore の users コレクションに、
   ドキュメントID = Authentication の UID で新規作成

5. users/{uid} には role と companyCode を入れる
   - role: company_admin
   - companyCode: companies のドキュメントIDと一致

6. 企業管理者で /company/login からログイン`

const firestoreUser = `{
  "email": "admin@abc-company.jp",
  "displayName": "ABC管理者",
  "accountType": "company",
  "companyCode": "OUTIN001",
  "companyName": "ABC株式会社",
  "role": "company_admin",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}`

const firestoreCompany = `{
  "name": "ABC株式会社",
  "status": "active"
}`

const learnerUser = `{
  "email": "learner@example.com",
  "displayName": "学習者名",
  "accountType": "company",
  "companyCode": "OUTIN001",
  "companyName": "ABC株式会社",
  "role": "learner",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}`

export default function CompanySetupPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto grid max-w-5xl gap-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">FOR BUSINESS</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">企業管理者アカウント作成手順</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            現在の設計は <strong>companyCode</strong> と <strong>role</strong> を中心に管理します。
            古い <code>companyId</code> や <code>billing.accountType</code> は使いません。
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">手順まとめ</h2>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-5 text-sm leading-7 text-slate-100">{codeBlock}</pre>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">users/{`{uid}`} 企業管理者</h2>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-5 text-sm leading-7 text-slate-100">{firestoreUser}</pre>
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-7 text-blue-900">
              <strong>重要:</strong> role は <code>company_admin</code>、companyCode は <code>companies/OUTIN001</code> のドキュメントIDと完全一致させます。
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">companies/{`{companyCode}`} 企業情報</h2>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-5 text-sm leading-7 text-slate-100">{firestoreCompany}</pre>
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-900">
              <strong>例:</strong> ドキュメントIDを <code>OUTIN001</code> にして、status を <code>active</code> にします。
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">学習者データの例</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            企業コード登録した学習者は、以下のように <code>role: learner</code> で保存されます。
            企業管理画面はこの <code>companyCode</code> で学習者を絞り込みます。
          </p>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-5 text-sm leading-7 text-slate-100">{learnerUser}</pre>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">よくあるエラー</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
            <li>・企業ログイン直後に弾かれる → users/{`{uid}`} の role と companyCode を確認</li>
            <li>・学習者が出ない → 学習者の role が learner か確認</li>
            <li>・企業コード登録できない → companies/{`{companyCode}`} が存在し status が active か確認</li>
            <li>・本番だけ失敗する → Vercel の Firebase 環境変数が新プロジェクトか確認</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/company" className="btn-dark min-h-[48px]">企業管理画面へ</Link>
          <Link href="/company/login" className="btn-secondary min-h-[48px]">企業ログインへ</Link>
          <Link href="/home" className="btn-secondary min-h-[48px]">学習TOPへ</Link>
        </div>
      </div>
    </main>
  )
}
