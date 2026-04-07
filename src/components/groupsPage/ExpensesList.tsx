import MonthSection from './MonthSection'
import type { Expense } from './ExpenseItem'

export type ExpensesByMonth = {
    month: string
    expenses: Expense[]
}[]

export default function ExpensesList({ data }: { data: ExpensesByMonth }) {
    return (
        <div className="space-y-4">
            {data.map((m) => (
                <MonthSection key={m.month} month={m.month} expenses={m.expenses} />
            ))}
        </div>
    )
}
