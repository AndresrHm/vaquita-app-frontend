import React from 'react'

export default function ActionButton({
    children,
    icon,
    variant = 'primary',
    className = '',
    ...props
}: React.ComponentProps<'button'> & { icon?: React.ReactNode; variant?: 'primary' | 'secondary' }) {
    if (variant === 'secondary') {
        return (
            <button
                type="button"
                className={`inline-flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-500 shadow-sm hover:bg-red-100 transition ${className}`}
                {...props}
            >
                {icon ? <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-500">{icon}</span> : null}
                {children}
            </button>
        )
    }

    return (
        <button
            type="button"
            className={`inline-flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition ${className}`}
            {...props}
        >
            {icon ? <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">{icon}</span> : null}
            {children}
        </button>
    )
}
