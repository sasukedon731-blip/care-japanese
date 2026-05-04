"use client"

import Link from "next/link"

export default function PersonalLandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold tracking-[0.18em] text-sky-700">
                日本語検定 / 介護
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
                ゲームで学ぶ、
                <br />
                日本語。
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
                日本語検定・介護に対応。
                <br />
                むずかしい勉強を、もっと楽しく、もっと続けやすく。
                <br />
                スキマ時間にテンポよく学べる日本語学習アプリです。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  今すぐはじめる
                </Link>

                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  ログイン
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <MiniPill text="ゲーム感覚で学習" />
                <MiniPill text="日本語検定 / 介護対応" />
                <MiniPill text="スマホでも使いやすい" />
              </div>
            </div>

            <div>
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] md:p-6">
                <div className="rounded-[24px] bg-slate-900 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                        GAME LEARNING
                      </p>
                      <h2 className="mt-2 text-2xl font-extrabold">
                        毎日の学習を
                        <br />
                        もっと軽く。
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
                      <div className="text-xs text-slate-300">今日の学習</div>
                      <div className="text-lg font-bold">10分</div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <MockCard
                      title="語彙クイズ"
                      subtitle="選んで覚える"
                      stat="日本語検定 / 介護"
                    />
                    <MockCard
                      title="文法チェック"
                      subtitle="テンポよく復習"
                      stat="スキマ時間OK"
                    />
                    <MockCard
                      title="学習の積み上げ"
                      subtitle="続けるほど伸びる"
                      stat="毎日少しずつ"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              PROBLEM
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              こんな悩みありませんか？
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ProblemCard text="日本語の勉強が続かない" />
            <ProblemCard text="テキストだけだと飽きてしまう" />
            <ProblemCard text="何からやればいいかわからない" />
            <ProblemCard text="勉強してもすぐ忘れてしまう" />
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                SOLUTION
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                その悩み、
                <br />
                ゲームで解決。
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                むずかしい説明を読むだけではなく、
                <br />
                手を動かしながら、テンポよく覚える。
                <br />
                だから、学習が続きやすくなります。
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard
                emoji="🎮"
                title="ゲーム感覚"
                description="楽しく進められるから、勉強のハードルが下がります。"
              />
              <FeatureCard
                emoji="⚡"
                title="テンポよく学べる"
                description="スキマ時間でもすぐ始められて、少しずつ積み上がります。"
              />
              <FeatureCard
                emoji="📈"
                title="続けやすい"
                description="結果が見えやすく、成長を感じながら学習できます。"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What you can do */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              EXPERIENCE
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              できること
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              シンプルで、すぐ始められる。
              <br />
              日本語学習に必要な基本を、ゲーム感覚で繰り返せます。
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SimpleCard
              title="語彙を学ぶ"
              description="基本の言葉を、クイズ感覚でくり返し確認。"
            />
            <SimpleCard
              title="文法を学ぶ"
              description="日本語検定・介護の大事なポイントをテンポよく復習。"
            />
            <SimpleCard
              title="短時間で進める"
              description="1回の学習が重すぎないから、毎日続けやすい。"
            />
            <SimpleCard
              title="反復しやすい"
              description="間違えたところも、くり返し学んで定着へ。"
            />
          </div>
        </div>
      </section>

      {/* 日本語検定 */}
      <section className="border-b border-slate-200 bg-sky-50/50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                日本語検定 SUPPORT
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                日本語検定・介護に対応
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                日本語をこれから学ぶ人、基礎をしっかり固めたい人に。
                <br />
                日本語検定・介護レベルを中心に、学びやすい形で続けられます。
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <LevelCard level="日本語基礎" text="はじめての日本語学習にも" />
              <LevelCard level="日本語検定" text="基礎を固めて次へ進む" />
              <LevelCard level="毎日" text="少しずつでも積み上がる" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            START NOW
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
            楽しく続ける
            <br />
            日本語学習をはじめよう
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            勉強が続かない人でも、まずは一歩。
            <br />
            ゲーム感覚で、日本語学習をもっと身近に。
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-slate-900 transition hover:opacity-90"
            >
              無料ではじめる
            </Link>

            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              ログイン
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function MiniPill({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
      {text}
    </div>
  )
}

function MockCard({
  title,
  subtitle,
  stat,
}: {
  title: string
  subtitle: string
  stat: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <div>
        <div className="text-sm font-bold text-white">{title}</div>
        <div className="mt-1 text-xs text-slate-300">{subtitle}</div>
      </div>
      <div className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200">
        {stat}
      </div>
    </div>
  )
}

function ProblemCard({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-base font-semibold leading-7 text-slate-800">{text}</div>
    </div>
  )
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-4 text-lg font-bold text-slate-900">{title}</div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  )
}

function SimpleCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="text-lg font-bold text-slate-900">{title}</div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  )
}

function LevelCard({ level, text }: { level: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="text-3xl font-extrabold tracking-tight text-slate-900">
        {level}
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  )
}