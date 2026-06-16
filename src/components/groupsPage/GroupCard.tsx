import { Link } from 'react-router-dom'

export function GroupCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="h-12 w-14 shrink-0 rounded-md bg-muted/60" />
        <div className="space-y-2">
          <div className="h-3.5 w-32 rounded bg-muted/60" />
          <div className="h-3 w-20 rounded bg-muted/60" />
        </div>
      </div>
    </div>
  )
}

type Group = {
  id: number
  nombre: string
  estadoGrupo: string
  imagenUrl?: string
}

export default function GroupCard({ group }: { group: Group }) {
  return (
    <Link
      to={`/groups/${group.id}`}
      className="block rounded-2xl border border-border bg-background/70 p-4 shadow-sm hover:bg-muted/50 active:bg-muted/70 cursor-pointer transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {group.imagenUrl ? (
            <img
              src={group.imagenUrl}
              alt={group.nombre}
              className="h-12 w-14 shrink-0 rounded-md border border-border object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(group.nombre)}&background=random&color=fff`
              }}
            />
          ) : (
            <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-muted/80 text-sm font-semibold text-muted-foreground">
              {group.nombre
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase() ?? '')
                .join('')}
            </div>
          )}

          <div>
            <div className="text-sm font-semibold text-foreground">{group.nombre}</div>
            <div className="mt-1 text-xs text-muted-foreground">{group.estadoGrupo}</div>
          </div>
        </div>

      </div>
    </Link>
  )
}
