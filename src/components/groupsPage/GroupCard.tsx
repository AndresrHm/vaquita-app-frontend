import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAvatarColorClass, getInitials } from '@/components/common/initials'

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
  const [imageLoadFailed, setImageLoadFailed] = useState(false)
  const initials = getInitials(group.nombre)
  const avatarColor = getAvatarColorClass(group.nombre)
  const showImage = Boolean(group.imagenUrl?.trim()) && !imageLoadFailed

  return (
    <Link
      to={`/groups/${group.id}`}
      className="block rounded-2xl border border-border bg-background/70 p-4 shadow-sm hover:bg-muted/50 active:bg-muted/70 cursor-pointer transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {showImage ? (
            <img
              src={group.imagenUrl!}
              alt={group.nombre}
              className="h-12 w-14 shrink-0 rounded-md border border-border object-cover"
              onError={() => setImageLoadFailed(true)}
            />
          ) : (
            <div className={`flex h-12 w-14 shrink-0 items-center justify-center rounded-md border border-border ${avatarColor.bg}`}>
              <span className={`text-sm font-semibold ${avatarColor.text}`}>{initials}</span>
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
