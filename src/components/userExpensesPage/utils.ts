import type { ExpenseFiltersDTO } from '@/domain/expenseItemDTO'

import { PAGE_SIZE } from './constants'
import type { FilterState } from './types'

export function normalizeTextOrNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function normalizeNumberOrNull(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) return null

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null
}

export function formatDateFromApi(date: string): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat('es-AR').format(parsed)
}

export function buildRequestFilters(filters: FilterState, search: string, page: number): ExpenseFiltersDTO {
  return {
    fechaIni: normalizeTextOrNull(filters.fechaIni),
    fechaFin: normalizeTextOrNull(filters.fechaFin),
    amigoID: null,
    search: normalizeTextOrNull(search),
    rangoIni: normalizeNumberOrNull(filters.rangoIni),
    rangoFin: normalizeNumberOrNull(filters.rangoFin),
    page,
    size: PAGE_SIZE,
    categoria: filters.categoria.length > 0 ? filters.categoria : null,
    vista: filters.vista,
  }
}
