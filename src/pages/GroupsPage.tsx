const mockGroups = [
  { id: 'g1', name: 'Centro de Estudiantes', members: 6, outstanding: 12400, currency: '$' },
  { id: 'g2', name: 'Cátedra - Comisión 2', members: 9, outstanding: 7800, currency: '$' },
  { id: 'g3', name: 'Viaje de Fin de Año', members: 14, outstanding: 25650, currency: '$' },
]

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

      <div className="space-y-3">
        {mockGroups.map((g) => (
          <div
            key={g.id}
            className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{g.name}</div>
                <div className="mt-1 text-xs text-slate-600">{g.members} miembros</div>
              </div>
              <div className="text-right">
                <div className="inline-flex rounded-lg border border-red-200/70 bg-red-100/70 px-2 py-1 text-sm font-semibold text-red-700">
                  -{g.currency}
                  {g.outstanding.toLocaleString('es-AR')}
                </div>
                <div className="mt-1 text-xs text-red-600">deuda pendiente</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

