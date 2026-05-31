import { quizCatalog } from "@/app/data/quizCatalog"

export type BadgeRarity = "common" | "rare" | "epic" | "legend"
export type BadgeGroup =
  | "care"
  | "japanese"
  | "ai"
  | "game"
  | "streak"
  | "score"
  | "special"
  | "secret"

export type BadgeDef = {
  id: string
  icon: string
  label: string
  description: string
  howToUnlock: string
  rarity: BadgeRarity
  group: BadgeGroup
  hidden?: boolean
  image?: string
  order: number
}

type UnlockState = {
  totalAnswers?: number
  listeningAnswers?: number
  gamePlays?: number
  attackPlays?: number
  tileDropClears?: number
  flashJudgeClears?: number
  memoryBurstClears?: number
  examClears?: number
  reviewPlays?: number
  maxScore?: number
  streak?: number
  aiUses?: number
  aiMessages?: number
  aiConversationCount?: number
  industryCounts?: Partial<Record<"construction" | "manufacturing" | "care" | "driver", number>>
}

const LEGACY_BADGE_PREFIXES = [
  "construction-",
  "manufacturing-",
  "driver-",
  "battle-",
  "attack-",
  "tile-drop-",
  "flash-judge-",
  "memory-burst-",
  "listening-clear-",
]

const LEGACY_BADGE_IDS = new Set([
  "listening-first-play",
  "secret-perfectionist",
])

function isLegacyBadgeId(id: string) {
  return LEGACY_BADGE_IDS.has(id) || LEGACY_BADGE_PREFIXES.some((prefix) => id.startsWith(prefix))
}

function normalizeUnlockedBadgeIds(unlockedBadgeIds: string[]) {
  return unlockedBadgeIds.filter((id) => !isLegacyBadgeId(id))
}

export function getPerfectBadgeId(quizType: string) {
  return `perfect-${quizType}`
}

function quizTitle(quizType: string) {
  return quizCatalog.find((q) => q.id === quizType)?.title ?? quizType
}

function buildImagePath(group: BadgeGroup, id: string) {
  return `/badges/generated/${group}-${id}.svg`
}

function badge(
  id: string,
  icon: string,
  label: string,
  description: string,
  howToUnlock: string,
  rarity: BadgeRarity,
  group: BadgeGroup,
  order: number,
  hidden = false
): BadgeDef {
  return {
    id,
    icon,
    image: buildImagePath(group, id),
    label,
    description,
    howToUnlock,
    rarity,
    group,
    order,
    hidden,
  }
}

const STATIC_CATALOG: BadgeDef[] = [
  // Special
  badge(
    "welcome-first-step",
    "🌟",
    "はじめの一歩",
    "Care Japanese Appで学習を始める準備ができました",
    "会員登録後、最初の学習に進む",
    "common",
    "special",
    1
  ),

  // Care
  badge(
    "care-start",
    "🌱",
    "介護スタート",
    "初めて介護分野の問題に挑戦しました",
    "介護教材を累計1問解く",
    "common",
    "care",
    100
  ),
  badge(
    "care-beginner",
    "💖",
    "介護初級",
    "介護の基本用語に少しずつ慣れてきました",
    "介護教材を累計10問解く",
    "common",
    "care",
    101
  ),
  badge(
    "care-growing",
    "🩺",
    "介護中級",
    "介護現場で使う言葉の理解が深まっています",
    "介護教材を累計50問解く",
    "rare",
    "care",
    102
  ),
  badge(
    "care-advanced",
    "👨‍⚕️",
    "介護上級",
    "介護日本語を安定して学習できています",
    "介護教材を累計100問解く",
    "epic",
    "care",
    103
  ),
  badge(
    "care-master",
    "🏆",
    "介護マスター",
    "介護分野の学習をしっかり積み重ねました",
    "介護教材を累計300問解く",
    "legend",
    "care",
    104
  ),

  // Japanese
  badge(
    "japanese-start",
    "🌸",
    "日本語スタート",
    "日本語学習の最初の一歩を踏み出しました",
    "通常学習か模擬試験で累計1問解く",
    "common",
    "japanese",
    200
  ),
  badge(
    "japanese-50",
    "📝",
    "日本語チャレンジャー",
    "日本語の問題に継続して取り組んでいます",
    "累計50問解く",
    "common",
    "japanese",
    201
  ),
  badge(
    "japanese-100",
    "📚",
    "日本語上達中",
    "日本語の基礎力が伸びてきています",
    "累計100問解く",
    "rare",
    "japanese",
    202
  ),
  badge(
    "japanese-500",
    "🎓",
    "日本語努力家",
    "たくさんの問題に取り組み、力を積み上げています",
    "累計500問解く",
    "epic",
    "japanese",
    203
  ),
  badge(
    "japanese-master",
    "🏆",
    "日本語マスター",
    "日本語学習を大きく積み重ねました",
    "累計1000問解く",
    "legend",
    "japanese",
    204
  ),

  // Score
  badge(
    "score-70",
    "🥉",
    "合格ライン到達",
    "正答率70%以上を達成しました",
    "どれかの教材で70点以上を取る",
    "rare",
    "score",
    300
  ),
  badge(
    "score-80",
    "🥈",
    "安定してきた学習者",
    "正答率80%以上を達成しました",
    "どれかの教材で80点以上を取る",
    "rare",
    "score",
    301
  ),
  badge(
    "score-90",
    "🥇",
    "高得点学習者",
    "正答率90%以上を達成しました",
    "どれかの教材で90点以上を取る",
    "epic",
    "score",
    302
  ),
  badge(
    "score-100",
    "💯",
    "満点達成",
    "どれかの教材で満点を達成しました",
    "どれかの教材で100点を取る",
    "legend",
    "score",
    303
  ),

  // AI
  badge(
    "ai-debut",
    "💬",
    "AIデビュー",
    "初めてAI学習サポートを使いました",
    "AIを1回利用する",
    "common",
    "ai",
    400
  ),
  badge(
    "ai-user",
    "🤖",
    "AI活用者",
    "AIを使って学習を進めています",
    "AIを10回利用する",
    "rare",
    "ai",
    401
  ),
  badge(
    "ai-partner",
    "🚀",
    "AIパートナー",
    "AIを学習の相棒として活用できています",
    "AIを50回利用する",
    "epic",
    "ai",
    402
  ),
  badge(
    "ai-master",
    "👑",
    "AIマスター",
    "AIを使った自学習が習慣になっています",
    "AIを100回利用する",
    "legend",
    "ai",
    403
  ),

  // Game
  badge(
    "game-first",
    "🎲",
    "初チャレンジ",
    "ゲーム学習に初めて挑戦しました",
    "ゲームを1回プレイする",
    "common",
    "game",
    500
  ),
  badge(
    "game-10",
    "🎮",
    "ゲーム好き",
    "ゲーム学習を楽しみながら続けています",
    "ゲームを10回プレイする",
    "rare",
    "game",
    501
  ),
  badge(
    "game-50",
    "⚡",
    "ゲーム達人",
    "ゲーム学習でしっかり練習を重ねています",
    "ゲームを50回プレイする",
    "epic",
    "game",
    502
  ),
  badge(
    "game-master",
    "🏆",
    "ゲームマスター",
    "ゲーム学習を大きく積み重ねました",
    "ゲームを100回プレイする",
    "legend",
    "game",
    503
  ),

  // Streak
  badge(
    "streak-3",
    "🔥",
    "3日継続",
    "3日連続で学習できました",
    "3日連続で学習する",
    "common",
    "streak",
    600
  ),
  badge(
    "streak-7",
    "🔥",
    "7日継続",
    "1週間、学習を続けられました",
    "7日連続で学習する",
    "rare",
    "streak",
    601
  ),
  badge(
    "streak-30",
    "🔥",
    "30日継続",
    "学習がしっかり習慣になってきました",
    "30日連続で学習する",
    "epic",
    "streak",
    602
  ),
  badge(
    "streak-100",
    "🔥",
    "100日継続",
    "長期間の努力を積み重ねました",
    "100日連続で学習する",
    "legend",
    "streak",
    603
  ),

  // Special
  badge(
    "effort-100",
    "💪",
    "努力家",
    "学習を100問分積み重ねました",
    "累計100問解く",
    "rare",
    "special",
    700
  ),
  badge(
    "growth-500",
    "🚀",
    "成長中",
    "たくさんの問題に挑戦し、着実に成長しています",
    "累計500問解く",
    "epic",
    "special",
    701
  ),
  badge(
    "care-japanese-certified",
    "👑",
    "ケアジャパニーズ認定",
    "介護・日本語・継続学習をバランスよく達成しました",
    "介護100問、累計500問、7日継続、90点以上を達成する",
    "legend",
    "special",
    702
  ),

  // Secret
  badge(
    "secret-night-owl",
    "🌙",
    "夜の学習者",
    "夜にコツコツ学ぶ努力家です",
    "深夜0:00〜4:59に学習する",
    "rare",
    "secret",
    900,
    true
  ),
  badge(
    "secret-early-bird",
    "🌅",
    "朝の学習者",
    "朝の時間を使って学習できています",
    "朝5:00〜7:59に学習する",
    "rare",
    "secret",
    901,
    true
  ),
].sort((a, b) => a.order - b.order)

function buildPerfectBadgeMeta(badgeId: string): BadgeDef {
  const quizType = badgeId.replace(/^perfect-/, "")
  const title = quizTitle(quizType)
  return {
    id: badgeId,
    icon: "💯",
    image: buildImagePath("score", badgeId),
    label: `${title} 100点`,
    description: `${title} の模擬試験で100点を獲得`,
    howToUnlock: `${title} の模擬試験で100点を取る`,
    rarity: "legend",
    group: "score",
    order: 20000,
  }
}

export function getBadgeMeta(badgeId: string): BadgeDef {
  if (badgeId.startsWith("perfect-")) return buildPerfectBadgeMeta(badgeId)

  return (
    STATIC_CATALOG.find((b) => b.id === badgeId) ?? {
      id: badgeId,
      icon: "🏅",
      image: buildImagePath("special", badgeId),
      label: badgeId,
      description: "実績バッジ",
      howToUnlock: "条件不明",
      rarity: "common",
      group: "special",
      order: 99999,
    }
  )
}

export function getBadgeLabelFromBadgeId(badgeId: string) {
  return getBadgeMeta(badgeId).label
}

export function getBadgeCatalog(): BadgeDef[] {
  const perfectBadges = quizCatalog
    .filter((q) => q.enabled)
    .map((q, i) => ({
      ...buildPerfectBadgeMeta(getPerfectBadgeId(q.id)),
      order: 20000 + i,
    }))

  return [...STATIC_CATALOG, ...perfectBadges].sort((a, b) => a.order - b.order)
}

export function getAllBadgeMeta(unlockedBadgeIds: string[]) {
  const unlocked = new Set(normalizeUnlockedBadgeIds(unlockedBadgeIds))
  return getBadgeCatalog().map((badge) => ({
    ...badge,
    unlocked: unlocked.has(badge.id),
  }))
}

export function getUnlockedBadgeCount(unlockedBadgeIds: string[]) {
  const catalogIds = new Set(getBadgeCatalog().map((badge) => badge.id))
  return normalizeUnlockedBadgeIds(unlockedBadgeIds).filter((id) => catalogIds.has(id) || id.startsWith("perfect-")).length
}

export function getTotalBadgeCount() {
  return getBadgeCatalog().length
}

export function getPreviewBadgeMeta(unlockedBadgeIds: string[], limit = 8) {
  const unlockedSet = new Set(normalizeUnlockedBadgeIds(unlockedBadgeIds))
  return getBadgeCatalog()
    .filter((b) => unlockedSet.has(b.id))
    .slice(0, limit)
}

export function getRarityColors(rarity: BadgeRarity) {
  switch (rarity) {
    case "common":
      return {
        border: "#d1d5db",
        bg: "linear-gradient(135deg, #f9fafb 0%, #eef2f7 100%)",
        glow: "rgba(107,114,128,0.18)",
      }
    case "rare":
      return {
        border: "#93c5fd",
        bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        glow: "rgba(59,130,246,0.20)",
      }
    case "epic":
      return {
        border: "#c4b5fd",
        bg: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
        glow: "rgba(124,58,237,0.22)",
      }
    case "legend":
      return {
        border: "#fcd34d",
        bg: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)",
        glow: "rgba(245,158,11,0.22)",
      }
  }
}

export function getBadgeGroupLabel(group: BadgeGroup) {
  switch (group) {
    case "care":
      return "介護"
    case "japanese":
      return "日本語"
    case "ai":
      return "AI"
    case "game":
      return "ゲーム"
    case "streak":
      return "継続"
    case "score":
      return "得点"
    case "special":
      return "特別"
    case "secret":
      return "シークレット"
    default:
      return "その他"
  }
}

export function computeUnlockedBadges(currentBadgeIds: string[], state: UnlockState) {
  const owned = new Set(normalizeUnlockedBadgeIds(currentBadgeIds))
  const newlyUnlocked: string[] = []

  const tryAdd = (id: string, ok: boolean) => {
    if (ok && !owned.has(id)) {
      owned.add(id)
      newlyUnlocked.push(id)
    }
  }

  const totalAnswers = state.totalAnswers ?? 0
  const careAnswers = state.industryCounts?.care ?? 0
  const gamePlays = state.gamePlays ?? 0
  const maxScore = state.maxScore ?? 0
  const streak = state.streak ?? 0
  const aiUses = state.aiUses ?? state.aiMessages ?? state.aiConversationCount ?? 0

  // Special
  tryAdd("welcome-first-step", totalAnswers >= 1 || careAnswers >= 1 || gamePlays >= 1 || aiUses >= 1)

  // Care
  tryAdd("care-start", careAnswers >= 1)
  tryAdd("care-beginner", careAnswers >= 10)
  tryAdd("care-growing", careAnswers >= 50)
  tryAdd("care-advanced", careAnswers >= 100)
  tryAdd("care-master", careAnswers >= 300)

  // Japanese
  tryAdd("japanese-start", totalAnswers >= 1)
  tryAdd("japanese-50", totalAnswers >= 50)
  tryAdd("japanese-100", totalAnswers >= 100)
  tryAdd("japanese-500", totalAnswers >= 500)
  tryAdd("japanese-master", totalAnswers >= 1000)

  // Score
  tryAdd("score-70", maxScore >= 70)
  tryAdd("score-80", maxScore >= 80)
  tryAdd("score-90", maxScore >= 90)
  tryAdd("score-100", maxScore >= 100)

  // AI
  tryAdd("ai-debut", aiUses >= 1)
  tryAdd("ai-user", aiUses >= 10)
  tryAdd("ai-partner", aiUses >= 50)
  tryAdd("ai-master", aiUses >= 100)

  // Game
  tryAdd("game-first", gamePlays >= 1)
  tryAdd("game-10", gamePlays >= 10)
  tryAdd("game-50", gamePlays >= 50)
  tryAdd("game-master", gamePlays >= 100)

  // Streak
  tryAdd("streak-3", streak >= 3)
  tryAdd("streak-7", streak >= 7)
  tryAdd("streak-30", streak >= 30)
  tryAdd("streak-100", streak >= 100)

  // Special
  tryAdd("effort-100", totalAnswers >= 100)
  tryAdd("growth-500", totalAnswers >= 500)
  tryAdd(
    "care-japanese-certified",
    careAnswers >= 100 && totalAnswers >= 500 && streak >= 7 && maxScore >= 90
  )

  return newlyUnlocked
}
