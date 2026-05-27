export type ActivityAnalyticsDateRange = {
  desde: string
  hasta: string
}

export type ActivityAnalyticsSummary = {
  totalActividades: number
  actividadesPorDia: number
}

export type ActivityAnalyticsByType = {
  tipo: string
  cantidad: number
}

export type ActivityAnalyticsByDay = {
  fecha: string
  cantidad: number
}

export type ActivityAnalyticsByGroup = {
  grupoId: number
  grupoNombre: string
  cantidad: number
}

export type ActivityAnalyticsDTO = {
  rango: ActivityAnalyticsDateRange
  resumen: ActivityAnalyticsSummary
  porTipo: ActivityAnalyticsByType[]
  porDia: ActivityAnalyticsByDay[]
  porGrupo: ActivityAnalyticsByGroup[]
}
