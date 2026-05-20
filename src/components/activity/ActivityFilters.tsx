/// <reference types="react" />
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Filter, Search, X } from 'lucide-react'
import type { TipoActividad } from '@/domain/enums/tipoActividad'
import { TipoActividad as TipoActividadEnum, TipoActividadLabel } from '@/domain/enums/tipoActividad'
import { debounce, SEARCH_DEBOUNCE_MS } from '@/lib/utils'

interface ActivityFiltersProps {
    onFilterChange: (filters: ActivityFiltersState) => void
}

export interface ActivityFiltersState {
    searchText: string
    tipo?: TipoActividad
    desde?: string
    hasta?: string
}

export default function ActivityFilters({ onFilterChange }: ActivityFiltersProps) {
    const [searchText, setSearchText] = useState('')
    const [selectedTipo, setSelectedTipo] = useState<TipoActividad | undefined>()
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null)

    useEffect(() => {
        function onDoc(e: globalThis.Event) {
            const target = e.target as globalThis.Element
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

    const debouncedFilterChange = useMemo(
        () => debounce((text: string, tipo?: TipoActividad) => {
            onFilterChange({ searchText: text, tipo })
        }, SEARCH_DEBOUNCE_MS),
        [onFilterChange],
    )

    useEffect(() => {
        return () => {
            debouncedFilterChange.cancel()
        }
    }, [debouncedFilterChange])

    const handleSearch = useCallback(
        (text: string) => {
            setSearchText(text)
            debouncedFilterChange(text, selectedTipo)
        },
        [selectedTipo, debouncedFilterChange],
    )

    const handleTipoChange = useCallback(
        (tipo: TipoActividad | undefined) => {
            debouncedFilterChange.cancel()
            setSelectedTipo(tipo)
            onFilterChange({ searchText, tipo })
        },
        [searchText, onFilterChange, debouncedFilterChange],
    )

    const handleClear = useCallback(() => {
        debouncedFilterChange.cancel()
        setSearchText('')
        setSelectedTipo(undefined)
        onFilterChange({ searchText: '', tipo: undefined })
    }, [debouncedFilterChange, onFilterChange])

    const hasFilters = searchText || selectedTipo

    return (
        <div ref={containerRef} className="relative space-y-3">
            <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2 hover:bg-muted transition">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        className="inline-flex items-center justify-center p-1 text-muted-foreground"
                        aria-label="Buscar"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                    <input
                        type="text"
                        placeholder="Buscar movimientos"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                    {searchText && (
                        <button
                            type="button"
                            onClick={() => handleSearch('')}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={open}
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen((v) => !v)
                        }}
                        className={`ml-2 inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:text-foreground cursor-pointer active:bg-muted/80 active:rounded-md active:scale-[0.98] transition ${open ? 'bg-muted/70' : 'hover:bg-muted'}`}
                        aria-label="Abrir filtros"
                    >
                        <Filter className="h-4 w-4" />
                    </button>
                </label>
            </div>

            {open && dropdownPos
                ? createPortal(
                    <div
                        ref={dropdownRef}
                        style={{ position: 'fixed', top: dropdownPos.top, right: dropdownPos.right, zIndex: 9999 }}
                        className="w-56 rounded-lg border border-border bg-card p-3 shadow-lg"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Tipo de actividad</span>
                            <div className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleTipoChange(undefined)}
                                    className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted text-sm text-foreground w-full text-left cursor-pointer active:bg-muted/80 transition"
                                >
                                    <span
                                        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${!selectedTipo ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}`}
                                    >
                                        {!selectedTipo ? <span className="h-2 w-2 rounded-full bg-primary-foreground block" /> : null}
                                    </span>
                                    <span className="flex-1">Todos</span>
                                </button>

                                {Object.values(TipoActividadEnum).map((tipo) => {
                                    const checked = selectedTipo === tipo
                                    return (
                                        <button
                                            key={tipo}
                                            type="button"
                                            onClick={() => handleTipoChange(tipo)}
                                            className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted text-sm text-foreground w-full text-left cursor-pointer active:bg-muted/80 transition"
                                        >
                                            <span
                                                className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}`}
                                            >
                                                {checked ? <span className="h-2 w-2 rounded-full bg-primary-foreground block" /> : null}
                                            </span>
                                            <span className="flex-1">{TipoActividadLabel[tipo]}</span>
                                        </button>
                                    )
                                })}
                            </div>
                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="mt-1 rounded-md border border-border px-2 py-2 text-left text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    </div>,
                    document.body,
                )
                : null}
        </div>
    )
}
