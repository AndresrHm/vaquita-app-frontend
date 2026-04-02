import React from 'react'

type Group = {
  id: string
  name: string
  status: string
  imageUrl?: string
}

export default function GroupCard({ group }: { group: Group }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {group.imageUrl ? (
            <img
              src={group.imageUrl}
              alt={group.name}
              className="h-12 w-14 shrink-0 rounded-md border border-border object-cover"
            />
          ) : (
            <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-muted/80 text-sm font-semibold text-muted-foreground">
              {group.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase() ?? '')
                .join('')}
            </div>
          )}

          <div>
            <div className="text-sm font-semibold text-foreground">{group.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{group.status}</div>
          </div>
        </div>

      </div>
    </div>
  )
}
