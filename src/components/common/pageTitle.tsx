import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import IconNavButton from './IconNavButton'
import { ChevronLeft } from 'lucide-react'

type PageTitleProps = ComponentPropsWithoutRef<'div'> & {
    title?: ReactNode
    subtitle?: ReactNode
    children?: ReactNode
    className?: string
    onBack?: () => void
}

export default function PageTitle({ title, subtitle, children, className = '', onBack, ...rest }: PageTitleProps) {
    // If title prop is provided, render a standardized left block and place children on the right.
    if (title) {
        return (
            <div
                className={`rounded-b-2xl rounded-t-none border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl space-y-4 ${className}`}
                {...rest}
            >
                <div className="max-w-2xl mx-auto px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <IconNavButton ariaLabel="Volver" onClick={onBack} icon={<ChevronLeft className="h-5 w-5" />} />
                        )}
                        <div className="pl-0">
                            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        )
    }

    // Fallback: render children directly (backwards compatible)
    return (
        <div className={`rounded-b-2xl rounded-t-none border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl space-y-4 ${className}`} {...rest}>
            {children}
        </div>
    )
}
