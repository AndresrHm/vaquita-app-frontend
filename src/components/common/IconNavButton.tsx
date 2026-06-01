import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function IconNavButton({
    icon,
    to,
    onClick,
    ariaLabel,
    className,
}: {
    icon: React.ReactNode
    to?: string
    onClick?: () => void
    ariaLabel?: string
    className?: string
}) {
    const navigate = useNavigate()

    function handleClick(e: React.MouseEvent) {
        e.stopPropagation()
        if (onClick) return onClick()
        if (to) return navigate(to)
    }

    // Clone icon to enforce strokeWidth and ensure consistent sizing
    const renderedIcon = React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement, {
            className: [
                // keep any className provided by caller
                (icon as React.ReactElement).props.className ?? '',
            ].join(' '),
            strokeWidth: 1.8,
        })
        : icon

    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={handleClick}
            className={`inline-flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition ${className ?? ''}`}
        >
            {renderedIcon}
        </button>
    )
}
