/* eslint-disable no-undef */
import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Edit3, Sparkles, Upload, Camera, X, RotateCcw,
  CheckCircle2, Loader2, AlertCircle, Trash2, Plus, ReceiptText
} from 'lucide-react'
import PageTitle from '@/components/common/pageTitle'
import ColumnContainer from '@/components/common/columnContainer'
import { useNavigate } from 'react-router-dom'
import { scanMock, type LineItem, type ScanResult } from '@/service/smartScanService'
import axios from 'axios'

// ── Types ────────────────────────────────────────────────────────────────────
type ScanState = 'idle' | 'preview' | 'loading' | 'result' | 'error'

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍴 Comida',
  transport: '🚗 Transporte',
  entertainment: '🎉 Entretenimiento',
  other: '📦 Otro',
}

export default function GroupsScanPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [state, setState] = useState<ScanState>('idle')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // -- Estado editable del resultado --
  const [editableResult, setEditableResult] = useState<ScanResult | null>(null)

  // El total se calcula siempre en base a lo que el usuario ve/edita
  const total = useMemo(() => {
    return editableResult?.items.reduce((acc, it) => acc + (it.price * it.quantity), 0) ?? 0
  }, [editableResult])

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
    setEditableResult(null)
    setErrorMsg(null)
    setState('idle')
    if (imagePreview) URL.revokeObjectURL(imagePreview)
  }

  async function handleScan() {
    if (!imageFile) return
    setState('loading')
    setErrorMsg(null)

    try {
      const data = await scanMock(imageFile)
      // Inicializamos el estado editable con lo que viene de la IA
      setEditableResult({
        ...data,
        // description: data.description || '', // Por si el backend no lo trae
      })
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

  // ── Handlers de Edición ─────────────────────────────────────────────────────

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    if (!editableResult) return
    const newItems = [...editableResult.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setEditableResult({ ...editableResult, items: newItems })
  }

  const removeItem = (index: number) => {
    if (!editableResult) return
    setEditableResult({
      ...editableResult,
      items: editableResult.items.filter((_, i) => i !== index)
    })
  }

  const addItem = () => {
    if (!editableResult) return
    const newItem: LineItem = { name: 'Nuevo ítem', quantity: 1, price: 0 }
    setEditableResult({ ...editableResult, items: [...editableResult.items, newItem] })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 pb-10">
      <PageTitle
        title="Escanear con IA"
        subtitle="Gemini analizará tu ticket para automatizar la carga."
      />

      {/* ── PANEL DE CARGA ── */}
      {state !== 'result' && (
        <ColumnContainer>
          <div className="pl-1">
            <h2 className="text-sm font-semibold text-foreground">Subir comprobante</h2>
            <p className="text-xs text-muted-foreground">Optimizá tu tiempo escaneando el ticket.</p>
          </div>

          {imagePreview && (
            <div className="mt-4 relative rounded-2xl overflow-hidden border border-border aspect-4/3 bg-muted">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              {state === 'loading' && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <Sparkles className="absolute -top-1 -right-1 text-yellow-500 animate-pulse" size={14} />
                  </div>
                  <p className="text-sm font-medium animate-pulse text-primary">Leyendo ticket...</p>
                </div>
              )}
              {state !== 'loading' && (
                <button onClick={handleReset} className="absolute top-3 right-3 bg-background/90 p-1.5 rounded-full border shadow-sm">
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {state === 'error' && errorMsg && (
            <div className="mt-3 flex gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3">
              <AlertCircle size={16} className="text-destructive shrink-0" />
              <p className="text-xs text-destructive">{errorMsg}</p>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3">
            {state === 'preview' || state === 'error' ? (
              <>
                <Button className="w-full h-12 rounded-xl text-md font-bold" onClick={handleScan} disabled={state === 'loading'}>
                  {state === 'error' ? <RotateCcw size={18} className="mr-2" /> : <Sparkles size={18} className="mr-2" />}
                  {state === 'error' ? 'Reintentar' : 'Confirmar y Escanear'}
                </Button>
                <Button variant="ghost" className="text-xs h-10" onClick={handleReset}>Cambiar imagen</Button>
              </>
            ) : state !== 'loading' && (
              <>
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])} />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])} />

                <Button className="w-full h-14 rounded-2xl shadow-lg gap-2 text-md" onClick={() => cameraInputRef.current?.click()}>
                  <Camera size={20} /> Sacar foto
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl h-11 text-xs" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={14} className="mr-2" /> Galería
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl h-11 text-xs" onClick={() => navigate('/groups/expense/create')}>
                    <Edit3 size={14} className="mr-2" /> Manual
                  </Button>
                </div>
              </>
            )}
          </div>
        </ColumnContainer>
      )}

      {/* ── RESULTADO EDITABLE ── */}
      {state === 'result' && editableResult && (
        <div className="space-y-4">
          <ColumnContainer>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="bg-green-500/10 p-1.5 rounded-full">
                  <CheckCircle2 size={18} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">¡Lectura exitosa!</h2>
                  <p className="text-[11px] text-muted-foreground">Revisá y corregí si es necesario.</p>
                </div>
              </div>
              {editableResult.category && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-lg">
                  {CATEGORY_LABELS[editableResult.category] || editableResult.category}
                </span>
              )}
            </div>

            {/* Datos Generales (Título y Descripción) */}
            <div className="mt-4 space-y-3 p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Título del Gasto</label>
                <input
                  className="w-full bg-transparent border-none text-lg font-semibold focus:ring-0 p-0 placeholder:text-muted-foreground/50"
                  value={editableResult.title}
                  placeholder="Ej: Cena en el Club"
                  onChange={(e) => setEditableResult({ ...editableResult, title: e.target.value })}
                />
              </div>
              <div className="space-y-1 border-t border-border/50 pt-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Descripción / Nota</label>
                <textarea
                  className="w-full bg-transparent border-none text-sm text-muted-foreground focus:ring-0 p-0 resize-none h-12"
                  // value={editableResult.description || ''}
                  value="Descripción que por el momento está hardcodeada. . . "
                  placeholder="Agregá un comentario..."
                // onChange={(e) => setEditableResult({ ...editableResult, description: e.target.value })} TODO
                />
              </div>
            </div>

            {/* Listado de ítems */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                  <ReceiptText size={14} /> Detalle de ítems
                </h3>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] text-primary" onClick={addItem}>
                  <Plus size={14} className="mr-1" /> Añadir
                </Button>
              </div>

              <div className="space-y-3">
                {editableResult.items.map((it, idx) => (
                  <div key={idx} className="group relative bg-background border border-border rounded-xl p-3 shadow-sm transition-all hover:border-primary/50">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <input
                        className="flex-1 bg-transparent border-none font-medium text-sm p-0 focus:ring-0"
                        value={it.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      />
                      <button onClick={() => removeItem(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Cant.</span>
                        <input
                          type="number"
                          className="w-12 bg-muted/50 border-none rounded-md px-1 py-0.5 text-xs text-center focus:ring-1 focus:ring-primary"
                          value={it.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Precio Unitario</span>
                        <div className="relative">
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">$</span>
                          <input
                            type="number"
                            className="w-full bg-muted/50 border-none rounded-md pl-4 pr-1 py-0.5 text-xs focus:ring-1 focus:ring-primary"
                            value={it.price}
                            onChange={(e) => updateItem(idx, 'price', Number(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end shrink-0">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Subtotal</span>
                        <span className="text-sm font-bold text-primary">
                          ${(it.price * it.quantity).toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* Card del Total: Refinada con degradado sutil y sombra profunda */}
            <div className="mt-8 relative overflow-hidden bg-blue-400 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/10">
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -mr-16 -mt-16" />

              <div className="relative flex justify-between items-center mb-2">
                <div className="space-y-1">
                  <span className="text-l font-black text-primary-foreground/90">
                    Monto Total Extraído
                  </span>
                  <p className="text-xs font-medium text-primary-foreground/80">
                    Suma automática de {editableResult.items.length} ítems
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">ARS</span>
                </div>
              </div>

              <div className="relative flex items-baseline justify-end gap-1">
                <span className="text-4xl font-black text-white">$</span>
                <span className="text-4xl font-black text-white tracking-tight">
                  {total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Acciones Finales: Botones con más "punch" y bordes definidos */}
            <div className="mt-8 space-y-4">
              <Button
                className="w-full h-16 rounded-[1.25rem] bg-blue-400 text-primary-foreground text-lg font-black shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_15px_30px_rgba(var(--primary-rgb),0.4)] hover:-translate-y-0.5 transition-all active:scale-[0.97] border-2 border-primary-foreground/10"
                onClick={() => navigate('/groups/expense/create', { state: { scanResult: editableResult } })}
              >
                Confirmar y Repartir                </Button>

              <Button
                variant="outline"
                className="w-full h-14 rounded-[1.25rem] border-2 border-dashed bg-background shadow-sm text-foreground font-bold hover:bg-muted transition-all flex items-center justify-center gap-2"
                onClick={handleReset}
              >
                <RotateCcw size={16} className="text-muted-foreground" />
                <span className="text-sm">Escanear otro ticket</span>
              </Button>
            </div>

          </ColumnContainer>
        </div>
      )}
    </div>
  )
}