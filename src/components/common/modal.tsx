import type { ReactNode } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ModalProps = {
  isOpen: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export default function Modal({ isOpen, title, description, onClose, children, footer }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center overflow-y-auto bg-black/35 p-3 sm:p-6">
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col rounded-2xl border border-border bg-background p-4 shadow-xl sm:max-h-[calc(100dvh-3rem)]">
        <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar modal">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">{children}</div>

        {footer ? <div className="mt-5 flex shrink-0 items-center justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  )
}