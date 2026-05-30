import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { actividadService } from '@/service/activityService'
import type { ActivityAnalyticsDTO } from '@/domain/activityAnalytics'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'

type ActivityChartsModalProps = {
  isOpen: boolean
  onClose: () => void
  initialDesde?: string
  initialHasta?: string
}

const dayFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
})

function getDefaultDateRange() {
  const now = new Date()
  const hasta = now.toISOString().slice(0, 10)
  const desdeDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const desde = desdeDate.toISOString().slice(0, 10)

  return { desde, hasta }
}

function formatDayLabel(dateKey: string) {
  const date = new Date(dateKey)
  if (Number.isNaN(date.getTime())) return dateKey
  return dayFormatter.format(date)
}

export default function ActivityChartsModal({ isOpen, onClose, initialDesde, initialHasta }: ActivityChartsModalProps) {
  const { showToast } = useToast()
  const defaultRange = useMemo(() => getDefaultDateRange(), [])

  const [desde, setDesde] = useState(initialDesde || defaultRange.desde)
  const [hasta, setHasta] = useState(initialHasta || defaultRange.hasta)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ActivityAnalyticsDTO | null>(null)

  useEffect(() => {
    if (!isOpen) return

    setDesde(initialDesde || defaultRange.desde)
    setHasta(initialHasta || defaultRange.hasta)
  }, [defaultRange.desde, defaultRange.hasta, initialDesde, initialHasta, isOpen])

  useEffect(() => {
    if (!isOpen) return

    if (desde && hasta && desde > hasta) {
      setError('El rango de fechas es invalido: "Desde" no puede ser mayor que "Hasta".')
      setData(null)
      return
    }

    const loadAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await actividadService.obtenerAnalytics(desde, hasta)
        setData(response)
      } catch (err) {
        const mensaje = getMensajeError(err)
        showToast(mensaje, 'error')
        setError(mensaje)
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    void loadAnalytics()
  }, [desde, hasta, isOpen, showToast])

  if (!isOpen) return null

  const hasData = !!data && data.resumen.totalActividades > 0

  return (
    <div className="fixed inset-0 z-70 bg-black/45 p-2 sm:p-6" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute left-1/2 top-1/2 flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:w-full sm:max-h-[calc(100dvh-3rem)]"
      >
        <div className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground">Graficos de actividad</h3>
            <p className="mt-1 text-xs text-muted-foreground">Analitica por tipo, dia y grupo.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid shrink-0 gap-3 border-b border-border px-4 py-3 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
          <label className="space-y-1 text-xs text-muted-foreground">
            Desde
            <input
              type="date"
              value={desde}
              onChange={(event) => setDesde(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            />
          </label>

          <label className="space-y-1 text-xs text-muted-foreground">
            Hasta
            <input
              type="date"
              value={hasta}
              onChange={(event) => setHasta(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            />
          </label>

          {data ? (
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground sm:col-span-2 lg:col-span-1">
              Rango backend: {data.rango.desde} - {data.rango.hasta}
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
          {isLoading ? <div className="text-sm text-muted-foreground">Cargando graficos...</div> : null}

          {!isLoading && error ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
          ) : null}

          {!isLoading && !error && !hasData ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              No hay actividad para el rango seleccionado.
            </div>
          ) : null}

          {!isLoading && !error && hasData && data ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Total de actividades</p>
                  <p className="mt-1 text-2xl font-semibold leading-none text-foreground sm:text-lg">{data.resumen.totalActividades}</p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Promedio diario</p>
                  <p className="mt-1 text-2xl font-semibold leading-none text-foreground sm:text-lg">{data.resumen.actividadesPorDia.toFixed(2)}</p>
                </div>
              </div>

              <section className="rounded-xl border border-border p-3">
                <h4 className="mb-2 text-sm font-semibold text-foreground">Actividad por dia</h4>
                <div className="h-52 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.porDia.map((item) => ({ ...item, fechaLabel: formatDayLabel(item.fecha) }))}
                      margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fechaLabel" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} width={36} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="cantidad" stroke="#0f766e" strokeWidth={2} dot />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-border p-3">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Actividad por tipo</h4>
                  <div className="h-52 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.porTipo} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tipo" interval={0} angle={-35} textAnchor="end" height={84} tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} width={36} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="cantidad" fill="#0369a1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="rounded-xl border border-border p-3">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Actividad por grupo</h4>
                  <div className="h-52 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.porGrupo} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grupoNombre" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} width={36} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="cantidad" fill="#ea580c" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
