export type GroupAnalyticsDateRange = {
  desde: string
  hasta: string
}

export type GroupAnalyticsSummary = {
  totalGastado: number
  cantidadGastos: number
  promedioPorGasto: number
}

export type GroupAnalyticsByMonth = {
  mes: string
  total: number
}

export type GroupAnalyticsByCategory = {
  categoria: string
  total: number
}

export type GroupAnalyticsByPayer = {
  pagadorId: number
  pagadorNombre: string
  total: number
}

export type GroupAnalyticsBalance = {
  usuarioId: number
  usuarioNombre: string
  saldo: number
}

export type GroupAnalyticsDTO = {
  grupoId: number
  grupoNombre: string
  rango: GroupAnalyticsDateRange
  resumen: GroupAnalyticsSummary
  porMes: GroupAnalyticsByMonth[]
  porCategoria: GroupAnalyticsByCategory[]
  porPagador: GroupAnalyticsByPayer[]
  balances: GroupAnalyticsBalance[]
}
