import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type PageTitleProps = ComponentPropsWithoutRef<'div'> & {
    title?: ReactNode
    subtitle?: ReactNode
    children?: ReactNode
    className?: string
}

export default function PageTitle({ title, subtitle, children, className = '', ...rest }: PageTitleProps) {
    // If title prop is provided, render a standardized left block and place children on the right.
    if (title) {
        return (
            <div
                className={`rounded-b-2xl rounded-t-none border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl space-y-4 ${className}`}
                {...rest}
            >
                <div className="max-w-2xl mx-auto px-3 py-2 flex items-center justify-between">
                    <div className="pl-0">
                        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
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
