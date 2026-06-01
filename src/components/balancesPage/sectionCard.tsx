import type { ReactNode } from 'react'

export function SectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 shadow-sm overflow-hidden">
      <div className="border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="py-1">{children}</div>
    </div>
  )
}