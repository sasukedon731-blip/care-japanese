// app/data/quizCatalog.ts

export type QuizMode = "normal" | "exam" | "review"
export type IndustryId = "care" | "undecided"

export type QuizSectionDef = {
  id: string
  title: string
  description?: string
  enabled: boolean
  order: number
}

export type QuizDef = {
  id: string
  title: string
  description?: string

  enabled: boolean
  order: number

  modes: QuizMode[]
  sections: QuizSectionDef[]

  // 業種別TOP表示用（未指定なら従来どおり全体扱い）
  industries?: IndustryId[] | "all"
}

/**
 * 🎯 全教材共通のカタログ
 */
export const quizCatalog: QuizDef[] = [
  // ===============================
  // 日本語・共通
  // ===============================


  {
    id: "japanese-n4",
    title: "日本語検定 N4",
    description: "文法・語彙・読解・聴解",
    enabled: true,
    order: 2,
    industries: "all",
    modes: ["normal", "exam", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "vocab", title: "文字・語彙", enabled: true, order: 2 },
      { id: "grammar", title: "文法", enabled: true, order: 3 },
      { id: "reading", title: "読解", enabled: true, order: 4 },
      { id: "listening", title: "聴解", enabled: true, order: 5 },
    ],
  },



  {
    id: "japanese-n3",
    title: "日本語検定 N3",
    description: "文法・語彙・読解・聴解（N3）",
    enabled: true,
    order: 4,
    industries: "all",
    modes: ["normal", "exam", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "vocab", title: "文字・語彙", enabled: true, order: 2 },
      { id: "grammar", title: "文法", enabled: true, order: 3 },
      { id: "reading", title: "読解", enabled: true, order: 4 },
      { id: "listening", title: "聴解", enabled: true, order: 5 },
    ],
  },

  {
    id: "japanese-n2",
    title: "日本語検定 N2",
    description: "文法・語彙・読解・聴解（N2）",
    enabled: true,
    order: 5,
    industries: "all",
    modes: ["normal", "exam", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "vocab", title: "文字・語彙", enabled: true, order: 2 },
      { id: "grammar", title: "文法", enabled: true, order: 3 },
      { id: "reading", title: "読解", enabled: true, order: 4 },
      { id: "listening", title: "聴解", enabled: true, order: 5 },
    ],
  },









  // ===============================
  // 建設
  // ===============================






















  // ===============================
  // 製造
  // ===============================












  // ===============================
  // 介護
  // ===============================
  {
    id: "care-terms",
    title: "介護用語（重要100）",
    description: "介護現場で必須の用語を4択で覚える",
    enabled: true,
    order: 80,
    industries: ["care"],
    modes: ["normal", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "adl", title: "身体介助・基本動作", enabled: true, order: 2 },
      { id: "meal", title: "食事・水分", enabled: true, order: 3 },
      { id: "vital", title: "健康状態・バイタル", enabled: true, order: 4 },
      { id: "dementia", title: "認知症・メンタル", enabled: true, order: 5 },
      { id: "equipment", title: "用具・設備", enabled: true, order: 6 },
      { id: "record", title: "記録・事務", enabled: true, order: 7 },
      { id: "facility", title: "施設・専門職", enabled: true, order: 8 },
      { id: "risk", title: "リスク・緊急時", enabled: true, order: 9 },
    ],
  },

  {
    id: "care-listening",
    title: "介護リスニング（重要100）",
    description: "介護現場でよく聞く用語を聞いて意味を選ぶ",
    enabled: true,
    order: 81,
    industries: ["care"],
    modes: ["normal", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "adl", title: "身体介助・基本動作", enabled: true, order: 2 },
      { id: "meal", title: "食事・水分", enabled: true, order: 3 },
      { id: "vital", title: "健康状態・バイタル", enabled: true, order: 4 },
      { id: "dementia", title: "認知症・メンタル", enabled: true, order: 5 },
      { id: "equipment", title: "用具・設備", enabled: true, order: 6 },
      { id: "record", title: "記録・事務", enabled: true, order: 7 },
      { id: "facility", title: "施設・専門職", enabled: true, order: 8 },
      { id: "risk", title: "リスク・緊急時", enabled: true, order: 9 },
    ],
  },

  {
    id: "care-conversation",
    title: "介護現場会話（重要100）",
    description: "介護現場の指示・会話を聞いて対応を選ぶ",
    enabled: true,
    order: 82,
    industries: ["care"],
    modes: ["normal", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "adl", title: "身体介助・基本動作", enabled: true, order: 2 },
      { id: "meal", title: "食事・水分", enabled: true, order: 3 },
      { id: "vital", title: "健康状態・バイタル", enabled: true, order: 4 },
      { id: "dementia", title: "認知症・メンタル", enabled: true, order: 5 },
      { id: "equipment", title: "用具・設備", enabled: true, order: 6 },
      { id: "record", title: "記録・事務", enabled: true, order: 7 },
      { id: "facility", title: "施設・専門職", enabled: true, order: 8 },
      { id: "risk", title: "リスク・緊急時", enabled: true, order: 9 },
    ],
  },
  {
    id: "care-worker-exam",
    title: "介護福祉士試験",
    description: "介護福祉士国家試験レベルの知識を学ぶ",
    enabled: true,
    order: 40,
    industries: ["care"],
    modes: ["normal","exam","review"],
    sections: [{ id: "all", title: "総合", enabled: true, order: 1 }],
  },
]

/**
 * util: quizType から定義を取得（enabled のみ）
 */
export function getQuizDef(quizType: string): QuizDef | undefined {
  return quizCatalog.find((q) => q.id === quizType && q.enabled)
}

/**
 * util: sectionId を解決（無ければ all）
 * ✅ sections が空でも落ちないよう安全化
 */
export function resolveSection(
  quiz: QuizDef,
  sectionId?: string | null,
): QuizSectionDef {
  const enabledSections = (quiz.sections ?? [])
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)

  const fallback: QuizSectionDef =
    enabledSections[0] ?? {
      id: "all",
      title: "総合",
      enabled: true,
      order: 1,
    }

  if (!sectionId) return fallback
  return enabledSections.find((s) => s.id === sectionId) ?? fallback
}
