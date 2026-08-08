import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { japaneseN4Quiz } from "../app/data/quizzes/japanese-n4.ts"
import { migrateN4QuestionStorage, migrateN4StoredValue } from "../app/lib/n4QuestionMigration.ts"
import { buildGameQuestionsFromQuizzes } from "../app/(auth)/game/fromQuizzes.ts"

const questions = japaneseN4Quiz.questions
const old100 = {
  id: 100,
  sectionId: "reading",
  question: "【休館】図書館は工事のため5月1日〜7日休みます。返却は入り口横のポストに入れてください。\n本を返したい人はどうしますか。",
  choices: ["開館まで待つ", "郵便で送る", "ポストに入れる", "工事の人に渡す"],
  correctIndex: 2,
  explanation: "正解は「ポストに入れる」です。完成形は「【休館】図書館は工事のため5月1日〜7日休みます。返却は入り口横のポストに入れてください。」です。休館中の返却方法として、入口横のポストを使うよう本文に明記されています。「開館まで待つ」は、修正後の問題で求める意味・接続・語形のいずれかに合いません。 「郵便で送る」は、修正後の問題で求める意味・接続・語形のいずれかに合いません。 「工事の人に渡す」は、修正後の問題で求める意味・接続・語形のいずれかに合いません。",
}
const expected100 = {
  id: 100,
  sectionId: "reading",
  question: "【宅配便のお知らせ】荷物を届けに来ましたが、お客様は留守でした。明日の再配達を希望する場合は、今日の午後8時までにウェブサイトで申し込んでください。午後8時を過ぎると、配達はあさってになります。\n明日、荷物を受け取りたい人はどうしなければなりませんか。",
  choices: ["明日の午後8時までに電話する", "何も申し込まず家で待つ", "今日の午後8時までにウェブサイトで申し込む", "あさって配達員に直接頼む"],
  correctIndex: 2,
  explanation: "正解は「今日の午後8時までにウェブサイトで申し込む」です。本文には、明日の再配達を希望する場合の締切と申込方法が、このように明記されています。「明日の午後8時までに電話する」は締切・方法の両方が違い、「何も申し込まず家で待つ」では再配達を依頼できません。「あさって配達員に直接頼む」は、明日に受け取るための行動ではありません。",
}
class MemoryStorage {
  constructor(initial = {}) { this.values = new Map(Object.entries(initial)) }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null }
  setItem(key, value) { this.values.set(key, String(value)) }
}

test("Phase 74 N4 duplicate resolution and storage migration", () => {
  assert.equal(questions.length, 150)
  assert.equal(new Set(questions.map(q => q.id)).size, 150)
  assert.equal(questions.filter(q => q.id === 95).length, 1)
  assert.equal(questions.filter(q => q.id === 100).length, 1)
  const id95 = questions.find(q => q.id === 95)
  const id100 = questions.find(q => q.id === 100)
  assert.deepEqual(id100, expected100)
  assert.equal(id95.question, old100.question)
  assert.deepEqual(id95.choices, old100.choices)
  assert.equal(id95.correctIndex, 2)
  assert.equal(id95.choices[id95.correctIndex], "ポストに入れる")
  assert.notEqual(id95.question, id100.question)
  assert.notEqual(id95.choices[id95.correctIndex], id100.choices[id100.correctIndex])
  assert.equal(createHash("sha256").update(JSON.stringify(questions.filter(q => q.id !== 100))).digest("hex"), "eee948068034ba6f0a19484d55d45682024421cc8c5eadda92743a89db404213")
  const normalized = questions.map(q => ({ id:q.id, sectionId:q.sectionId, question:q.question, choices:q.choices, correctIndex:q.correctIndex, explanation:q.explanation, listeningText:q.listeningText ?? null }))
  assert.equal(createHash("sha256").update(JSON.stringify(normalized)).digest("hex"), "7e86c54ee90a267f7adfa9c84eb1c24d98e84b791ae68e6abd8c67d8e28ca951")
  // 聴解問題は共通の指示文を使用するため、question単独ではなく、
  // question・listeningText・choicesを含む意味単位で一意性を検証する。
  assert.equal(new Set(questions.map(q => q.question)).size, 140)
  const promptGroups = new Map()
  for (const q of questions) {
    const group = promptGroups.get(q.question) ?? []
    group.push(q)
    promptGroups.set(q.question, group)
  }
  const duplicatePromptGroups = [...promptGroups.entries()].filter(([, group]) => group.length > 1)
  assert.equal(duplicatePromptGroups.length, 2)
  assert.deepEqual(duplicatePromptGroups.map(([, group]) => group.map(q => q.id)), [
    [11001, 11002, 11003, 11004, 11005, 11006],
    [11015, 11016, 11017, 11018, 11019, 11020],
  ])
  for (const [, group] of duplicatePromptGroups) {
    assert.equal(group.length, 6)
    assert.equal(new Set(group.map(q => q.listeningText)).size, 6)
    assert.equal(new Set(group.map(q => JSON.stringify(q.choices))).size, 6)
  }
  assert.equal(new Set(questions.map(q => JSON.stringify([q.question, q.listeningText ?? null, q.choices]))).size, 150)
  assert.equal(new Set(questions.map(q => JSON.stringify([q.question,q.choices]))).size, 150)
  assert.equal(new Set(questions.map(q => JSON.stringify(q))).size, 150)
  for (const q of questions) {
    assert.equal(q.choices.length, 4)
    assert.equal(new Set(q.choices).size, 4)
    assert.ok(q.question.trim() && q.explanation.trim() && q.choices.every(c => c.trim()))
    assert.ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < 4)
    assert.ok(q.explanation.includes(q.choices[q.correctIndex]))
  }
  assert.match(id100.question, /明日の再配達/)
  assert.match(id100.question, /今日の午後8時まで/)
  assert.match(id100.question, /ウェブサイト/)
  assert.doesNotMatch(id100.choices[0], /今日.*ウェブサイト/)
  assert.deepEqual(id100.choices, expected100.choices)
  assert.equal(id100.choices.length, 4)
  assert.equal(new Set(id100.choices).size, 4)
  assert.equal(id100.choices[1], "何も申し込まず家で待つ")
  assert.match(id100.choices[1], /申し込まず/)
  assert.equal(id100.correctIndex, 2)
  assert.equal(id100.choices[id100.correctIndex], "今日の午後8時までにウェブサイトで申し込む")
  assert.notEqual(id100.choices[1], id100.choices[id100.correctIndex])
  assert.doesNotMatch(id100.choices[3], /明日/)

  const metadata = { selectedIndexes:[1], answerIndex:1, isCorrect:false, score:7, progress:3, timestamp:"2026-08-09T00:00:00Z" }
  const legacy = { ...old100, ...metadata }
  const migrated = migrateN4StoredValue([legacy], "japanese-n4")[0]
  assert.deepEqual({ ...migrated, selectedIndexes:undefined, answerIndex:undefined, isCorrect:undefined, score:undefined, progress:undefined, timestamp:undefined },
    { ...expected100, selectedIndexes:undefined, answerIndex:undefined, isCorrect:undefined, score:undefined, progress:undefined, timestamp:undefined })
  for (const key of Object.keys(metadata)) assert.deepEqual(migrated[key], metadata[key])
  assert.deepEqual(migrateN4StoredValue([{ id:100 }], "japanese-n4"), [{ id:100 }])
  assert.deepEqual(migrateN4StoredValue([old100], "japanese-n3"), [old100])
  assert.deepEqual(migrateN4StoredValue([id95], "japanese-n4"), [id95])
  assert.deepEqual(migrateN4StoredValue([{ ...old100, question: old100.question + " " }], "japanese-n4"), [{ ...old100, question: old100.question + " " }])
  const shuffled = { ...old100, choices:["工事の人に渡す","ポストに入れる","開館まで待つ","郵便で送る"], correctIndex:1, selectedIndexes:[1] }
  assert.deepEqual(migrateN4StoredValue([shuffled], "japanese-n4")[0].choices, expected100.choices)

  const storage = new MemoryStorage({
    "wrong-japanese-n4": JSON.stringify([legacy]),
    "normal-session-japanese-n4": JSON.stringify({ questions:[legacy], index:4, correctCount:2 }),
    "exam-session-japanese-n4": JSON.stringify({ questions:[legacy], answers:[{selectedIndexes:[1],isCorrect:false}], score:0 }),
  })
  assert.equal(migrateN4QuestionStorage(storage, "japanese-n4"), true)
  for (const key of ["wrong-japanese-n4","normal-session-japanese-n4","exam-session-japanese-n4"]) {
    const value = JSON.parse(storage.getItem(key))
    const q = Array.isArray(value) ? value[0] : value.questions[0]
    assert.equal(q.question, expected100.question)
  }
  assert.equal(JSON.parse(storage.getItem("normal-session-japanese-n4")).correctCount, 2)
  assert.deepEqual(JSON.parse(storage.getItem("exam-session-japanese-n4")).answers, [{selectedIndexes:[1],isCorrect:false}])
  const once = JSON.stringify([...storage.values])
  assert.equal(migrateN4QuestionStorage(storage, "japanese-n4"), false)
  assert.equal(JSON.stringify([...storage.values]), once)
  assert.equal(migrateN4QuestionStorage(new MemoryStorage({ "wrong-japanese-n4":"{" }), "japanese-n4"), false)
  assert.doesNotThrow(() => migrateN4QuestionStorage({ getItem(){throw new Error("blocked")}, setItem(){} }, "japanese-n4"))
  assert.doesNotThrow(() => migrateN4QuestionStorage({ getItem(){return null}, setItem(){throw new Error("blocked")} }, "japanese-n4"))
  assert.equal(migrateN4QuestionStorage(undefined, "japanese-n4"), false)

  const game = buildGameQuestionsFromQuizzes("japanese-n4")
  assert.ok(game.every(q => q.id !== "qz-japanese-n4-100"))
  assert.ok(game.every((q,index,array) => array.findIndex(x => x.id === q.id) === index))
})
