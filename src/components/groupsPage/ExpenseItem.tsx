import { useState } from 'react'
import ExpenseDetailModal from './ExpenseDetailModal'

export type Expense = {
    id: string
    date: { day: number; month?: string; year?: number }
    title: string
    amount: number
    currency: string
    paymentType:
    | 'paid_by_you'
    | 'paid_by_other'
    | 'split_equal'
    | 'split_unequal'
    | 'you_owe'
    | 'you_are_owed'
    imageUrl: string
    tieneTicket: boolean
}

function paymentLabel(type: Expense['paymentType']) {
    switch (type) {
        case 'paid_by_you':
            return 'Pagaste'
        case 'paid_by_other':
            return 'Pagó otro'
        case 'split_equal':
            return 'Dividido en partes iguales'
        case 'split_unequal':
            return 'Dividido de forma desigual'
        case 'you_owe':
            return 'Debés'
        case 'you_are_owed':
            return 'Te deben'
        default:
            return ''
    }
}

export default function ExpenseItem({ expense, month }: { expense: Expense; month: string }) {
    const [showDetail, setShowDetail] = useState(false)
    const short = month ? month.slice(0, 3).toLowerCase() : ''

    return (
        <>
            <button
                type="button"
                onClick={() => setShowDetail(true)}
                className="w-full flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50 active:bg-muted/70 transition text-left"
            >
                <div className="w-10 flex-shrink-0 text-center">
                    <div className="text-lg font-semibold text-foreground">{expense.date.day}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{short}</div>
                </div>

                <img src={expense.imageUrl} alt={expense.title} className="h-10 w-10 rounded-md object-cover" />

                <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{expense.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{paymentLabel(expense.paymentType)} • {expense.currency} {expense.amount.toLocaleString('es-AR')}</div>
                </div>
            </button>

            <ExpenseDetailModal isOpen={showDetail} expense={expense} onClose={() => setShowDetail(false)} />
        </>
    )
}
