import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type CardProps = ComponentPropsWithoutRef<'div'> & {
    children: ReactNode
    className?: string
}

export default function Card({ children, className = '', ...rest }: CardProps) {
    return (
        <div
            className={
                'block rounded-2xl border border-border bg-background/70 p-4 shadow-sm hover:bg-muted/50 active:bg-muted/70 cursor-pointer transition ' +
                className
            }
            {...rest}
        >
            {children}
        </div>
    )
}
