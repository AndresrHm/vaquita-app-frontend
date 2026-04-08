import * as React from 'react'

export default function Select({ value, onChange, children, className, ...props }: any) {
    return (
        <select
            value={value}
            onChange={onChange}
            className={
                'w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-foreground ' +
                (className ?? '')
            }
            {...props}
        >
            {children}
        </select>
    )
}
