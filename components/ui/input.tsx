import type { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-red-600 focus:ring-2 focus:ring-red-600/15 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}
