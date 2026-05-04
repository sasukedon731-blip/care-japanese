"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "@/app/lib/firebase"
import AppHeader from "@/app/components/AppHeader"
import LegalFooter from "@/app/components/LegalFooter"

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user)
    })
    return () => unsub()
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <AppHeader />

      <main className="lp-main">
        {/* =========================
            Hero
        ========================= */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              {/* Left */}
              <div>
                <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  日本語検定 × 介護学習 × 企業管理
                </div>

                <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                  外国人の日本語学習を、
                  <br className="hidden sm:block" />
                  もっと続けやすく。
                </h1>

                <p className="lp-hero-lead mt-5 max-w-2xl text-base md:text-lg">
                  日本語検定と介護現場の学習を、スマホでわかりやすく。
                  個人学習にも、企業での学習管理にも対応した学習サービスです。
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={loggedIn ? "/home" : "/register"}
                    className="lp-primary-btn inline-flex min-w-[190px] items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold shadow-md transition"
                  >
                    {loggedIn ? "個人ホームへ" : "個人で始める"}
                  </Link>

                  <Link
                    href="/for-business"
                    className="lp-dark-btn inline-flex min-w-[190px] items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold shadow-md transition"
                  >
                    法人導入はこちら
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>スマホ対応</span>
                  <span>日本語検定・介護学習</span>
                  <span>企業管理画面あり</span>
                </div>
              </div>

              {/* Right / Phone Mock */}
              <div>
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-6">
                  <div className="mx-auto max-w-sm rounded-[2.4rem] border-[10px] border-slate-900 bg-white p-4 shadow-xl">
                    <div className="mx-auto mb-4 h-2.5 w-24 rounded-full bg-slate-200" />

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-800">学習状況</p>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                          介護 学習中
                        </span>
                      </div>

                      <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                        <div className="h-2 w-[68%] rounded-full bg-blue-600" />
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-[11px] text-slate-500">回数</p>
                          <p className="mt-1 text-lg font-bold text-slate-900">12</p>
                        </div>
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-[11px] text-slate-500">正答率</p>
                          <p className="mt-1 text-lg font-bold text-slate-900">78%</p>
                        </div>
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-[11px] text-slate-500">最終</p>
                          <p className="mt-1 text-sm font-bold text-slate-900">今日</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        "学習を始める",
                        "模擬試験",
                        "日本語バトル",
                        "復習",
                        "成績を見る",
                        "AI練習",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex h-24 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-center shadow-sm"
                        >
                          <span className="text-sm font-semibold text-slate-900">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-center text-sm text-slate-600">
                    ログイン後は、迷わず学習を始められるシンプルなホーム画面
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            Features
        ========================= */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                学びやすく、続けやすく、管理しやすい。
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                個人学習でも、企業での日本語研修でも使いやすいように、
                学習導線と管理導線をわかりやすく整理しています。
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900">スマホで学習</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  通勤中やすきま時間でも取り組みやすい、
                  スマホ中心の見やすい画面設計です。
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900">日本語検定・介護学習</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  基礎から反復しながら、段階的に学習できます。
                  学習と模擬試験を行き来しやすい構成です。
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900">企業管理に対応</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  学習者一覧、正答率、最終学習日などを確認でき、
                  フォローの判断がしやすくなります。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            Personal / Business
        ========================= */}
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Personal */}
              <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  個人向け
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  個人の方へ
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  学習を始める、模擬試験に挑戦する、日本語バトルで反復する。
                  毎日の学習を、スマホで続けやすくまとめました。
                </p>

                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  <li>・学習を始めやすいシンプルなホーム画面</li>
                  <li>・日本語検定 / 介護 の基礎学習に対応</li>
                  <li>・模擬試験や成績確認もスムーズ</li>
                </ul>

                <div className="mt-auto pt-8">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      href={loggedIn ? "/home" : "/register"}
                      className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700"
                    >
                      {loggedIn ? "個人ホームへ" : "個人で始める"}
                    </Link>

                    <Link
                      href="/select-mode"
                      className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
                    >
                      学習メニューを見る
                    </Link>
                  </div>
                </div>
              </div>

              {/* Business */}
              <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  法人向け
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  法人の方へ
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  外国人材の日本語学習を、企業側で把握しやすく。
                  学習回数、正答率、最終学習日などを確認でき、
                  学習フォローにつなげやすい管理画面を用意しています。
                </p>

                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  <li>・学習者一覧をまとめて確認</li>
                  <li>・未学習者やフォロー対象の把握</li>
                  <li>・日本語検定取得支援を見据えた運用に対応</li>
                </ul>

                <div className="mt-auto pt-8">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/for-business"
                      className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-slate-800 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-900"
                    >
                      法人導入を見る
                    </Link>

                    <Link
                      href="/for-business#contact"
                      className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
                    >
                      お問い合わせ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            How it works
        ========================= */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                ご利用開始までの流れ
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                個人利用でも法人利用でも、迷わず始められる導線を用意します。
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <h3 className="text-xl font-bold text-slate-900">個人利用の流れ</h3>
                <div className="mt-6 space-y-4">
                  {[
                    ["1", "新規登録", "アカウントを作成してログインします。"],
                    ["2", "学習開始", "日本語・介護・資格メニューから選びます。"],
                    ["3", "学習開始", "ホームからすぐに学習を始められます。"],
                  ].map(([num, title, text]) => (
                    <div
                      key={num}
                      className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {num}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{title}</div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <h3 className="text-xl font-bold text-slate-900">法人利用の流れ</h3>
                <div className="mt-6 space-y-4">
                  {[
                    ["1", "お問い合わせ", "利用人数や目的にあわせてご相談いただけます。"],
                    ["2", "ご案内・お見積", "運用方法や料金の目安をご案内します。"],
                    ["3", "ご利用開始", "企業担当者アカウント発行後、運用を開始します。"],
                  ].map(([num, title, text]) => (
                    <div
                      key={num}
                      className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                        {num}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{title}</div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FAQ
        ========================= */}
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                よくある質問
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {[
                [
                  "スマホで使えますか？",
                  "はい。スマホで見やすく、学習しやすい画面を前提に設計しています。",
                ],
                [
                  "個人でも使えますか？",
                  "はい。個人学習向けの導線と、ログイン後のホーム画面を用意しています。",
                ],
                [
                  "法人利用は何名くらいから想定していますか？",
                  "少人数の導入から、数十名規模の運用まで想定しています。詳しくは法人向けページからご相談ください。",
                ],
                [
                  "日本語検定・介護に対応していますか？",
                  "はい。現在は日本語検定・介護対策を中心に進めています。",
                ],
              ].map(([q, a]) => (
                <div
                  key={q}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-base font-bold text-slate-900">{q}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            Final CTA
        ========================= */}
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              個人でも、法人でも。
              <br className="hidden sm:block" />
              続けやすい日本語学習をここから。
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
              まずは自分に合った使い方から始めましょう。
              個人利用の開始も、法人導入の相談も、このページから進められます。
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={loggedIn ? "/home" : "/register"}
                className="lp-primary-btn inline-flex min-w-[190px] items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold shadow-md transition"
              >
                {loggedIn ? "個人ホームへ" : "個人で始める"}
              </Link>

              <Link
                href="/for-business"
                className="lp-dark-btn inline-flex min-w-[190px] items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold shadow-md transition"
              >
                法人導入はこちら
              </Link>
            </div>

            <div className="mt-5">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-900"
              >
                すでにアカウントをお持ちの方はこちら
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LegalFooter />
    </div>
  )
}