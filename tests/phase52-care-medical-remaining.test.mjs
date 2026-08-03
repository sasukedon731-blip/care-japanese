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
globalThis.__phase52CareQuiz = careWorkerExamQuiz
const migrationSource = (await readFile(new URL('../app/lib/careWorkerExamQuestionMigration.ts', import.meta.url), 'utf8'))
  .replace(/^import type.*$/m, '')
  .replace(/^import \{ careWorkerExamQuiz \}.*$/m, 'const careWorkerExamQuiz=globalThis.__phase52CareQuiz')
const migration = await import(`data:text/javascript;base64,${Buffer.from(compile(migrationSource, ts.ModuleKind.ESNext)).toString('base64')}`)
const { buildCareWorkerExamContentSignature, migrateCareWorkerExamQuestionStorage, phase52LegacyCareWorkerQuestions } = migration
const questions = careWorkerExamQuiz.questions
const ids = [103, 117, 139, 145, 230, 248, 293, 294, 304, 458, 561, 594]
const protectedIds = [111, 241, 254, 569, 574, 235]

class MemoryStorage {
  constructor(data = {}) { this.data = { ...data }; this.writes = [] }
  getItem(key) { return this.data[key] ?? null }
  setItem(key, value) { this.data[key] = value; this.writes.push([key, value]) }
}

test('Phase 52 canonical data has 599 unique five-choice questions and the twelve expected records', () => {
  assert.deepEqual(phase52LegacyCareWorkerQuestions.map((question) => question.id), ids)
  assert.equal(questions.length, 599)
  assert.equal(new Set(questions.map((question) => question.id)).size, 599)
  assert.equal(questions.reduce((sum, question) => sum + question.choices.length, 0), 2995)
  for (const question of questions) {
    assert.equal(question.choices.length, 5)
    assert.equal(new Set(question.choices).size, 5)
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 5)
  }
  const indexes = new Map([[103,0],[117,0],[139,1],[145,2],[230,0],[248,1],[293,0],[294,0],[304,0],[458,0],[561,0],[594,0]])
  for (const [id, index] of indexes) assert.equal(questions.find((q) => q.id === id).correctIndex, index)
  assert.equal(questions.find((q) => q.id === 139).choices[1], '訪問看護師')
  assert.equal(questions.find((q) => q.id === 145).choices[2], '計画に沿って嚥下体操や口腔運動を行う')
  assert.equal(questions.find((q) => q.id === 235).question, '快眠のための枕の高さとして、一般的に適切とされるのはどれか。')
  for (const id of protectedIds.slice(0, 5)) assert.ok(questions.find((q) => q.id === id))
})

test('Phase 52 v4 migrates exact legacy content in all three stores and preserves metadata', () => {
  const stored = phase52LegacyCareWorkerQuestions.map((question) => ({ ...question, userAnswer: [4], answeredAt: 'keep', score: 7, progress: 2, correct: false }))
  const storage = new MemoryStorage({
    'care-worker-exam-question-content-migration-v1': '1',
    'care-worker-exam-question-content-migration-v2': '1',
    'care-worker-exam-question-content-migration-v3': '1',
    'wrong-care-worker-exam': JSON.stringify(stored),
    'normal-session-care-worker-exam': JSON.stringify({ questions: stored, index: 8, correctCount: 3 }),
    'exam-session-care-worker-exam': JSON.stringify({ questions: stored, answers: [{ questionId: 103, choice: 4 }], score: 5 }),
  })
  migrateCareWorkerExamQuestionStorage(storage)
  const wrong = JSON.parse(storage.data['wrong-care-worker-exam'])
  assert.equal(wrong.length, 12)
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
    assert.equal(question.correct, false)
  }
  assert.equal(JSON.parse(storage.data['normal-session-care-worker-exam']).index, 8)
  assert.equal(JSON.parse(storage.data['exam-session-care-worker-exam']).answers[0].choice, 4)
  assert.equal(storage.data['care-worker-exam-question-content-migration-v4'], '1')
})

test('Phase 52 supports every v1-v4 execution path and repeated execution', () => {
  for (let completed = 0; completed <= 4; completed++) {
    const data = { 'wrong-care-worker-exam': JSON.stringify(phase52LegacyCareWorkerQuestions) }
    for (let version = 1; version <= completed; version++) data[`care-worker-exam-question-content-migration-v${version}`] = '1'
    const storage = new MemoryStorage(data)
    migrateCareWorkerExamQuestionStorage(storage)
    migrateCareWorkerExamQuestionStorage(storage)
    for (let version = 1; version <= 4; version++) assert.equal(storage.data[`care-worker-exam-question-content-migration-v${version}`], '1')
    const first = JSON.parse(storage.data['wrong-care-worker-exam'])[0]
    if (completed < 4) assert.equal(first.question, questions.find((q) => q.id === 103).question)
    else assert.equal(first.question, phase52LegacyCareWorkerQuestions[0].question)
  }
})

test('Phase 52 v4 rejects near matches, protected IDs and other quizzes and tolerates invalid storage', () => {
  const near = { ...phase52LegacyCareWorkerQuestions[0], explanation: 'different', metadata: 'keep' }
  const protectedQuestions = protectedIds.map((id) => questions.find((q) => q.id === id))
  const other = JSON.stringify(phase52LegacyCareWorkerQuestions)
  const storage = new MemoryStorage({
    'care-worker-exam-question-content-migration-v1': '1',
    'care-worker-exam-question-content-migration-v2': '1',
    'care-worker-exam-question-content-migration-v3': '1',
    'wrong-care-worker-exam': JSON.stringify([near, ...protectedQuestions]),
    'wrong-japanese-n4': other,
  })
  migrateCareWorkerExamQuestionStorage(storage)
  const result = JSON.parse(storage.data['wrong-care-worker-exam'])
  assert.deepEqual(result[0], near)
  assert.equal(JSON.stringify(result.slice(1)), JSON.stringify(protectedQuestions))
  assert.equal(storage.data['wrong-japanese-n4'], other)
  for (const raw of ['{bad', 'null', '{}', '42', '"text"']) assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(new MemoryStorage({ 'wrong-care-worker-exam': raw })))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(undefined))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { throw new Error('read') }, setItem() { throw new Error('write') } }))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { return null }, setItem() { throw new Error('write') } }))
})

test('Phase 52 changes are detected by the care signature and game remains canonical-driven', async () => {
  const signature = buildCareWorkerExamContentSignature('care-worker-exam', questions)
  const changedQuestion = questions.map((question) => question.id === 103 ? { ...question, question: `${question.question}x` } : question)
  const changedChoices = questions.map((question) => question.id === 103 ? { ...question, choices: [...question.choices].reverse() } : question)
  const changedIndex = questions.map((question) => question.id === 103 ? { ...question, correctIndex: 1 } : question)
  assert.notEqual(buildCareWorkerExamContentSignature('care-worker-exam', changedQuestion), signature)
  assert.notEqual(buildCareWorkerExamContentSignature('care-worker-exam', changedChoices), signature)
  assert.notEqual(buildCareWorkerExamContentSignature('care-worker-exam', changedIndex), signature)
  assert.equal(buildCareWorkerExamContentSignature('japanese-n2', questions), 'japanese-n2:unchanged')
  assert.equal(buildCareWorkerExamContentSignature('japanese-n3', questions), 'japanese-n3:unchanged')
  const game = await readFile(new URL('../app/(auth)/game/fromQuizzes.ts', import.meta.url), 'utf8')
  assert.match(game, /const quiz = \(quizzes as any\)\[quizType\]/)
  assert.doesNotMatch(game, /突然倒れた.*普段どおりの呼吸|角化型疥癬.*シーツ/)
})
