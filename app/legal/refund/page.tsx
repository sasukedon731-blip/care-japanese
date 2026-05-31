import Link from "next/link"

export const metadata = {
  title: "返金ポリシー",
}

export default function RefundPage() {
  return (
    <main style={styles.main}>
      <article style={styles.card}>
        <p style={styles.kicker}>Care Japanese App</p>
        <h1 style={styles.title}>返金ポリシー</h1>
        <p style={styles.lead}>
          本ポリシーは、株式会社アウトインプラスが提供するCare Japanese Appの購入後の返金、キャンセル、利用期間に関する方針を定めるものです。
        </p>

        <Section title="1. 基本方針">
          本サービスは買い切り型の期間利用権販売です。
          決済完了後またはコンビニ決済の入金確認後、サービスが利用可能となるデジタルコンテンツのため、購入後の返金、キャンセル、返品は原則としてお受けしておりません。
        </Section>

        <Section title="2. 返金対象となる場合">
          以下の場合は、内容を確認のうえ個別に対応します。
          <br />
          ・二重課金が発生した場合
          <br />
          ・当社の重大なシステム不具合により、購入した有料機能が長時間利用できなかった場合
          <br />
          ・法令上返金義務が発生する場合
          <br />
          ・その他、当社が返金対応を相当と判断した場合
        </Section>

        <Section title="3. 返金対象外となる場合">
          以下の場合は、原則として返金対象外となります。
          <br />
          ・お客様都合によるキャンセル
          <br />
          ・利用開始後の途中解約
          <br />
          ・日割り返金の希望
          <br />
          ・購入内容、利用期間、対象教材の確認不足による申込み
          <br />
          ・推奨環境外での利用、通信環境、端末環境、ブラウザ設定等に起因する不具合
          <br />
          ・学習成果、試験合格、資格取得、就職等が得られなかったことを理由とする返金希望
        </Section>

        <Section title="4. コンビニ決済について">
          コンビニ決済を選択した場合、入金確認後にサービスが利用可能となります。
          支払期限を過ぎた場合、申込みが自動的に無効またはキャンセル扱いとなる場合があります。
          コンビニでのお支払い後は、原則として返金対象外となります。
        </Section>

        <Section title="5. 自動更新について">
          本サービスは月額サブスクリプションではありません。
          自動更新はなく、利用期間終了後に継続利用を希望する場合は再購入が必要です。
        </Section>

        <Section title="6. 返金申請方法">
          返金対象となる可能性がある場合は、購入時のメールアドレス、購入日時、決済方法、状況の詳細を記載のうえ、以下のメールアドレスまでご連絡ください。
          <br />
          support@outin-plus.com
        </Section>

        <div style={styles.bottomLinks}>
          <Link href="/legal/terms" style={styles.link}>
            利用規約
          </Link>
          <Link href="/legal/privacy" style={styles.link}>
            プライバシーポリシー
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
