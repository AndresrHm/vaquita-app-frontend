/* eslint-disable no-undef */
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Search, Sliders, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FILTER_OPTIONS = [
    { value: 'all', label: 'Todos los grupos' },
    { value: 'pending', label: 'Saldos pendientes' },
    { value: 'you-owe', label: 'Grupos a los que debés' },
    { value: 'owe-you', label: 'Grupos que te deben' },
]

export default function GroupsSearch({
    onFilterChange,
    onSearchChange,
    onAddFriend
}: {
    onFilterChange?: (v: string) => void
    onSearchChange?: (v: string) => void
    onAddFriend?: () => void
}) {
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState('all')
    const containerRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null)

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            const target = e.target as Node
            const insideTrigger = containerRef.current?.contains(target)
            const insideDropdown = dropdownRef.current?.contains(target)
            if (!insideTrigger && !insideDropdown) {
                setOpen(false)
            }
        }
        document.addEventListener('click', onDoc)
        return () => document.removeEventListener('click', onDoc)
    }, [])

    useEffect(() => {
        onFilterChange?.(filter)
    }, [filter, onFilterChange])

    useEffect(() => {
        if (!open) {
            setDropdownPos(null)
            return
        }

        function updatePos() {
            const el = containerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const right = Math.max(8, window.innerWidth - rect.right)
            const top = rect.bottom + 8
            setDropdownPos({ top, right })
        }

        updatePos()
        window.addEventListener('resize', updatePos)
        window.addEventListener('scroll', updatePos, true)
        return () => {
            window.removeEventListener('resize', updatePos)
            window.removeEventListener('scroll', updatePos, true)
        }
    }, [open])

    const navigate = useNavigate()

    return (
        <div ref={containerRef} className="relative">
            <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2 hover:bg-muted transition">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            inputRef.current?.focus()
                        }}
                        className="inline-flex items-center justify-center p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Focus search"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar grupos"
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />

                    <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={open}
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen((v) => !v)
                        }}
                        className={`ml-2 inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:text-foreground cursor-pointer active:bg-muted/80 active:rounded-md active:scale-[0.98] transition ${open ? 'bg-muted/70' : 'hover:bg-muted'}`}
                    >
                        <Sliders className="h-4 w-4" />
                    </button>
                </label>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        onAddFriend?.()
                        navigate('/groups/new')
                    }}
                    aria-label="Crear grupo"
                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer active:bg-muted/80 active:rounded-md active:scale-[0.98] transition"
                >
                    <Users className="h-5 w-5" />
                </button>
            </div>

            {open && dropdownPos
                ? createPortal(
                    <div
                        ref={dropdownRef}
                        style={{ position: 'fixed', top: dropdownPos.top, right: dropdownPos.right, zIndex: 9999 }}
                        className="w-56 rounded-lg border border-border bg-card p-3 shadow-lg"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Filtrar</span>
                            <div className="flex flex-col gap-1">
                                {FILTER_OPTIONS.map((opt) => {
                                    const checked = filter === opt.value
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFilter(opt.value)}
                                            className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted text-sm text-foreground w-full text-left cursor-pointer active:bg-muted/80 transition"
                                        >
                                            <span
                                                className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'
                                                    }`}
                                            >
                                                {checked ? (
                                                    <span className="h-2 w-2 rounded-full bg-primary-foreground block" />
                                                ) : null}
                                            </span>
                                            <span className="flex-1">{opt.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>,
                    document.body,
                )
                : null}
        </div>
    )
}
