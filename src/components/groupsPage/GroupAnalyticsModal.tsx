import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

const POSITIVE_COLOR = '#0f766e'
const NEGATIVE_COLOR = '#be123c'

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
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (abs >= 1000000) {
    return `${sign}$${(abs / 1000000).toFixed(1)}M`
  }

  if (abs >= 1000) {
    return `${sign}$${Math.round(abs / 1000)}K`
  }

  return `${sign}$${abs}`
}

function truncateLabel(value: string, max = 12) {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}

type CurrencyTooltipProps = {
  active?: boolean
  label?: string | number
  payload?: Array<{ value?: number | string }>
}

/** Tooltip con estilos del tema (legible en mobile). */
function CurrencyTooltip({ active, payload, label }: CurrencyTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const item = payload[0]

  return (
    <div className="rounded-xl border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
      {label ? (
        <p className="mb-0.5 text-xs font-medium text-muted-foreground">{label}</p>
      ) : null}
      <p className="text-sm font-semibold tabular-nums text-foreground">
        {formatCurrency(Number(item.value ?? 0))}
      </p>
    </div>
  )
}

export default function GroupAnalyticsModal({
  isOpen,
  groupId,
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

  const mesData = useMemo(
    () =>
      (data?.porMes ?? []).map((item) => ({
        ...item,
        mesLabel: formatMonthLabel(item.mes),
      })),
    [data],
  )

  const categoriaTotal = useMemo(
    () => (data?.porCategoria ?? []).reduce((acc, item) => acc + item.total, 0),
    [data],
  )

  const pagadoresOrdenados = useMemo(
    () => [...(data?.porPagador ?? [])].sort((a, b) => b.total - a.total),
    [data],
  )

  const balancesOrdenados = useMemo(
    () => [...(data?.balances ?? [])].sort((a, b) => b.saldo - a.saldo),
    [data],
  )

  if (!isOpen) return null

  const hasData = !!data && data.resumen.cantidadGastos > 0

  // Las barras horizontales crecen con la cantidad de filas para no apretarse.
  const pagadoresHeight = Math.max(160, pagadoresOrdenados.length * 40)
  const balancesHeight = Math.max(160, balancesOrdenados.length * 40)

  return (
    <Modal
      isOpen={isOpen}
      title="Estadísticas del grupo"
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card/70 p-3">
          <label className="space-y-1 text-xs font-medium text-muted-foreground">
            Desde
            <input
              type="date"
              value={desde}
              onChange={(event) => setDesde(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            />
          </label>

          <label className="space-y-1 text-xs font-medium text-muted-foreground">
            Hasta
            <input
              type="date"
              value={hasta}
              onChange={(event) => setHasta(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted/40" />
              ))}
            </div>
            <div className="h-52 animate-pulse rounded-xl bg-muted/40" />
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && !hasData ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/20 p-6 text-center text-sm text-muted-foreground">
            No hay gastos para el rango seleccionado.
          </div>
        ) : null}

        {!isLoading && !error && hasData && data ? (
          <>
            {/* Resumen (KPIs) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="overflow-hidden rounded-xl border border-border bg-card/70 p-3">
                <p className="text-[11px] leading-tight text-muted-foreground">
                  Total gastado
                </p>

                <p className="mt-1 text-[clamp(0.85rem,3.6vw,1.5rem)] font-semibold leading-tight tracking-tight tabular-nums text-foreground">
                  {formatCurrency(data.resumen.totalGastado)}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-card/70 p-3">
                <p className="text-[11px] leading-tight text-muted-foreground">
                  Cantidad de gastos
                </p>

                <p className="mt-1 text-[clamp(0.85rem,3.6vw,1.5rem)] font-semibold leading-tight tracking-tight tabular-nums text-foreground">
                  {data.resumen.cantidadGastos}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-card/70 p-3">
                <p className="text-[11px] leading-tight text-muted-foreground">
                  Promedio por gasto
                </p>

                <p className="mt-1 text-[clamp(0.85rem,3.6vw,1.5rem)] font-semibold leading-tight tracking-tight tabular-nums text-foreground">
                  {formatCurrency(data.resumen.promedioPorGasto)}
                </p>
              </div>
            </div>

            {/* Evolución mensual */}
            <section className="rounded-xl border border-border p-3 bg-card/70">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                Evolución mensual
              </h4>

              <div className="h-52 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={mesData}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="grpAreaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={POSITIVE_COLOR} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={POSITIVE_COLOR} stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="currentColor"
                      className="text-border"
                    />

                    <XAxis
                      dataKey="mesLabel"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      tickMargin={8}
                    />

                    <YAxis
                      tickFormatter={(value) => formatCompactCurrency(Number(value))}
                      tickLine={false}
                      axisLine={false}
                      width={44}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip
                      content={<CurrencyTooltip />}
                      cursor={{ stroke: POSITIVE_COLOR, strokeOpacity: 0.25 }}
                    />

                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke={POSITIVE_COLOR}
                      strokeWidth={2.5}
                      fill="url(#grpAreaFill)"
                      dot={{ r: 3, fill: POSITIVE_COLOR, strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Distribución por categoría */}
            <section className="rounded-xl border border-border p-3 bg-card/70">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                Distribución por categoría
              </h4>

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
                <div className="relative h-44 w-44 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.porCategoria}
                        dataKey="total"
                        nameKey="categoria"
                        innerRadius={52}
                        outerRadius={80}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {data.porCategoria.map((item, index) => (
                          <Cell
                            key={item.categoria}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip content={<CurrencyTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Total
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {formatCompactCurrency(categoriaTotal)}
                    </span>
                  </div>
                </div>

                {/* Leyenda propia: nombre + monto + % (legible en mobile) */}
                <ul className="w-full space-y-1.5">
                  {data.porCategoria.map((item, index) => {
                    const pct = categoriaTotal > 0 ? (item.total / categoriaTotal) * 100 : 0

                    return (
                      <li
                        key={item.categoria}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        <span className="min-w-0 flex-1 truncate text-foreground">
                          {item.categoria}
                        </span>
                        <span className="shrink-0 tabular-nums text-muted-foreground">
                          {pct.toFixed(0)}%
                        </span>
                        <span className="w-20 shrink-0 text-right text-xs tabular-nums text-foreground">
                          {formatCompactCurrency(item.total)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>

            {/* Top pagadores por monto (barras horizontales) */}
            <section className="rounded-xl border border-border p-3 bg-card/70">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                Top pagadores por monto
              </h4>

              <div style={{ height: pagadoresHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={pagadoresOrdenados}
                    margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="currentColor"
                      className="text-border"
                    />

                    <XAxis
                      type="number"
                      tickFormatter={(value) => formatCompactCurrency(Number(value))}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      type="category"
                      dataKey="pagadorNombre"
                      tickFormatter={(value) => truncateLabel(String(value))}
                      tickLine={false}
                      axisLine={false}
                      width={90}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip
                      content={<CurrencyTooltip />}
                      cursor={{ fill: 'currentColor', fillOpacity: 0.06 }}
                    />

                    <Bar
                      dataKey="total"
                      fill="#0369a1"
                      radius={[0, 6, 6, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Balance por integrante (barras horizontales) */}
            <section className="rounded-xl border border-border p-3 bg-card/70">
              <h4 className="mb-1 text-sm font-semibold text-foreground">
                Balance por integrante
              </h4>
              <p className="mb-3 text-xs text-muted-foreground">
                Verde: a favor · Rojo: en contra
              </p>

              <div style={{ height: balancesHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={balancesOrdenados}
                    margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="currentColor"
                      className="text-border"
                    />

                    <XAxis
                      type="number"
                      tickFormatter={(value) => formatCompactCurrency(Number(value))}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      type="category"
                      dataKey="usuarioNombre"
                      tickFormatter={(value) => truncateLabel(String(value))}
                      tickLine={false}
                      axisLine={false}
                      width={90}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip
                      content={<CurrencyTooltip />}
                      cursor={{ fill: 'currentColor', fillOpacity: 0.06 }}
                    />

                    <Bar dataKey="saldo" radius={[0, 6, 6, 0]} barSize={18}>
                      {balancesOrdenados.map((item) => (
                        <Cell
                          key={item.usuarioId}
                          fill={item.saldo >= 0 ? POSITIVE_COLOR : NEGATIVE_COLOR}
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
