import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit3, Sparkles, Upload } from 'lucide-react'

type LineItem = { id: string; label: string; amount: number }

const mockDetected: LineItem[] = [
  { id: 'li1', label: 'Fotocopias', amount: 3200 },
  { id: 'li2', label: 'Material de estudio', amount: 4600 },
  { id: 'li3', label: 'Transporte', amount: 2100 },
]

export default function GroupsScanPage() {
  const [scanned, setScanned] = useState(false)

  const total = useMemo(() => {
    return mockDetected.reduce((acc, it) => acc + it.amount, 0)
  }, [])

  return (
    <div className="space-y-4">
      <div className="-mx-4 rounded-b-2xl rounded-t-none border border-border bg-card/70 px-9 py-5 shadow-sm backdrop-blur-xl">
        <h1 className="text-lg font-semibold text-slate-900">Escanear con IA</h1>
        <p className="mt-1 text-sm text-slate-600">
          Placeholder mock: en el futuro se integra Gemini + OCR.
        </p>
      </div>

      <div className="rounded-2xl bg-card/70 p-5 shadow-sm backdrop-blur-xl border border-border">
        <h2 className="text-sm font-semibold text-foreground">Próxima acción</h2>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Optimizá tu tiempo escaneando el ticket con nuestra IA.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {/* OPCIÓN ESTRELLA: ESCANEO IA */}
          <Button
            className="w-full h-12 text-md font-bold shadow-md hover:opacity-90 transition-all bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2"
            onClick={() => setScanned(true)}
          >
            <Sparkles size={18} />
            Escanear con IA
          </Button>

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

      {scanned ? (
        <div className="rounded-2xl bg-card/70 p-5 shadow-sm backdrop-blur-xl border border-border">
          <>
            <h2 className="text-sm font-semibold text-slate-900">Ticket detectado (mock)</h2>
            <div className="mt-3 space-y-2">
              {mockDetected.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2">
                  <div className="text-sm font-medium text-slate-900">{it.label}</div>
                  <div className="text-sm font-semibold text-slate-900">
                    $ {it.amount.toLocaleString('es-AR')}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200/60 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-800">Total</div>
                <div className="text-base font-semibold text-slate-900">$ {total.toLocaleString('es-AR')}</div>
              </div>
              <div className="mt-2 text-xs text-slate-600">Siguiente paso: repartir entre miembros del group.</div>
            </div>
            <div className="mt-4">
              <Button className="w-full rounded-xl" onClick={() => setScanned(false)}>
                Escanear otro ticket
              </Button>
            </div>
          </>
        </div>
      ) : null}
    </div>
  )
}

