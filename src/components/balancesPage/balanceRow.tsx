import type { ReactNode } from 'react'
import { AvatarCircle } from '../common/avatarCircle'

export function BalanceRow({
  label,
  sublabel,
  amount,
  variant,
  avatarNombre,
}: {
  label: ReactNode
  sublabel?: string
  amount: string
  variant: 'success' | 'neutral' | 'danger'
  avatarNombre: string
}) {
  const amountColor =
    variant === 'success'
      ? 'text-[var(--success)]'
      : variant === 'danger'
        ? 'text-[var(--danger)]'
        : 'text-muted-foreground'

  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <AvatarCircle nombre={avatarNombre} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground leading-tight">{label}</div>
        {sublabel && (
          <div className="mt-0.5 text-xs text-muted-foreground">{sublabel}</div>
        )}
      </div>
      <div className={`shrink-0 text-sm font-medium ${amountColor}`}>{amount}</div>
    </div>
  )
}