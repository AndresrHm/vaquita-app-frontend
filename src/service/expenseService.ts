import axios from 'axios'
import type { ActionResponse } from '@/types/actionResponse'
import type { Expense } from '@/domain/expense'
import { REST_SERVER_URL } from './configurations'
import { getAxiosData } from './common'

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
}

export const expenseService = new ExpenseService()
