import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import ActivityCard from '@/components/activity/ActivityCard'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import type { ActividadDTO } from '@/domain/actividadDTO'
import type { PageResponse } from '@/domain/pageResponse'
import { actividadService } from '@/service/activityService'

type GroupActivitiesModalProps = {
  isOpen: boolean
  groupId: number
  groupName?: string
  onClose: () => void
}

export default function GroupActivitiesModal({ isOpen, groupId, groupName, onClose }: GroupActivitiesModalProps) {
  const { showToast } = useToast()
  const [page, setPage] = useState(0)
  const [activities, setActivities] = useState<ActividadDTO[]>([])
  const [pageInfo, setPageInfo] = useState<Omit<PageResponse<ActividadDTO>, 'content'> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const loadActivities = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await actividadService.obtenerActividadesPorGrupo(groupId, page, 5)

        console.log('Respuesta completa de actividades del grupo:', result)
        console.log('Contenido de actividades del grupo:', result?.content)

        setActivities(result?.content ?? [])
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
        setError(err instanceof Error ? err.message : 'Error cargando actividades del grupo')
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    void loadActivities()
  }, [groupId, isOpen, page, showToast])

  useEffect(() => {
    if (isOpen) {
      setPage(0)
    }
  }, [isOpen, groupId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-70 bg-black/45 p-3 sm:p-6">
      <div className="absolute left-1/2 top-1/2 flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-4 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-foreground">Actividades del grupo</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {groupName ? `Historial de ${groupName}` : `Grupo ${groupId}`}
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {loading ? (
            <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              Cargando actividades...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              Error: {error}
            </div>
          ) : (activities?.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              No hay actividades para mostrar.
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((actividad) => (
                <ActivityCard key={actividad.id} actividad={actividad} />
              ))}
            </div>
          )}
        </div>

        {pageInfo && pageInfo.totalPages > 1 && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-4 sm:px-5">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={page === 0}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <div className="text-xs text-muted-foreground">
              Página {pageInfo.page + 1} de {pageInfo.totalPages}
            </div>

            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!pageInfo.hasNext}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}