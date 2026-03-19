import { Search } from 'lucide-react'

const mockGroups = [
  { id: 'g1', name: 'Centro de Estudiantes', status: 'Pendiente de pago', outstanding: 12400, currency: '$', imageUrl: '' },
  { id: 'g2', name: 'Cátedra - Comisión 2', status: 'Parcialmente pagada', outstanding: 7800, currency: '$', imageUrl: '' },
  { id: 'g3', name: 'Viaje de Fin de Año', status: 'Pagada', outstanding: 0, currency: '$', imageUrl: '' },
]

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function GroupsPage() {
  return (
    <div className="space-y-4">
      <div className="-mx-4 rounded-b-lg rounded-t-none border border-border bg-card/70 px-9 py-5 shadow-sm backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Grupos</h1>
            <p className="mt-1 text-sm text-slate-600">Administrá deudas compartidas.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl">
        <label className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar grupos"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur-xl">
        <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
          {mockGroups.map((g) => (
            <div
              key={g.id}
              className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {g.imageUrl ? (
                    <img
                      src={g.imageUrl}
                      alt={g.name}
                      className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-muted/80 text-xs font-semibold text-muted-foreground">
                      {getInitials(g.name)}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{g.name}</div>
                    <div className="mt-1 text-xs text-slate-600">{g.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  {g.outstanding > 0 ? (
                    <>
                      <div className="inline-flex rounded-lg border border-red-200/70 bg-red-100/70 px-1.5 py-0.5 text-xs font-semibold text-red-700">
                        -{g.currency}
                        {g.outstanding.toLocaleString('es-AR')}
                      </div>
                      <div className="mt-1 text-xs text-red-600">deuda pendiente</div>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex rounded-lg border border-emerald-200/70 bg-emerald-100/70 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                        +{g.currency}
                        {g.outstanding.toLocaleString('es-AR')}
                      </div>
                      <div className="mt-1 text-xs text-emerald-600">saldo al día</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

