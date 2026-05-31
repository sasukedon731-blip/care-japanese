import Link from "next/link"

export const metadata = {
  title: "お問い合わせ",
}

export default function ContactPage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <p style={styles.kicker}>Care Japanese App</p>
        <h1 style={styles.title}>お問い合わせ</h1>
        <p style={styles.lead}>
          Care Japanese Appに関するお問い合わせは、以下のメールアドレスまでご連絡ください。
        </p>

        <div style={styles.contactBox}>
          <div style={styles.label}>お問い合わせ窓口</div>
          <a href="mailto:support@outin-plus.com" style={styles.mailLink}>
            support@outin-plus.com
          </a>
          <p style={styles.smallText}>
            受付時間：平日 9:00〜18:00（土日祝日・年末年始を除く）
          </p>
        </div>

        <div style={styles.contactBox}>
          <div style={styles.label}>電話番号</div>
          <a href="tel:0368203675" style={styles.mailLink}>
            03-6820-3675
          </a>
          <p style={styles.smallText}>
            お問い合わせ内容の記録を残すため、原則メールでのご連絡をお願いいたします。
          </p>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>お問い合わせ時に記載いただきたい内容</h2>
          <ul style={styles.list}>
            <li>登録メールアドレス</li>
            <li>お名前または表示名</li>
            <li>お問い合わせ内容</li>
            <li>購入・決済に関するお問い合わせの場合は、購入日時と決済方法</li>
            <li>不具合の場合は、発生した画面・操作内容・表示されたエラー文</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>運営会社</h2>
          <p style={styles.text}>
            株式会社アウトインプラス
            <br />
            〒150-0043
            <br />
            東京都渋谷区道玄坂１丁目１０－８
            <br />
            渋谷道玄坂東急ビル２F-C
          </p>
        </section>

        <div style={styles.actions}>
          <Link href="/" style={styles.primaryBtn}>
            TOPへ戻る
          </Link>
          <Link href="/legal/tokushoho" style={styles.secondaryBtn}>
            特定商取引法を見る
          </Link>
          <Link href="/legal/terms" style={styles.secondaryBtn}>
            利用規約を見る
          </Link>
        </div>
      </section>
    </main>
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
    marginTop: 12,
    fontSize: 15,
    lineHeight: 1.9,
    color: "#1f2937",
  },
  contactBox: {
    marginTop: 18,
    padding: 18,
    borderRadius: 16,
    background: "#f8fafc",
    border: "1px solid rgba(37,99,235,.15)",
  },
  label: {
    fontSize: 13,
    fontWeight: 900,
    color: "#475569",
    marginBottom: 8,
  },
  mailLink: {
    fontSize: 20,
    fontWeight: 900,
    color: "#2563eb",
    textDecoration: "none",
    wordBreak: "break-all",
  },
  smallText: {
    margin: "10px 0 0",
    fontSize: 13,
    lineHeight: 1.8,
    color: "#64748b",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: 14,
    background: "#0f172a",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 900,
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
  },
  list: {
    margin: 0,
    paddingLeft: 20,
    fontSize: 14,
    lineHeight: 1.9,
    color: "#1f2937",
  },
  actions: {
    marginTop: 24,
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: 14,
    background: "#eff6ff",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 900,
  },
}
