import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Receipt, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GroupsContainer from '@/components/groupsPage/GroupsContainer'
import { CATEGORIES } from '@/components/createExpense/categories'
import FieldWrapper from '@/components/createExpense/FieldWrapper'
import ParticipantDisplay from '@/components/createExpense/ParticipantDisplay'
import { Expense } from '@/domain/expense'

// Mock de grupos (esto después vendrá del back)
const mockUserGroups = [
  { id: 'g1', name: 'Centro de Estudiantes', emoji: '📚' },
  { id: 'g2', name: 'Los Pibes', emoji: '⚽' },
  { id: 'g4', name: 'Depto Palermo', emoji: '🏠' },
  { id: 'g6', name: 'Asado del Finde', emoji: '🔥' },
]

// Mock de participantes por grupo (esto después vendrá del back)
const participantsByGroup = {
  g1: [
    { id: 'p1', name: 'Juan' },
    { id: 'p2', name: 'María' },
    { id: 'p3', name: 'Pedro' },
  ],
  g2: [
    { id: 'p4', name: 'Ana' },
    { id: 'p5', name: 'Luis' },
  ],
  g4: [
    { id: 'p6', name: 'Carlos' },
    { id: 'p7', name: 'Sofia' },
    { id: 'p8', name: 'Diego' },
  ],
  g6: [
    { id: 'p9', name: 'Laura' },
    { id: 'p10', name: 'Miguel' },
  ],
}

export default function CreateManualExpensePage() {
  const navigate = useNavigate()

  const [expense, setExpense] = useState(new Expense())
  const [participants, setParticipants] = useState<{ id: string; name: string }[]>([])
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)

  const actualizarExpense = (cambios: Partial<Expense>) => {
    const expenseClon = new Expense()
    Object.assign(expenseClon, expense)
    Object.assign(expenseClon, cambios)
    setExpense(expenseClon)
  }

  const handleToggleParticipant = (id: string) => {
    const newParticipantIds = expense.participantIds.includes(id)
      ? expense.participantIds.filter((v) => v !== id)
      : [...expense.participantIds, id]
    actualizarExpense({ participantIds: newParticipantIds })
  }

  useEffect(() => {
    if (expense.groupId) {
      const groupParticipants = participantsByGroup[expense.groupId as keyof typeof participantsByGroup] || []
      setParticipants(groupParticipants)
      actualizarExpense({ participantIds: groupParticipants.map((participant) => participant.id) })
    } else {
      setParticipants([])
      actualizarExpense({ participantIds: [] })
    }
  }, [expense.groupId])

  const crearExpense = async () => {
    const expenseParaValidar = Expense.clone(expense)
    expenseParaValidar.validar()

    setExpense(expenseParaValidar)
    if (expenseParaValidar.valido()) {
      try {
        // Aquí iría la llamada al service
        console.log('Gasto creado:', expense)
        //navigate('/')
      } catch (error: unknown) {
        console.error('Error creando gasto:', error)
      }
    }
  }

  return (
    <div className="flex flex-col space-y-4 min-h-[calc(100vh-5rem)]">
      {/* HEADER GLOBAL */}
      <div className="-mx-4 rounded-b-2xl border border-border bg-card/70 px-6 py-5 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 bg-background/50 border border-border text-foreground hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Nuevo Gasto</h1>
            <p className="text-xs text-muted-foreground">Registrá un movimiento rápido</p>
          </div>
        </div>
      </div>

      <GroupsContainer>
        <div className="space-y-4 pt-2">
          {/* SECTOR MONTO */}
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

          {/* FORMULARIO */}
          <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl space-y-4">
            {/* Grupo */}
            <FieldWrapper label="¿A qué grupo pertenece?" instruction="Seleccioná un grupo">
              <div className="relative flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <select
                  value={expense.groupId}
                  onChange={(e) => actualizarExpense({ groupId: e.target.value })}
                  className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-card text-muted-foreground">
                    Seleccioná un grupo
                  </option>
                  {mockUserGroups.map((group) => (
                    <option key={group.id} value={group.id} className="bg-card text-foreground">
                      {group.emoji} {group.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-muted-foreground text-[10px]">▼</div>
              </div>
            </FieldWrapper>

            {/* Participantes */}
            <FieldWrapper label="¿Quiénes participan del gasto?">
              <div className="relative">
                <div
                  className={`relative flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 cursor-pointer ${!expense.groupId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => expense.groupId && setIsParticipantsOpen(!isParticipantsOpen)}
                >
                  <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="w-full text-sm text-foreground">
                    <ParticipantDisplay participants={participants} selectedIds={expense.participantIds} />
                  </span>
                  <div className="absolute right-3 pointer-events-none text-muted-foreground text-[10px]">▼</div>
                </div>
                {isParticipantsOpen && expense.groupId && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
                    {participants.map((participant) => (
                      <label key={participant.id} className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer">
                        <input
                          type="checkbox"
                          checked={expense.participantIds.includes(participant.id)}
                          onChange={() => handleToggleParticipant(participant.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{participant.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </FieldWrapper>

            {/* Descripción */}
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

            {/* Categoría */}
            <FieldWrapper label="Categoría" instruction="Elegí un tipo de gasto">
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => actualizarExpense({ category: category.id })}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                      expense.category === category.id
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

            {/* Fecha */}
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

          {/* BOTÓN FINAL */}
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
      </GroupsContainer>
    </div>
  )
}