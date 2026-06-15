import { useState } from 'react'
import { Button } from '@/components/ui/button'
import FieldWrapper from './FieldWrapper'
import { ExpenseItem } from '@/domain/expenseItem'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

const INITIAL_ITEM = new ExpenseItem('', 1, 0)

interface CreateExpenseItemProps {
    items: ExpenseItem[]
    onChange: (items: ExpenseItem[]) => void
}

export default function CreateExpenseItem({ items, onChange }: CreateExpenseItemProps) {

    const [isOpen, setIsOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [item, setItem] = useState<ExpenseItem>(INITIAL_ITEM)
    const [confirmDelete, setConfirmDelete] = useState(false)

    // ─────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────

    const openCreate = () => {
        setItem(new ExpenseItem('', 1, 0))
        setEditingIndex(null)
        setIsOpen(true)
        setConfirmDelete(false)
    }

    const openEdit = (index: number) => {
        const current = items[index]
        setItem(new ExpenseItem(
            current.nombre,
            current.cantidad,
            current.precioUnitario
        ))
        setEditingIndex(index)
        setIsOpen(true)
        setConfirmDelete(false)
    }

    const handleSave = () => {
        if (!item.nombre.trim() || item.cantidad <= 0 || item.precioUnitario <= 0) {
            return
        }

        if (editingIndex !== null) {
            const updated = [...items]
            updated[editingIndex] = item
            onChange(updated)
        } else {
            onChange([...items, item])
        }

        setIsOpen(false)
    }

    // const handleRemoveItem = (index: number) => {
    //     onChange(items.filter((_, i) => i !== index))
    // }

    const handleDelete = () => {
        if (editingIndex === null) return

        onChange(items.filter((_, i) => i !== editingIndex))
        setIsOpen(false)
        setConfirmDelete(false)
    }

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────

    return (
        <FieldWrapper label="Ítems del gasto" instruction="Dividí el gasto en partes (si corresponde)">
            {/* LISTA */}
            {items.length > 0 ? (
                <div className="mt-4">
                    <div className="space-y-2 max-h-[40vh] md:max-h-[28vh] overflow-auto pr-2">
                        {items.map((currentItem, index) => {
                        return (
                            <div
                                key={`${currentItem.nombre}-${index}`}
                                onClick={() => openEdit(index)}
                                className="cursor-pointer rounded-xl border border-border bg-background/70 px-3 py-2 hover:bg-muted transition"
                            >
                                <div className="flex items-center justify-between gap-3 mb-1">
                                    <div className="text-sm font-medium text-foreground">
                                        {currentItem.nombre || 'Ítem sin nombre'}
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                                    <span>Cantidad: {currentItem.cantidad}</span>
                                    <span>Precio u.: ${currentItem.precioUnitario.toFixed(2)}</span>
                                    <span className="font-medium text-primary">
                                        Subtotal: ${currentItem.total().toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                    No hay ítems agregados todavía.
                </p>
            )}

            {/* BOTÓN CREAR */}
            <div className="mt-3 flex justify-end">
                <Button type="button" onClick={openCreate} className="h-10 rounded-2xl px-4 text-sm">
                    Agregar ítem
                </Button>
            </div>

            {/* MODAL */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md bg-blue-50">
                    <DialogHeader>
                        <DialogTitle>
                            {editingIndex !== null ? 'Editar ítem' : 'Nuevo ítem'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">

                        {/* NOMBRE */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Producto</label>
                            <input
                                type="text"
                                value={item.nombre}
                                placeholder="Ej. Bebida Cola"
                                onChange={(e) =>
                                    setItem(new ExpenseItem(
                                        e.target.value,
                                        item.cantidad,
                                        item.precioUnitario
                                    ))
                                }
                                className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none"
                            />
                        </div>

                        {/* CANTIDAD */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Cantidad</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={item.cantidad}
                                onChange={(e) =>
                                    setItem(new ExpenseItem(
                                        item.nombre,
                                        Number(e.target.value) || 0,
                                        item.precioUnitario
                                    ))
                                }
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
                            />
                        </div>

                        {/* PRECIO */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Precio unitario</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.precioUnitario}
                                    onChange={(e) =>
                                        setItem(new ExpenseItem(
                                            item.nombre,
                                            item.cantidad,
                                            Number(e.target.value) || 0
                                        ))
                                    }
                                    className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2 text-sm outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full">
                            {/* GUARDAR */}
                            <Button
                                onClick={handleSave}
                                className="flex-1 h-11 rounded-xl text-sm font-bold"
                            >
                                Guardar
                            </Button>

                            {/* ELIMINAR */}
                            {editingIndex !== null && (
                                !confirmDelete ? (
                                    <Button
                                        onClick={() => setConfirmDelete(true)}
                                        className="flex-1 h-11 rounded-xl text-sm font-bold border-red-200 text-red-400 bg-red-100 hover:bg-red-200"
                                    >
                                        Eliminar
                                    </Button>
                                ) : (
                                    <div className="flex flex-1 gap-2">
                                        <Button
                                            onClick={handleDelete}
                                            className="flex-1 h-11 rounded-xl text-sm font-bold border-red-200 text-red-400 bg-red-100 hover:bg-red-200"
                                        >
                                            Confirmar
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => setConfirmDelete(false)}
                                            className="flex-1 h-11 rounded-xl text-sm font-bold"
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </FieldWrapper >
    )
}