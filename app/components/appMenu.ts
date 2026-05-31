export type AppMenuItem = {
  href: string
  label: string
  labelEn?: string
  icon: string
}

export const APP_MENU: AppMenuItem[] = [
  { href: "/home", icon: "🏠", label: "TOP", labelEn: "Home" },
  { href: "/select-mode", icon: "📚", label: "学習", labelEn: "Study" },
  { href: "/ai", icon: "🤖", label: "AI", labelEn: "AI Practice" },
  { href: "/game", icon: "🎮", label: "ゲーム", labelEn: "Game" },
  { href: "/mypage", icon: "👤", label: "マイページ", labelEn: "My Page" },
  { href: "/for-business", icon: "🏢", label: "法人向け", labelEn: "Business" },
]
