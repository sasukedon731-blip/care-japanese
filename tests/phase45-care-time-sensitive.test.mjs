import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const compile = (source, module = ts.ModuleKind.CommonJS) => ts.transpileModule(source, { compilerOptions: { module, target: ts.ScriptTarget.ES2022 } }).outputText
const quizSource = await readFile(new URL('../app/data/quizzes/care-worker-exam.ts', import.meta.url), 'utf8')
const quizModule = { exports: {} }
vm.runInNewContext(`(function(exports,module){${compile(quizSource)}})(quizModule.exports,quizModule)`, { quizModule })
const { careWorkerExamQuiz } = quizModule.exports
globalThis.__phase45CareQuiz = careWorkerExamQuiz
const migrationSource = (await readFile(new URL('../app/lib/careWorkerExamQuestionMigration.ts', import.meta.url), 'utf8'))
  .replace(/^import type.*$/m, '')
  .replace(/^import \{ careWorkerExamQuiz \}.*$/m, 'const careWorkerExamQuiz=globalThis.__phase45CareQuiz')
const migration = await import(`data:text/javascript;base64,${Buffer.from(compile(migrationSource, ts.ModuleKind.ESNext)).toString('base64')}`)
const { buildCareWorkerExamContentSignature, migrateCareWorkerExamQuestionStorage, phase45LegacyCareWorkerQuestions } = migration
const questions = careWorkerExamQuiz.questions
const ids = [56, 63, 70, 71, 73, 74, 128, 147, 160, 325, 399, 412, 452, 499, 551, 589]

class MemoryStorage {
  constructor(data = {}) { this.data = { ...data }; this.writes = [] }
  getItem(key) { return this.data[key] ?? null }
  setItem(key, value) { this.data[key] = value; this.writes.push([key, value]) }
}

test('Phase 45 changes exactly 16 adjudicated questions and preserves data invariants', () => {
  assert.deepEqual(phase45LegacyCareWorkerQuestions.map((question) => question.id), ids)
  assert.equal(questions.length, 599)
  assert.equal(new Set(questions.map((question) => question.id)).size, 599)
  assert.equal(questions.reduce((sum, question) => sum + question.choices.length, 0), 2995)
  for (const question of questions) {
    assert.equal(question.choices.length, 5)
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 5)
  }
  const expected = new Map([[63, '介護保険法'], [70, '約30％'], [71, '国民年金（基礎年金）'], [73, '後期高齢者医療制度'], [74, '3割'], [147, '本人の望む生活と個別性を踏まえ、評価可能な目標にする'], [160, '言葉以外の情報も、利用者の気持ちや状態を理解する手掛かりになるから'], [325, '短期目標は長期目標の達成に向けた具体的な段階として設定する'], [399, '後期高齢者'], [412, 'アルツハイマー型認知症'], [452, '共生'], [499, '原則1割の定率負担があり、所得に応じた月額負担上限が設けられる'], [551, '社会福祉士及び介護福祉士法'], [589, '合理的配慮の提供']])
  for (const [id, answer] of expected) {
    const question = questions.find((candidate) => candidate.id === id)
    assert.equal(question.choices[question.correctIndex], answer)
  }
  assert.match(questions.find((question) => question.id === 56).explanation, /要件/)
  assert.match(questions.find((question) => question.id === 128).explanation, /3年/)
})

test('Phase 45 v2 migrates all exact legacy objects and preserves user metadata', () => {
  const stored = phase45LegacyCareWorkerQuestions.map((question) => ({ ...question, userAnswer: [4], answeredAt: 'keep', score: 7, progress: 2 }))
  const storage = new MemoryStorage({
    'care-worker-exam-question-content-migration-v1': '1',
    'wrong-care-worker-exam': JSON.stringify(stored),
    'normal-session-care-worker-exam': JSON.stringify({ questions: stored, index: 8, correctCount: 3 }),
    'exam-session-care-worker-exam': JSON.stringify({ questions: stored, answers: [{ questionId: 63 }], score: 5 }),
  })
  migrateCareWorkerExamQuestionStorage(storage)
  migrateCareWorkerExamQuestionStorage(storage)
  const wrong = JSON.parse(storage.data['wrong-care-worker-exam'])
  assert.equal(wrong.length, 16)
  for (const question of wrong) {
    const canonical = questions.find((candidate) => candidate.id === question.id)
    assert.equal(question.question, canonical.question)
    assert.equal(JSON.stringify(question.choices), JSON.stringify(canonical.choices))
    assert.equal(question.correctIndex, canonical.correctIndex)
    assert.deepEqual(question.userAnswer, [4])
    assert.equal(question.answeredAt, 'keep')
    assert.equal(question.score, 7)
    assert.equal(question.progress, 2)
  }
  assert.equal(JSON.parse(storage.data['normal-session-care-worker-exam']).index, 8)
  assert.equal(JSON.parse(storage.data['exam-session-care-worker-exam']).score, 5)
  assert.equal(storage.data['care-worker-exam-question-content-migration-v2'], '1')
})

test('Phase 42 pending and completed users both safely reach Phase 45', () => {
  const pending = new MemoryStorage({ 'wrong-care-worker-exam': JSON.stringify(phase45LegacyCareWorkerQuestions) })
  migrateCareWorkerExamQuestionStorage(pending)
  assert.equal(pending.data['care-worker-exam-question-content-migration-v1'], '1')
  assert.equal(pending.data['care-worker-exam-question-content-migration-v2'], '1')
  const completed = new MemoryStorage({ 'care-worker-exam-question-content-migration-v1': '1', 'wrong-care-worker-exam': JSON.stringify(phase45LegacyCareWorkerQuestions) })
  migrateCareWorkerExamQuestionStorage(completed)
  assert.equal(completed.data['care-worker-exam-question-content-migration-v2'], '1')
})

test('Phase 45 migration rejects near matches, other quizzes, bad storage and repeated execution', () => {
  const near = { ...phase45LegacyCareWorkerQuestions[0], explanation: 'different', metadata: 'keep' }
  const other = JSON.stringify(phase45LegacyCareWorkerQuestions)
  const storage = new MemoryStorage({ 'care-worker-exam-question-content-migration-v1': '1', 'wrong-care-worker-exam': JSON.stringify([near]), 'wrong-japanese-n4': other })
  migrateCareWorkerExamQuestionStorage(storage)
  assert.deepEqual(JSON.parse(storage.data['wrong-care-worker-exam']), [near])
  assert.equal(storage.data['wrong-japanese-n4'], other)
  const once = JSON.stringify(storage.data)
  migrateCareWorkerExamQuestionStorage(storage)
  assert.equal(JSON.stringify(storage.data), once)
  for (const raw of ['{bad', 'null', '{}', '42', '"text"']) assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(new MemoryStorage({ 'wrong-care-worker-exam': raw })))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(undefined))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { throw new Error('read') }, setItem() { throw new Error('write') } }))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { return null }, setItem() { throw new Error('write') } }))
})

test('Phase 45 care signature detects content changes and game remains canonical-driven', async () => {
  const signature = buildCareWorkerExamContentSignature('care-worker-exam', questions)
  const changed = questions.map((question) => question.id === 70 ? { ...question, explanation: `${question.explanation}x` } : question)
  assert.equal(buildCareWorkerExamContentSignature('care-worker-exam', changed), signature)
  const changedQuestion = questions.map((question) => question.id === 70 ? { ...question, question: `${question.question}x` } : question)
  assert.notEqual(buildCareWorkerExamContentSignature('care-worker-exam', changedQuestion), signature)
  const game = await readFile(new URL('../app/(auth)/game/fromQuizzes.ts', import.meta.url), 'utf8')
  assert.match(game, /const quiz = \(quizzes as any\)\[quizType\]/)
  assert.doesNotMatch(game, /29\.3％|福祉三法|合理的配慮の提供.*2024/)
})
