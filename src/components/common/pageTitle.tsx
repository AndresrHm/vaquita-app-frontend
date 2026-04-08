import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type PageTitleProps = ComponentPropsWithoutRef<'div'> & {
    children: ReactNode
    className?: string
}

export default function PageTitle({ children, className = '', ...rest }: PageTitleProps) {
    return (
        <div
            className={
                'rounded-b-2xl rounded-t-none border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl space-y-4 ' +
                className
            }
            {...rest}
        >
            {children}
        </div>
    )
}
