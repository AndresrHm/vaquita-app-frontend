import { ExpensesFilterTabs } from '@/domain/expenseItemDTO'
import { CategoriaGasto } from '@/domain/enums/categoriaGasto'

import type { FilterState, SortOption } from './types'

export const PAGE_SIZE = 10
export const SEARCH_DEBOUNCE_MS = 500
export const MIN_SEARCH_CHARACTERS = 3

export const sortOptions = [
  { value: 'NOMBRE_ASC', label: 'Nombre: A a Z' },
  { value: 'NOMBRE_DESC', label: 'Nombre: Z a A' },
  { value: 'CREADOR_ASC', label: 'Creador: A a Z' },
  { value: 'CREADOR_DESC', label: 'Creador: Z a A' },
  { value: 'FECHA_ASC', label: 'Fecha: antigua a reciente' },
  { value: 'FECHA_DESC', label: 'Fecha: reciente a antigua' },
] satisfies SortOption[]

export const INITIAL_FILTERS: FilterState = {
  vista: ExpensesFilterTabs.TODOS,
  fechaIni: '',
  fechaFin: '',
  rangoIni: '',
  rangoFin: '',
  categoria: [],
}

export const categoryOptions = [
  { id: CategoriaGasto.COMIDA, label: 'Comida' },
  { id: CategoriaGasto.BEBIDA, label: 'Bebida' },
  { id: CategoriaGasto.HOGAR, label: 'Hogar' },
  { id: CategoriaGasto.TRANSPORTE, label: 'Transporte' },
  { id: CategoriaGasto.SUPERMERCADO, label: 'Supermercado' },
  { id: CategoriaGasto.ENTRETENIMIENTO, label: 'Entretenimiento' },
  { id: CategoriaGasto.VARIOS, label: 'Varios' },
  { id: CategoriaGasto.OTROS, label: 'Otros' },
]

export const categoryLabelById = categoryOptions.reduce<Record<CategoriaGasto, string>>((acc, category) => {
  acc[category.id] = category.label
  return acc
}, {} as Record<CategoriaGasto, string>)
