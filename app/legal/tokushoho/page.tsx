import Link from "next/link"

export const metadata = {
  title: "特定商取引法に基づく表記",
}

export default function TokushohoPage() {
  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <p style={styles.kicker}>Care Japanese App</p>
        <h1 style={styles.title}>特定商取引法に基づく表記</h1>
        <p style={styles.lead}>
          株式会社アウトインプラスが提供する外国人介護人材向け日本語・介護学習Webアプリに関する表示です。
        </p>

        <InfoRow label="販売事業者" value="株式会社アウトインプラス" />
        <InfoRow label="運営責任者" value="高野 倫之" />
        <InfoRow
          label="所在地"
          value={`〒150-0043
東京都渋谷区道玄坂１丁目１０－８
渋谷道玄坂東急ビル２F-C`}
        />
        <InfoRow
          label="電話番号"
          value={`03-6820-3675
※お電話でのお問い合わせには対応していない場合があります。お問い合わせはメールにてお願いいたします。`}
        />
        <InfoRow label="メールアドレス" value="support@outin-plus.com" />
        <InfoRow label="サービス名" value="Care Japanese App" />
        <InfoRow label="販売URL" value="https://care-japanese.vercel.app/" />

        <SectionTitle>販売価格</SectionTitle>
        <p style={styles.text}>
          各商品ページまたは学習メニューページに税込価格を表示します。
        </p>

        <SectionTitle>商品代金以外の必要料金</SectionTitle>
        <p style={styles.text}>
          インターネット接続料金、通信料金、振込手数料その他サービス利用に必要な費用はお客様のご負担となります。
        </p>

        <SectionTitle>支払方法</SectionTitle>
        <p style={styles.text}>
          クレジットカード決済、コンビニ決済、その他当社が定める決済方法によりお支払いいただけます。
        </p>

        <SectionTitle>支払時期</SectionTitle>
        <p style={styles.text}>
          クレジットカード決済の場合は、申込時に決済されます。
          <br />
          コンビニ決済の場合は、決済画面または決済事業者が指定する期限までにお支払いください。
        </p>

        <SectionTitle>サービス提供時期</SectionTitle>
        <p style={styles.text}>
          クレジットカード決済の場合は、決済完了後、直ちに利用可能となります。
          <br />
          コンビニ決済の場合は、入金確認後、直ちに利用可能となります。
        </p>

        <SectionTitle>商品の内容</SectionTitle>
        <p style={styles.text}>
          外国人介護人材向け日本語・介護学習Webアプリ「Care Japanese App」の期間利用権を提供します。
          本サービスには、日本語学習、介護用語学習、ゲーム型学習、AI会話練習、AIスピーク等の機能が含まれる場合があります。
        </p>

        <SectionTitle>契約形態・自動更新について</SectionTitle>
        <p style={styles.text}>
          本サービスは買い切り型の期間利用権販売です。
          <br />
          月額サブスクリプションではなく、自動更新はありません。
        </p>

        <SectionTitle>利用期間</SectionTitle>
        <p style={styles.text}>
          購入したプランまたは学習メニューに応じた期間のみ利用できます。
          <br />
          利用期間終了後、継続利用を希望する場合は再度ご購入ください。
        </p>

        <SectionTitle>解約について</SectionTitle>
        <p style={styles.text}>
          本サービスは買い切り型のため、月額サブスクリプションのような解約手続きはありません。
        </p>

        <SectionTitle>返品・キャンセル・返金について</SectionTitle>
        <p style={styles.text}>
          デジタルコンテンツの性質上、購入後の返品、キャンセル、返金は原則としてお受けしておりません。
          <br />
          ただし、二重課金、当社の重大な不具合、法令上返金義務が発生する場合、または当社が必要と判断した場合はこの限りではありません。
        </p>

        <SectionTitle>動作環境</SectionTitle>
        <p style={styles.text}>
          本サービスはインターネット接続環境およびWebブラウザ上で利用するサービスです。
          ご利用端末、通信環境、ブラウザ設定等により、一部機能が利用できない場合があります。
        </p>

        <SectionTitle>表現および商品に関する注意書き</SectionTitle>
        <p style={styles.text}>
          本サービスの学習効果には個人差があり、特定の試験合格、資格取得、就職、在留資格取得、業務能力向上その他特定の成果を保証するものではありません。
          <br />
          AI機能による回答は学習支援を目的とした参考情報であり、正確性、完全性、最新性を保証するものではありません。
        </p>

        <BottomLinks />
      </div>
    </main>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.row}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={styles.sectionTitle}>{children}</h2>
}

function BottomLinks() {
  return (
    <div style={styles.bottomLinks}>
      <Link href="/legal/terms" style={styles.link}>
        利用規約
      </Link>
      <Link href="/legal/privacy" style={styles.link}>
        プライバシーポリシー
      </Link>
      <Link href="/legal/refund" style={styles.link}>
        返金ポリシー
      </Link>
      <Link href="/cancel" style={styles.link}>
        利用期限・再購入について
      </Link>
      <Link href="/contact" style={styles.link}>
        お問い合わせ
      </Link>
    </div>
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
    lineHeight: 1.3,
    color: "#0f172a",
  },
  lead: {
    margin: "10px 0 18px",
    fontSize: 14,
    lineHeight: 1.8,
    color: "#475569",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    gap: 14,
    padding: "14px 0",
    borderBottom: "1px solid rgba(17,24,39,.08)",
  },
  label: {
    fontWeight: 900,
    fontSize: 14,
    color: "#0f172a",
  },
  value: {
    fontSize: 14,
    lineHeight: 1.8,
    whiteSpace: "pre-wrap",
    color: "#1f2937",
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
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
