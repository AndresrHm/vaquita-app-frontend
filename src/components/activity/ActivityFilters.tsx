import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import type { TipoActividad } from '@/domain/enums/tipoActividad'
import { TipoActividad as TipoActividadEnum } from '@/domain/enums/tipoActividad'

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
    const [isExpanded, setIsExpanded] = useState(false)

    const handleSearch = useCallback(
        (text: string) => {
            setSearchText(text)
            onFilterChange({ searchText: text, tipo: selectedTipo })
        },
        [selectedTipo, onFilterChange],
    )

    const handleTipoChange = useCallback(
        (tipo: TipoActividad | undefined) => {
            setSelectedTipo(tipo)
            onFilterChange({ searchText, tipo })
        },
        [searchText, onFilterChange],
    )

    const handleClear = useCallback(() => {
        setSearchText('')
        setSelectedTipo(undefined)
        onFilterChange({ searchText: '', tipo: undefined })
    }, [onFilterChange])

    const hasFilters = searchText || selectedTipo

    return (
        <div className="space-y-3">
            {/* Search Input */}
            <label className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar movimientos"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                {searchText && (
                    <button onClick={() => handleSearch('')} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </label>

            {/* Tipo Filter */}
            {isExpanded && (
                <div className="rounded-lg border border-border bg-background/50 p-3">
                    <div className="mb-2 text-xs font-semibold text-muted-foreground">Tipo de actividad</div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleTipoChange(undefined)}
                            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                                !selectedTipo
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                        >
                            Todos
                        </button>
                        {Object.values(TipoActividadEnum).map((tipo) => (
                            <button
                                key={tipo}
                                onClick={() => handleTipoChange(tipo)}
                                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    selectedTipo === tipo
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                            >
                                {tipo}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Toggle and Clear */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    {isExpanded ? 'Ocultar' : 'Mostrar'} filtros
                </button>
                {hasFilters && (
                    <button onClick={handleClear} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    )
}
