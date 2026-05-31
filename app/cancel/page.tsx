import Link from "next/link"

export const metadata = {
  title: "利用期限・再購入について",
}

export default function CancelPage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <p style={styles.kicker}>Care Japanese App</p>
        <h1 style={styles.title}>利用期限・再購入について</h1>

        <p style={styles.lead}>
          Care Japanese Appは、月額サブスクリプションではなく、
          <b>買い切り型の期間利用学習メニュー</b>です。
        </p>

        <div style={styles.pointBox}>
          <div style={styles.pointTitle}>このページで伝えたいこと</div>
          <ul style={styles.list}>
            <li>自動更新はありません</li>
            <li>月額課金の解約手続きは不要です</li>
            <li>利用期間が終わると有料機能は停止します</li>
            <li>継続したい場合は、再度学習メニューを購入してください</li>
          </ul>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>利用期間が終わったらどうなる？</h2>
          <p style={styles.text}>
            購入済みの期間が終了すると、有料学習メニューで利用していた教材や機能は利用できなくなります。
            <br />
            無料で使える範囲がある場合は、その範囲のみ継続して利用できます。
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>途中でやめたい場合</h2>
          <p style={styles.text}>
            月額課金ではないため、サブスクリプションの解約手続きはありません。
            <br />
            追加の請求も発生しません。
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>再度使いたい場合</h2>
          <p style={styles.text}>
            利用期間終了後に、学習メニューページから希望の期間・教材数を選んで再購入してください。
            <br />
            コンビニ決済を選択した場合は、入金確認後に利用可能となります。
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>お問い合わせ</h2>
          <p style={styles.text}>
            利用期間、購入状況、再購入について不明点がある場合は、以下までご連絡ください。
            <br />
            support@outin-plus.com
          </p>
        </section>

        <div style={styles.actions}>
          <Link href="/select-mode" style={styles.primaryBtn}>
            学習メニューを見る
          </Link>
          <Link href="/legal/refund" style={styles.secondaryBtn}>
            返金ポリシーを見る
          </Link>
          <Link href="/contact" style={styles.secondaryBtn}>
            お問い合わせ
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
  pointBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    background: "#f8fafc",
    border: "1px solid rgba(37,99,235,.15)",
  },
  pointTitle: {
    fontSize: 15,
    fontWeight: 900,
    marginBottom: 10,
    color: "#0f172a",
  },
  list: {
    margin: 0,
    paddingLeft: 20,
    lineHeight: 1.9,
    fontSize: 14,
    color: "#1f2937",
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
  actions: {
    marginTop: 24,
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: 14,
    background: "#111827",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 900,
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
