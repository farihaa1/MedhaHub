"use client"

interface MarkdownTextProps {
  text: string
}

export default function MarkdownText({ text }: MarkdownTextProps) {
  const parts = text.split(/(\*\*.*?\*\*)/g)

  return (
    <>
      {parts.map((part, index) => {
        const isBold =
          part.startsWith("**") && part.endsWith("**") && part.length >= 4

        if (isBold) {
          return (
            <strong key={index} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          )
        }

        return <span key={index}>{part}</span>
      })}
    </>
  )
}
