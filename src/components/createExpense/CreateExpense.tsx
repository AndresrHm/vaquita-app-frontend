/* eslint-disable no-undef */
import { useEffect, useState } from 'react'
import { Calendar, AlertTriangle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/components/createExpense/categories'
import CreateExpenseItem from '@/components/createExpense/CreateExpenseItem'
import { Expense } from '@/domain/expense'
import { ExpenseItem } from '@/domain/expenseItem'
import { expenseService } from '@/service/expenseService'
import ColumnContainer from '@/components/common/columnContainer'
import PageTitle from '@/components/common/pageTitle'
import CollapsibleCard from '@/components/common/collapsibleCard'
import { usuarioService } from '@/service/usuarioService'
import type { Usuario } from '@/domain/usuario'
import type { Grupo } from '@/domain/Grupo'
import { obtenerGrupoPorId, obtenerGrupoSettings, obtenerGruposDeUsuario } from '@/service/groupsService'
import { useOnInit } from '@/customHooks/hooks'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
    CURRENCY_LABELS,
    CURRENCY_SYMBOLS,
    SUPPORTED_CURRENCIES,
    isSupportedCurrency,
    type SupportedCurrency,
} from '@/domain/currency'
import {
    type ExpenseAttachment,
    type LineItem,
    type ScanResult
} from '@/domain/smartScanDTO'
import { TipoDivision } from '@/domain/enums/tipoDivision'
import DivisionTypeSelector from './DivisionTypeSelector'
import AllocationSummary from './AllocationSummary'
import CategorySelector from './CategorySelector'
import ParticipantSelector from './ParticipantSelector'
import GroupSelector from './GroupSelector'
import { useToast } from '@/customHooks/useToast'
import { useNetwork } from '@/customHooks/useNetwork'
import ExpenseAttachmentsField from './ExpenseAttachmentsField'
import { attachmentService } from '@/service/attachmentService'
import { convertCurrency, type CurrencyConversionResult } from '../../service/currencyService'
import ButtonSkeleton from '../common/ButtonSkeleton'

type LocationState = {
    scanResult?: ScanResult & { totalAmount: number }
    attachments?: ExpenseAttachment[]
}

type ScanCurrency = SupportedCurrency

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

    const [currency, setCurrency] = useState<ScanCurrency>(() => {
        return resolveCurrencyCode(locationState?.scanResult?.currency)
    })

    const [expense, setExpense] = useState<Expense>(() => {
        const scanResult = (location.state as LocationState)?.scanResult
        const initialCurrency = resolveCurrencyCode(scanResult?.currency)

        const newExpense = new Expense(undefined, Number(localStorage.id))
        newExpense.monedaOriginal = initialCurrency

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
    const [groupCurrency, setGroupCurrency] = useState<string | null>(null)
    const [conversionPreview, setConversionPreview] = useState<CurrencyConversionResult | null>(null)
    const [isConvertingCurrency, setIsConvertingCurrency] = useState(false)

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

    useEffect(() => {
        let cancelled = false

        const sourceCurrency = expense.monedaOriginal?.trim().toUpperCase()
        const destinationCurrency = groupCurrency?.trim().toUpperCase()

        if (!sourceCurrency || !destinationCurrency || sourceCurrency === destinationCurrency || expense.total <= 0) {
            setConversionPreview(null)
            return () => {
                cancelled = true
            }
        }

        const runConversion = async () => {
            try {
                setIsConvertingCurrency(true)
                const result = await convertCurrency(sourceCurrency, destinationCurrency, expense.total)
                if (!cancelled) {
                    setConversionPreview(result)
                }
            } catch {
                if (!cancelled) {
                    setConversionPreview(null)
                }
            } finally {
                if (!cancelled) {
                    setIsConvertingCurrency(false)
                }
            }
        }

        void runConversion()

        return () => {
            cancelled = true
        }
    }, [expense.total, expense.monedaOriginal, groupCurrency])

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
            setGroupCurrency(null)
            setConversionPreview(null)
            actualizarExpense({ participantIds: [], groupId: undefined })
            return
        }

        try {
            setIsLoadingParticipants(true)
            const [participantesBack, grupoSettings] = await Promise.all([
                usuarioService.obtenerUsuariosDeGrupo(id),
                obtenerGrupoSettings(id),
            ])

            setParticipants(participantesBack)
            setGroupCurrency(grupoSettings.moneda)
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
        const nuevasAsignaciones = {
            ...expense.allocations,
            [participantId]: amount,
        }

        actualizarExpense({
            tipoDivision: TipoDivision.PARTES_EXACTAS,
            allocations: nuevasAsignaciones
        })
    }

    const handlePercentageChange = (participantId: number, percentage: number) => {
        const nuevasAsignaciones = {
            ...expense.allocations,
            [participantId]: percentage,
        }

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
                                <span className="text-3xl font-bold text-primary">{CURRENCY_SYMBOLS[currency]}</span>
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
                                <span className="text-3xl font-bold text-muted-foreground">{CURRENCY_SYMBOLS[currency]}</span>
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
                        {/* Selección de moneda */}
                        <div className="w-full max-w-md">
                            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Seleccionar moneda</label>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                {locationState?.scanResult?.currency &&
                                    isSupportedCurrency(locationState.scanResult.currency) && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                                                <Sparkles size={13} />

                                                Detectada por IA →
                                                <span className="font-bold">
                                                    {locationState.scanResult.currency}
                                                </span>
                                            </div>

                                            {currency !== locationState.scanResult.currency && (
                                                <div className="inline-flex items-center rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                                                    Usando →
                                                    <span className="ml-1 font-semibold text-foreground">
                                                        {currency}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <select
                                    value={currency}
                                    onChange={(e) => {
                                        const v = (e.target.value as ScanCurrency)
                                        setCurrency(v)
                                        actualizarExpense({ monedaOriginal: v })
                                    }}
                                    className="w-full rounded-xl border border-border bg-background/70 px-3 py-2 text-sm font-semibold text-foreground"
                                >
                                    {SUPPORTED_CURRENCIES.map((c) => (
                                        <option key={c} value={c}>{`${c} - ${CURRENCY_LABELS[c]}`}</option>
                                    ))}
                                </select>

                            </div>

                            {isConvertingCurrency && (
                                <p className="mt-2 text-xs text-muted-foreground">Actualizando conversión para la moneda del grupo...</p>
                            )}

                            {!isConvertingCurrency && conversionPreview && (
                                <div className="mt-3 w-full max-w-md rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-foreground">
                                    <p className="font-semibold">
                                        En el grupo se verá aprox. {conversionPreview.to} {conversionPreview.convertedAmount.toFixed(2)}
                                    </p>
                                    <p className="mt-1 text-muted-foreground">
                                        Tasa aplicada: {conversionPreview.exchangeRate.toFixed(4)} ({conversionPreview.from} → {conversionPreview.to})
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl">
                        <div className="text-sm font-medium text-foreground mb-3">Cómo calcular el total</div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleUseItemTotalChange(false)}
                                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${!useItemTotal
                                    ? 'border-2 border-primary bg-primary/10 text-foreground shadow-sm'
                                    : 'border border-border bg-background/70 text-muted-foreground hover:bg-muted/50'
                                    }`}
                            >
                                📝 Manualmente
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUseItemTotalChange(true)}
                                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${useItemTotal
                                    ? 'border-2 border-primary bg-primary/10 text-foreground shadow-sm'
                                    : 'border border-border bg-background/70 text-muted-foreground hover:bg-muted/50'
                                    }`}
                            >
                                📊 Por ítems
                            </button>
                        </div>
                    </div>

                    <CollapsibleCard
                        title="Grupo y participantes"
                        subtitle="Elegí dónde cargar el gasto y quiénes participan"
                        createExpense
                    >
                        <div className="space-y-3">
                            <div className="mt-2 space-y-5 p-4 bg-card/70 rounded-2xl border border-border/50">
                                <GroupSelector
                                    groups={groups}
                                    selectedGroupId={expense.groupId}
                                    currentGroupName={groupNameState}
                                    isOpen={isGroupsOpen}
                                    onToggleOpen={() => setIsGroupsOpen(!isGroupsOpen)}
                                    onSelect={(id) => cambiarGrupo(id)}
                                    disabled={!!groupId}
                                />

                                <div className="border-t border-border/50 pt-4">
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
                                </div>
                            </div>
                        </div>
                    </CollapsibleCard>

                    <CollapsibleCard
                        title="Método de división"
                        subtitle="Definí cómo se reparte el gasto"
                        createExpense
                    >
                        <div className="space-y-3">
                            <div className="mt-2 space-y-3 p-4 bg-card/70 rounded-2xl border border-border/50">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Método de división</label>
                                    <DivisionTypeSelector
                                        value={divisionType}
                                        onChange={(type) => {
                                            setDivisionType(type)
                                            actualizarExpense({ tipoDivision: type })
                                        }}
                                    />
                                </div>

                                {(divisionType === TipoDivision.PARTES_EXACTAS || divisionType === TipoDivision.PORCENTUAL || divisionType === TipoDivision.PARTES_IGUALES || divisionType === TipoDivision.ALEATORIO) && (
                                    <div className="border-t border-border/50 pt-3">
                                        <AllocationSummary
                                            participants={participants}
                                            expense={expense}
                                            onExactAmountChange={divisionType === TipoDivision.PARTES_EXACTAS ? handleExactAmountChange : undefined}
                                            onPercentageChange={divisionType === TipoDivision.PORCENTUAL ? handlePercentageChange : undefined}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CollapsibleCard>

                    <CollapsibleCard
                        title="Descripción"
                        subtitle="Agregá una nota para identificar el gasto"
                        createExpense
                    >
                        <div className="space-y-3">
                            <div className="mt-2 space-y-1 p-4 bg-card/70 rounded-2xl border border-border/50">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Descripción / Nota</label>
                                <textarea
                                    value={expense.description}
                                    placeholder="¿En qué se gastó?"
                                    onChange={(event) => actualizarExpense({ description: event.target.value })}
                                    rows={3}
                                    className="w-full pl-1 bg-transparent border-none text-sm text-muted-foreground focus:ring-0 p-0 resize-y min-h-20 placeholder:text-muted-foreground/50 outline-none"
                                />
                            </div>
                        </div>
                    </CollapsibleCard>

                    <CollapsibleCard
                        title="Comprobantes"
                        subtitle={`${attachments.length} archivo${attachments.length === 1 ? '' : 's'} adjunto${attachments.length === 1 ? '' : 's'}`}
                        createExpense
                    >
                        <div className="space-y-3">
                            <div className="mt-2 p-4 bg-card/70 rounded-2xl border border-border/50">
                                <ExpenseAttachmentsField
                                    attachments={attachments}
                                    onAdd={handleAddAttachments}
                                    onRemove={handleRemoveAttachment}
                                />
                            </div>
                        </div>
                    </CollapsibleCard>

                    <CollapsibleCard
                        title="Ítems del gasto"
                        subtitle={`${expense.items.length} ítem${expense.items.length === 1 ? '' : 's'} cargado${expense.items.length === 1 ? '' : 's'}`}
                        createExpense
                    >
                        <div className="space-y-3">
                            <div className="mt-2 p-4 bg-card/70 rounded-2xl border border-border/50">
                                <CreateExpenseItem items={expense.items} onChange={handleItemsChange} />
                            </div>
                        </div>
                    </CollapsibleCard>

                    <CollapsibleCard
                        title="Categoría"
                        subtitle="Elegí un tipo de gasto"
                        createExpense
                    >
                        <div className="space-y-3">
                            <div className="mt-2 p-4 bg-card/70 rounded-2xl border border-border/50">
                                <CategorySelector
                                    label="Categoría"
                                    instruction="Elegí un tipo de gasto"
                                    categories={CATEGORIES}
                                    selectedCategory={expense.category}
                                    isOpen={isCategoryOpen}
                                    onToggleOpen={() => setIsCategoryOpen(!isCategoryOpen)}
                                    onSelect={(categoryId) => actualizarExpense({ category: categoryId })}
                                />
                            </div>
                        </div>
                    </CollapsibleCard>

                    <CollapsibleCard
                        title="Fecha"
                        subtitle="Indicá cuándo se realizó el gasto"
                        createExpense
                    >
                        <div className="space-y-3">
                            <div className="mt-2 space-y-1 p-4 bg-card/70 rounded-2xl border border-border/50">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Fecha del gasto</label>
                                <div className="flex items-center gap-3 border-t border-border/50 pt-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <input
                                        type="date"
                                        value={expense.date}
                                        onChange={(event) => actualizarExpense({ date: event.target.value })}
                                        className="w-full bg-transparent border-none text-sm text-foreground outline-none focus:ring-0 p-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </CollapsibleCard>

                    <div className="pt-4 space-y-3 pb-3">
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

function resolveCurrencyCode(currency?: string): ScanCurrency {
    const normalized = currency?.trim().toUpperCase()

    if (isSupportedCurrency(normalized)) {
        return normalized
    }

    return 'ARS'
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
