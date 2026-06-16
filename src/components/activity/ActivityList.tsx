import { useEffect, useState } from 'react'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import type { ActividadDTO } from '@/domain/actividadDTO'
import type { PageResponse } from '@/domain/pageResponse'
import ActivityCard, { ActivityCardSkeleton } from './ActivityCard'
import { AppPagination } from '../common/pagination'

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

    const handlePageChange = (nextPage: number) => {
        if (isLoading || nextPage === page) return

        setPage(nextPage)
    }

    useEffect(() => {
        const loadActividades = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const { actividadService } = await import('@/service/activityService')
                const result = await actividadService.obtenerActividades({
                    searchText,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }, [searchText, tipo, desde, hasta, page, size, showToast])

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: size }).map((_, i) => <ActivityCardSkeleton key={i} />)}
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

            {/* PAGINACIÓN */}
            {pageInfo && pageInfo.totalPages > 1 && (
                <div className="flex justify-center pt-3">
                    <div className="max-w-md overflow-x-auto">
                        <AppPagination
                            page={page}
                            totalPages={pageInfo.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}