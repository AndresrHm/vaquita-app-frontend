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
        try {
            const { data } = await api.get('/gasto/me/deuda');
            
            // Guardamos la deuda actualizada
            localStorage.setItem('cache_deuda_usuario', data.toString());
            
            return data;
        } catch (error: any) {
            if (!navigator.onLine || error.message === 'Network Error') {
                const deudaGuardada = localStorage.getItem('cache_deuda_usuario');
                
                if (deudaGuardada) {
                return Number(deudaGuardada); // Lo devolvemos como número
                }
            }
            throw error;
        }
    }

    async getExpensesFiltered(
        filtros: ExpenseFiltersDTO,
        page: number,
        size: number,
        userId: number,
        orden: OrderMethodExpenses = 'NOMBRE_ASC',
        flagDiff: ExpensesFilterTabs = ExpensesFilterTabs.TODOS
    ): Promise<PageResponse<ExpenseFilteredJSON>> {
        const params = {
            userId,
            page: filtros.page ?? page,
            size: filtros.size ?? size,
            orden,
            vista: filtros.vista ?? flagDiff,
            categoria: filtros.categoria ?? undefined,
            fechaInicio: filtros.fechaIni ?? undefined,
            fechaFin: filtros.fechaFin ?? undefined,
            amigoID: filtros.amigoID ?? undefined,
            search: filtros.search ?? undefined,
            rangoIni: filtros.rangoIni ?? undefined,
            rangoFin: filtros.rangoFin ?? undefined,
        }
        console.log('Fetching expenses with params:', params)

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