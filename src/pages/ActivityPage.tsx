import { Search } from 'lucide-react'
import PageTitle from '@/components/common/pageTitle'
import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'
import UserExpensesButton from '@/components/accountPage/UserExpensesButton'

const mockActivity = [
  { id: 'a1', title: 'Ticket escaneado', detail: 'Fotocopias - $3.200', date: 'Hoy' },
  { id: 'a2', title: 'Reparto automático', detail: '3 miembros - saldo actualizado', date: 'Ayer' },
  { id: 'a3', title: 'Pago registrado', detail: 'Martín - $1.200', date: 'Hace 3 días' },
]

export default function ActivityPage() {
  return (
    <div className="space-y-4">
      <PageTitle title="Actividad" subtitle="Resumen de movimientos (mock)." />
      <UserExpensesButton />
      <ColumnContainer>
        {/* Search movimientos */}
        <label className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar movimientos"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
          {mockActivity.map((item) => (
            <Card key={item.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.detail}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">{item.date}</div>
              </div>
            </Card>
          ))}
        </div>
      </ColumnContainer>
    </div>
  )
}

