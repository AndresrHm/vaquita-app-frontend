import React from 'react'

export default function GroupsListContainer({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl ${className}`}>
      <div className="flex flex-col flex-1 space-y-3 overflow-y-auto pr-1">
        {children}
      </div>
    </div>
  )
}
