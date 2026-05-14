import api from './apiToken'
import type { ExpenseItemDTO } from '@/domain/expenseItemDTO'

class ExpenseItemsService {
    async listarItems(gastoId: number): Promise<ExpenseItemDTO[]> {
        const response = await api.get('/gasto/listaItems', {
            params: { gastoId }
        })

        const data = response.data
        // Endpoint returns either an array or an object { id, nombre, items: [...] }
        if (Array.isArray(data)) return data as ExpenseItemDTO[]
        if (data && Array.isArray(data.items)) return data.items as ExpenseItemDTO[]

        return []
    }
}

export const expenseItemsService = new ExpenseItemsService()
