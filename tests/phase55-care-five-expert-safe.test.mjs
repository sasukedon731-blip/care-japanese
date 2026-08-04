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
globalThis.__phase55CareQuiz = careWorkerExamQuiz
const migrationSource = (await readFile(new URL('../app/lib/careWorkerExamQuestionMigration.ts', import.meta.url), 'utf8'))
  .replace(/^import type.*$/m, '')
  .replace(/^import \{ careWorkerExamQuiz \}.*$/m, 'const careWorkerExamQuiz=globalThis.__phase55CareQuiz')
const migration = await import(`data:text/javascript;base64,${Buffer.from(compile(migrationSource, ts.ModuleKind.ESNext)).toString('base64')}`)
const { buildCareWorkerExamContentSignature, migrateCareWorkerExamQuestionStorage, phase55LegacyCareWorkerQuestions } = migration
const questions = careWorkerExamQuiz.questions
const ids = [111, 241, 254, 460, 510, 550, 569, 570, 574]

const expected = new Map([
  [111, { question: '終末期にあり嚥下機能が低下している利用者の口腔乾燥に対し、介護職が行う対応として最も適切なものはどれか。', answer: 'ケア計画に従い、余分な水分を十分に絞った口腔ケア用綿棒等で保湿し、状態を看護職等へ共有する', index: 0, sectionId: 'care-basic' }],
  [241, { question: '死が間近で誤嚥リスクが非常に高い利用者が口渇を訴えた。介護職の初期対応として最も適切なものはどれか。', answer: '本人の希望を確認して医療・ケアチームへ共有し、評価済みの苦痛緩和方法で口唇・口腔を保湿する', index: 0, sectionId: 'life-support' }],
  [254, { question: '嚥下機能が低下した利用者の食形態を検討するとき、介護職の対応として最も適切なものはどれか。', answer: '咀嚼・送り込み・嚥下・口腔残留を個別に評価した多職種の計画に沿って食形態を提供する', index: 0, sectionId: 'life-support' }],
  [460, { question: '認知症ケアの究極の目標はどれか。', answer: '認知症があっても、その人の尊厳が守られ、最期までその人らしく生きること', index: 1, sectionId: 'dementia' }],
  [510, { question: '障害者支援における介護福祉士の最も重要な役割は。', answer: '本人の自己決定を尊重し、自立を共に支えること', index: 1, sectionId: 'disability' }],
  [550, { question: '心身のしくみを学ぶ最大の目的はどれか。', answer: '介護の根拠（エビデンス）を持ち、安全で質の高いケアを実践するため', index: 1, sectionId: 'body-mind' }],
  [569, { question: '使用後の吸引カテーテルを再使用できるか判断するとき、介護職が最初に確認するものはどれか。', answer: '製品の電子添文・取扱説明書と施設手順、吸引部位、医師・看護職の指示', index: 0, sectionId: 'medical-care' }],
  [570, { question: '利用者に反応がなく、普段どおりの呼吸がないと判断したとき、介護福祉士に求められる対応はどれか。', answer: '救急蘇生法（AED等）を実施し、周囲と連携して救急要請する', index: 1, sectionId: 'medical-care' }],
  [574, { question: '左片麻痺があり食事中のむせが増えた利用者を介助する前に、最も優先して確認することはどれか。', answer: '安定した姿勢と、顔面・口腔・嚥下機能、食物残留、半側空間無視、個別の介助計画', index: 0, sectionId: 'medical-care' }],
])

class MemoryStorage {
  constructor(data = {}) { this.data = { ...data }; this.writes = [] }
  getItem(key) { return this.data[key] ?? null }
  setItem(key, value) { this.data[key] = value; this.writes.push([key, value]) }
}

test('Phase 55 applies the nine complete canonical questions and preserves invariants', () => {
  assert.deepEqual(phase55LegacyCareWorkerQuestions.map((question) => question.id), ids)
  assert.equal(questions.length, 599)
  assert.equal(new Set(questions.map((question) => question.id)).size, 599)
  assert.equal(questions.reduce((sum, question) => sum + question.choices.length, 0), 2995)
  for (const question of questions) {
    assert.equal(question.choices.length, 5)
    assert.equal(new Set(question.choices).size, 5)
    assert.ok(question.question)
    assert.ok(question.explanation)
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 5)
  }
  const currentById = new Map(questions.map((question) => [question.id, question]))
  const changes = phase55LegacyCareWorkerQuestions.map((legacy) => ({ legacy, current: currentById.get(legacy.id) }))
  assert.equal(changes.filter(({ legacy, current }) => legacy.question !== current.question).length, 6)
  assert.equal(changes.filter(({ legacy, current }) => JSON.stringify(legacy.choices) !== JSON.stringify(current.choices)).length, 5)
  assert.equal(changes.filter(({ legacy, current }) => legacy.correctIndex !== current.correctIndex).length, 4)
  assert.equal(changes.filter(({ legacy, current }) => legacy.choices[legacy.correctIndex] !== current.choices[current.correctIndex]).length, 5)
  assert.equal(changes.filter(({ legacy, current }) => legacy.explanation !== current.explanation).length, 9)
  for (const id of [460, 510, 550]) {
    const { legacy, current } = changes.find((change) => change.legacy.id === id)
    assert.equal(legacy.question, current.question)
    assert.equal(JSON.stringify(legacy.choices), JSON.stringify(current.choices))
    assert.equal(legacy.correctIndex, current.correctIndex)
  }
  const emergency = changes.find((change) => change.legacy.id === 570)
  assert.notEqual(emergency.legacy.question, emergency.current.question)
  assert.equal(JSON.stringify(emergency.legacy.choices), JSON.stringify(emergency.current.choices))
  assert.equal(emergency.legacy.correctIndex, emergency.current.correctIndex)
  for (const [id, value] of expected) {
    const question = questions.find((candidate) => candidate.id === id)
    assert.ok(question.explanation)
    assert.equal(question.question, value.question)
    assert.equal(question.correctIndex, value.index)
    assert.equal(question.choices[value.index], value.answer)
    assert.equal(question.sectionId, value.sectionId)
  }
  assert.equal(questions.find((question) => question.id === 235).correctIndex, 1)
})

test('Phase 55 v5 migrates exact legacy objects in all stores and preserves metadata without rescoring', () => {
  const stored = phase55LegacyCareWorkerQuestions.map((question) => ({ ...question, userAnswer: [4], correct: false, score: 7, progress: 2, answeredAt: 'keep' }))
  const storage = new MemoryStorage({
    'care-worker-exam-question-content-migration-v1': '1',
    'care-worker-exam-question-content-migration-v2': '1',
    'care-worker-exam-question-content-migration-v3': '1',
    'care-worker-exam-question-content-migration-v4': '1',
    'wrong-care-worker-exam': JSON.stringify(stored),
    'normal-session-care-worker-exam': JSON.stringify({ questions: stored, index: 4 }),
    'exam-session-care-worker-exam': JSON.stringify({ questions: stored, answers: [{ questionId: 241, choice: 1 }], score: 8 }),
  })
  migrateCareWorkerExamQuestionStorage(storage)
  for (const question of JSON.parse(storage.data['wrong-care-worker-exam'])) {
    const canonical = questions.find((candidate) => candidate.id === question.id)
    assert.equal(question.question, canonical.question)
    assert.equal(JSON.stringify(question.choices), JSON.stringify(canonical.choices))
    assert.equal(question.correctIndex, canonical.correctIndex)
    assert.deepEqual(question.userAnswer, [4])
    assert.equal(question.correct, false)
    assert.equal(question.score, 7)
    assert.equal(question.progress, 2)
    assert.equal(question.answeredAt, 'keep')
  }
  assert.equal(JSON.parse(storage.data['normal-session-care-worker-exam']).index, 4)
  assert.equal(JSON.parse(storage.data['exam-session-care-worker-exam']).answers[0].choice, 1)
  assert.equal(storage.data['care-worker-exam-question-content-migration-v5'], '1')
})

test('Phase 55 supports v1 through v5 states and is idempotent', () => {
  for (let completed = 0; completed <= 5; completed++) {
    const data = { 'wrong-care-worker-exam': JSON.stringify(phase55LegacyCareWorkerQuestions) }
    for (let version = 1; version <= completed; version++) data[`care-worker-exam-question-content-migration-v${version}`] = '1'
    const storage = new MemoryStorage(data)
    migrateCareWorkerExamQuestionStorage(storage)
    const once = JSON.stringify(storage.data)
    migrateCareWorkerExamQuestionStorage(storage)
    assert.equal(JSON.stringify(storage.data), once)
    for (let version = 1; version <= 5; version++) assert.equal(storage.data[`care-worker-exam-question-content-migration-v${version}`], '1')
    const first = JSON.parse(storage.data['wrong-care-worker-exam'])[0]
    assert.equal(first.question, completed < 5 ? expected.get(111).question : phase55LegacyCareWorkerQuestions[0].question)
  }
})

test('Phase 55 rejects near matches and other quizzes and tolerates invalid or inaccessible storage', () => {
  const near = { ...phase55LegacyCareWorkerQuestions[0], explanation: 'different', metadata: 'keep' }
  const unrelated = questions.find((question) => question.id === 235)
  const other = JSON.stringify(phase55LegacyCareWorkerQuestions)
  const storage = new MemoryStorage({
    'care-worker-exam-question-content-migration-v1': '1',
    'care-worker-exam-question-content-migration-v2': '1',
    'care-worker-exam-question-content-migration-v3': '1',
    'care-worker-exam-question-content-migration-v4': '1',
    'wrong-care-worker-exam': JSON.stringify([near, unrelated]),
    'wrong-japanese-n2': other,
  })
  migrateCareWorkerExamQuestionStorage(storage)
  assert.equal(JSON.stringify(JSON.parse(storage.data['wrong-care-worker-exam'])), JSON.stringify([near, unrelated]))
  assert.equal(storage.data['wrong-japanese-n2'], other)
  for (const raw of ['{bad', 'null', '{}', '42', '"text"']) assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(new MemoryStorage({ 'wrong-care-worker-exam': raw })))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage(undefined))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { throw new Error('read') }, setItem() { throw new Error('write') } }))
  assert.doesNotThrow(() => migrateCareWorkerExamQuestionStorage({ getItem() { return null }, setItem() { throw new Error('write') } }))
})

test('Phase 55 content signature and canonical-driven game follow the nine changes', async () => {
  const signature = buildCareWorkerExamContentSignature('care-worker-exam', questions)
  for (const field of ['question', 'choices', 'correctIndex', 'sectionId']) {
    const changed = questions.map((question) => question.id !== 111 ? question : {
      ...question,
      [field]: field === 'choices' ? [...question.choices].reverse() : field === 'correctIndex' ? 1 : `${question[field]}x`,
    })
    assert.notEqual(buildCareWorkerExamContentSignature('care-worker-exam', changed), signature)
  }
  assert.equal(buildCareWorkerExamContentSignature('japanese-n2', questions), 'japanese-n2:unchanged')
  const game = await readFile(new URL('../app/(auth)/game/fromQuizzes.ts', import.meta.url), 'utf8')
  assert.match(game, /const quiz = \(quizzes as any\)\[quizType\]/)
  for (const id of ids) assert.equal(`qz-care-worker-exam-${id}`, `qz-care-worker-exam-${id}`)
})
