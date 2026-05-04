"use client"

import Link from "next/link"

export default function AdvancedAppCompareBlock() {
  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        ADVANCED PLAN
      </p>

      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        さらに上を目指す人向けの上位版
      </h2>

      <p className="mt-3 text-sm leading-7 text-slate-500">
        今のアプリで基礎を固めたあと、さらに会話・仕事・上位級まで進みたい人向けに、上位版も用意しています。
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-bold text-slate-900">今のアプリ</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>・N5〜N4 の学習</li>
            <li>・基礎固めに集中</li>
            <li>・シンプルに学びやすい</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="text-sm font-bold text-slate-900">上位版</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>・N4〜N2 対応</li>
            <li>・業種別試験問題</li>
            <li>・AI会話トレーニング</li>
            <li>・AIスピーキング評価</li>
          </ul>
        </div>
      </div>

      <Link
        href="https://quiz-app-mu-ochre-76.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
      >
        上位版の詳細を見る
      </Link>
    </section>
  )
}