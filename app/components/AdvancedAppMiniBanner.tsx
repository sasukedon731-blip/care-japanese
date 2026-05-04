"use client"

import Link from "next/link"

export default function AdvancedAppMiniBanner() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        NEXT STEP
      </p>

      <h3 className="mt-1 text-lg font-bold text-slate-900">
        会話・仕事の日本語まで伸ばしたい人へ
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        上位版では N4〜N2、業種別問題、AI会話、AIスピーキングまで学べます。
      </p>

      <Link
        href="https://quiz-app-mu-ochre-76.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        上位版を見る
      </Link>
    </section>
  )
}