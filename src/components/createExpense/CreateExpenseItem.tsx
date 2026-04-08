import { useState } from 'react'
import { Button } from '@/components/ui/button'
import FieldWrapper from './FieldWrapper'
import { ExpenseItem } from '@/domain/expenseItem'

const INITIAL_ITEM = new ExpenseItem('', 1, 0)

interface CreateExpenseItemProps {
    items: ExpenseItem[]
    onChange: (items: ExpenseItem[]) => void
}

export default function CreateExpenseItem({ items, onChange }: CreateExpenseItemProps) {
    const [item, setItem] = useState<ExpenseItem>(INITIAL_ITEM)

    const handleAddItem = () => {
        if (!item.nombre.trim() || item.cantidad <= 0 || item.precioUnitario <= 0) {
            return
        }

        onChange([...items, new ExpenseItem(item.nombre, item.cantidad, item.precioUnitario)])
        setItem(new ExpenseItem('', 1, 0))
    }

    const handleRemoveItem = (index: number) => {
        onChange(items.filter((_, itemIndex) => itemIndex !== index))
    }

    return (
        <FieldWrapper label="Ítems del gasto" instruction="Dividí el gasto en partes (si corresponde)">
            <div className="mt-4 grid gap-3 sm:grid-cols-5">
                <label className="flex flex-col gap-1 text-[11px] text-muted-foreground col-span-2">
                    Producto
                    <input
                        type="text"
                        value={item.nombre}
                        placeholder="Ej. Bebida Cola"
                        onChange={(event) => setItem(new ExpenseItem(event.target.value, item.cantidad, item.precioUnitario))}
                        className="rounded-xl border border-border bg-background/70 px-3 py-2 text-sm text-foreground outline-none"
                    />
                </label>
                <label className="flex flex-col gap-1 text-[11px] text-muted-foreground col-span-1">
                    Cantidad
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.cantidad}
                        placeholder="1"
                        onChange={(event) => setItem(new ExpenseItem(item.nombre, Number(event.target.value) || 0, item.precioUnitario))}
                        className="rounded-xl border border-border bg-background/70 px-3 py-2 text-sm text-foreground outline-none"
                    />
                </label>
                <label className="flex flex-col gap-1 text-[11px] text-muted-foreground col-span-2">
                    Precio unitario
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.precioUnitario}
                            placeholder="0.00"
                            onChange={(event) => setItem(new ExpenseItem(item.nombre, item.cantidad, Number(event.target.value) || 0))}
                            className="w-full rounded-xl border border-border bg-background/70 px-9 py-2 text-sm text-foreground outline-none"
                        />
                    </div>
                </label>
            </div>

            <div className="mt-3 flex justify-end">
                <Button type="button" onClick={handleAddItem} className="h-10 rounded-2xl px-4 text-sm">
                    Agregar ítem
                </Button>
            </div>

            {items.length > 0 ? (
                <div className="mt-4 space-y-2">
                    {items.map((currentItem, index) => (
                        <div key={`${currentItem.nombre}-${index}`} className="rounded-xl border border-border bg-background/70 px-3 py-2">
                            <div className="flex items-center justify-between gap-3 mb-1">
                                <div className="text-sm font-medium text-foreground">{currentItem.nombre}</div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="rounded-lg border border-border bg-muted/70 px-2 py-1 text-[11px] text-foreground transition hover:bg-muted"
                                >
                                    Eliminar
                                </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span>Cantidad: {currentItem.cantidad}</span>
                                <span>Precio u.: ${currentItem.precioUnitario.toFixed(2)}</span>
                                <span className="font-medium text-primary">Subtotal: ${currentItem.total().toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-sm text-muted-foreground">No hay ítems agregados todavía.</p>
            )}
        </FieldWrapper>
    )
}
