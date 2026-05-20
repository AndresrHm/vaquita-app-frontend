import type { ReactNode } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { createPortal } from 'react-dom'

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

  return createPortal(
    <div className="fixed inset-0 z-9999 bg-black/35 p-3 sm:p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="flex max-h-[calc(100dvh-3rem)] w-full flex-col rounded-2xl border border-border bg-background p-4 shadow-xl">
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
    </div>,
    document.body
  )
}