import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Receipt, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GroupsContainer from '@/components/groupsPage/GroupsContainer'
import GroupSelect from '@/components/createExpense/GroupSelect'
import CategorySelector from '@/components/createExpense/CategorySelector'
import TotalAmount from '@/components/createExpense/TotalAmount'
import TextField from '@/components/createExpense/TextField'
import ParticipantSelect from '@/components/createExpense/ParticipantSelect'
import { CATEGORIES } from '@/components/createExpense/categories'

// Mock de grupos (esto después vendrá del back)
const mockUserGroups = [
  { id: 'g1', name: 'Centro de Estudiantes', emoji: '📚' },
  { id: 'g2', name: 'Los Pibes', emoji: '⚽' },
  { id: 'g4', name: 'Depto Palermo', emoji: '🏠' },
  { id: 'g6', name: 'Asado del Finde', emoji: '🔥' },
]

// Mock de participantes por grupo (esto después vendrá del back
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

  // Estados del formulario
  const [monto, setMonto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [participants, setParticipants] = useState<{ id: string; name: string }[]>([])
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  const [categoria, setCategoria] = useState('OTROS')

  // Actualizar participantes cuando cambia el grupo
  useEffect(() => {
    if (selectedGroupId) {
      setParticipants(participantsByGroup[selectedGroupId as keyof typeof participantsByGroup] || [])
      setSelectedParticipants([])
    } else {
      setParticipants([])
      setSelectedParticipants([])
    }
  }, [selectedGroupId])

  const handleGuardar = () => {
    const montoNumerico = Number(monto)

    // Validamos que el grupo esté seleccionado además de los otros campos
    if (!selectedGroupId || !monto || !descripcion || Number.isNaN(montoNumerico)) return

    console.log({
      monto: montoNumerico,
      descripcion,
      fecha,
      groupId: selectedGroupId,
      excludedParticipants: selectedParticipants,
    })
    navigate('/')
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
          <TotalAmount
            label="Monto total"
            value={monto}
            onChange={setMonto}
            placeholder="0"
            currencySymbol="$"
          />

          {/* FORMULARIO */}
          <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl space-y-4">

            <GroupSelect
              label="¿A qué grupo pertenece?"
              instruction="Seleccioná un grupo"
              value={selectedGroupId}
              options={mockUserGroups}
              onChange={setSelectedGroupId}
            />

            <ParticipantSelect
              label="¿Quiénes participan del gasto?"
              value={selectedParticipants}
              options={participants}
              onChange={setSelectedParticipants}
              disabled={!selectedGroupId}
            />

            <TextField
              label="Descripción"
              placeholder="¿En qué se gastó?"
              value={descripcion}
              onChange={setDescripcion}
              icon={<Receipt className="h-4 w-4 text-muted-foreground shrink-0" />}
            />

            <CategorySelector
              label="Categoría"
              instruction="Elegí un tipo de gasto"
              categories={CATEGORIES}
              selectedCategory={categoria}
              onSelect={setCategoria}
            />

            <TextField
              label="Fecha del gasto"
              type="date"
              value={fecha}
              onChange={setFecha}
              icon={<Calendar className="h-4 w-4 text-muted-foreground shrink-0" />}
            />
          </div>

          {/* BOTÓN FINAL */}
          <div className="pt-4">
            <Button
              onClick={handleGuardar}
              disabled={!selectedGroupId || !monto || !descripcion}
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