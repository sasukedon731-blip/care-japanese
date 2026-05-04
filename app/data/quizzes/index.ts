// app/data/quizzes/index.ts
import { japaneseN4Quiz } from "./japanese-n4"
import { japaneseN3Quiz } from "./japanese-n3"
import { japaneseN2Quiz } from "./japanese-n2"
import { careTermsQuiz } from "./care-terms"
import { careListeningQuiz } from "./care-listening"
import { careConversationQuiz } from "./care-conversation"
import { careWorkerExamQuiz } from "./care-worker-exam"

export const quizzes = {
  "japanese-n4": japaneseN4Quiz,
  "japanese-n3": japaneseN3Quiz,
  "japanese-n2": japaneseN2Quiz,
  "care-terms": careTermsQuiz,
  "care-listening": careListeningQuiz,
  "care-conversation": careConversationQuiz,
  "care-worker-exam": careWorkerExamQuiz,
} as const
