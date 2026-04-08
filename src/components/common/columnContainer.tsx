import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ColumnContainerProps = ComponentPropsWithoutRef<'div'> & {
    children: ReactNode
    className?: string
}

export default function ColumnContainer({ children, className = '', ...rest }: ColumnContainerProps) {
    return (
        <div
            className={`flex-1 min-h-0 rounded-2xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl ${className}`}
            {...rest}
        >
            <div className="h-full space-y-3 overflow-y-auto">{children}</div>
        </div>
    )
}
