import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { GroupAnalyticsDTO } from '@/domain/groupAnalytics'
import { obtenerAnalyticsGrupo } from '@/service/groupsService'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import { formatCurrency } from '@/utils/formatCurrency'

type GroupAnalyticsModalProps = {
  isOpen: boolean
  groupId: number
  groupName?: string
  onClose: () => void
  initialDesde?: string
  initialHasta?: string
}

const CHART_COLORS = ['#0f766e', '#ea580c', '#0369a1', '#be123c', '#6d28d9', '#65a30d']

const monthFormatter = new Intl.DateTimeFormat('es-AR', {
  month: 'short',
  year: '2-digit',
})

function getDefaultDateRange() {
  const now = new Date()
  const hasta = now.toISOString().slice(0, 10)
  const desdeDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const desde = desdeDate.toISOString().slice(0, 10)

  return { desde, hasta }
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number)
  if (!year || !month) return monthKey

  return monthFormatter.format(new Date(year, month - 1, 1))
}

export default function GroupAnalyticsModal({
  isOpen,
  groupId,
  groupName,
  onClose,
  initialDesde,
  initialHasta,
}: GroupAnalyticsModalProps) {
  const { showToast } = useToast()
  const defaultRange = useMemo(() => getDefaultDateRange(), [])

  const [desde, setDesde] = useState(initialDesde || defaultRange.desde)
  const [hasta, setHasta] = useState(initialHasta || defaultRange.hasta)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<GroupAnalyticsDTO | null>(null)

  useEffect(() => {
    if (!isOpen) return

    setDesde(initialDesde || defaultRange.desde)
    setHasta(initialHasta || defaultRange.hasta)
  }, [defaultRange.desde, defaultRange.hasta, initialDesde, initialHasta, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const loadAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await obtenerAnalyticsGrupo(groupId, desde, hasta)
        setData(response)
      } catch (err) {
        const mensaje = getMensajeError(err)
        showToast(mensaje, 'error')
        setError('No se pudieron cargar los graficos del grupo.')
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    void loadAnalytics()
  }, [desde, groupId, hasta, isOpen, showToast])

  if (!isOpen) return null

  const hasData = !!data && data.resumen.cantidadGastos > 0

  return (
    <div className="fixed inset-0 z-70 bg-black/45 p-2 sm:p-6" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute left-1/2 top-1/2 flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:w-full sm:max-h-[calc(100dvh-3rem)]"
      >
        <div className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground">Graficos del grupo</h3>
            <p className="mt-1 text-xs text-muted-foreground">{groupName ? `Analitica de ${groupName}` : `Grupo ${groupId}`}</p>
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
              No hay gastos para el rango seleccionado.
            </div>
          ) : null}

          {!isLoading && !error && hasData && data ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Total gastado</p>
                  <p className="mt-1 text-2xl font-semibold leading-none text-foreground sm:text-lg">{formatCurrency(data.resumen.totalGastado)}</p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Cantidad de gastos</p>
                  <p className="mt-1 text-2xl font-semibold leading-none text-foreground sm:text-lg">{data.resumen.cantidadGastos}</p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Promedio por gasto</p>
                  <p className="mt-1 text-2xl font-semibold leading-none text-foreground sm:text-lg">{formatCurrency(data.resumen.promedioPorGasto)}</p>
                </div>
              </div>

              <section className="rounded-xl border border-border p-3">
                <h4 className="mb-2 text-sm font-semibold text-foreground">Evolucion mensual</h4>
                <div className="h-52 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.porMes.map((item) => ({ ...item, mesLabel: formatMonthLabel(item.mes) }))}
                      margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mesLabel" tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={72} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line type="monotone" dataKey="total" stroke="#0f766e" strokeWidth={2} dot />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-border p-3">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Distribucion por categoria</h4>
                  <div className="h-52 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.porCategoria}
                          dataKey="total"
                          nameKey="categoria"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={2}
                        >
                          {data.porCategoria.map((item, index) => (
                            <Cell key={item.categoria} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="rounded-xl border border-border p-3">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Top pagadores por monto</h4>
                  <div className="h-52 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.porPagador} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="pagadorNombre" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={72} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="total" fill="#0369a1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </div>

              <section className="rounded-xl border border-border p-3">
                <h4 className="mb-2 text-sm font-semibold text-foreground">Balance por integrante</h4>
                <div className="h-52 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.balances} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="usuarioNombre" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(value) => formatCurrency(Number(value))} width={72} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="saldo" radius={[6, 6, 0, 0]}>
                        {data.balances.map((item) => (
                          <Cell key={item.usuarioId} fill={item.saldo >= 0 ? '#0f766e' : '#be123c'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
