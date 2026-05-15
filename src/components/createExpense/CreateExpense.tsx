/* eslint-disable no-undef */
import { useRef, useState } from 'react'
import { Receipt, Calendar, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/components/createExpense/categories'
import CreateExpenseItem from '@/components/createExpense/CreateExpenseItem'
import FieldWrapper from '@/components/createExpense/FieldWrapper'
import { Expense } from '@/domain/expense'
import { ExpenseItem } from '@/domain/expenseItem'
import { expenseService } from '@/service/expenseService'
import ColumnContainer from '@/components/common/columnContainer'
import PageTitle from '@/components/common/pageTitle'
import { usuarioService } from '@/service/usuarioService'
import type { Usuario } from '@/domain/usuario'
import type { Grupo } from '@/domain/Grupo'
import { obtenerGrupoPorId, obtenerGruposDeUsuario } from '@/service/groupsService'
import { useOnInit } from '@/customHooks/hooks'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import type { ExpenseAttachment, LineItem, ScanResult } from '@/domain/smartScanDTO'
import { TipoDivision } from '@/domain/enums/tipoDivision'
import { ExpenseAllocation } from '@/domain/expenseAllocation'
import DivisionTypeSelector from './DivisionTypeSelector'
import AllocationSummary from './AllocationSummary'
import CategorySelector from './CategorySelector'
import ParticipantSelector from './ParticipantSelector'
import GroupSelector from './GroupSelector'
import { useToast } from '@/customHooks/useToast'
import { useNetwork } from '@/customHooks/useNetwork'
import ExpenseAttachmentsField from './ExpenseAttachmentsField'
import { attachmentService } from '@/service/attachmentService'
import ButtonSkeleton from '../common/ButtonSkeleton'

type LocationState = {
    scanResult?: ScanResult & { totalAmount: number }
    attachments?: ExpenseAttachment[]
}

export default function CreateExpense() {
    const location = useLocation()
    const locationState = location.state as LocationState

    const [attachments, setAttachments] = useState<ExpenseAttachment[]>(
        locationState?.attachments || []
    )

    const [useItemTotal, setUseItemTotal] = useState<boolean>(() => {
        return Boolean(locationState?.scanResult?.items?.length)
    })

    const [manualTotalInput, setManualTotalInput] = useState<string>(() => {
        const scanResult = locationState?.scanResult
        if (scanResult?.items?.length) return ''
        return scanResult?.totalAmount?.toString() ?? '0'
    })

    const [expense, setExpense] = useState<Expense>(() => {
        const scanResult = (location.state as LocationState)?.scanResult

        const newExpense = new Expense(undefined, Number(localStorage.id))

        if (scanResult) {
            newExpense.description = scanResult.description || ''
            newExpense.date =
                scanResult.date || new Date().toISOString().split('T')[0]

            newExpense.category = mapearCategoria(scanResult.category)

            const items = convertirItems(scanResult.items)
            newExpense.items = items
            newExpense.useItemsTotal = items.length > 0

            const totalEnCentavos = items.reduce((acc, item) => {
                return acc + Math.round(item.total() * 100)
            }, 0)

            const total = Number((totalEnCentavos / 100).toFixed(2))

            newExpense.total = items.length
                ? total
                : Number(scanResult.totalAmount.toFixed(2))
        }

        return newExpense
    })

    const [participants, setParticipants] = useState<Usuario[]>([])
    const [groups, setGroups] = useState<Grupo[]>([])
    const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
    const [isGroupsOpen, setIsGroupsOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [isLoadingParticipants, setIsLoadingParticipants] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { groupId } = useParams()
    const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(
        groupId ? Number(groupId) : undefined
    )
    const effectiveGroupId = (groupId ?? selectedGroupId) as number | undefined
    const [groupNameState, setGroupNameState] = useState<string | undefined>()
    const [divisionType, setDivisionType] = useState<TipoDivision>(TipoDivision.PARTES_IGUALES)

    const navigate = useNavigate()
    const { showToast } = useToast()
    const isOnline = useNetwork()

    const actualizarExpense = (cambios: Partial<Expense>) => {
        const expenseClon = new Expense()
        Object.assign(expenseClon, expense)
        Object.assign(expenseClon, cambios)
        expenseClon.validar()
        setExpense(expenseClon)
    }

    const handleToggleParticipant = (id: number) => {
        const newParticipantIds = expense.participantIds.includes(id)
            ? expense.participantIds.filter((v) => v !== id)
            : [...expense.participantIds, id]
        actualizarExpense({ participantIds: newParticipantIds })
    }

    const handleItemsChange = (items: ExpenseItem[]) => {
        actualizarExpense({
            items
        })
    }

    const handleManualTotalChange = (value: string) => {
        const normalized = value.replace(',', '.')
        setManualTotalInput(value)

        if (normalized.trim() === '') {
            actualizarExpense({ _total: 0 })
            return
        }

        const parsed = Number(normalized)
        if (!Number.isNaN(parsed)) {
            actualizarExpense({ _total: parsed })
        }
    }

    const handleUseItemTotalChange = (value: boolean) => {
        if (!value) {
            actualizarExpense({
                _total: expense.total,
                useItemsTotal: false,
            })
            setManualTotalInput(expense.total.toString())
        } else {
            const itemsTotal = expense.items.reduce(
                (acc, item) => acc + Math.round(item.total() * 100),
                0
            ) / 100
            actualizarExpense({
                _total: itemsTotal,
                useItemsTotal: true
            })
        }

        setUseItemTotal(value)
    }

    const obtenerGrupos = async () => {
        try {
            const gruposBack = await obtenerGruposDeUsuario()
            setGroups(gruposBack)
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error cargando grupos'
            showToast(mensaje, 'error')
            console.error(error)
        }
    }

    const handleAddAttachments = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || [])

        const newAttachments = files.map(file => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file)
        }))

        setAttachments(prev => [...prev, ...newAttachments])
    }

    const handleRemoveAttachment = (id: string) => {
        setAttachments(prev => {
            const attachment = prev.find(a => a.id === id)

            if (attachment) {
                URL.revokeObjectURL(attachment.preview)
            }

            return prev.filter(a => a.id !== id)
        })
    }

    useOnInit(() => {
        if (groupId) {
            const id = Number(groupId)
            cambiarGrupo(id)
            obtenerNombreGrupo(id)
        } else {
            obtenerGrupos()
        }
    })

    const cambiarGrupo = async (id: number | undefined) => {
        setSelectedGroupId(id)

        if (!id) {
            setParticipants([])
            actualizarExpense({ participantIds: [], groupId: undefined })
            return
        }

        try {
            setIsLoadingParticipants(true)
            const participantesBack = await usuarioService.obtenerUsuariosDeGrupo(id)

            setParticipants(participantesBack)
            const idsValidos = participantesBack
                .map((p) => p.id)
                .filter((id): id is number => id !== undefined)

            actualizarExpense({
                participantIds: idsValidos,
                groupId: id
            })
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error cargando participantes'
            showToast(mensaje, 'error')
            console.error('Error al cargar participantes:', error)
        } finally {
            setIsLoadingParticipants(false)
        }
    }

    const handleExactAmountChange = (participantId: number, amount: number) => {
        const otrasAsignaciones = expense.allocations.filter(a => a.participantId !== participantId)
        const nuevasAsignaciones = [...otrasAsignaciones, new ExpenseAllocation(participantId, amount)]

        actualizarExpense({
            tipoDivision: TipoDivision.PARTES_EXACTAS,
            allocations: nuevasAsignaciones
        })
    }

    const handlePercentageChange = (participantId: number, percentage: number) => {
        const otrasAsignaciones = expense.allocations.filter(a => a.participantId !== participantId)
        const nuevasAsignaciones = [...otrasAsignaciones, new ExpenseAllocation(participantId, percentage)]

        actualizarExpense({
            tipoDivision: TipoDivision.PORCENTUAL,
            allocations: nuevasAsignaciones
        })
    }

    const crearExpense = async () => {
        const expenseParaValidar = Expense.clone(expense)
        expenseParaValidar.validar()
        setExpense(expenseParaValidar)

        if (!expenseParaValidar.valido()) {
            return
        }

        try {
            const createdExpense = await expenseService.createExpense(expense)

            if (attachments.length > 0) {
                await attachmentService.uploadAttachments(
                    createdExpense.id,
                    attachments
                )
            }

            showToast('¡Gasto creado con éxito!', 'success')

            if (groupId) {
                navigate(`/groups/${groupId}`)
            } else {
                navigate('/')
            }

        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error creando gasto'
            showToast(mensaje, 'error')
            console.error('Error creando gasto:', mensaje)
        }
    }

    const obtenerNombreGrupo = async (id: number) => {
        try {
            const grupo = await obtenerGrupoPorId(id)
            setGroupNameState(grupo.nombre)
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error obteniendo nombre de grupo'
            showToast(mensaje, 'error')
            console.error('Error al obtener nombre del grupo:', error)
        }
    }

    const topLevelErrors = expense.errors

    return (
        <div className="flex flex-col space-y-4">
            <PageTitle title='Nuevo gasto' subtitle='Registrá un movimiento rápido' onBack={() => window.history.back()} />
            <ColumnContainer>
                <div className="space-y-4 pt-2 overflow-hidden">
                    <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-xl flex flex-col items-center">
                        <span className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">Monto total</span>
                        
                        {!useItemTotal ? (
                            <div className="flex items-center justify-center gap-2 w-full max-w-md rounded-2xl border border-primary/30 bg-primary/10 px-4 py-4">
                                <span className="text-3xl font-bold text-primary">$</span>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    pattern="[0-9]*[.,]?[0-9]*"
                                    value={manualTotalInput}
                                    onChange={(event) => handleManualTotalChange(event.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-transparent text-4xl font-bold text-center text-foreground outline-none"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-1 w-full max-w-md rounded-2xl bg-muted/50 px-4 py-4 cursor-not-allowed">
                                <span className="text-3xl font-bold text-muted-foreground">$</span>
                                <div className="text-4xl font-bold text-center text-muted-foreground">
                                    {expense.total.toFixed(2)}
                                </div>
                            </div>
                        )}

                        {!useItemTotal && (
                            <p className="mt-3 text-xs text-muted-foreground">El total manual debe coincidir con la suma de los ítems.</p>
                        )}

                        {useItemTotal && expense.items.length === 0 && (
                            <p className="mt-3 text-sm text-muted-foreground">Agregá ítems para calcular el total automáticamente.</p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl">
                        <div className="text-sm font-semibold text-foreground mb-3">Cómo calcular el total</div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleUseItemTotalChange(false)}
                                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                    !useItemTotal
                                        ? 'border-2 border-primary bg-primary/10 text-foreground shadow-sm'
                                        : 'border border-border bg-background/70 text-muted-foreground hover:bg-muted/50'
                                }`}
                            >
                                📝 Manualmente
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUseItemTotalChange(true)}
                                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                    useItemTotal
                                        ? 'border-2 border-primary bg-primary/10 text-foreground shadow-sm'
                                        : 'border border-border bg-background/70 text-muted-foreground hover:bg-muted/50'
                                }`}
                            >
                                📊 Por ítems
                            </button>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl flex flex-col gap-7">
                        <GroupSelector
                            groups={groups}
                            selectedGroupId={expense.groupId}
                            currentGroupName={groupNameState}
                            isOpen={isGroupsOpen}
                            onToggleOpen={() => setIsGroupsOpen(!isGroupsOpen)}
                            onSelect={(id) => cambiarGrupo(id)}
                            disabled={!!groupId}
                        />

                        <ParticipantSelector
                            participants={participants}
                            selectedIds={expense.participantIds}
                            currentUser={{ id: Number(localStorage.id) } as Usuario}
                            isLoading={isLoadingParticipants}
                            isOpen={isParticipantsOpen}
                            enabled={!!effectiveGroupId}
                            onToggleOpen={() => setIsParticipantsOpen(!isParticipantsOpen)}
                            onToggleParticipant={handleToggleParticipant}
                        />

                        <span className='space-y-2'>
                            <FieldWrapper label="Método de división">
                                <DivisionTypeSelector
                                    value={divisionType}
                                    onChange={(type) => {
                                        setDivisionType(type)
                                        actualizarExpense({ tipoDivision: type })
                                    }}
                                />
                            </FieldWrapper>

                            {(divisionType === TipoDivision.PARTES_EXACTAS || divisionType === TipoDivision.PORCENTUAL || divisionType === TipoDivision.PARTES_IGUALES || divisionType === TipoDivision.ALEATORIO) && (
                                <AllocationSummary
                                    participants={participants}
                                    expense={expense}
                                    onExactAmountChange={divisionType === TipoDivision.PARTES_EXACTAS ? handleExactAmountChange : undefined}
                                    onPercentageChange={divisionType === TipoDivision.PORCENTUAL ? handlePercentageChange : undefined}
                                />
                            )}
                        </span>

                        <FieldWrapper label="Descripción" instruction="¿En qué se gastó?">
                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5">
                                <Receipt className="h-4 w-4 text-muted-foreground shrink-0" />
                                <input
                                    type="text"
                                    value={expense.description}
                                    placeholder="¿En qué se gastó?"
                                    onChange={(event) => actualizarExpense({ description: event.target.value })}
                                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </FieldWrapper>

                        <ExpenseAttachmentsField
                            attachments={attachments}
                            onAdd={handleAddAttachments}
                            onRemove={handleRemoveAttachment}
                        />

                        <CreateExpenseItem items={expense.items} onChange={handleItemsChange} />

                        <CategorySelector
                            label="Categoría"
                            instruction="Elegí un tipo de gasto"
                            categories={CATEGORIES}
                            selectedCategory={expense.category}
                            isOpen={isCategoryOpen}
                            onToggleOpen={() => setIsCategoryOpen(!isCategoryOpen)}
                            onSelect={(categoryId) => actualizarExpense({ category: categoryId })}
                        />

                        <FieldWrapper label="Fecha del gasto">
                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5">
                                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                <input
                                    type="date"
                                    value={expense.date}
                                    onChange={(event) => actualizarExpense({ date: event.target.value })}
                                    className="w-full bg-transparent text-sm text-foreground outline-none"
                                />
                            </div>
                        </FieldWrapper>
                    </div>

                    {/* SECCIÓN FINAL DE ACCIONES Y ERRORES */}
                    <div className="pt-4 space-y-3">
                        {isLoading ? (
                            <ButtonSkeleton className="w-full h-12 rounded-2xl" />
                        ) : (
                            <Button
                                onClick={async () => {
                                    setIsLoading(true)
                                    console.log(expense)
                                    try {
                                        await crearExpense()
                                    } finally {
                                        setIsLoading(false)
                                    }
                                }}
                                disabled={!isOnline || !expense.valido()}
                                className="w-full h-12 rounded-2xl text-md font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                Cargar Gasto
                            </Button>
                        )}

                        {/* Listado dinámico de errores de negocio remanentes */}
                        {topLevelErrors.length > 0 && (
                            <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm space-y-3">
                                {topLevelErrors.map((error) => (
                                    <div key={error.nombre} className="flex items-start gap-3 text-red-600 dark:text-red-400">
                                        <AlertTriangle className="h-5 w-5 shrink-0" />
                                        <span className="font-medium">{error.mensaje}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-center text-[10px] text-muted-foreground mt-4 leading-relaxed px-6 italic">
                            "La vaquita se divide entre todos los miembros del grupo seleccionado automáticamente."
                        </p>
                    </div>
                </div>
            </ColumnContainer>
        </div>
    )
}

// ═════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════════

function mapearCategoria(scanCategory?: string): string {
    if (!scanCategory) return 'OTROS'
    const normalized = scanCategory.toLowerCase()
    const mapping: Record<string, string> = {
        'food': 'COMIDA', 'comida': 'COMIDA',
        'drink': 'BEBIDA', 'bebida': 'BEBIDA',
        'transport': 'TRANSPORTE', 'transporte': 'TRANSPORTE',
        'grocery': 'SUPERMERCADO', 'supermarket': 'SUPERMERCADO', 'supermercado': 'SUPERMERCADO',
        'entertainment': 'ENTRETENIMIENTO', 'ocio': 'ENTRETENIMIENTO',
        'home': 'HOGAR', 'hogar': 'HOGAR',
        'other': 'OTROS', 'otros': 'OTROS',
    }
    return mapping[normalized] || 'OTROS'
}

function convertirItems(scanItems?: LineItem[]): ExpenseItem[] {
    if (!scanItems?.length) return []
    return scanItems.map(item => {
        const cantidad = item.quantity ?? 1
        return new ExpenseItem(
            item.name,
            cantidad,
            item.price
        )
    })
}