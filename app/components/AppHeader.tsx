"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "firebase/auth"

import Button from "@/app/components/Button"
import BilingualText from "@/app/components/BilingualText"
import { auth } from "@/app/lib/firebase"
import { useAuth } from "@/app/lib/useAuth"
import { APP_MENU } from "@/app/components/appMenu"

type Props = {
  title?: string
  titleEn?: string
}

export default function AppHeader({ title, titleEn }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const [open, setOpen] = useState(false)

  const isTop = pathname === "/"
  const items = APP_MENU

  const close = () => setOpen(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } finally {
      router.push("/home")
    }
  }

  return (
    <>
      <header className="appHeader" aria-label="header">
        <div className="appHeaderLeft">
          <Link href="/home" className="appHeaderBrand" aria-label="TOPへ / Go to Home">
            <span className="appHeaderLogo">📚</span>
            <span className="appHeaderName">
              <BilingualText
                ja="日本語・介護 学習アプリ"
                en="Care Japanese App"
                jaStyle={{ fontWeight: 900 }}
                enStyle={{ fontSize: 11, opacity: 0.72 }}
              />
            </span>
          </Link>
          {title ? (
            <span className="appHeaderTitle">
              <BilingualText ja={title} en={titleEn} />
            </span>
          ) : null}
        </div>

        {!isTop ? (
          <button
            className="hamburgerBtn"
            aria-label="メニュー / Menu"
            onClick={() => setOpen(true)}
            type="button"
          >
            ☰
          </button>
        ) : null}
      </header>

      {open ? (
        <div
          className="drawerOverlay"
          onClick={close}
          role="dialog"
          aria-label="menu"
        >
          <div className="drawerPanel" onClick={(e) => e.stopPropagation()}>
            <div className="drawerHead">
              <BilingualText ja="メニュー" en="Menu" style={{ fontWeight: 900 }} />
              <button
                className="drawerClose"
                aria-label="閉じる / Close"
                onClick={close}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="drawerBody">
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="drawerLink"
                  onClick={close}
                >
                  <span className="drawerIcon" aria-hidden="true">{it.icon}</span>
                  <span className="drawerLabel">
                    <BilingualText ja={it.label} en={it.labelEn} inline />
                  </span>
                </Link>
              ))}

              <div className="drawerDivider" />

              {user ? (
                <Button
                  variant="danger"
                  onClick={async () => {
                    close()
                    await handleLogout()
                  }}
                >
                  ログアウト / Logout
                </Button>
              ) : (
                <Button
                  variant="main"
                  onClick={() => {
                    close()
                    router.push("/login")
                  }}
                >
                  ログイン / Login
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
