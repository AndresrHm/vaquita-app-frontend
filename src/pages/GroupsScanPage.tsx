import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit3, Sparkles, Upload } from 'lucide-react'
import PageTitle from '@/components/common/pageTitle'
import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'

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
      <PageTitle title="Escanear con IA" subtitle="Placeholder mock: en el futuro se integra Gemini + OCR." />

      <ColumnContainer>
        <div className="pl-2">
          <h2 className="text-sm font-semibold text-foreground">Próxima acción</h2>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Optimizá tu tiempo escaneando el ticket con nuestra IA.
          </p>
        </div>

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
              className="flex-1 rounded-xl border-border text-foreground hover:bg-muted text-xs h-10"
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
      </ColumnContainer>

      {scanned ? (
        <ColumnContainer>
          <>
            <h2 className="pl-2 text-sm font-semibold text-foreground">Ticket detectado (mock)</h2>
            <div className="mt-3 space-y-2">
              {mockDetected.map((it) => (
                <Card key={it.id} className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">{it.label}</div>
                  <div className="text-sm font-semibold">
                    $ {it.amount.toLocaleString('es-AR')}
                  </div>
                </Card>
              ))}
            </div>
            <Card className="mt-4 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-foreground">Total</div>
                <div className="text-base font-semibold text-foreground">$ {total.toLocaleString('es-AR')}</div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Siguiente paso: repartir entre miembros del group.</div>
            </Card>
            <div className="mt-4">
              <Button className="w-full rounded-xl" onClick={() => setScanned(false)}>
                Escanear otro ticket
              </Button>
            </div>
          </>
        </ColumnContainer>
      ) : null}
    </div>
  )
}

