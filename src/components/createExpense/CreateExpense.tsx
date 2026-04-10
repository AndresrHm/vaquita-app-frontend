import { useState, useEffect } from 'react'
import { Receipt, Calendar, Users, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/components/createExpense/categories'
import CreateExpenseItem from '@/components/createExpense/CreateExpenseItem'
import FieldWrapper from '@/components/createExpense/FieldWrapper'
import ParticipantDisplay from '@/components/createExpense/ParticipantDisplay'
import { Expense } from '@/domain/expense'
import type { ExpenseItem } from '@/domain/expenseItem'
import { expenseService } from '@/service/expenseService'
import ColumnContainer from '@/components/common/columnContainer'
import PageTitle from '@/components/common/pageTitle'
import { usuarioService } from '@/service/usuarioService'
import type { Usuario } from '@/domain/usuario'
import type { Grupo } from '@/domain/Grupo'
import { obtenerGruposDeUsuario } from '@/service/groupsService'
import { useOnInit } from '@/customHooks/hooks'
import IconNavButton from '../common/IconNavButton'
import { useNavigate } from 'react-router-dom'

const mockCurrentUser = { id: 1, name: 'Juan' }

type Props = {
    groupId?: string | number | undefined
    onBack?: () => void
}

export default function CreateExpense({ groupId, onBack }: Props) {
    const [expense, setExpense] = useState(new Expense(undefined, mockCurrentUser.id))
    const [participants, setParticipants] = useState<Usuario[]>([])
    const [groups, setGroups] = useState<Grupo[]>([])
    const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
    const [isLoadingParticipants, setIsLoadingParticipants] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined)

    const effectiveGroupId = (groupId ?? selectedGroupId) as number | undefined

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
        actualizarExpense({ items })
    }

    const obtenerGrupos = async () => {
        try {
            const gruposBack = await obtenerGruposDeUsuario(mockCurrentUser.id)
            setGroups(gruposBack)
        } catch (error: unknown) {
            console.log(error)
        }
    }

    useOnInit(() => {
        obtenerGrupos()
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

    const crearExpense = async () => {
        const expenseParaValidar = Expense.clone(expense)
        expenseParaValidar.validar()

        setExpense(expenseParaValidar)
        if (expenseParaValidar.valido()) {
            try {
                await expenseService.createExpense(expense)
                navigate('/')
            } catch (error: unknown) {
                console.error('Error creando gasto:', error)
            }
        }
    }

    return (
        <div className="flex flex-col space-y-4">
            <PageTitle>
                <div className="max-w-2xl mx-auto px-4 flex items-center justify-between relative">
                    <div className="flex items-center space-x-3">
                        <IconNavButton ariaLabel="Volver" onClick={() => window.history.back()} icon={<ChevronLeft className="h-5 w-5" />} />
                    </div>
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-foreground">Nuevo gasto</h2>
                </div>
            </PageTitle>

            <ColumnContainer>
                <div className="space-y-4 pt-2">
                    <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-xl flex flex-col items-center">
                        <span className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Monto total</span>
                        <div className="flex items-center gap-1 w-full max-w-md">
                            <span className="text-3xl font-bold text-primary">$</span>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                inputMode="decimal"
                                value={expense.total || ''}
                                onChange={(event) => actualizarExpense({ total: Number(event.target.value) || 0 })}
                                className="w-full bg-transparent text-4xl font-bold text-foreground outline-none placeholder:text-muted-foreground/30 text-center"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl space-y-4">
                        {!groupId && (
                            <FieldWrapper label="¿A qué grupo pertenece?" instruction="Seleccioná un grupo">
                                <div className="relative flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5">
                                    <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <select
                                        value={expense.groupId || ''}
                                        onChange={(e) => {
                                            const val = Number(e.target.value) || undefined
                                            cambiarGrupo(val)
                                        }}
                                        className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer">
                                        <option value="" disabled className="bg-card text-muted-foreground">
                                            Seleccioná un grupo
                                        </option>
                                        {groups.map((group) => (
                                            <option key={group.id} value={String(group.id)} className="bg-card text-foreground">
                                                {group.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 pointer-events-none text-muted-foreground text-[10px]">▼</div>
                                </div>
                            </FieldWrapper>
                        )}

                        <FieldWrapper label="¿Quiénes participan del gasto?">
                            <div className="relative">
                                <div
                                    className={`relative flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 cursor-pointer 
        ${(!effectiveGroupId || isLoadingParticipants) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => effectiveGroupId && !isLoadingParticipants && setIsParticipantsOpen(!isParticipantsOpen)}
                                >
                                    <Users className={`h-4 w-4 text-muted-foreground shrink-0 ${isLoadingParticipants ? 'animate-pulse' : ''}`} />
                                    <span className="w-full text-sm text-foreground">
                                        {isLoadingParticipants ? (
                                            'Cargando integrantes...'
                                        ) : (
                                            <ParticipantDisplay participants={participants} selectedIds={expense.participantIds} />
                                        )}
                                    </span>
                                    <div className="absolute right-3 pointer-events-none text-muted-foreground text-[10px]">
                                        {isLoadingParticipants ? '...' : '▼'}
                                    </div>
                                </div>

                                {isParticipantsOpen && effectiveGroupId && !isLoadingParticipants && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
                                        {participants.length > 0 ? (
                                            participants.map((participant) => (
                                                <label key={participant.id} className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={expense.participantIds.includes(participant.id!)}
                                                        onChange={() => handleToggleParticipant(participant.id!)}
                                                        className="rounded border-primary text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm">{participant.nombre}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-xs text-muted-foreground text-center italic">
                                                El grupo no tiene integrantes
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </FieldWrapper>

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

                        <FieldWrapper label="Categoría" instruction="Elegí un tipo de gasto">
                            <div className="grid grid-cols-3 gap-2">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => actualizarExpense({ category: category.id })}
                                        className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${expense.category === category.id
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border bg-background/70 text-muted-foreground hover:bg-muted'
                                            }`}
                                    >
                                        <span className="text-lg">{category.icon}</span>
                                        <span className="text-[10px] font-medium mt-1">{category.label}</span>
                                    </button>
                                ))}
                            </div>
                        </FieldWrapper>

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