import Link from "next/link"

export const metadata = {
  title: "プライバシーポリシー",
}

export default function PrivacyPage() {
  return (
    <main style={styles.main}>
      <article style={styles.card}>
        <p style={styles.kicker}>Care Japanese App</p>
        <h1 style={styles.title}>プライバシーポリシー</h1>

        <p style={styles.lead}>
          株式会社アウトインプラス（以下「当社」といいます。）は、当社が提供する外国人介護人材向け日本語・介護学習Webアプリ「Care Japanese App」（以下「本サービス」といいます。）におけるユーザー情報を、以下の方針に基づき適切に取り扱います。
        </p>

        <Section title="1. 取得する情報">
          当社は、本サービスの提供にあたり、以下の情報を取得する場合があります。
          <br />
          ・氏名、表示名、メールアドレス、所属企業名、企業コード等の登録情報
          <br />
          ・ログイン情報、認証情報、アカウント種別、利用権限に関する情報
          <br />
          ・学習履歴、回答履歴、正答率、学習回数、学習時間、最終学習日、獲得バッジ等の学習情報
          <br />
          ・AI会話、AIスピーク、発話練習、評価結果、利用回数等のAI機能利用情報
          <br />
          ・決済方法、購入プラン、購入日、利用期間、決済状況等の決済関連情報
          <br />
          ・お問い合わせ内容、サポート対応履歴
          <br />
          ・アクセス日時、IPアドレス、端末情報、ブラウザ情報、Cookieその他これに類する情報
        </Section>

        <Section title="2. 利用目的">
          当社は、取得した情報を以下の目的で利用します。
          <br />
          ・本サービスの提供、本人確認、認証、アカウント管理のため
          <br />
          ・学習機能、AI会話機能、AIスピーク機能、ゲーム型学習機能等を提供するため
          <br />
          ・学習状況、成績、利用状況を表示、分析、管理するため
          <br />
          ・企業契約における学習管理、教育支援、フォロー対象者の把握のため
          <br />
          ・決済処理、購入状況、利用期間の管理のため
          <br />
          ・お問い合わせ、サポート、不具合対応のため
          <br />
          ・不正利用防止、セキュリティ向上、利用規約違反への対応のため
          <br />
          ・サービス改善、新機能開発、品質向上、利用状況分析のため
          <br />
          ・重要なお知らせ、規約変更、メンテナンス情報等の連絡のため
        </Section>

        <Section title="3. AI機能に関する情報の取り扱い">
          本サービスでは、生成AIを活用した学習支援機能を提供する場合があります。
          当社は、AI会話、AIスピーク、発話評価、学習支援機能の提供および品質向上のため、ユーザーが入力または送信したテキスト、音声、回答内容、評価結果等を利用する場合があります。
          ユーザーは、本人または第三者の機微情報、医療情報、金融情報、パスワード、本人確認書類、秘密情報その他入力が不適切な情報をAI機能へ送信しないものとします。
        </Section>

        <Section title="4. 企業契約ユーザーの情報共有">
          企業、団体、施設等との契約により本サービスを利用するユーザーについては、所属企業または所属団体の管理者が、学習状況、学習履歴、成績情報、利用状況、AI機能の利用状況等を閲覧できる場合があります。
          当社は、企業契約に基づく教育管理、学習支援、フォロー対象者の把握のために必要な範囲で、これらの情報を共有します。
        </Section>

        <Section title="5. 第三者提供">
          当社は、以下の場合を除き、本人の同意なく個人情報を第三者に提供しません。
          <br />
          ・法令に基づく場合
          <br />
          ・人の生命、身体または財産の保護のために必要がある場合
          <br />
          ・公衆衛生の向上または児童の健全な育成の推進のため特に必要がある場合
          <br />
          ・国の機関または地方公共団体等への協力が必要な場合
          <br />
          ・企業契約に基づき、所属企業または所属団体の管理者に学習状況等を共有する場合
        </Section>

        <Section title="6. 外部サービスの利用">
          本サービスでは、以下の外部サービスを利用する場合があります。
          <br />
          ・Firebase / Google Cloud（認証、データ保存、システム運用等）
          <br />
          ・OpenAI等のAI関連サービス（AI会話、発話評価、学習支援等）
          <br />
          ・Stripe、KOMOJU、その他決済事業者（決済処理、入金確認等）
          <br />
          これらのサービス提供に必要な範囲で、情報が外部サービスへ送信または保存される場合があります。
        </Section>

        <Section title="7. Cookie等の利用">
          当社は、利便性向上、ログイン状態の維持、利用状況の把握、不正利用防止、サービス改善のため、Cookieその他これに類する技術を利用する場合があります。
        </Section>

        <Section title="8. 安全管理">
          当社は、取得した情報について、漏えい、滅失、毀損、不正アクセス等を防止するため、必要かつ適切な安全管理措置を講じます。
        </Section>

        <Section title="9. 開示・訂正・削除等">
          ユーザー本人から、当社が保有する個人情報の開示、訂正、利用停止、削除等の請求があった場合、本人確認のうえ、法令に従い適切に対応します。
        </Section>

        <Section title="10. お問い合わせ窓口">
          個人情報の取り扱いに関するお問い合わせは、以下の窓口までお願いいたします。
          <br />
          株式会社アウトインプラス
          <br />
          メールアドレス：support@outin-plus.com
        </Section>

        <Section title="11. 改定">
          当社は、必要に応じて本ポリシーを改定することがあります。
          重要な変更がある場合は、本サービス上でのお知らせその他適切な方法により通知します。
        </Section>

        <div style={styles.bottomLinks}>
          <Link href="/legal/terms" style={styles.link}>
            利用規約
          </Link>
          <Link href="/legal/refund" style={styles.link}>
            返金ポリシー
          </Link>
          <Link href="/legal/tokushoho" style={styles.link}>
            特定商取引法
          </Link>
          <Link href="/contact" style={styles.link}>
            お問い合わせ
          </Link>
        </div>
      </article>
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.text}>{children}</p>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "24px 14px 40px",
  },
  card: {
    background: "#fff",
    border: "1px solid rgba(17,24,39,.08)",
    borderRadius: 18,
    padding: 20,
  },
  kicker: {
    margin: "0 0 6px",
    fontSize: 13,
    fontWeight: 900,
    color: "#2563eb",
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
    color: "#0f172a",
  },
  lead: {
    margin: "10px 0 18px",
    fontSize: 14,
    lineHeight: 1.8,
    color: "#475569",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    margin: "0 0 8px",
    fontSize: 18,
    fontWeight: 900,
    color: "#0f172a",
  },
  text: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.9,
    color: "#1f2937",
    whiteSpace: "pre-wrap",
  },
  bottomLinks: {
    marginTop: 28,
    paddingTop: 16,
    borderTop: "1px solid rgba(17,24,39,.08)",
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  link: {
    color: "#2563eb",
    fontWeight: 800,
    textDecoration: "none",
    fontSize: 14,
  },
}
