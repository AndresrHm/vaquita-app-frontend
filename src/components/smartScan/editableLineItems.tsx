// components/scan/EditableLineItems.tsx
import { Plus, Minus, Trash2, ReceiptText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LineItem } from '@/domain/smartScanDTO'

interface Props {
    items: LineItem[]
    onUpdate: (index: number, field: keyof LineItem, value: string | number) => void
    onRemove: (index: number) => void
    onAdd: () => void
}

export default function EditableLineItems({ items, onUpdate, onRemove, onAdd }: Props) {
    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <ReceiptText size={14} className="text-primary" />
                    Detalle de ítems
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-primary/20 text-primary hover:bg-primary/5 text-[11px] font-bold"
                    onClick={onAdd}
                >
                    <Plus size={14} className="mr-1" /> Añadir ítem
                </Button>
            </div>

            <div className="space-y-3">
                {items.map((it, idx) => (
                    <div key={idx} className="group bg-background/70 border border-border/60 rounded-2xl p-3 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                        <div className="flex justify-between items-start gap-2 mb-3">
                            <input
                                className="flex-1 pl-2 bg-transparent border-none font-semibold text-sm p-0 focus:ring-0 placeholder:text-muted-foreground/40"
                                value={it.name}
                                placeholder="Nombre del producto..."
                                onChange={(e) => onUpdate(idx, 'name', e.target.value)}
                            />
                            <button
                                onClick={() => onRemove(idx)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            {/* Selector de Cantidad Estilo Material */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold ml-1">Cantidad</span>
                                <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/40">
                                    <button
                                        onClick={() => onUpdate(idx, 'quantity', Math.max(1, it.quantity - 1))}
                                        className="p-1 hover:bg-background rounded-lg text-primary transition-colors"
                                    >
                                        <Minus size={16} className='text-blue-400' />
                                    </button>
                                    <span className="w-8 text-center text-xs font-bold">{it.quantity}</span>
                                    <button
                                        onClick={() => onUpdate(idx, 'quantity', it.quantity + 1)}
                                        className="p-1 hover:bg-background rounded-lg text-primary transition-colors"
                                    >
                                        <Plus size={16} className='text-blue-400' />
                                    </button>
                                </div>
                            </div>

                            {/* Precio Unitario */}
                            <div className="flex flex-col gap-1.5 flex-1">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold ml-1">Precio Unit.</span>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">$</span>
                                    <input
                                        type="number"
                                        className="w-full bg-muted/50 border border-border/40 rounded-xl pl-6 pr-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={it.price}
                                        onChange={(e) => onUpdate(idx, 'price', Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* Subtotal */}
                            <div className="flex flex-col gap-1.5 items-center shrink-0">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold mr-1">Subtotal</span>
                                <span className="text-l font-bold text-primary">
                                    ${(it.price * it.quantity).toLocaleString('es-AR')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}