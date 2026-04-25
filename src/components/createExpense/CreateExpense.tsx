/* eslint-disable no-undef */
import { useState } from 'react'
import { Receipt, Calendar } from 'lucide-react'
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
import type { LineItem, ScanResult } from '@/domain/smartScanDTO'
import { TipoDivision } from '@/domain/enums/tipoDivision'
import { ExpenseAllocation } from '@/domain/expenseAllocation'
import DivisionTypeSelector from './DivisionTypeSelector'
import ExactAmountAllocator from './ExactAmountAllocator'
import CategorySelector from './CategorySelector'
import ParticipantSelector from './ParticipantSelector'
import GroupSelector from './GroupSelector'

type LocationState = {
    scanResult?: ScanResult & { totalAmount: number }
}

export default function CreateExpense() {

    const location = useLocation()

    const [expense, setExpense] = useState<Expense>(() => {
        const scanResult = (location.state as LocationState)?.scanResult

        const newExpense = new Expense(undefined, Number(localStorage.id))

        if (scanResult) {
            newExpense.description = scanResult.description || ''
            newExpense.total = scanResult.totalAmount
            newExpense.date = scanResult.date || new Date().toISOString().split('T')[0]
            newExpense.category = mapearCategoria(scanResult.category)
            newExpense.total = scanResult.totalAmount
            newExpense.items = convertirItems(scanResult.items)
        }

        return newExpense
    })


    const [participants, setParticipants] = useState<Usuario[]>([])
    const [groups, setGroups] = useState<Grupo[]>([])
    const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
    const [isGroupsOpen, setIsGroupsOpen] = useState(false)
    const [isLoadingParticipants, setIsLoadingParticipants] = useState(false)
    const { groupId } = useParams()
    const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(
        groupId ? Number(groupId) : undefined // Si llega la id por props la usamos directamente (nuevo gasto desde groupDetail)
    )
    const effectiveGroupId = (groupId ?? selectedGroupId) as number | undefined
    const [groupNameState, setGroupNameState] = useState<string | undefined>()
    const [divisionType, setDivisionType] = useState<TipoDivision>(TipoDivision.PARTES_IGUALES)

    const navigate = useNavigate()

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
        const total = items.reduce((acc, item) => acc + item.total(), 0)

        actualizarExpense({
            items,
            total
        })
    }

    const obtenerGrupos = async () => {
        try {
            const gruposBack = await obtenerGruposDeUsuario()
            setGroups(gruposBack)
        } catch (error: unknown) {
            console.log(error)
        }
    }

    // Si se pasa la id de grupo usamos esa misma (crear gasto dentro de groupDetail)
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

    const totalAsignado = expense.allocations.reduce((acc, curr) => acc + curr.total, 0)

    const crearExpense = async () => {
        const expenseParaValidar = Expense.clone(expense)
        expenseParaValidar.validar()

        setExpense(expenseParaValidar)
        if (expenseParaValidar.valido()) {
            try {
                await expenseService.createExpense(expense)
                navigate('/')
            } catch (error: unknown) {
                console.error('Error creando gasto:', error.message)
            }
        }
    }

    const obtenerNombreGrupo = async (id: number) => {
        try {
            const grupo = await obtenerGrupoPorId(id)
            setGroupNameState(grupo.nombre)
        } catch (error) {
            console.error('Error al obtener nombre del grupo:', error)
        }
    }

    return (
        <div className="flex flex-col space-y-4">
            <PageTitle title='Nuevo gasto' subtitle='Registrá un movimiento rápido' onBack={() => window.history.back()} />
            <ColumnContainer>
                <div className="space-y-4 pt-2">
                    <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-xl flex flex-col items-center">
                        <span className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Monto total</span>
                        <div className="flex items-center gap-1 w-full max-w-md">
                            <span className="text-3xl font-bold text-primary">$</span>
                            <input
                                type="number"
                                step="1000"
                                placeholder="0"
                                inputMode="decimal"
                                value={expense.total.toFixed(2) || ''}
                                disabled={expense.items.length > 0} // lo desactivamos si hay ítems
                                onChange={(event) => actualizarExpense({ total: Number(event.target.value) || 0 })}
                                className="w-full bg-transparent text-4xl font-bold text-foreground outline-none placeholder:text-muted-foreground/30 text-center"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl space-y-4">
                        <GroupSelector
                            groups={groups}
                            selectedGroupId={expense.groupId}
                            currentGroupName={groupNameState}
                            isOpen={isGroupsOpen}
                            onToggleOpen={() => setIsGroupsOpen(!isGroupsOpen)}
                            onSelect={(id) => cambiarGrupo(id)}
                            disabled={!!groupId} // Si viene por URL, está deshabilitado
                        />

                        <ParticipantSelector
                            participants={participants}
                            selectedIds={expense.participantIds}
                            currentUser={{ id: Number(localStorage.id) } as Usuario} // O el objeto usuario que tengas
                            isLoading={isLoadingParticipants}
                            isOpen={isParticipantsOpen}
                            enabled={!!effectiveGroupId}
                            onToggleOpen={() => setIsParticipantsOpen(!isParticipantsOpen)}
                            onToggleParticipant={handleToggleParticipant}
                        />

                        {/* Selector de Tipo de División */}
                        <FieldWrapper label="Método de división">
                            <DivisionTypeSelector
                                value={divisionType}
                                onChange={(type) => {
                                    setDivisionType(type)
                                    actualizarExpense({ tipoDivision: type })
                                }}
                            />
                        </FieldWrapper>

                        {/* Sección Dinámica para Partes Exactas */}
                        {divisionType === TipoDivision.PARTES_EXACTAS && (
                            <ExactAmountAllocator
                                participants={participants}
                                expense={expense}
                                totalAsignado={totalAsignado}
                                onAmountChange={handleExactAmountChange}
                            />
                        )}

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

                        <CreateExpenseItem items={expense.items} onChange={handleItemsChange} />

                        <CategorySelector
                            label="Categoría"
                            instruction="Elegí un tipo de gasto"
                            categories={CATEGORIES}
                            selectedCategory={expense.category}
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

                    <div className="pt-4">
                        <Button
                            onClick={crearExpense}
                            disabled={!expense.valido()}
                            className="w-full h-12 rounded-2xl text-md font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            Cargar Gasto
                        </Button>
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

/**
 * Mapea la categoría del escaneo (food, transport, etc) a las categorías de tu app
 */
function mapearCategoria(scanCategory?: string): string {
    if (!scanCategory) return 'food'

    const mapping: Record<string, string> = {
        'food': 'food',
        'transport': 'transport',
        'entertainment': 'entertainment',
        'other': 'other'
    }

    return mapping[scanCategory] || 'food'
}

/**
 * Convierte items del escaneo a ExpenseItem si lo necesitas
 */
function convertirItems(scanItems?: LineItem[]): ExpenseItem[] {
    if (!scanItems?.length) return []

    return scanItems.map(item => {
        const cantidad = item.quantity ?? 1

        const precioUnitario =
            cantidad > 0 ? item.price / cantidad : item.price

        return new ExpenseItem(
            item.name,
            cantidad,
            precioUnitario
        )
    })
}

// TODO:
// 1. que quede seleccionada la categoría correspondiente
// 2. que quede seleccionada la fecha correspondiente