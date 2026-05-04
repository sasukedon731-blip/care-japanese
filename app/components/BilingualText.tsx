import React from "react"

type Props = {
  ja: string
  en?: string
  as?: React.ElementType
  style?: React.CSSProperties
  jaStyle?: React.CSSProperties
  enStyle?: React.CSSProperties
  inline?: boolean
}

export default function BilingualText({
  ja,
  en,
  as = "span",
  style,
  jaStyle,
  enStyle,
  inline = false,
}: Props) {
  const Tag = as as any

  return (
    <Tag
      style={{
        display: inline ? "inline-flex" : "flex",
        flexDirection: inline ? "row" : "column",
        alignItems: inline ? "baseline" : undefined,
        gap: inline ? 6 : 2,
        ...style,
      }}
    >
      <span style={jaStyle}>{ja}</span>
      {en ? (
        <span
          style={{
            fontSize: "0.86em",
            opacity: 0.72,
            fontWeight: 600,
            ...enStyle,
          }}
        >
          {en}
        </span>
      ) : null}
    </Tag>
  )
}
