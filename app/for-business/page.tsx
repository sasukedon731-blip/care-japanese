"use client"

import Link from "next/link"
import AppHeader from "@/app/components/AppHeader"
import LegalFooter from "@/app/components/LegalFooter"

export default function ForBusinessPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <AppHeader />

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  法人向け 日本語学習支援
                </div>

                <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                  外国人材の日本語学習を、
                  <br className="hidden sm:block" />
                  企業側で見える化。
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">
                  日本語検定・介護学習を、学習者はスマホで進めやすく、
                  企業担当者は学習状況・正答率・最終学習日などをまとめて確認できます。
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Link href="#contact" className="btn-dark min-h-[56px] w-full">
                    お問い合わせ
                  </Link>

                  <Link href="#pricing" className="btn-secondary min-h-[56px] w-full">
                    概算料金を見る
                  </Link>
                </div>

                <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    FOR COMPANIES
                  </div>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                    企業・教育担当者の方へ
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    学習者の進捗確認や利用状況の把握ができる管理画面をご用意しています。
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["学習者一覧", "進捗確認", "未学習者の把握"].map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/company/login"
                      className="btn-dark min-h-[56px] w-full sm:w-auto sm:min-w-[190px]"
                    >
                      管理画面ログイン
                    </Link>

                    <Link
                      href="#flow"
                      className="btn-secondary min-h-[56px] w-full sm:w-auto sm:min-w-[190px]"
                    >
                      導入の流れを見る
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          企業管理画面
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-slate-900">
                          学習者一覧
                        </h3>
                      </div>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        20名利用中
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[
                        ["Nguyen Van A", "学習中", "82%", "今日"],
                        ["Tran Thi B", "7日以上未学習", "61%", "8日前"],
                        ["Pham C", "未学習", "—", "—"],
                      ].map(([name, status, score, last]) => (
                        <div
                          key={name}
                          className="grid grid-cols-[1.3fr_0.9fr_0.7fr_0.8fr] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                        >
                          <div className="font-semibold text-slate-900">{name}</div>
                          <div>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                status === "学習中"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : status === "7日以上未学習"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                          <div className="font-semibold text-slate-900">{score}</div>
                          <div className="text-slate-500">{last}</div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      学習者の状況を一覧で把握し、フォロー対象を見つけやすくします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                企業利用でできること
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-700">
                外国人材の日本語学習を、学習者任せにしすぎず、
                企業側でも進捗を確認しやすい設計です。
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["学習者一覧を確認", "自社で登録した学習者を一覧で確認できます。学習状況の把握がしやすくなります。"],
                ["進捗を見える化", "学習回数、正答率、最終学習日などを見ながら、フォローが必要な学習者を把握できます。"],
                ["日本語検定取得支援に活用", "日本語検定・介護学習を日々の学習に取り入れ、日本語力向上のサポートに活用できます。"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  こんな企業におすすめ
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  導入しやすい企業イメージ
                </h2>

                <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
                  <li>・外国人材の日本語学習を継続させたい</li>
                  <li>・日本語検定取得を目標にしている</li>
                  <li>・学習状況を企業側でも確認したい</li>
                  <li>・未学習者やフォロー対象を把握したい</li>
                  <li>・スマホで取り組みやすい教材を探している</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  運用イメージ
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  ご利用イメージ
                </h2>

                <div className="mt-6 space-y-4">
                  {[
                    ["1", "企業担当者アカウント発行"],
                    ["2", "学習者を企業に紐づけ"],
                    ["3", "学習開始"],
                    ["4", "企業側で進捗確認"],
                  ].map(([num, title]) => (
                    <div
                      key={num}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                        {num}
                      </div>
                      <div className="font-semibold text-slate-900">{title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                概算料金の目安
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-700">
                導入人数に応じてご相談いただけるよう、まずは目安を掲載しています。
              </p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                ["20名まで", "月額 400円〜8,000円", "小規模チーム向け"],
                ["50名まで", "月額 8,000円〜19,000円", "中規模運用向け"],
                ["100名まで", "個別見積", "大人数運用向け"],
              ].map(([title, price, note]) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                  <p className="text-sm font-semibold text-slate-500">{note}</p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900">{title}</h3>
                  <p className="mt-4 text-3xl font-bold text-slate-900">{price}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-700">
                    利用人数や運用方法に応じて、詳細は個別にご案内します。
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              ※ 実際のご提案内容は、利用人数や運用方法に応じて調整いたします。
            </p>
          </div>
        </section>

        <section id="flow" className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                導入の流れ
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-700">
                まずはお問い合わせから、導入内容にあわせてご案内します。
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                ["1", "お問い合わせ"],
                ["2", "ご案内・お見積"],
                ["3", "ご契約・準備"],
                ["4", "ご利用開始"],
              ].map(([num, title]) => (
                <div key={num} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                    {num}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                よくある質問
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {[
                ["学習者は企業でまとめて管理できますか？", "はい。企業担当者向けの管理画面から、学習者一覧や学習状況を確認できます。"],
                ["何名くらいから利用できますか？", "少人数の導入から、数十名規模の運用まで想定しています。"],
                ["まずは相談だけでも大丈夫ですか？", "はい。導入前のご相談や、運用イメージの確認だけでも問題ありません。"],
                ["利用料金は固定ですか？", "人数や運用方法に応じてご案内するため、詳細はお問い合わせ時にご相談ください。"],
              ].map(([q, a]) => (
                <div key={q} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900">{q}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              まずは導入イメージをご相談ください。
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-700">
              利用人数、導入目的、運用イメージに応じてご案内します。
              まずはお問い合わせからご相談ください。
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:support@outin-plus.com?subject=Care Japanese App 導入相談"
                className="btn-dark min-h-[56px] w-full sm:w-auto sm:min-w-[190px]"
              >
                メールで問い合わせる
              </a>

              <Link
                href="/contact"
                className="btn-secondary min-h-[56px] w-full sm:w-auto sm:min-w-[190px]"
              >
                お問い合わせページへ
              </Link>

              <Link
                href="/company/login"
                className="btn-secondary min-h-[56px] w-full sm:w-auto sm:min-w-[190px]"
              >
                企業管理画面へ
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              うまくメールが起動しない場合は、support@outin-plus.com まで直接ご連絡ください。
            </p>
          </div>
        </section>
      </main>

      <LegalFooter />
    </div>
  )
}