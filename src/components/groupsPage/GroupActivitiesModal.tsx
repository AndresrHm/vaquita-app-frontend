import { useEffect, useState } from 'react'

import ActivityCard from '@/components/activity/ActivityCard'
import Modal from '@/components/common/modal'

import { useToast } from '@/customHooks/useToast'

import type { ActividadDTO } from '@/domain/actividadDTO'
import type { PageResponse } from '@/domain/pageResponse'

import { actividadService } from '@/service/activityService'

import { getMensajeError } from '@/utils/getMensajeError'

type GroupActivitiesModalProps = {
  isOpen: boolean
  groupId: number
  groupName?: string
  onClose: () => void
}

export default function GroupActivitiesModal({
  isOpen,
  groupId,
  groupName,
  onClose,
}: GroupActivitiesModalProps) {
  const { showToast } = useToast()

  const [page, setPage] = useState(0)

  const [activities, setActivities] = useState<ActividadDTO[]>([])

  const [pageInfo, setPageInfo] =
    useState<Omit<PageResponse<ActividadDTO>, 'content'> | null>(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setPage(0)
    }
  }, [isOpen, groupId])

  useEffect(() => {
    if (!isOpen) return

    const loadActivities = async () => {
      try {
        setLoading(true)
        setError(null)

        const result =
          await actividadService.obtenerActividadesPorGrupo(
            groupId,
            page,
            5,
          )

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

        setError(
          err instanceof Error
            ? err.message
            : 'Error cargando actividades del grupo',
        )

        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    void loadActivities()
  }, [groupId, isOpen, page, showToast])

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      title="Actividad del grupo"
      onClose={onClose}
    >
      <div className="flex max-h-[75vh] flex-col overflow-hidden">
        {/* Header */}
        <div className="mb-4 rounded-xl border border-border bg-card/70 p-4">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Historial de actividad
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {groupName
              ? `Movimientos y actividad de ${groupName}`
              : `Grupo ${groupId}`}
          </p>
        </div>

        {/* Content */}
        <div className="h-[420px] sm:h-[500px] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex h-[320px] items-center justify-center rounded-2xl border border-border bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Cargando actividades...
              </div>
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
                <ActivityCard
                  key={actividad.id}
                  actividad={actividad}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {pageInfo && pageInfo.totalPages > 1 && (
          <div className="mt-4 flex shrink-0 items-center justify-between rounded-xl border border-border bg-card/70 px-4 py-3 backdrop-blur">
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.max(0, current - 1),
                )
              }
              disabled={page === 0 || loading}
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <div className="text-sm font-medium text-muted-foreground">
              Página{' '}
              <span className="text-foreground">
                {pageInfo.page + 1}
              </span>{' '}
              de{' '}
              <span className="text-foreground">
                {pageInfo.totalPages}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setPage((current) => current + 1)
              }
              disabled={!pageInfo.hasNext || loading}
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}