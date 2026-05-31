import Link from "next/link"

export const metadata = {
  title: "利用規約",
}

export default function TermsPage() {
  return (
    <main style={styles.main}>
      <article style={styles.card}>
        <p style={styles.kicker}>Care Japanese App</p>
        <h1 style={styles.title}>利用規約</h1>
        <p style={styles.lead}>
          本規約は、株式会社アウトインプラスが提供するCare Japanese Appの利用条件を定めるものです。
        </p>

        <Section title="第1条（適用）">
          本規約は、株式会社アウトインプラス（以下「当社」といいます。）が提供する外国人介護人材向け日本語・介護学習Webアプリ「Care Japanese App」（以下「本サービス」といいます。）の利用条件を定めるものです。
          ユーザーは、本規約に同意したうえで本サービスを利用するものとします。
        </Section>

        <Section title="第2条（本サービスの内容）">
          本サービスは、日本語学習、介護用語学習、介護場面での会話練習、ゲーム型学習、AI会話練習、AIスピーク、学習履歴管理その他これらに関連する機能を提供します。
          当社は、必要に応じて本サービスの内容を追加、変更、停止または終了することがあります。
        </Section>

        <Section title="第3条（アカウント登録）">
          ユーザーは、当社が定める方法によりアカウント登録を行うものとします。
          登録情報に虚偽、誤りまたは変更があった場合、ユーザーは速やかに修正または当社へ連絡するものとします。
        </Section>

        <Section title="第4条（アカウント管理）">
          ユーザーは、自己の責任においてアカウント情報、メールアドレス、パスワード等を管理するものとします。
          アカウントの貸与、譲渡、共有、売買その他第三者に利用させる行為は禁止します。
        </Section>

        <Section title="第5条（料金および支払）">
          本サービスの有料機能は、買い切り型の期間利用権として販売されます。
          ユーザーは、当社が表示する販売価格を、クレジットカード決済、コンビニ決済、その他当社が定める決済方法により支払うものとします。
          決済に関する条件は、当社または決済事業者が定める条件に従うものとします。
        </Section>

        <Section title="第6条（利用期間・自動更新）">
          ユーザーは、購入したプランまたは学習メニューに応じた期間、本サービスの有料機能を利用できます。
          本サービスは月額サブスクリプションではなく、自動更新はありません。
          利用期間終了後、継続利用を希望する場合は再度購入が必要です。
        </Section>

        <Section title="第7条（返金・キャンセル）">
          本サービスはデジタルコンテンツの性質上、購入後の返品、キャンセル、返金は原則としてお受けしておりません。
          ただし、二重課金、当社の重大な不具合、法令上返金義務が発生する場合、または当社が必要と判断した場合はこの限りではありません。
        </Section>

        <Section title="第8条（AI機能の利用）">
          本サービスでは、生成AIを活用した学習支援機能を提供する場合があります。
          AIによる回答、評価、会話例、学習アドバイス等は参考情報であり、正確性、完全性、最新性、特定目的への適合性を保証するものではありません。
          ユーザーは、自己の責任においてAI機能を利用するものとします。
        </Section>

        <Section title="第9条（AI機能に入力してはいけない情報）">
          ユーザーは、AI機能またはお問い合わせ等に、本人または第三者の機微情報、医療情報、金融情報、パスワード、本人確認書類、秘密情報その他入力が不適切な情報を送信しないものとします。
          当社は、ユーザーが入力した内容に起因する損害について、当社に故意または重大な過失がある場合を除き責任を負いません。
        </Section>

        <Section title="第10条（企業契約ユーザー）">
          企業、団体、施設等との契約により本サービスを利用するユーザーについては、所属企業または所属団体の管理者が、学習状況、学習履歴、成績情報、利用状況、AI機能の利用状況等を閲覧できる場合があります。
          ユーザーは、企業契約ユーザーとして利用する場合、この取り扱いに同意するものとします。
        </Section>

        <Section title="第11条（禁止事項）">
          ユーザーは、以下の行為をしてはなりません。
          <br />
          ・法令または公序良俗に反する行為
          <br />
          ・不正アクセスまたはこれを試みる行為
          <br />
          ・アカウントの貸与、譲渡、共有、売買
          <br />
          ・教材、画像、音声、文章、問題、解説、画面等の無断転載、複製、再配布、販売
          <br />
          ・学習データ、成績データ、利用履歴等を不正に改ざんする行為
          <br />
          ・本サービスの運営、サーバー、ネットワーク、AI機能に過度な負荷をかける行為
          <br />
          ・第三者になりすます行為
          <br />
          ・当社、他のユーザーまたは第三者の権利、利益、信用を侵害する行為
          <br />
          ・その他、当社が不適切と判断する行為
        </Section>

        <Section title="第12条（知的財産権）">
          本サービスに含まれる教材、文章、画像、音声、動画、問題、解説、UI、プログラムその他一切のコンテンツに関する知的財産権は、当社または正当な権利者に帰属します。
          ユーザーは、当社の許可なくこれらを複製、転載、配布、販売、公開、改変、二次利用してはなりません。
        </Section>

        <Section title="第13条（サービスの変更・停止）">
          当社は、保守、障害対応、セキュリティ対応、天災、通信障害、外部サービスの停止その他やむを得ない事情がある場合、本サービスの全部または一部を変更、停止または終了することがあります。
        </Section>

        <Section title="第14条（免責）">
          当社は、本サービスの利用により、特定の学習成果、試験合格、資格取得、就職、在留資格取得、業務能力向上その他特定の成果を保証するものではありません。
          当社に故意または重大な過失がある場合を除き、本サービスの利用または利用不能により生じた損害について責任を負いません。
        </Section>

        <Section title="第15条（規約の変更）">
          当社は、必要と判断した場合、本規約を変更できるものとします。
          変更後の内容は、本サービス上に表示した時点または当社が定める時点で効力を生じます。
        </Section>

        <Section title="第16条（お問い合わせ）">
          本サービスに関するお問い合わせは、以下のメールアドレスまでお願いいたします。
          <br />
          support@outin-plus.com
        </Section>

        <Section title="第17条（準拠法・管轄）">
          本規約は日本法に準拠します。
          本サービスに関して紛争が生じた場合は、当社所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
        </Section>

        <div style={styles.bottomLinks}>
          <Link href="/legal/privacy" style={styles.link}>
            プライバシーポリシー
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
