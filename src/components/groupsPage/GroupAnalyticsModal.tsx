import { useEffect, useMemo, useState } from 'react'
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

import Modal from '@/components/common/modal'

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

function formatCompactCurrency(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }

  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }

  return `$${value}`
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
  }, [
    defaultRange.desde,
    defaultRange.hasta,
    initialDesde,
    initialHasta,
    isOpen,
  ])

  useEffect(() => {
    if (!isOpen) return

    const loadAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await obtenerAnalyticsGrupo(
          groupId,
          desde,
          hasta,
        )

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
  }, [desde, hasta, groupId, isOpen, showToast])

  if (!isOpen) return null

  const hasData = !!data && data.resumen.cantidadGastos > 0

  return (
    <Modal
      isOpen={isOpen}
      title="Estadísticas del grupo"
      onClose={onClose}
    >
      <div className="max-h-[70vh] sm:max-h-[80vh] overflow-y-auto px-1 py-1 space-y-4">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/70 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-row gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Desde
              </label>

              <input
                type="date"
                value={desde}
                onChange={(event) => setDesde(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Hasta
              </label>

              <input
                type="date"
                value={hasta}
                onChange={(event) => setHasta(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Cargando graficos...
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && !hasData ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/20 p-4 text-sm text-muted-foreground">
            No hay gastos para el rango seleccionado.
          </div>
        ) : null}

        {!isLoading && !error && hasData && data ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card/70 p-3">
                <p className="text-xs text-muted-foreground">
                  Total gastado
                </p>

                <p className="mt-1 text-xl sm:text-2xl font-semibold leading-none text-foreground break-words">
                  {formatCurrency(data.resumen.totalGastado)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/70 p-3">
                <p className="text-xs text-muted-foreground">
                  Cantidad de gastos
                </p>

                <p className="mt-1 text-xl sm:text-2xl font-semibold leading-none text-foreground ">
                  {data.resumen.cantidadGastos}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/70 p-3">
                <p className="text-xs text-muted-foreground">
                  Promedio por gasto
                </p>

                <p className="mt-1 text-xl sm:text-2xl font-semibold leading-none text-foreground break-words">
                  {formatCurrency(data.resumen.promedioPorGasto)}
                </p>
              </div>
            </div>

            {/* Evolución mensual */}
            <section className="rounded-xl border border-border p-3 bg-card/70">
              <h4 className="mb-2 text-sm font-semibold text-foreground">
                Evolucion mensual
              </h4>

              <div className="h-52 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.porMes.map((item) => ({
                      ...item,
                      mesLabel: formatMonthLabel(item.mes),
                    }))}
                    margin={{
                      top: 8,
                      right: 4,
                      left: -10,
                      bottom: 4,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="mesLabel"
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      tickFormatter={(value) =>
                        formatCompactCurrency(Number(value))
                      }
                      width={48}
                      tick={{ fontSize: 8 }}
                    />

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(Number(value))
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#0f766e"
                      strokeWidth={2}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Distribución */}
              <section className="rounded-xl border border-border p-3 bg-card/70">
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Distribucion por categoria
                </h4>

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
                          <Cell
                            key={item.categoria}
                            fill={
                              CHART_COLORS[
                              index % CHART_COLORS.length
                              ]
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(Number(value))
                        }
                      />

                      <Legend
                        wrapperStyle={{
                          fontSize: '11px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Top pagadores */}
              <section className="rounded-xl border border-border p-3 bg-card/70">
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Top pagadores por monto
                </h4>

                <div className="h-52 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.porPagador}
                      margin={{
                        top: 8,
                        right: 4,
                        left: -10,
                        bottom: 4,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="pagadorNombre"
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={50}
                      />

                      <YAxis
                        tickFormatter={(value) =>
                          formatCompactCurrency(Number(value))
                        }
                        width={48}
                        tick={{ fontSize: 8 }}
                      />

                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(Number(value))
                        }
                      />

                      <Bar
                        dataKey="total"
                        fill="#0369a1"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            {/* Balance */}
            <section className="rounded-xl border border-border p-3 bg-card/70">
              <h4 className="mb-2 text-sm font-semibold text-foreground">
                Balance por integrante
              </h4>

              <div className="h-52 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.balances}
                    margin={{
                      top: 8,
                      right: 4,
                      left: -10,
                      bottom: 4,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="usuarioNombre"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={50}
                    />

                    <YAxis
                      tickFormatter={(value) =>
                        formatCompactCurrency(Number(value))
                      }
                      width={48}
                      tick={{ fontSize: 8 }}
                    />

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(Number(value))
                      }
                    />

                    <Bar
                      dataKey="saldo"
                      radius={[6, 6, 0, 0]}
                    >
                      {data.balances.map((item) => (
                        <Cell
                          key={item.usuarioId}
                          fill={
                            item.saldo >= 0
                              ? '#0f766e'
                              : '#be123c'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </Modal>
  )
}