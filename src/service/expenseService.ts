import axios from 'axios'
import type { ActionResponse } from '@/types/actionResponse'
import type { Expense, ExpenseFilteredJSON } from '@/domain/expense'
import { REST_SERVER_URL } from './configurations'
import { getAxiosData } from './common'
import { ExpensesFilterTabs, type ExpenseFiltersDTO, type OrderMethodExpenses } from '@/domain/expenseItemDTO'
import type { PageResponse } from '@/domain/pageResponse'

class ExpenseService {
    async createExpense(expense: Expense): Promise<ActionResponse> {
        return getAxiosData(() =>
            axios.post<ActionResponse>(
                `${REST_SERVER_URL}/gasto`,
                expense.toJSON()
            )
        )
    }

    async getUserDebt(userId: number): Promise<number> {
        return getAxiosData(() =>
            axios.get<number>(
                `${REST_SERVER_URL}/gasto/${userId}`
            )
        )
    }

    async getExpensesFiltered(
        filtros: ExpenseFiltersDTO,
        page: number,
        size: number,
        user: number,
        orden: OrderMethodExpenses = 'NOMBRE_ASC',
        flagDiff: ExpensesFilterTabs = ExpensesFilterTabs.GENERAL
    ): Promise<PageResponse<ExpenseFilteredJSON>> {
        const params = {
            page: filtros.page ?? page,
            size: filtros.size ?? size,
            userId: user,
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

        const obtenerGastosFiltradosQuery = () => axios.get<PageResponse<ExpenseFilteredJSON>>(REST_SERVER_URL + '/gasto/filtrar', {
            params,
            paramsSerializer: {
                indexes: null,
            },
        })
        return getAxiosData(obtenerGastosFiltradosQuery)
    }
}

export const expenseService = new ExpenseService()
