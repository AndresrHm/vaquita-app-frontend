export type AnalyticsDateRange = {
  desde: string
  hasta: string
}

export type ExpensesAnalyticsSummary = {
  totalGastado: number
  cantidadGastos: number
  promedioPorGasto: number
}

export type ExpensesByMonth = {
  mes: string
  total: number
}

export type ExpensesByCategory = {
  categoria: string
  total: number
}

export type ExpensesByGroup = {
  grupoId: number
  grupoNombre: string
  total: number
}

export type ExpensesByPayer = {
  pagadorId: number
  pagadorNombre: string
  total: number
}

export type ExpensesAnalyticsDTO = {
  rango: AnalyticsDateRange
  resumen: ExpensesAnalyticsSummary
  porMes: ExpensesByMonth[]
  porCategoria: ExpensesByCategory[]
  porGrupo: ExpensesByGroup[]
  porPagador: ExpensesByPayer[]
}
