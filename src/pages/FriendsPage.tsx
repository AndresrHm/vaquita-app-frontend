import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

const mockFriends = [
  { id: 'u1', name: 'Lucía', role: 'Integrante', due: 2100 },
  { id: 'u2', name: 'Martín', role: 'Integrante', due: 5400 },
  { id: 'u3', name: 'Sofía', role: 'Integrante', due: 1200 },
]

export default function FriendsPage() {
  return (
    <div className="space-y-4">
      <div className="-mx-4 rounded-b-lg rounded-t-none border border-border bg-card/70 px-9 py-5 shadow-sm backdrop-blur-xl">
        <h1 className="text-lg font-semibold text-slate-900">Amigos</h1>
        <p className="mt-1 text-sm text-slate-600">Agregá y organizá participantes.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl">
        <label className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar amigos"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl">
        <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Invitaciones (mock)</h2>
          <p className="mt-1 text-sm text-slate-600">Por ahora usamos datos estáticos.</p>
          <Button className="mt-4 w-full rounded-xl" variant="secondary" type="button">
            Invitar por link
          </Button>
        </div>

        <div className="mt-3 max-h-[42vh] space-y-3 overflow-y-auto pr-1">
          {mockFriends.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{f.name}</div>
                  <div className="mt-1 text-xs text-slate-600">{f.role}</div>
                </div>
                <div className="text-right">
                  <div className="inline-flex rounded-lg border border-emerald-200/70 bg-emerald-100/70 px-2 py-1 text-sm font-semibold text-emerald-700">
                    +$ {f.due.toLocaleString('es-AR')}
                  </div>
                  <div className="mt-1 text-xs text-emerald-600">saldo a favor</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

