import type { Question, QuizType } from '@/app/data/types'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>
type UnknownRecord = Record<string, unknown>

const VERSION_KEY = 'n4-question-migration-id100-v1'
const STORAGE_KEYS = ['wrong-japanese-n4', 'normal-session-japanese-n4', 'exam-session-japanese-n4'] as const
const OLD_QUESTION = '【休館】図書館は工事のため5月1日〜7日休みます。返却は入り口横のポストに入れてください。\n本を返したい人はどうしますか。'
const OLD_CHOICES = ['開館まで待つ', '郵便で送る', 'ポストに入れる', '工事の人に渡す'] as const
const OLD_ANSWER = 'ポストに入れる'
const NEW_QUESTION: Question = {
  id: 100, sectionId: 'reading',
  question: '【宅配便のお知らせ】荷物を届けに来ましたが、お客様は留守でした。明日の再配達を希望する場合は、今日の午後8時までにウェブサイトで申し込んでください。午後8時を過ぎると、配達はあさってになります。\n明日、荷物を受け取りたい人はどうしなければなりませんか。',
  choices: ['明日の午後8時までに電話する', '何も申し込まず家で待つ', '今日の午後8時までにウェブサイトで申し込む', 'あさって配達員に直接頼む'], correctIndex: 2,
  explanation: '正解は「今日の午後8時までにウェブサイトで申し込む」です。本文には、明日の再配達を希望する場合の締切と申込方法が、このように明記されています。「明日の午後8時までに電話する」は締切・方法の両方が違い、「何も申し込まず家で待つ」では再配達を依頼できません。「あさって配達員に直接頼む」は、明日に受け取るための行動ではありません。',
}
const sameChoiceSet = (choices: unknown): choices is string[] => Array.isArray(choices) && choices.length === OLD_CHOICES.length && [...choices].sort().every((choice,index)=>choice===[...OLD_CHOICES].sort()[index])
function isLegacyQuestion(value: unknown): value is UnknownRecord { if(!value||typeof value!=='object')return false;const q=value as UnknownRecord;if(q.id!==100||q.sectionId!=='reading'||q.question!==OLD_QUESTION||!sameChoiceSet(q.choices)||!Number.isInteger(q.correctIndex))return false;return (q.choices as string[])[q.correctIndex as number]===OLD_ANSWER }
function migrateNode(value: unknown): unknown { if(isLegacyQuestion(value))return {...value,...NEW_QUESTION};if(Array.isArray(value))return value.map(migrateNode);if(!value||typeof value!=='object')return value;const r=value as UnknownRecord;let changed=false;const next={...r};if('questions'in r){next.questions=migrateNode(r.questions);changed=JSON.stringify(next.questions)!==JSON.stringify(r.questions)}return changed?next:value }
export function migrateN4StoredValue(value: unknown, quizType: unknown): unknown { return quizType==='japanese-n4'?migrateNode(value):value }
export function migrateN4QuestionStorage(storage?: StorageLike, quizType?: QuizType): boolean { if(quizType!==undefined&&quizType!=='japanese-n4')return false;let target=storage;if(!target){if(typeof window==='undefined')return false;try{target=window.localStorage}catch{return false}}try{if(target.getItem(VERSION_KEY)==='done')return false}catch{return false}let changed=false;for(const key of STORAGE_KEYS){try{const raw=target.getItem(key);if(!raw)continue;const parsed=JSON.parse(raw);const migrated=migrateN4StoredValue(parsed,'japanese-n4');if(JSON.stringify(migrated)!==JSON.stringify(parsed)){target.setItem(key,JSON.stringify(migrated));changed=true}}catch{}}try{target.setItem(VERSION_KEY,'done')}catch{}return changed }
