import { useEffect, useState } from 'react'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import type { ActividadDTO } from '@/domain/actividadDTO'
import type { PageResponse } from '@/domain/pageResponse'
import ActivityCard from './ActivityCard'

interface ActivityListProps {
    searchText?: string
    tipo?: string
    desde?: string
    hasta?: string
    size?: number
}

export default function ActivityList({ searchText, tipo, desde, hasta, size = 6 }: ActivityListProps) {
    const { showToast } = useToast()
    const [actividades, setActividades] = useState<ActividadDTO[]>([])
    const [page, setPage] = useState(0)
    const [pageInfo, setPageInfo] = useState<Omit<PageResponse<ActividadDTO>, 'content'> | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadActividades = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const { actividadService } = await import('@/service/activityService')
                const result = await actividadService.obtenerActividades({
                    searchText,
                    tipo: tipo as any,
                    desde,
                    hasta,
                    page,
                    size,
                })
                setActividades(result.content)
                setPageInfo({
                    page: result.page,
                    size: result.size,
                    totalElements: result.totalElements,
                    totalPages: result.totalPages,
                    hasNext: result.hasNext,
                })
            } catch (err) {
                const mensaje = getMensajeError(err)
                showToast(mensaje, 'error')
                setError(err instanceof Error ? err.message : 'Error cargando actividades')
                setActividades([])
            } finally {
                setIsLoading(false)
            }
        }

        loadActividades()
    }, [searchText, tipo, desde, hasta, page, size])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Cargando actividades...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <div className="text-sm text-destructive">Error: {error}</div>
            </div>
        )
    }

    if (actividades.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
                <div className="text-sm font-medium text-foreground">
                    No hay actividades
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                    Las nuevas actividades aparecerán acá
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col">
            {/* LISTA SCROLLEABLE */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1 pb-4">
                {actividades.map((actividad) => (
                    <ActivityCard
                        key={actividad.id}
                        actividad={actividad}
                    />
                ))}
            </div>

            {/* PAGINACIÓN FIJA */}
            {pageInfo && pageInfo.totalPages > 1 && (
                <div
                    className="
        sticky
        bottom-0
        mt-3
        flex
        shrink-0
        items-center
        justify-between
        border-t
        border-border
        bg-bg/70
        px-2
        pt-4
        pb-1
        backdrop-blur
    "
                >
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="rounded px-3 py-1 text-sm font-medium transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <div className="text-xs text-muted-foreground">
                        Página {pageInfo.page + 1} de {pageInfo.totalPages}
                    </div>

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!pageInfo.hasNext}
                        className="rounded px-3 py-1 text-sm font-medium transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}
