import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Edit3, Sparkles, Upload } from 'lucide-react'

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
            <h1 className="text-lg font-semibold text-slate-900">Grupos</h1>
            <p className="mt-1 text-sm text-slate-600">Administrá deudas compartidas.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card/70 p-5 shadow-sm backdrop-blur-xl border border-border">
        <h2 className="text-sm font-semibold text-foreground">Próxima acción</h2>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Optimizá tu tiempo escaneando el ticket con nuestra IA.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {/* OPCIÓN ESTRELLA: ESCANEO IA */}
          <Link to="/groups/scan" className="w-full">
            <Button
              className="w-full h-12 text-md font-bold shadow-md hover:opacity-90 transition-all bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              Escanear con IA
            </Button>
          </Link>

          {/* OPCIONES SECUNDARIAS */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-primary/20 text-primary hover:bg-primary/5 text-xs h-10"
            >
              <Upload size={14} className="mr-2" />
              Subir imagen
            </Button>

            <Button
              variant="ghost"
              className="flex-1 rounded-xl text-muted-foreground hover:text-foreground text-xs h-10"
            >
              <Edit3 size={14} className="mr-2" />
              Manual
            </Button>
          </div>
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

