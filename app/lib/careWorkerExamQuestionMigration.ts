import type { Question, QuizType } from '../data/types'
import { careWorkerExamQuiz } from '../data/quizzes/care-worker-exam'

const VERSION_KEY = 'care-worker-exam-question-content-migration-v1'
const VERSION_KEY_V2 = 'care-worker-exam-question-content-migration-v2'
const VERSION_KEY_V3 = 'care-worker-exam-question-content-migration-v3'
const STORAGE_KEYS = ['wrong-care-worker-exam', 'normal-session-care-worker-exam', 'exam-session-care-worker-exam'] as const
const legacy = [
  { id: 85, question: '日本の将来推計において、2040年頃に高齢者1人を現役世代何人で支えることになると予測されているか。', choices: ['約10人', '約5人', '約', '5人', '約0.5人', '誰も支えない'], correctIndex: 2, sectionId: 'society' },
  { id: 161, question: '介護記録を書く際、客観的な事実を示す書き方として適切なものはどれか。', choices: ['利用者が怒っているように見えた', '食事を半分ほど残された', '体調が悪いのではないかと思った', '3', '5度の発熱があり、顔が赤かった', '昨日に比べて元気がない気がした'], correctIndex: 3, sectionId: 'communication' },
  { id: 251, question: '住宅の段差解消のためにスロープを設置する際、車椅子で自力走行する場合の適切な勾配（傾き）はどれか。', choices: ['1/4（急坂）', '1/', '6', '1/12以下（緩やか）', '勾配は関係ない', '垂直'], correctIndex: 2, sectionId: 'life-support' },
  { id: 263, question: 'アセスメントにおける「客観的情報」として適切なものはどれか。', choices: ['利用者が「腰が痛い」と言っている', '介護職が「疲れているな」と感じた', '利用者の顔が赤く、体温が', '3', '8度である', '家族が「わがままだ」と怒っている', '部屋が少し暗い気がする'], correctIndex: 2, sectionId: 'life-support' },
  { id: 513, question: '呼吸、心拍、体温調節など、生命維持に直結する自律神経の中枢がある部分はどこか。', choices: ['大脳皮質', '脳幹', '海馬', '側頭葉', '後頭葉'], correctIndex: 1, sectionId: 'body-mind' },
] as const

export const phase45LegacyCareWorkerQuestions = [
  { id: 56, question: '生活に困窮するすべての国民に対し、最低限度の生活を保障する制度を何というか。', choices: ['生活保護制度', '児童手当制度', '障害年金制度', '住宅手当制度', '奨学金制度'], correctIndex: 0, sectionId: 'society', explanation: '日本国憲法第25条（生存権）に基づいた、最後のセーフティネットです。' },
  { id: 63, question: '1947年に制定され、日本の福祉の出発点となった「福祉三法」に含まれないものはどれか。', choices: ['児童福祉法', '身体障害者福祉法', '旧生活保護法', '介護保険法', 'すべて含まれる'], correctIndex: 3, sectionId: 'society', explanation: '介護保険法は2000年施行。戦後すぐの三法（児童・身障・生保）とは時代が違います。' },
  { id: 70, question: '現在の日本の高齢化率（総人口に占める65歳以上の割合）に最も近いものはどれか。', choices: ['約10％', '約20％', '約30％', '約50％', '約70％'], correctIndex: 2, sectionId: 'society', explanation: '日本は世界一の「超高齢社会」。約3.5人に1人が高齢者という計算です。' },
  { id: 71, question: '日本の公的年金制度のうち、20歳以上のすべての国民が加入する「1階部分」にあたる年金はどれか。', choices: ['厚生年金', '確定拠出年金', '国民年金（基礎年金）', '企業年金', '個人年金'], correctIndex: 2, sectionId: 'society', explanation: '日本の年金は「2階建て」構造。1階の「国民年金」は全員共通の土台です。' },
  { id: 73, question: '75歳以上の人が全員加入し、都道府県ごとの広域連合が運営する医療保険制度を何というか。', choices: ['国民健康保険', '組合健保', '後期高齢者医療制度', '共済組合', '介護保険'], correctIndex: 2, sectionId: 'society', explanation: '75歳（または一定の障害がある65歳）からは、この独立した制度に切り替わります。' },
  { id: 74, question: '現役世代が加入する医療保険において、窓口で支払う自己負担割合は原則何割か。', choices: ['1割', '2割', '3割', '5割', '10割（全額）'], correctIndex: 2, sectionId: 'society', explanation: '介護保険（原則1割）と混同しないように！医療は現役なら3割負担が基本です。' },
  { id: 128, question: '介護保険サービスを提供した事業所が、その対価として受け取る報酬を何というか。', choices: ['運営交付金', '介護報酬', '医療診療報酬', '社会福祉手当', '施設利用料'], correctIndex: 1, sectionId: 'care-basic', explanation: '3年に一度、料金（報酬）の見直しが行われるのが試験に出やすいます。' },
  { id: 147, question: '介護計画（ケアプラン）における「長期目標」の設定期間として、一般的に適切なのはどれか。', choices: ['1週間以内', '半年〜1年程度', '10年以上', '毎日更新する', '期間は決めない'], correctIndex: 1, sectionId: 'care-basic', explanation: '最終的なゴールが長期目標、そのためのステップが短期目標（数ヶ月）です。' },
  { id: 160, question: '介護職の表情や視線、声のトーンが利用者に与える影響を説明した法則はどれか。', choices: ['ハインリッヒの法則', 'メラビアンの法則', '鏡の法則', 'アルキメデスの原理', 'メンデルの法則'], correctIndex: 1, sectionId: 'communication', explanation: '視覚・聴覚情報が印象の9割以上を決める。笑顔と優しい声が最強の武器です！' },
  { id: 325, question: '介護計画の「長期目標」を設定する際、意識すべき期間は一般的にどれくらいか。', choices: ['1週間以内', '3日以内', '半年から1年程度（目指すべき将来像）', '100年後', '明日の朝まで'], correctIndex: 2, sectionId: 'care-process', explanation: '長期目標は「どんな生活を送りたいか」という大きなゴールを設定するのです。' },
  { id: 399, question: '高齢者のうち、75歳から84歳までの年齢区分を一般的に何というか。', choices: ['前期高齢者', '中期高齢者', '後期高齢者', '超高齢者', '青年期'], correctIndex: 2, sectionId: 'aging', explanation: '65～74歳が前期、75歳以上が後期高齢者と区分されます。' },
  { id: 412, question: '日本人の認知症の中で最も多く、全体の約7割近くを占めるタイプはどれか。', choices: ['血管性認知症', 'レビー小体型認知症', 'アルツハイマー型認知症', '前頭側頭型認知症', '混合型認知症'], correctIndex: 2, sectionId: 'dementia', explanation: '脳にアミロイドβなどのタンパク質が蓄積し、脳が萎縮していくのが特徴です。' },
  { id: 452, question: '認知症の人が地域で自分らしく暮らし続けられる社会を目指す考え方を何というか。', choices: ['隔離', '予防', '共生', '排除', '同化'], correctIndex: 2, sectionId: 'dementia', explanation: '「予防」と「共生」は、現在の日本の認知症施策推進大綱の2大柱です。' },
  { id: 499, question: '障害者総合支援法における、利用者の費用負担の基本的な考え方はどれか。', choices: ['応能負担（所得に応じた負担）', '応益負担（一律1割負担）', '完全無料', '全額自己負担', '年齢別負担'], correctIndex: 0, sectionId: 'disability', explanation: 'サービスを利用した量ではなく、その人の「支払う能力（所得）」に応じて上限額が決まる仕組みです。' },
  { id: 551, question: '介護福祉士が一定の条件の下で喀痰吸引等を行うことができると定めた法律はどれか。', choices: ['医師法', '介護保険法', '社会福祉士及び介護福祉士法', '医療法', '老人福祉法'], correctIndex: 2, sectionId: 'medical-care', explanation: '2011年の法改正により、実地研修を修了した介護福祉士に認められるようになりました。' },
  { id: 589, question: '【事例 7】 Gさん（45歳、男性）は、交通事故で頸髄を損傷し、四肢麻痺となった。現在は電動車椅子を使用し、就労への意欲を持っている。\nGさんが職場で車椅子を使いやすくするために、段差をなくすなどの配慮を求めることを何というか。', choices: ['贅沢な要求', '合理的配慮の提供', '特別待遇', '職務放棄', '自己負担'], correctIndex: 1, sectionId: 'medical-care', explanation: '障害者差別解消法に基づき、事業者に義務付けられている大切な配慮です。' },
] as const

export const phase49LegacyCareWorkerQuestions = [
  { id: 245, question: '食事中に利用者が喉に物を詰まらせ、声が出せなくなった。最初に行うべき救急処置はどれか。', choices: ['水を飲ませる', '背部叩打法（背中を強く叩く）を試みる', '寝かせて心臓マッサージをする', 'お腹をマッサージする', '歌を歌って落ち着かせる'], correctIndex: 1, sectionId: 'life-support', explanation: '窒息は1分1秒を争う。異物除去が最優先です！（腹部突き上げ法も有効）。' },
  { id: 246, question: '意識も呼吸もない利用者を発見した。胸骨圧迫（心臓マッサージ）を行う際の深さとテンポはどれか。', choices: ['1cm沈む程度、ゆっくり', '5cm以上沈む強さで、1分間に100〜120回のテンポ', '指先で軽く押さえる程度', 'お腹を強く押す', '背中をさする'], correctIndex: 1, sectionId: 'life-support', explanation: '「強く、速く、絶え間なく」。救急車が来るまで続けるのが鉄則です！' },
  { id: 289, question: '片麻痺がある方が食事をする際、麻痺側に麻痺側をサポートするクッションを入れる目的は。', choices: ['見た目を良くするため', '姿勢を安定させ、飲み込みやすくするため', 'クッションを汚すため', '介護職の腕を休めるため', '眠らせるため'], correctIndex: 1, sectionId: 'life-support', explanation: '姿勢が崩れると誤嚥しやすくなる。体幹を真っ直ぐ保つためのサポートです。' },
  { id: 369, question: '高齢者が脱水になりやすい理由として、適切なものはどれか。', choices: ['体内の水分含有率が増加するから', '喉の渇きを感じる「渇中枢」の機能が低下するから', '汗をかきやすくなるから', '腎臓での水分再吸収が増えるから', '食事量が増えるから'], correctIndex: 1, sectionId: 'aging', explanation: '喉が渇いていないと思っていても、実際には水分が不足しているケースが多いです。' },
  { id: 388, question: '眼圧が上昇し、視野が欠けていく疾患はどれか。', choices: ['白内障', '緑内障', '飛蚊症', '老眼', '遠視'], correctIndex: 1, sectionId: 'aging', explanation: '放置すると失明の恐れがあるため、早期発見と点眼薬などによる眼圧管理が重要です。' },
  { id: 429, question: '認知症の中核症状について、正しい説明はどれか。', choices: ['薬で完全に治る', '脳の細胞が壊れることで、誰にでも必ず現れる直接的な症状', '体調が良い時は消失する', '周囲の関わり方次第でなくなる', '認知症の末期にだけ現れる'], correctIndex: 1, sectionId: 'dementia', explanation: '脳のダメージが原因のため、程度の差はあれど認知症の方に共通して見られる症状です。' },
  { id: 444, question: '65歳未満で発症する「若年性認知症」の方や家族を支援するため、都道府県等に配置されている専門職は。', choices: ['警察官', '若年性認知症支援員', '児童相談員', '職業安定所の職員', '弁護士'], correctIndex: 1, sectionId: 'dementia', explanation: '就労継続や経済的支援など、若年性特有の悩みにワンストップで対応する専門家です。' },
  { id: 492, question: '障害者総合支援法において、新たに支援の対象（障害者の定義）に加えられたのはどれか。', choices: ['身体障害', '知的障害', '精神障害', '難病（一定の基準を満たすもの）', '認知症'], correctIndex: 3, sectionId: 'disability', explanation: '治療法が確立していない難病の方々も、必要な福祉サービスを受けられるようになりました。' },
  { id: 542, question: '眼圧が上昇し、視野が外側から欠けていく（狭くなる）疾患を何というか。', choices: ['白内障', '緑内障', '老眼', '近視', '飛蚊症'], correctIndex: 1, sectionId: 'body-mind', explanation: '放置すると失明の恐れがある。早期発見と点眼薬による眼圧コントロールが命です。' },
  { id: 582, question: '【事例 5】 Eさん（88歳、女性、要介護5）は、特別養護老人ホームに入所中。インフルエンザが施設内で流行しており、Eさんも高熱と咳が出始めた。\nEさんの介助にあたるとき、介護職が徹底すべき「標準予防策（スタンダード・プリコーション）」はどれか。', choices: ['手洗いと手指消毒、使い捨て手袋・マスクの着用', '部屋の鍵をかける', 'Eさんと話さないようにする', '窓をすべて閉め切る', '薬を多めに飲ませる'], correctIndex: 0, sectionId: 'medical-care', explanation: '「すべての体液・排出物は感染の恐れがある」として扱う、感染防止の鉄則です。' },
] as const

const canonical = new Map(careWorkerExamQuiz.questions.map((question) => [Number(question.id), question]))
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>
const same = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right)

type LegacyQuestion = (typeof legacy)[number] | (typeof phase45LegacyCareWorkerQuestions)[number] | (typeof phase49LegacyCareWorkerQuestions)[number]

function isLegacyQuestion(value: unknown, item: LegacyQuestion): value is Question {
  if (!value || typeof value !== 'object') return false
  const question = value as Partial<Question>
  const explanationMatches = !('explanation' in item) || question.explanation === item.explanation
  return Number(question.id) === item.id && question.question === item.question && same(question.choices, item.choices) && question.correctIndex === item.correctIndex && question.sectionId === item.sectionId && explanationMatches
}

function migrateQuestion(value: unknown, candidates: readonly LegacyQuestion[]): unknown {
  const item = candidates.find((candidate) => isLegacyQuestion(value, candidate))
  if (!item || !value || typeof value !== 'object') return value
  const current = canonical.get(item.id)
  return current ? { ...(value as Record<string, unknown>), ...current } : value
}

function migrateArray(values: unknown[], candidates: readonly LegacyQuestion[]): unknown[] {
  const seen = new Set<string>()
  return values.map((value) => migrateQuestion(value, candidates)).filter((value) => {
    if (!value || typeof value !== 'object' || !('id' in value)) return true
    const question = value as Partial<Question>
    const key = JSON.stringify([question.id, question.question, question.choices, question.correctIndex, question.sectionId])
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function migrateCareWorkerExamStoredValue(value: unknown, candidates: readonly LegacyQuestion[] = [...legacy, ...phase45LegacyCareWorkerQuestions, ...phase49LegacyCareWorkerQuestions]): unknown {
  if (Array.isArray(value)) return migrateArray(value, candidates)
  if (!value || typeof value !== 'object') return value
  const record = { ...(value as Record<string, unknown>) }
  if (Array.isArray(record.questions)) record.questions = migrateArray(record.questions, candidates)
  return record
}

export function migrateCareWorkerExamQuestionStorage(storage?: StorageLike): void {
  if (!storage) {
    if (typeof window === 'undefined') return
    storage = window.localStorage
  }
  const migrations = [[VERSION_KEY, legacy], [VERSION_KEY_V2, phase45LegacyCareWorkerQuestions], [VERSION_KEY_V3, phase49LegacyCareWorkerQuestions]] as const
  for (const [versionKey, candidates] of migrations) {
    try {
      if (storage.getItem(versionKey) === '1') continue
    } catch {
      return
    }
    for (const key of STORAGE_KEYS) {
      try {
        const raw = storage.getItem(key)
        if (!raw) continue
        const parsed = JSON.parse(raw)
        const migrated = migrateCareWorkerExamStoredValue(parsed, candidates)
        if (!same(parsed, migrated)) storage.setItem(key, JSON.stringify(migrated))
      } catch {
        // Invalid or inaccessible storage is left untouched.
      }
    }
    try {
      storage.setItem(versionKey, '1')
    } catch {
      // The app remains usable without persistence.
    }
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
