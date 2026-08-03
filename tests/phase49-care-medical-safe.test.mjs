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
globalThis.__phase49CareQuiz = careWorkerExamQuiz
const migrationSource = (await readFile(new URL('../app/lib/careWorkerExamQuestionMigration.ts', import.meta.url), 'utf8'))
  .replace(/^import type.*$/m, '')
  .replace(/^import \{ careWorkerExamQuiz \}.*$/m, 'const careWorkerExamQuiz=globalThis.__phase49CareQuiz')
const migration = await import(`data:text/javascript;base64,${Buffer.from(compile(migrationSource, ts.ModuleKind.ESNext)).toString('base64')}`)
const { migrateCareWorkerExamQuestionStorage, phase49LegacyCareWorkerQuestions } = migration
const questions = careWorkerExamQuiz.questions
const ids = [245, 246, 289, 369, 388, 429, 444, 492, 542, 582]

class MemoryStorage {
  constructor(data = {}) { this.data = { ...data }; this.writes = [] }
  getItem(key) { return this.data[key] ?? null }
  setItem(key, value) { this.data[key] = value; this.writes.push([key, value]) }
}

test('Phase 49 applies exactly the ten adjudicated questions and preserves invariants', () => {
  assert.deepEqual(phase49LegacyCareWorkerQuestions.map((question) => question.id), ids)
  assert.equal(questions.length, 599)
  assert.equal(new Set(questions.map((question) => question.id)).size, 599)
  assert.equal(questions.reduce((sum, question) => sum + question.choices.length, 0), 2995)
  for (const question of questions) {
    assert.equal(question.choices.length, 5)
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 5)
  }
  const answers = new Map([
    [245, '背部叩打法を行う'], [246, '胸が約5cm沈む深さで、1分間に100～120回'],
    [289, '姿勢を安定させ、飲み込みやすくするため'], [369, '口渇を感じる中枢の機能が低下し、喉の渇きを自覚しにくくなるから'],
    [388, '緑内障'], [429, '原因疾患による脳の障害から直接生じる認知機能の症状である'],
    [444, '若年性認知症支援コーディネーター'], [492, '一定の要件を満たす難病等の人'],
    [542, '眼圧が正常範囲でも発症することがある'], [582, '飛沫予防策としてサージカルマスクを適切に使用する'],
  ])
  for (const [id, answer] of answers) {
    const question = questions.find((candidate) => candidate.id === id)
    assert.equal(question.choices[question.correctIndex], answer)
    assert.ok(question.explanation.length > 20)
  }
  assert.equal(questions.find((question) => question.id === 235).question, '快眠のための枕の高さとして、一般的に適切とされるのはどれか。')
})

test('Phase 49 v3 migrates exact legacy questions in all three storage shapes and preserves metadata', () => {
  const stored = phase49LegacyCareWorkerQuestions.map((question) => ({ ...question, userAnswer: [4], answeredAt: 'keep', score: 7, progress: 2 }))
  const storage = new MemoryStorage({
    'care-worker-exam-question-content-migration-v1': '1',
    'care-worker-exam-question-content-migration-v2': '1',
    'wrong-care-worker-exam': JSON.stringify(stored),
    'normal-session-care-worker-exam': JSON.stringify({ questions: stored, index: 8, correctCount: 3 }),
    'exam-session-care-worker-exam': JSON.stringify({ questions: stored, answers: [{ questionId: 245 }], score: 5 }),
  })
  migrateCareWorkerExamQuestionStorage(storage)
  const wrong = JSON.parse(storage.data['wrong-care-worker-exam'])
  assert.equal(wrong.length, 10)
  for (const question of wrong) {
    const canonical = questions.find((candidate) => candidate.id === question.id)
    assert.equal(question.question, canonical.question)
    assert.equal(JSON.stringify(question.choices), JSON.stringify(canonical.choices))
    assert.equal(question.correctIndex, canonical.correctIndex)
    assert.equal(question.explanation, canonical.explanation)
    assert.deepEqual(question.userAnswer, [4])
    assert.equal(question.answeredAt, 'keep')
    assert.equal(question.score, 7)
    assert.equal(question.progress, 2)
  }
  assert.equal(JSON.parse(storage.data['normal-session-care-worker-exam']).index, 8)
  assert.equal(JSON.parse(storage.data['exam-session-care-worker-exam']).score, 5)
  assert.equal(storage.data['care-worker-exam-question-content-migration-v3'], '1')
})

test('Phase 49 users reach v3 whether v1 and v2 are pending or complete', () => {
  const pending = new MemoryStorage({ 'wrong-care-worker-exam': JSON.stringify(phase49LegacyCareWorkerQuestions) })
  migrateCareWorkerExamQuestionStorage(pending)
  assert.equal(pending.data['care-worker-exam-question-content-migration-v1'], '1')
  assert.equal(pending.data['care-worker-exam-question-content-migration-v2'], '1')
  assert.equal(pending.data['care-worker-exam-question-content-migration-v3'], '1')
  const completed = new MemoryStorage({
    'care-worker-exam-question-content-migration-v1': '1',
    'care-worker-exam-question-content-migration-v2': '1',
    'wrong-care-worker-exam': JSON.stringify(phase49LegacyCareWorkerQuestions),
  })
  migrateCareWorkerExamQuestionStorage(completed)
  assert.equal(completed.data['care-worker-exam-question-content-migration-v3'], '1')
})

test('Phase 49 v3 rejects near matches and other quizzes and is idempotent', () => {
  const near = { ...phase49LegacyCareWorkerQuestions[0], explanation: 'different', metadata: 'keep' }
  const other = JSON.stringify(phase49LegacyCareWorkerQuestions)
  const storage = new MemoryStorage({
    'care-worker-exam-question-content-migration-v1': '1',
    'care-worker-exam-question-content-migration-v2': '1',
    'wrong-care-worker-exam': JSON.stringify([near]),
    'wrong-japanese-n4': other,
  })
  migrateCareWorkerExamQuestionStorage(storage)
  assert.deepEqual(JSON.parse(storage.data['wrong-care-worker-exam']), [near])
  assert.equal(storage.data['wrong-japanese-n4'], other)
  const once = JSON.stringify(storage.data)
  migrateCareWorkerExamQuestionStorage(storage)
  assert.equal(JSON.stringify(storage.data), once)
})

test('Phase 49 v3 is safe for SSR, malformed JSON and storage exceptions', () => {
  for (const raw of ['{bad', 'null', '{}', '42', '"text"']) {
    assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(new MemoryStorage({ 'wrong-care-worker-exam': raw })))
  }
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(undefined))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { throw new Error('read') }, setItem() { throw new Error('write') } }))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { return null }, setItem() { throw new Error('write') } }))
})
