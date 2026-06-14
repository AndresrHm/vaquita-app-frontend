import { useState } from 'react'
import Modal from '@/components/common/modal'
import { Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Expense } from './ExpenseItem'
import { attachmentService } from '@/service/attachmentService'
import { expenseItemsService } from '@/service/expenseItemsService'
import type { ExpenseItemDTO } from '@/domain/expenseItemDTO'

type ExpenseDetailModalProps = {
    isOpen: boolean
    expense: Expense | null
    onClose: () => void
}



function paymentLabel(type: Expense['paymentType']) {
    switch (type) {
        case 'paid_by_you':
            return 'Pagaste'
        case 'paid_by_other':
            return 'Pagó otro'
        case 'split_equal':
            return 'Dividido en partes iguales'
        case 'split_unequal':
            return 'Dividido de forma desigual'
        case 'you_owe':
            return 'Debés'
        case 'you_are_owed':
            return 'Te deben'
        default:
            return ''
    }
}

function toMonthNumber(month?: string | number): number | null {
    if (!month && month !== 0) return null
    if (typeof month === 'number') return month
    const m = month.toString().toLowerCase()
    const spanish = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    const english = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

    // numeric string
    const asNumber = Number(m)
    if (!Number.isNaN(asNumber) && asNumber > 0 && asNumber <= 12) return asNumber

    const idxES = spanish.findIndex(s => s === m || s.startsWith(m.slice(0, 3)))
    if (idxES >= 0) return idxES + 1

    const idxEN = english.findIndex(s => s === m || s.startsWith(m.slice(0, 3)))
    if (idxEN >= 0) return idxEN + 1

    return null
}

function pad(n: number) {
    return n < 10 ? `0${n}` : `${n}`
}

function formatExpenseDate(expense: Expense) {
    const day = expense.date?.day
    const monthVal = expense.date?.month
    const year = expense.date?.year

    if (day && monthVal && year) {
        const monthNum = toMonthNumber(monthVal) ?? 0
        return `${pad(day)}/${pad(monthNum)}/${year}`
    }

    if (day) return `${day}`
    return ''
}

function formatUploadedAt(value: string) {
    if (!value) return ''
    // try parse common formats like '2024-05-13 14:30' or ISO
    const iso = value.includes('T') ? value : value.replace(' ', 'T')
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return value

    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    return `${pad(day)}/${pad(month)}/${year}`
}

export default function ExpenseDetailModal({ isOpen, expense, onClose }: ExpenseDetailModalProps) {
    const [showTicket, setShowTicket] = useState(false)
    const [attachments, setAttachments] = useState<null | Array<{ id: string; filename: string; mimeType: string; downloadUrl: string; createdAt: string }>>(null)
    const [loadingAttachments, setLoadingAttachments] = useState(false)
    const hasTicketUrl = Boolean(expense?.tieneTicket)
    const ticketAttachments = attachments ?? []
    const [showItems, setShowItems] = useState(false)
    const [items, setItems] = useState<null | ExpenseItemDTO[]>(null)
    const [loadingItems, setLoadingItems] = useState(false)
    const [currentAttachmentIdx, setCurrentAttachmentIdx] = useState(0)

    if (!expense) return null
    return (
        <Modal isOpen={isOpen} title={expense.title} onClose={onClose}>
            {/* Información básica */}
            <div className="space-y-4">
                {/* Items detalle (mock) */}
                <div>
                    {/* Monto */}
                    <div className="rounded-lg bg-card/70 p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Monto</p>
                        <p className="text-2xl font-bold text-foreground">
                            {expense.currency} {expense.amount.toLocaleString('es-AR')}
                        </p>
                    </div>

                    {/* Ítems */}
                    <button
                        type="button"
                        onClick={async () => {
                            const willOpen = !showItems
                            setShowItems(w => !w)
                            if (willOpen && items === null) {
                                try {
                                    setLoadingItems(true)
                                    const list = await expenseItemsService.listarItems(Number(expense?.id))
                                    setItems(list)
                                } catch {
                                    setItems([])
                                } finally {
                                    setLoadingItems(false)
                                }
                            }
                        }}
                        className="w-full flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card/70 px-3 py-2 mt-4 text-sm font-medium text-foreground hover:bg-muted/20 transition"
                    >
                        <span>Detalle de items</span>
                        <span className="text-xs text-muted-foreground">{showItems ? 'Ocultar' : 'Ver'}</span>
                    </button>

                    {showItems && (
                        <div className="mt-2 space-y-2">
                            {loadingItems ? (
                                <div className="p-3 text-sm text-muted-foreground">Cargando items...</div>
                            ) : items && items.length > 0 ? (
                                <>
                                    {items.map((it, idx) => (
                                        <div key={idx} className="flex items-center justify-between rounded-2xl border border-border/30 px-3 py-2 bg-card/70">
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-foreground truncate">{it.nombre}</div>
                                                <div className="text-xs text-muted-foreground">{it.cantidad} x {it.precioUnitario.toLocaleString('es-AR')}</div>
                                            </div>
                                            <div className="text-sm font-medium text-foreground">{(it.cantidad * it.precioUnitario).toLocaleString('es-AR')}</div>
                                        </div>
                                    ))}

                                    <div className="flex items-center justify-end gap-3 pr-3 rounded-2xl pt-1 bg-card/70">
                                        <span className="text-l text-muted-foreground">Total</span>
                                        <div className="text-l font-semibold text-foreground">{items.reduce((s, it) => s + it.cantidad * it.precioUnitario, 0).toLocaleString('es-AR')}</div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-3 text-sm text-muted-foreground">No hay items para mostrar.</div>
                            )}
                        </div>
                    )}
                </div>
                {/* Fecha y tipo de pago */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border/50 p-3 bg-card/70">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Fecha</p>
                        <p className="text-sm font-medium text-foreground">{formatExpenseDate(expense)}</p>
                    </div>
                    <div className="rounded-lg border border-border/50 p-3 bg-card/70">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Tipo</p>
                        <p className="text-xs font-medium text-foreground">{paymentLabel(expense.paymentType)}</p>
                    </div>
                </div>

                {/* Ticket */}
                {hasTicketUrl && loadingAttachments ? (
                    <div className="p-3 text-sm text-muted-foreground">Cargando comprobante...</div>
                ) : hasTicketUrl && attachments === null ? (
                    <button
                        onClick={async () => {
                            try {
                                setLoadingAttachments(true)
                                const list = await attachmentService.getAttachments(Number(expense.id))
                                setAttachments(list)
                                setCurrentAttachmentIdx(0)
                                setShowTicket(list.length > 0)
                            } catch {
                                setAttachments([])
                                setShowTicket(false)
                            } finally {
                                setLoadingAttachments(false)
                            }
                        }}
                        className="w-full flex items-center gap-2 rounded-lg border border-border/50 bg-card/70 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/40 transition"
                    >
                        <Eye className="h-4 w-4" />
                        Ver comprobante
                    </button>
                ) : hasTicketUrl && ticketAttachments.length > 0 ? (
                    <div className="space-y-2">
                        <button
                            onClick={() => setShowTicket(w => !w)}
                            className="w-full flex items-center gap-2 rounded-lg border border-border/50 bg-card/70 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/40 transition"
                        >
                            <Eye className="h-4 w-4" />
                            {showTicket ? 'Ocultar' : 'Ver'} comprobante
                        </button>

                        {showTicket && (() => {
                            const a = ticketAttachments[currentAttachmentIdx]
                            if (a.mimeType.startsWith('image/')) {
                                return (
                                    <>
                                        <img src={a.downloadUrl} alt={a.filename} className="w-full rounded-lg border border-border/50 object-cover" />
                                        <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                                            <div className="text-xs text-muted-foreground">
                                                <p className="font-medium">{a.filename}</p>
                                                <p className="text-xs">{formatUploadedAt(a.createdAt)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {ticketAttachments.length > 1 && (
                                                    <span className="text-xs text-muted-foreground">{currentAttachmentIdx + 1} / {ticketAttachments.length}</span>
                                                )}
                                                <a href={a.downloadUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-muted transition">
                                                    <Download className="h-3.5 w-3.5" />
                                                    Descargar
                                                </a>
                                            </div>
                                        </div>

                                        {ticketAttachments.length > 1 && (
                                            <div className="flex items-center justify-between gap-2 pt-2">
                                                <button
                                                    onClick={() => setCurrentAttachmentIdx((i) => (i - 1 + ticketAttachments.length) % ticketAttachments.length)}
                                                    className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    Anterior
                                                </button>
                                                <button
                                                    onClick={() => setCurrentAttachmentIdx((i) => (i + 1) % ticketAttachments.length)}
                                                    className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
                                                >
                                                    Siguiente
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )
                            }

                            return (
                                <div className="rounded-lg border border-border/50 p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0 text-sm font-medium text-foreground truncate">{a.filename}</div>
                                        <a href={a.downloadUrl} target="_blank" rel="noreferrer" className="shrink-0 text-sm text-primary">Descargar</a>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{formatUploadedAt(a.createdAt)}</p>
                                </div>
                            )
                        })()}
                    </div>
                ) : null}
            </div>
        </Modal >
    )
}
