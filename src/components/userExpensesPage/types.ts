import type { OrderMethodExpenses } from '@/domain/expenseItemDTO'
import { ExpensesFilterTabs } from '@/domain/expenseItemDTO'
import { CategoriaGasto } from '@/domain/enums/categoriaGasto'

export type SortOption = {
  value: OrderMethodExpenses
  label: string
}

export type SortValue = OrderMethodExpenses

export type FilterState = {
  vista: ExpensesFilterTabs
  fechaIni: string
  fechaFin: string
  rangoIni: string
  rangoFin: string
  categoria: CategoriaGasto[]
}

export type ExpenseCardViewModel = {
  id: string
  title: string
  payer: string
  category: string
  date: string
  amountToPay: number

}
