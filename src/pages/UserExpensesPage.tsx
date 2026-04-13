import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'
import PageTitle from '@/components/common/pageTitle'
import { Button } from '@/components/ui/button'

const createdExpenses = [
  {
    id: 'e1',
    title: 'Supermercado con amigos',
    date: '08/04/2026',
    group: 'Depto Palermo',
    category: 'Comida',
    amount: 18450,
    currency: '$',
  },
  {
    id: 'e2',
    title: 'Combustible del viaje',
    date: '05/04/2026',
    group: 'Viaje a Bariloche',
    category: 'Transporte',
    amount: 27900,
    currency: '$',
  },
  {
    id: 'e3',
    title: 'Cena de cumpleaños',
    date: '02/04/2026',
    group: 'Cumple Juan',
    category: 'Salidas',
    amount: 12600,
    currency: '$',
  },
  {
    id: 'e4',
    title: 'Materiales para oficina',
    date: '28/03/2026',
    group: 'Gastos Oficina',
    category: 'Trabajo',
    amount: 8400,
    currency: '$',
  },
]

const participatedExpenses = [
  {
    id: 'p1',
    title: 'Alquiler del mes',
    date: '07/04/2026',
    group: 'Depto Palermo',
    category: 'Vivienda',
    amount: 68000,
    currency: '$',
    relation: 'Participás en el grupo',
  },
  {
    id: 'p2',
    title: 'Merienda de comisión',
    date: '04/04/2026',
    group: 'Cátedra - Comisión 2',
    category: 'Comida',
    amount: 9600,
    currency: '$',
    relation: 'Participás en el grupo',
  },
  {
    id: 'p3',
    title: 'Regalo de cumpleaños',
    date: '01/04/2026',
    group: 'Cumple Juan',
    category: 'Regalos',
    amount: 22000,
    currency: '$',
    relation: 'Participás en el grupo',
  },
]

function ExpenseListSection({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: Array<{
    id: string
    title: string
    date: string
    group: string
    category: string
    amount: number
    currency: string
    relation?: string
  }>
}) {
  return (
    <section className="space-y-2">
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      </div>

      <div className="space-y-3">
        {items.map((expense) => (
          <Card key={expense.id} className="rounded-xl px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-foreground">{expense.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {expense.group} · {expense.category}
                </div>
                {expense.relation && <div className="mt-1 text-[11px] text-muted-foreground">{expense.relation}</div>}
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  {expense.currency} {expense.amount.toLocaleString('es-AR')}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{expense.date}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default function UserExpensesPage() {
  return (
    <div className="space-y-4">
      <PageTitle title="Mis gastos" subtitle="Gastos creados por vos y también los grupos donde participás (mock).">
        <Button asChild variant="ghost" size="sm" className="rounded-full px-3">
          <Link to="/account">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
      </PageTitle>

      <ColumnContainer>
        <div className="text-xs text-muted-foreground">Información temporal hasta conectar el backend.</div>

        <Card className="rounded-2xl border border-border/70 bg-background/80 px-4 py-4 shadow-sm">
          <ExpenseListSection
            title="Creados por vos"
            description="Gastos que cargaste manualmente."
            items={createdExpenses}
          />
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-background/80 px-4 py-4 shadow-sm">
          <ExpenseListSection
            title="Donde participás"
            description="Gastos creados por otras personas dentro de grupos en los que aparecés."
            items={participatedExpenses}
          />
        </Card>
      </ColumnContainer>
    </div>
  )
}