import type { Question, QuizType } from '../data/types'
import { careWorkerExamQuiz } from '../data/quizzes/care-worker-exam'

const VERSION_KEY = 'care-worker-exam-question-content-migration-v1'
const STORAGE_KEYS = ['wrong-care-worker-exam', 'normal-session-care-worker-exam', 'exam-session-care-worker-exam'] as const
const legacy = [
  { id: 85, question: '日本の将来推計において、2040年頃に高齢者1人を現役世代何人で支えることになると予測されているか。', choices: ['約10人', '約5人', '約', '5人', '約0.5人', '誰も支えない'], correctIndex: 2, sectionId: 'society' },
  { id: 161, question: '介護記録を書く際、客観的な事実を示す書き方として適切なものはどれか。', choices: ['利用者が怒っているように見えた', '食事を半分ほど残された', '体調が悪いのではないかと思った', '3', '5度の発熱があり、顔が赤かった', '昨日に比べて元気がない気がした'], correctIndex: 3, sectionId: 'communication' },
  { id: 251, question: '住宅の段差解消のためにスロープを設置する際、車椅子で自力走行する場合の適切な勾配（傾き）はどれか。', choices: ['1/4（急坂）', '1/', '6', '1/12以下（緩やか）', '勾配は関係ない', '垂直'], correctIndex: 2, sectionId: 'life-support' },
  { id: 263, question: 'アセスメントにおける「客観的情報」として適切なものはどれか。', choices: ['利用者が「腰が痛い」と言っている', '介護職が「疲れているな」と感じた', '利用者の顔が赤く、体温が', '3', '8度である', '家族が「わがままだ」と怒っている', '部屋が少し暗い気がする'], correctIndex: 2, sectionId: 'life-support' },
  { id: 513, question: '呼吸、心拍、体温調節など、生命維持に直結する自律神経の中枢がある部分はどこか。', choices: ['大脳皮質', '脳幹', '海馬', '側頭葉', '後頭葉'], correctIndex: 1, sectionId: 'body-mind' },
] as const

const canonical = new Map(careWorkerExamQuiz.questions.map((question) => [Number(question.id), question]))
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>
const same = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right)

function isLegacyQuestion(value: unknown, item: (typeof legacy)[number]): value is Question {
  if (!value || typeof value !== 'object') return false
  const question = value as Partial<Question>
  return Number(question.id) === item.id && question.question === item.question && same(question.choices, item.choices) && question.correctIndex === item.correctIndex && question.sectionId === item.sectionId
}

function migrateQuestion(value: unknown): unknown {
  const item = legacy.find((candidate) => isLegacyQuestion(value, candidate))
  if (!item || !value || typeof value !== 'object') return value
  const current = canonical.get(item.id)
  return current ? { ...(value as Record<string, unknown>), ...current } : value
}

function migrateArray(values: unknown[]): unknown[] {
  const seen = new Set<string>()
  return values.map(migrateQuestion).filter((value) => {
    if (!value || typeof value !== 'object' || !('id' in value)) return true
    const question = value as Partial<Question>
    const key = JSON.stringify([question.id, question.question, question.choices, question.correctIndex, question.sectionId])
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function migrateCareWorkerExamStoredValue(value: unknown): unknown {
  if (Array.isArray(value)) return migrateArray(value)
  if (!value || typeof value !== 'object') return value
  const record = { ...(value as Record<string, unknown>) }
  if (Array.isArray(record.questions)) record.questions = migrateArray(record.questions)
  return record
}

export function migrateCareWorkerExamQuestionStorage(storage?: StorageLike): void {
  if (!storage) {
    if (typeof window === 'undefined') return
    storage = window.localStorage
  }
  try {
    if (storage.getItem(VERSION_KEY) === '1') return
  } catch {
    return
  }
  for (const key of STORAGE_KEYS) {
    try {
      const raw = storage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw)
      const migrated = migrateCareWorkerExamStoredValue(parsed)
      if (!same(parsed, migrated)) storage.setItem(key, JSON.stringify(migrated))
    } catch {
      // Invalid or inaccessible storage is left untouched.
    }
  }
  try {
    storage.setItem(VERSION_KEY, '1')
  } catch {
    // The app remains usable without persistence.
  }
}

function hashText(text: string): string {
  let hash = 2166136261
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

export function buildCareWorkerExamContentSignature(quizType: QuizType, questions: readonly Question[]): string {
  if (quizType !== 'care-worker-exam') return `${quizType}:unchanged`
  const content = questions.map((question) => JSON.stringify([question.id, question.question, question.choices, question.correctIndex, question.sectionId])).join('|')
  return `care-worker-exam:v1:${questions.length}:${hashText(content)}`
}
