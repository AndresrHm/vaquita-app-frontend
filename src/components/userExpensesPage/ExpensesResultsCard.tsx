import ExpenseCard from '@/components/common/expenseCard'
import Card from '@/components/common/card'
import { AppPagination } from '@/components/common/pagination'

import type { ExpenseCardViewModel } from './types'

type ExpensesResultsCardProps = {
  loading: boolean
  error: string | null
  totalElements: number
  totalPages: number
  page: number
  expenses: ExpenseCardViewModel[]
  onPageChange: (nextPage: number) => void
}

export default function ExpensesResultsCard({
  loading,
  error,
  totalElements,
  totalPages,
  page,
  expenses,
  onPageChange,
}: ExpensesResultsCardProps) {
  return (
    <Card className="rounded-2xl border border-border/70 bg-background/80 p-4" interactive={false}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Resultados</h3>
          </div>
          <p className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{totalElements} gasto(s)</p>
        </div>

        {loading ? (
          <p className="rounded-xl border border-border px-3 py-6 text-center text-sm text-muted-foreground">Cargando gastos...</p>
        ) : error ? (
          <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-6 text-center text-sm text-destructive">
            {error}
          </p>
        ) : expenses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
            No hay gastos para los filtros seleccionados.
          </p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="space-y-1">
                <ExpenseCard
                  title={expense.title}
                  group={expense.payer}
                  groupLabel="Pagador"
                  category={expense.category}
                  date={expense.date}
                  amountToPay={expense.amountToPay}
                />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="pt-1">
            <AppPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
        ) : null}
      </div>
    </Card>
  )
}
