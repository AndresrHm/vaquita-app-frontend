import React from 'react'

export default function GroupsContainer({
    children,
    className = ''
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`flex-1 min-h-0 rounded-2xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl ${className}`}>
            <div className="h-full space-y-3 overflow-y-auto">
                {children}
            </div>
        </div>
    )
}
