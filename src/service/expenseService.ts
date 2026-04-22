import api from './apiToken' 
import type { ActionResponse } from '@/types/actionResponse'
import type { Expense, ExpenseFilteredJSON } from '@/domain/expense'
import { getAxiosData } from './common'
import { ExpensesFilterTabs, type ExpenseFiltersDTO, type OrderMethodExpenses } from '@/domain/expenseItemDTO'
import type { PageResponse } from '@/domain/pageResponse'

class ExpenseService {
    async createExpense(expense: Expense): Promise<ActionResponse> {
        return getAxiosData(() =>
            api.post<ActionResponse>('/gasto', expense.toJSON())
        )
    }

    async getUserDebt(): Promise<number> {
        return getAxiosData(() =>
            api.get<number>('/gasto/me/deuda')
        )
    }

    async getExpensesFiltered(
        filtros: ExpenseFiltersDTO,
        page: number,
        size: number,
        orden: OrderMethodExpenses = 'NOMBRE_ASC',
        flagDiff: ExpensesFilterTabs = ExpensesFilterTabs.GENERAL
    ): Promise<PageResponse<ExpenseFilteredJSON>> {
        const params = {
            page: filtros.page ?? page,
            size: filtros.size ?? size,
            orden,
            vista: filtros.vista && filtros.vista !== ExpensesFilterTabs.GENERAL
                ? filtros.vista
                : (flagDiff !== ExpensesFilterTabs.GENERAL ? flagDiff : undefined),
            categoria: filtros.categoria ?? undefined,
            fechaInicio: filtros.fechaIni ?? undefined,
            fechaFin: filtros.fechaFin ?? undefined,
            amigoID: filtros.amigoID ?? undefined,
            search: filtros.search ?? undefined,
            rangoIni: filtros.rangoIni ?? undefined,
            rangoFin: filtros.rangoFin ?? undefined,
        }

        const obtenerGastosFiltradosQuery = () => api.get<PageResponse<ExpenseFilteredJSON>>('/gasto/filtrar', {
            params,
            paramsSerializer: {
                indexes: null,
            },
        })
        return getAxiosData(obtenerGastosFiltradosQuery)
    }
}

export const expenseService = new ExpenseService()