const mockActivity = [
  { id: 'a1', title: 'Ticket escaneado', detail: 'Fotocopias - $3.200', date: 'Hoy' },
  { id: 'a2', title: 'Reparto automático', detail: '3 miembros - saldo actualizado', date: 'Ayer' },
  { id: 'a3', title: 'Pago registrado', detail: 'Martín - $1.200', date: 'Hace 3 días' },
]

export default function ActivityPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
        <h1 className="text-lg font-semibold text-slate-900">Activity</h1>
        <p className="mt-1 text-sm text-slate-600">Resumen de movimientos (mock).</p>
      </div>

      <div className="space-y-3">
        {mockActivity.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 text-xs text-slate-600">{item.detail}</div>
              </div>
              <div className="text-right text-xs text-slate-500">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

