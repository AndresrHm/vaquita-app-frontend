import ExpenseItem from './ExpenseItem'
import type { Expense } from './ExpenseItem'

export default function MonthSection({ month, expenses }: { month: string; expenses: Expense[] }) {
    return (
        <section>
            <div className="sticky top-0 z-10 mt-4 mb-2">
                <div className="inline-block rounded-md bg-muted/80 px-3 py-1 text-xs font-semibold text-muted-foreground">{month}</div>
            </div>

            <div className="space-y-2">
                {expenses.map((e) => (
                    <ExpenseItem key={e.id} expense={e} month={month} />
                ))}
            </div>
        </section>
    )
}
