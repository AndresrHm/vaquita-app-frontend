import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type CardProps = ComponentPropsWithoutRef<'div'> & {
    children: ReactNode
    className?: string
    interactive?: boolean
}

export default function Card({ children, className = '', interactive = true, ...rest }: CardProps) {
    const base = 'block rounded-2xl border border-border bg-background/70 p-4 shadow-sm transition '
    const interactiveClasses = interactive ? 'hover:bg-muted/50 active:bg-muted/70 cursor-pointer ' : ''

    return (
        <div className={base + interactiveClasses + className} {...rest}>
            {children}
        </div>
    )
}
