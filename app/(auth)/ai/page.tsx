"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"

import AppHeader from "@/app/components/AppHeader"
import LegalFooter from "@/app/components/LegalFooter"
import { auth } from "@/app/lib/firebase"

const AI_MENUS = [
  {
    title: "AI会話",
    en: "AI Conversation",
    href: "/conversation",
    desc: "日常会話、介護現場の声かけ、面接練習などをAIと会話形式で練習できます。",
    badge: "会話練習",
    cls: "border-purple-200 bg-purple-50/60",
    button: "AI会話を始める",
  },
  {
    title: "AIスピーク",
    en: "AI Speak",
    href: "/speaking",
    desc: "発話練習、言い換え、評価を通して、実際に話す力を伸ばします。",
    badge: "発話練習",
    cls: "border-rose-200 bg-rose-50/60",
    button: "AIスピークを始める",
  },
  {
    title: "AI会話履歴",
    en: "Conversation History",
    href: "/mypage/conversation-history",
    desc: "過去のAI会話の記録を確認して、苦手な表現や成長を振り返れます。",
    badge: "履歴",
    cls: "border-slate-200 bg-white",
    button: "会話履歴を見る",
  },
  {
    title: "AIスピーク履歴",
    en: "Speak History",
    href: "/mypage/speaking-history",
    desc: "スピーキング練習の履歴や評価を確認して、次の練習につなげます。",
    badge: "履歴",
    cls: "border-slate-200 bg-white",
    button: "スピーク履歴を見る",
  },
]

export default function AiPage() {
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/login")
    })
    return () => unsub()
  }, [router])

  return (
    <div className="app-shell">
      <AppHeader title="AI練習" titleEn="AI Practice" />

      <main className="page-shell">
        <section className="ui-card">
          <p className="eyebrow">AI PRACTICE</p>
          <h1 className="page-title">AI練習メニュー</h1>
          <p className="page-lead">
            学習ページとは分けて、AI会話とAIスピークだけをここにまとめました。
            職場・面接・日常会話の実践練習に進めます。
          </p>
        </section>

        <section className="mt-6">
          <div className="grid-cards two">
            {AI_MENUS.map((item) => (
              <Link key={item.href} href={item.href} className={`ui-card-link ${item.cls}`}>
                <div className="ui-card-body">
                  <span className="ui-badge">{item.en}</span>
                  <h2 className="mt-4 card-title">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item.desc}</p>
                  <div className="ui-card-actions">
                    <span className="ui-btn ui-btn-primary">{item.button}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="ui-card mt-6">
          <p className="eyebrow">NEXT STEP</p>
          <h2 className="mt-2 card-title">通常学習に戻る</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            文法・語彙・介護用語などの問題演習は、学習メニューから始められます。
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/select-mode" className="ui-btn ui-btn-primary">
              学習メニューへ
            </Link>
            <Link href="/home" className="ui-btn ui-btn-secondary">
              個人ホームへ
            </Link>
          </div>
        </section>
      </main>

      <LegalFooter />
    </div>
  )
}
