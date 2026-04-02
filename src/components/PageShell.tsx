import React from 'react'

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-4 flex-1">{children}</div>
    </div>
  )
}
