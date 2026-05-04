"use client"

import Link from "next/link"

const codeBlock = `1. Firebase Authentication で企業管理者用アカウントを新規作成
   - 例: admin@abc-company.jp

2. Authentication の UID を確認

3. Firestore の users コレクションに、
   ドキュメントID = その UID で新規作成

4. 入れるデータ例
{
  "uid": "AuthenticationのUID",
  "email": "admin@abc-company.jp",
  "displayName": "ABC管理者",
  "role": "company_admin",
  "companyId": "abc-company",
  "companyName": "ABC株式会社",
  "billing": {
    "accountType": "company",
    "status": "active"
  }
}

5. companies/abc-company が存在することを確認
{
  "name": "ABC株式会社",
  "inviteCode": "ABC123",
  "inviteEnabled": true
}

6. 企業管理者で /company/login からログイン`

const firestoreUser = `{
  "uid": "AuthenticationのUID",
  "email": "admin@abc-company.jp",
  "displayName": "ABC管理者",
  "role": "company_admin",
  "companyId": "abc-company",
  "companyName": "ABC株式会社",
  "billing": {
    "accountType": "company",
    "status": "active"
  }
}`

const firestoreCompany = `{
  "name": "ABC株式会社",
  "inviteCode": "ABC123",
  "inviteEnabled": true
}`

export default function CompanySetupPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <section
          style={{
            background: "#fff",
            border: "1px solid #dbe7ff",
            borderRadius: 24,
            boxShadow: "0 20px 50px rgba(37, 99, 235, 0.10)",
            padding: 24,
          }}
        >
          <p
            style={{
              display: "inline-block",
              margin: 0,
              padding: "6px 10px",
              borderRadius: 999,
              background: "#eff6ff",
              color: "#1d4ed8",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 0.3,
            }}
          >
            FOR BUSINESS
          </p>

          <h1
            style={{
              margin: "12px 0 8px",
              fontSize: 32,
              lineHeight: 1.25,
              color: "#0f172a",
            }}
          >
            企業管理者アカウント作成手順
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.8,
              color: "#475569",
            }}
          >
            企業の管理画面に入るための管理者アカウントは、
            学習者アカウントとは分けて作るのがおすすめです。
            このページでは、Firebase Authentication と Firestore での
            最小構成をまとめています。
          </p>
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #dbe7ff",
            borderRadius: 24,
            padding: 24,
          }}
        >
          <h2
            style={{
              margin: "0 0 14px",
              fontSize: 22,
              color: "#0f172a",
            }}
          >
            手順まとめ
          </h2>

          <div
            style={{
              borderRadius: 18,
              background: "#0f172a",
              color: "#e2e8f0",
              padding: 18,
              overflowX: "auto",
              fontSize: 14,
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            {codeBlock}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #dbe7ff",
              borderRadius: 24,
              padding: 24,
            }}
          >
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: 20,
                color: "#0f172a",
              }}
            >
              users/{`{uid}`} に入れるデータ
            </h2>

            <div
              style={{
                borderRadius: 18,
                background: "#0f172a",
                color: "#e2e8f0",
                padding: 16,
                overflowX: "auto",
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {firestoreUser}
            </div>

            <div
              style={{
                marginTop: 14,
                borderRadius: 14,
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#1e3a8a",
                padding: "12px 14px",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              <strong>重要:</strong> role は <code>company</code> ではなく
              <code> company_admin</code> にしてください。
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #dbe7ff",
              borderRadius: 24,
              padding: 24,
            }}
          >
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: 20,
                color: "#0f172a",
              }}
            >
              companies/{`{companyId}`} に入れる例
            </h2>

            <div
              style={{
                borderRadius: 18,
                background: "#0f172a",
                color: "#e2e8f0",
                padding: 16,
                overflowX: "auto",
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {firestoreCompany}
            </div>

            <div
              style={{
                marginTop: 14,
                borderRadius: 14,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#334155",
                padding: "12px 14px",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              学習者が企業コードで所属するときは、
              <code>companyId</code> とこのドキュメントIDが一致している必要があります。
            </div>
          </div>
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #dbe7ff",
            borderRadius: 24,
            padding: 24,
          }}
        >
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: 20,
              color: "#0f172a",
            }}
          >
            よくあるつまずき
          </h2>

          <div style={{ display: "grid", gap: 12 }}>
            {[
              "role を company にしていて通らない → company_admin にする",
              "billing.accountType が personal に戻る → userPlanState.ts の補正を確認する",
              "companyId が users と companies で一致していない",
              "既存の個人アカウントを流用して billing や履歴が混ざっている",
              "/company/login ではなく通常の /login から入っていて分かりにくい",
            ].map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  padding: "12px 14px",
                  fontSize: 14,
                  color: "#334155",
                  lineHeight: 1.7,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <Link
            href="/company/login"
            style={{
              textDecoration: "none",
              borderRadius: 14,
              padding: "14px 18px",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            企業ログインへ
          </Link>

          <Link
            href="/for-business"
            style={{
              textDecoration: "none",
              borderRadius: 14,
              padding: "14px 18px",
              background: "#fff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
              fontWeight: 800,
            }}
          >
            企業向けページへ戻る
          </Link>
        </section>
      </div>
    </main>
  )
}