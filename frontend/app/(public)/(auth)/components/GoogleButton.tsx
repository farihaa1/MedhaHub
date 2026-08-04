"use client"

type Props = {
  onClick: () => void
  loading?: boolean
}

export default function GoogleButton({ onClick, loading = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full rounded-md border p-3"
    >
      Continue with Google
    </button>
  )
}
