import React from 'react'
import { useNavigate } from 'react-router-dom'

type IconProps = {
    className?: string
    strokeWidth?: number
}

export default function IconNavButton({
    icon,
    to,
    onClick,
    ariaLabel,
    className,
}: {
    
    icon: React.ReactElement<IconProps>
    to?: string
    onClick?: () => void
    ariaLabel?: string
    className?: string
}) {
    const navigate = useNavigate()

    function handleClick(e: React.MouseEvent) {
        e.stopPropagation()
        if (onClick) return onClick()
        if (to) return  navigate(to)
    }

    // Clone icon to enforce strokeWidth and ensure consistent sizing
    const renderedIcon = React.cloneElement(icon, {
        className: [
            icon.props.className ?? '',
        ].join(' '),
        strokeWidth: 1.8,
    })
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
