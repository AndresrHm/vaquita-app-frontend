/* eslint-disable no-undef */
import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Edit3, Sparkles, Upload, Camera, RotateCcw,
  CheckCircle2, AlertCircle
} from 'lucide-react'
import PageTitle from '@/components/common/pageTitle'
import ColumnContainer from '@/components/common/columnContainer'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import EditableLineItems from '@/components/smartScan/editableLineItems'
import Card from '@/components/common/card'
import { CATEGORY_LABELS, CURRENCY_SYMBOLS, type LineItem, type ScanResult, type ScanState } from '@/domain/smartScanDTO'
import { scan, scanMock } from '@/service/smartScanService'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import CollapsibleCard from '@/components/common/collapsibleCard'

export default function GroupsScanPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [state, setState] = useState<ScanState>('idle')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // -- Estado editable del resultado --
  const [editableResult, setEditableResult] = useState<ScanResult | null>(null)

  // El total se calcula siempre en base a lo que el usuario ve/edita
  // ✨ CAMBIO: Ahora items es opcional y quantity también es opcional
  const total = useMemo(() => {
    return editableResult?.items?.reduce((acc: number, it: LineItem) => acc + (it.price * (it.quantity || 1)), 0) ?? 0
  }, [editableResult?.items])

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
      const data = await scan(imageFile)
      // Inicializamos el estado editable con lo que viene de la IA
      setEditableResult({
        ...data,
        items: data.items || []
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
    if (!editableResult?.items) return
    const newItems = [...editableResult.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setEditableResult({ ...editableResult, items: newItems })
  }

  const removeItem = (index: number) => {
    if (!editableResult?.items) return
    setEditableResult({
      ...editableResult,
      items: editableResult.items.filter((_, i) => i !== index)
    })
  }

  const addItem = () => {
    if (!editableResult?.items) return
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

          <Card interactive={false}>

            {imagePreview && (
              <>
                <div
                  className="mt-4 rounded-2xl overflow-hidden border border-border cursor-pointer group"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Modal */}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogContent className="max-w-3xl p-0 bg-black/90 border-none">
                    <img
                      src={imagePreview}
                      alt="preview zoom"
                      className="w-full h-auto object-contain"
                    />
                  </DialogContent>
                </Dialog>
              </>
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
                  {/* Confirmar y Escanerar | Reintentar */}
                  <Button
                    className="w-full h-16 rounded-[1.25rem] bg-blue-400 text-primary-foreground text-lg font-black shadow-[0_5px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_20px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all active:scale-[0.97] border-0 flex items-center justify-center gap-2"
                    onClick={handleScan}
                    disabled={state === 'loading'}
                  >
                    {state === 'loading' && (
                      <>
                        <RotateCcw size={18} />
                        <Sparkles size={18} />
                        <p className="text-center text-sm text-muted-foreground mt-2 animate-pulse">
                          Procesando imagen...
                        </p>
                      </>
                    )

                    }
                    {state === 'error' ? 'Reintentar' : 'Confirmar y Escanear'}
                  </Button>
                  {/* Cambiar imagen */}
                  <Button
                    variant="outline"
                    className="rounded-xl h-10 text-sm"
                    onClick={handleReset}
                  >
                    Cambiar imagen
                  </Button>
                </>
              ) : state !== 'loading' && (
                <>
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])} />
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])} />

                  <Button
                    className="w-full h-16 rounded-[1.25rem] bg-blue-400 text-primary-foreground text-lg font-black shadow-[0_5px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_20px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all active:scale-[0.97] border-0 flex items-center justify-center gap-2"
                    onClick={() => cameraInputRef.current?.click()}
                  >
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
          </Card>
        </ColumnContainer>
      )}

      {/* ── RESULTADO EDITABLE ── */}
      {state === 'result' && editableResult && (
        <div className="space-y-4">

          <ColumnContainer>
            <div className="flex items-center justify-between px-1">

              <div className="flex items-center gap-2">
                <div className="bg-green-500/10 p-1.5 rounded-full">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-l font-bold">¡Lectura exitosa!</h2>
                  <p className="text-xs text-muted-foreground">Revisá y corregí si es necesario.</p>
                </div>
              </div>
              {editableResult.category && (
                <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-lg">
                  {CATEGORY_LABELS[editableResult.category] || editableResult.category}
                </span>
              )}
            </div>

            {/* Imagen */}
            {imagePreview && (
              <>
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-sm font-semibold text-foreground">
                        Ticket escaneado
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Tocá la imagen para verla en detalle
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <div
                      className="w-full max-w-xs rounded-2xl overflow-hidden border border-border cursor-pointer group hover:shadow-md"
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  {/* Modal */}
                  <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-3xl p-0 bg-black/90 border-none">
                      <img
                        src={imagePreview}
                        alt="preview zoom"
                        className="w-full h-auto object-contain"
                      />
                    </DialogContent>
                  </Dialog>

                </Card>
              </>
            )}

            {/* Datos Generales (Título y Descripción) */}
            <CollapsibleCard
              title="Información del gasto"
              subtitle="Editá los datos generales"
            >
              <div className="space-y-3">
                <div className="mt-4 space-y-3 p-4 bg-card/70 rounded-2xl border border-border/50">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Título del Gasto</label>
                    <input
                      className="w-full pl-1 bg-transparent border-none text-lg font-semibold focus:ring-0 p-0 placeholder:text-muted-foreground/50"
                      value={editableResult.title}
                      placeholder="Ej: Cena en el Club"
                      onChange={(e) => setEditableResult({ ...editableResult, title: e.target.value })}
                    />
                  </div>

                  {/* ✨ NUEVO: Campo de descripción ahora soportado */}
                  <div className="space-y-1 border-t border-border/50 pt-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Descripción / Nota</label>
                    <textarea
                      className="w-full pl-1 bg-transparent border-none text-sm text-muted-foreground focus:ring-0 p-0 resize-none h-12"
                      value={editableResult.description || ''}
                      placeholder="Agregá un comentario..."
                      onChange={(e) => setEditableResult({ ...editableResult, description: e.target.value })}
                    />
                  </div>

                  {/* ✨ NUEVO: Mostrar moneda si está disponible */}
                  {editableResult.currency && (
                    <div className="space-y-1 border-t border-border/50 pt-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Moneda</label>
                      <p className="pl-1 text-sm font-medium">{editableResult.currency} ({CURRENCY_SYMBOLS[editableResult.currency]})</p>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleCard>

            {/* Listado de ítems */}
            <CollapsibleCard
              title="Detalle de ítems"
              subtitle={`${editableResult.items?.length || 0} ítems detectados`}
            >
              <EditableLineItems
                items={editableResult.items || []}
                onUpdate={updateItem}
                onRemove={removeItem}
                onAdd={addItem}
              />
            </CollapsibleCard>

            {/* Card final con total */}
            <Card interactive={false} >
              <div className="mt-2 relative overflow-hidden bg-blue-400 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/10">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -mr-16 -mt-16" />

                <div className="relative flex justify-between items-center mb-2">
                  <div className="space-y-1">
                    <span className="text-l font-black text-primary-foreground/90">
                      Monto Total Extraído
                    </span>
                    <p className="text-xs font-medium text-primary-foreground/80">
                      Suma automática de {editableResult.items?.length || 0} ítems
                    </p>
                  </div>
                  {/* ✨ NUEVO: Mostrar símbolo de moneda en el total */}
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                      {editableResult.currency || 'ARS'}
                    </span>
                  </div>
                </div>

                <div className="relative flex items-baseline justify-end gap-1">
                  <span className="text-4xl font-black text-white">
                    {CURRENCY_SYMBOLS[editableResult.currency || 'ARS']}
                  </span>
                  <span className="text-4xl font-black text-white tracking-tight">
                    {total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Acciones Finales: Botones con más "punch" y bordes definidos */}
              <div className="mt-8 space-y-4">
                <Button
                  className="w-full h-16 rounded-[1.25rem] bg-blue-400 text-primary-foreground text-lg font-black shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_15px_30px_rgba(var(--primary-rgb),0.4)] hover:-translate-y-0.5 transition-all active:scale-[0.97] border-2 border-primary-foreground/10"
                  onClick={() => navigate('/groups/expense/create', {
                    state: {
                      scanResult: {
                        ...editableResult,
                        totalAmount: total
                      }
                    }
                  })}
                >
                  Confirmar y Repartir
                </Button>

                <Button
                  variant="outline"
                  className="w-full mb-2 h-14 rounded-[1.25rem] border-2 border-dashed bg-background shadow-sm text-foreground font-bold hover:bg-muted transition-all flex items-center justify-center gap-2"
                  onClick={handleReset}
                >
                  <RotateCcw size={16} className="text-muted-foreground" />
                  <span className="text-sm">Escanear otro ticket</span>
                </Button>
              </div>
            </Card>

          </ColumnContainer>
        </div>
      )}
    </div>
  )
}