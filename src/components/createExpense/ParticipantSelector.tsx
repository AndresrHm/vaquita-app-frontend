import { Users } from 'lucide-react'
import { Usuario } from '@/domain/usuario'
import ParticipantDisplay from './ParticipantDisplay'
import FieldWrapper from './FieldWrapper'

interface Props {
  participants: Usuario[]
  selectedIds: number[]
  currentUser: Usuario | null // <-- Recibimos el objeto usuario
  isLoading: boolean
  isOpen: boolean
  onToggleOpen: () => void
  onToggleParticipant: (id: number) => void
  enabled: boolean
}

export default function ParticipantSelector({
  participants,
  selectedIds,
  currentUser,
  isLoading,
  isOpen,
  onToggleOpen,
  onToggleParticipant,
  enabled
}: Props) {
  return (
    <FieldWrapper label="¿Quiénes participan del gasto?">
      <div className="relative">
        <div
          className={`relative flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 cursor-pointer 
            ${(!enabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => enabled && !isLoading && onToggleOpen()}
        >
          <Users className={`h-4 w-4 text-muted-foreground shrink-0 ${isLoading ? 'animate-pulse' : ''}`} />
          <span className="w-full text-sm text-foreground">
            {isLoading ? (
              'Cargando integrantes...'
            ) : (
              <ParticipantDisplay participants={participants} selectedIds={selectedIds} />
            )}
          </span>
          <div className="absolute right-3 pointer-events-none text-muted-foreground text-[10px]">
            {isLoading ? '...' : '▼'}
          </div>
        </div>

        {isOpen && enabled && !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
            {participants.map((participant) => {
              // Comparamos contra el objeto recibido
              const isCurrentUser = participant.id === currentUser?.id
              const isSelected = selectedIds.includes(participant.id!)

              return (
                <label
                  key={participant.id}
                  className={`flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer ${isCurrentUser ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isCurrentUser}
                    onChange={() => !isCurrentUser && onToggleParticipant(participant.id!)}
                    className="rounded border-border accent-primary focus:ring-primary"
                  />
                  <span className="text-sm">
                    {participant.nombre} {isCurrentUser && '(Vos)'}
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>
    </FieldWrapper>
  )
}