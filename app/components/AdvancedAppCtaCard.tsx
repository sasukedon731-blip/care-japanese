"use client"

import Link from "next/link"

type Props = {
  variant?: "pass" | "fail" | "complete"
  className?: string
}

const CONTENT = {
  pass: {
    badge: "NEXT STEP",
    title: "合格おめでとう。次は“使える日本語”へ",
    body:
      "N4・N3の先も伸ばしたい人向けに、上位版では N4〜N2、業種別試験問題、AI会話、AIスピーキングまで学べます。",
    points: [
      "N4〜N2 のステップアップ学習",
      "建設・製造・介護など業種別問題",
      "AI会話トレーニング",
      "AIスピーキング評価",
    ],
    cta: "上位版を見る",
  },
  fail: {
    badge: "LEVEL UP",
    title: "次は実践トレーニングで底上げ",
    body:
      "あと一歩を埋めたい人向けに、上位版では試験対策だけでなく、AI会話やAIスピーキングで実践的に力を伸ばせます。",
    points: [
      "N4〜N2 の継続対策",
      "苦手分野を業種別でも補強",
      "AI会話で日本語運用力アップ",
      "AIスピーキングで発話もチェック",
    ],
    cta: "上位版をチェック",
  },
  complete: {
    badge: "ADVANCED",
    title: "学習の次は、会話と仕事の日本語へ",
    body:
      "今の学習をさらに広げたい人向けに、上位版では試験対策に加えて、仕事や会話に直結する教材も使えます。",
    points: [
      "N4〜N2 対応",
      "業種別教材あり",
      "AI会話トレーニング",
      "AIスピーキング対応",
    ],
    cta: "上位版を見る",
  },
} as const

export default function AdvancedAppCtaCard({
  variant = "complete",
  className = "",
}: Props) {
  const content = CONTENT[variant]

  return (
    <section
      className={`mt-8 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
            {content.badge}
          </p>

          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {content.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {content.body}
          </p>

          <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            {content.points.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-blue-100 bg-white px-3 py-2"
              >
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-auto md:min-w-[220px]">
          <Link
            href="https://quiz-app-mu-ochre-76.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            {content.cta}
          </Link>

          <p className="mt-3 text-center text-xs leading-5 text-slate-500">
            N4〜N2・業種別・AI会話・AIスピーキング対応
          </p>
        </div>
      </div>
    </section>
  )
}