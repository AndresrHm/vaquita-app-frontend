/* eslint-disable no-undef */
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CollapsibleCardProps {
    title: string
    subtitle?: string
    defaultOpen?: boolean
    createExpense?: boolean
    children: React.ReactNode
}

export default function CollapsibleCard({
    title,
    subtitle,
    defaultOpen = true,
    createExpense = false,
    children
}: CollapsibleCardProps) {

    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className={`rounded-2xl border border-border ${createExpense ? 'bg-card/70 overflow-visible' : 'bg-background/70 overflow-hidden'}`}>

            {/* HEADER */}
            <div
                className={`
    flex items-center justify-between px-4 cursor-pointer
    hover:bg-muted/40 transition
    ${createExpense ? 'pt-3 pb-2' : 'py-3'}
    ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}
`}
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
                    } ${createExpense && isOpen ? 'overflow-visible' : 'overflow-hidden'}`}
            >
                <div className={createExpense ? 'px-2 pb-2 pt-0' : 'px-4 pb-4 pt-2'}>
                    {children}
                </div>
            </div>
        </div>
    )
}
