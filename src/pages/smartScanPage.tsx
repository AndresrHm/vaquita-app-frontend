/* eslint-disable no-undef */
import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit3, Sparkles, Upload, Camera, X, RotateCcw, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import PageTitle from '@/components/common/pageTitle'
import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'
import { useNavigate } from 'react-router-dom'
import { scan, scanMock, type LineItem, type ScanResult } from '@/service/smartScanService'
import axios from 'axios'

// ── Types ────────────────────────────────────────────────────────────────────

type ScanState = 'idle' | 'preview' | 'loading' | 'result' | 'error'

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Comida',
  transport: 'Transporte',
  entertainment: 'Entretenimiento',
  other: 'Otro',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GroupsScanPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [state, setState] = useState<ScanState>('idle')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const total = useMemo(
    () => scanResult?.items.reduce((acc, it) => acc + it.price * it.quantity, 0) ?? scanResult?.totalAmount ?? 0,
    [scanResult],
  )

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleFileSelected(file: File) {
    if (!file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setState('preview')
  }

  function handleReset() {
    setImageFile(null)
    setImagePreview(null)
    setScanResult(null)
    setErrorMsg(null)
    setState('idle')
    // liberar object URL para evitar memory leak
    if (imagePreview) URL.revokeObjectURL(imagePreview)
  }

  // TODO: Por ahora está con mock en el backend (la api de gemini está saturada)
  async function handleScan() {
    if (!imageFile) return
    setState('loading')
    setErrorMsg(null)

    try {
      const data = await scanMock(imageFile)
      setScanResult(data)
      setState('result')
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg = e.response?.data?.message ?? e.response?.data ?? e.message
        setErrorMsg(typeof msg === 'string' ? msg : 'Error al conectar con el servidor')
      } else {
        setErrorMsg('Error inesperado')
      }
      setState('error')
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <PageTitle
        title="Escanear con IA"
        subtitle="Sacá una foto o subí una imagen de tu ticket y Gemini extrae los datos automáticamente."
      />

      {/* ── PANEL PRINCIPAL: idle / preview / loading / error ── */}
      {state !== 'result' && (
        <ColumnContainer>
          <div className="pl-2">
            <h2 className="text-sm font-semibold text-foreground">Próxima acción</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Optimizá tu tiempo escaneando el ticket con nuestra IA.
            </p>
          </div>

          {/* Preview de imagen */}
          {imagePreview && (
            <div className="mt-4 relative rounded-xl overflow-hidden border border-border">
              <img
                src={imagePreview}
                alt="Vista previa del ticket"
                className="w-full max-h-56 object-cover"
              />
              {state === 'loading' && (
                <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={28} />
                  <p className="text-xs font-medium text-foreground">Analizando ticket…</p>
                </div>
              )}
              {state !== 'loading' && (
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full p-1 border border-border transition-colors"
                  aria-label="Quitar imagen"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Error inline */}
          {state === 'error' && errorMsg && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-2">
              <AlertCircle size={15} className="text-destructive mt-0.5 shrink-0" />
              <p className="text-xs text-destructive leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="mt-5 flex flex-col gap-3">
            {state === 'preview' || state === 'error' ? (
              /* Con imagen cargada: Escanear o cambiar */
              <>
                <Button
                  className="w-full h-12 text-md font-bold shadow-md hover:opacity-90 transition-all bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2"
                  onClick={handleScan}
                  disabled={state === 'loading'}
                >
                  <Sparkles size={18} />
                  {state === 'error' ? 'Reintentar escaneo' : 'Escanear con IA'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-border text-foreground hover:bg-muted text-xs h-10"
                  onClick={handleReset}
                >
                  <RotateCcw size={14} className="mr-2" />
                  Cambiar imagen
                </Button>
              </>
            ) : state === 'loading' ? (
              <Button
                className="w-full h-12 text-md font-bold bg-primary text-primary-foreground rounded-xl"
                disabled
              >
                <Loader2 size={18} className="animate-spin mr-2" />
                Analizando…
              </Button>
            ) : (
              /* Sin imagen: seleccionar origen */
              <>
                {/* Inputs de archivo ocultos */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                />

                <Button
                  className="w-full h-12 text-md font-bold shadow-md hover:opacity-90 transition-all bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera size={18} />
                  Sacar foto del ticket
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-border text-foreground hover:bg-muted text-xs h-10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} className="mr-2" />
                    Subir imagen
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-xl text-muted-foreground hover:text-foreground text-xs h-10"
                    onClick={() => navigate('/groups/expense/create')}
                  >
                    <Edit3 size={14} className="mr-2" />
                    Manual
                  </Button>
                </div>
              </>
            )}
          </div>
        </ColumnContainer>
      )}

      {/* ── RESULTADO DEL SCAN ── */}
      {state === 'result' && scanResult && (
        <ColumnContainer>
          {/* Header con check */}
          <div className="pl-2 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">Ticket detectado</h2>
              {scanResult.category && (
                <p className="text-xs text-muted-foreground">
                  Categoría: {CATEGORY_LABELS[scanResult.category] ?? scanResult.category}
                  {scanResult.date && ` · ${scanResult.date}`}
                </p>
              )}
            </div>
          </div>

          {/* Thumb de la imagen escaneada */}
          {imagePreview && (
            <div className="mt-3 rounded-xl overflow-hidden border border-border h-28">
              <img src={imagePreview} alt="Ticket escaneado" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Título, Descripción e Ítems */}
          <Card className="mt-4 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-medium text-foreground">{scanResult.title}</div>
            </div>
          </Card>

          {scanResult.items.length > 0 && (
            <div className="mt-3 space-y-2">
              {scanResult.items.map((it, idx) => (
                <Card key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{it.name}</span>
                    {it.quantity > 1 && (
                      <span className="text-xs text-muted-foreground">x{it.quantity}</span>
                    )}
                  </div>
                  <div className="text-sm font-semibold shrink-0">
                    $ {(it.price * it.quantity).toLocaleString('es-AR')}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Total */}
          <Card className="mt-4 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-medium text-foreground">Total</div>
              <div className="text-base font-semibold text-foreground text-xl">
                $ {total.toLocaleString('es-AR')}
              </div>
            </div>
          </Card>

          {/* Acciones */}
          <div className="mt-4 flex flex-col gap-2">
            <Button
              className="w-full rounded-xl bg-primary text-primary-foreground"
              onClick={() => navigate('/groups/expense/create', { state: { scanResult } })}
            >
              Continuar y repartir
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl text-xs"
              onClick={handleReset}
            >
              <RotateCcw size={13} className="mr-2" />
              Escanear otro ticket
            </Button>
          </div>
        </ColumnContainer>
      )}
    </div>
  )
}