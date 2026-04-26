/* eslint-disable no-undef */
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CollapsibleCardProps {
    title: string
    subtitle?: string
    defaultOpen?: boolean
    children: React.ReactNode
}

export default function CollapsibleCard({
    title,
    subtitle,
    defaultOpen = true,
    children
}: CollapsibleCardProps) {

    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="rounded-2xl border border-border bg-background/70 overflow-hidden">

            {/* HEADER */}
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/40 transition"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-foreground">
                        {title}
                    </span>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>

                <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </div>

            {/* CONTENT */}
            <div
                className={`transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
            >
                <div className="px-4 pb-4 pt-2">
                    {children}
                </div>
            </div>
        </div>
    )
}