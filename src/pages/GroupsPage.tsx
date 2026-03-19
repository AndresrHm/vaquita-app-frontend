import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const mockGroups = [
  { id: 'g1', name: 'Centro de Estudiantes', members: 6, outstanding: 12400, currency: '$' },
  { id: 'g2', name: 'Cátedra - Comisión 2', members: 9, outstanding: 7800, currency: '$' },
  { id: 'g3', name: 'Viaje de Fin de Año', members: 14, outstanding: 25650, currency: '$' },
]

export default function GroupsPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Groups</h1>
            <p className="mt-1 text-sm text-slate-600">Administrá deudas compartidas con estilo fintech.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-slate-900">Próxima acción</h2>
        <p className="mt-1 text-sm text-slate-600">Escaneá un ticket y sumá el gasto al grupo.</p>
        <div className="mt-4">
          <Link to="/groups/scan">
            <Button className="w-full rounded-xl" variant="default">
              Escanear Ticket con IA
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {mockGroups.map((g) => (
          <div
            key={g.id}
            className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{g.name}</div>
                <div className="mt-1 text-xs text-slate-600">{g.members} miembros</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">
                  {g.currency}
                  {g.outstanding.toLocaleString('es-AR')}
                </div>
                <div className="mt-1 text-xs text-slate-600">pendiente</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

