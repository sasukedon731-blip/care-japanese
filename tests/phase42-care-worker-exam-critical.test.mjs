import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const quizSource = await readFile(new URL('../app/data/quizzes/care-worker-exam.ts', import.meta.url), 'utf8')
const quizCompiled = ts.transpileModule(quizSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const quizModule = { exports: {} }
vm.runInNewContext(`(function(exports,module){${quizCompiled}})(quizModule.exports,quizModule)`, { quizModule })
const { careWorkerExamQuiz } = quizModule.exports
globalThis.__phase42CareQuiz = careWorkerExamQuiz

const migrationSource = (await readFile(new URL('../app/lib/careWorkerExamQuestionMigration.ts', import.meta.url), 'utf8'))
  .replace(/^import type.*$/m, '')
  .replace(/^import \{ careWorkerExamQuiz \}.*$/m, 'const careWorkerExamQuiz=globalThis.__phase42CareQuiz')
const migrationModule = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(migrationSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64')}`)
const { buildCareWorkerExamContentSignature, migrateCareWorkerExamQuestionStorage } = migrationModule
const questions = careWorkerExamQuiz.questions

const legacy = [
  { id: 85, question: '日本の将来推計において、2040年頃に高齢者1人を現役世代何人で支えることになると予測されているか。', choices: ['約10人', '約5人', '約', '5人', '約0.5人', '誰も支えない'], correctIndex: 2, sectionId: 'society' },
  { id: 161, question: '介護記録を書く際、客観的な事実を示す書き方として適切なものはどれか。', choices: ['利用者が怒っているように見えた', '食事を半分ほど残された', '体調が悪いのではないかと思った', '3', '5度の発熱があり、顔が赤かった', '昨日に比べて元気がない気がした'], correctIndex: 3, sectionId: 'communication' },
  { id: 251, question: '住宅の段差解消のためにスロープを設置する際、車椅子で自力走行する場合の適切な勾配（傾き）はどれか。', choices: ['1/4（急坂）', '1/', '6', '1/12以下（緩やか）', '勾配は関係ない', '垂直'], correctIndex: 2, sectionId: 'life-support' },
  { id: 263, question: 'アセスメントにおける「客観的情報」として適切なものはどれか。', choices: ['利用者が「腰が痛い」と言っている', '介護職が「疲れているな」と感じた', '利用者の顔が赤く、体温が', '3', '8度である', '家族が「わがままだ」と怒っている', '部屋が少し暗い気がする'], correctIndex: 2, sectionId: 'life-support' },
  { id: 513, question: '呼吸、心拍、体温調節など、生命維持に直結する自律神経の中枢がある部分はどこか。', choices: ['大脳皮質', '脳幹', '海馬', '側頭葉', '後頭葉'], correctIndex: 1, sectionId: 'body-mind' },
]

class MemoryStorage {
  constructor(data = {}) { this.data = { ...data }; this.writes = [] }
  getItem(key) { return this.data[key] ?? null }
  setItem(key, value) { this.data[key] = value; this.writes.push([key, value]) }
}

test('Phase 42 keeps 599 questions and applies the nine adjudicated changes', () => {
  assert.equal(questions.length, 599)
  assert.equal(new Set(questions.map((question) => question.id)).size, 599)
  const expected = new Map([
    [85, ['約1.5人', 2]], [161, ['腋窩体温を測定すると37.5℃で、顔面に発赤が見られた', 3]],
    [251, ['1/12以下', 2]], [263, ['腋窩体温を測定すると37.8℃で、顔面に発赤が見られた', 2]], [513, ['視床下部', 1]],
  ])
  for (const [id, [answer, correctIndex]] of expected) {
    const question = questions.find((candidate) => candidate.id === id)
    assert.equal(question.correctIndex, correctIndex)
    assert.equal(question.choices[correctIndex], answer)
    assert.equal(question.choices.length, 5)
  }
  for (const id of [266, 518, 530, 541]) assert.ok(questions.find((question) => question.id === id).explanation.length > 30)
  for (const question of questions) assert.ok(question.correctIndex >= 0 && question.correctIndex < question.choices.length)
})

test('Phase 42 migration updates only exact legacy objects and preserves metadata', () => {
  const stored = legacy.map((question) => ({ ...question, userAnswer: [1], answeredAt: 'keep', score: 4 }))
  const storage = new MemoryStorage({
    'wrong-care-worker-exam': JSON.stringify(stored),
    'normal-session-care-worker-exam': JSON.stringify({ questions: stored, index: 7 }),
    'exam-session-care-worker-exam': JSON.stringify({ questions: stored, answers: [{ questionId: 85 }], score: 3 }),
  })
  migrateCareWorkerExamQuestionStorage(storage)
  migrateCareWorkerExamQuestionStorage(storage)
  const wrong = JSON.parse(storage.data['wrong-care-worker-exam'])
  assert.equal(wrong.length, 5)
  for (const question of wrong) {
    const canonical = questions.find((candidate) => candidate.id === question.id)
    assert.equal(question.question, canonical.question)
    assert.equal(JSON.stringify(question.choices), JSON.stringify(canonical.choices))
    assert.equal(question.correctIndex, canonical.correctIndex)
    assert.deepEqual(question.userAnswer, [1])
    assert.equal(question.answeredAt, 'keep')
    assert.equal(question.score, 4)
  }
  assert.equal(JSON.parse(storage.data['normal-session-care-worker-exam']).index, 7)
  assert.equal(JSON.parse(storage.data['exam-session-care-worker-exam']).score, 3)
  assert.equal(storage.data['care-worker-exam-question-content-migration-v1'], '1')
})

test('Phase 42 migration is scoped, idempotent, and safe for invalid storage', () => {
  const different = { ...legacy[0], question: `${legacy[0].question}別` }
  const otherQuiz = JSON.stringify(legacy)
  const storage = new MemoryStorage({ 'wrong-care-worker-exam': JSON.stringify([different, legacy[0], legacy[0]]), 'wrong-japanese-n4': otherQuiz })
  migrateCareWorkerExamQuestionStorage(storage)
  const migrated = JSON.parse(storage.data['wrong-care-worker-exam'])
  assert.equal(migrated.length, 2)
  assert.deepEqual(migrated[0], different)
  assert.equal(storage.data['wrong-japanese-n4'], otherQuiz)
  for (const raw of ['{bad', 'null', '{}', '42', '"text"']) assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(new MemoryStorage({ 'wrong-care-worker-exam': raw })))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(undefined))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { throw new Error('read') }, setItem() { throw new Error('write') } }))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { return null }, setItem() { throw new Error('write') } }))
})

test('Phase 42 care session signature detects every content field', () => {
  const base = buildCareWorkerExamContentSignature('care-worker-exam', questions)
  for (const field of ['id', 'question', 'choices', 'correctIndex', 'sectionId']) {
    const changed = questions.map((question, index) => index === 84 ? { ...question, [field]: field === 'choices' ? [...question.choices].reverse() : field === 'correctIndex' ? (question.correctIndex + 1) % question.choices.length : field === 'id' ? 9999 : `${question[field]}x` } : question)
    assert.notEqual(buildCareWorkerExamContentSignature('care-worker-exam', changed), base)
  }
  assert.equal(buildCareWorkerExamContentSignature('japanese-n2', questions), 'japanese-n2:unchanged')
})

test('Phase 42 clients migrate before reads and normal/exam sessions use care signatures', async () => {
  for (const path of ['../app/(auth)/normal/NormalClient.tsx', '../app/(auth)/exam/ExamClient.tsx', '../app/(auth)/review/ReviewClient.tsx']) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8')
    assert.match(source, /migrateCareWorkerExamQuestionStorage\(\)/)
  }
  const normal = await readFile(new URL('../app/(auth)/normal/NormalClient.tsx', import.meta.url), 'utf8')
  const exam = await readFile(new URL('../app/(auth)/exam/ExamClient.tsx', import.meta.url), 'utf8')
  assert.match(normal, /buildCareWorkerExamContentSignature/)
  assert.match(normal, /d\.meta\?\.contentSig === contentSig/)
  assert.match(exam, /buildCareWorkerExamContentSignature/)
  assert.match(exam, /s\?\.meta\?\.contentSig !== contentSig/)
})

test('Phase 42 game conversion remains canonical-driven with no static care copy', async () => {
  const source = await readFile(new URL('../app/(auth)/game/fromQuizzes.ts', import.meta.url), 'utf8')
  assert.match(source, /const quiz = \(quizzes as any\)\[quizType\]/)
  assert.match(source, /mapStudyToGame\(q, quizType/)
  assert.doesNotMatch(source, /約1\.5人|37\.5℃|1\/12以下|37\.8℃|視床下部/)
})
