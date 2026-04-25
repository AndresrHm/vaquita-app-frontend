import { Users } from 'lucide-react'
import { Grupo } from '@/domain/Grupo'
import FieldWrapper from './FieldWrapper'

interface Props {
  groups: Grupo[]
  selectedGroupId?: number
  currentGroupName?: string // Para cuando viene de la URL y no tenemos la lista
  isOpen: boolean
  onToggleOpen: () => void
  onSelect: (id: number) => void
  disabled: boolean
}

export default function GroupSelector({
  groups,
  selectedGroupId,
  currentGroupName,
  isOpen,
  onToggleOpen,
  onSelect,
  disabled
}: Props) {
  
  // Determinamos qué texto mostrar en el botón
  const selectedGroup = groups.find(g => g.id === selectedGroupId)
  const displayText = selectedGroup?.nombre || currentGroupName || 'Seleccioná un grupo'

  return (
    <FieldWrapper label="Grupo">
      <div className="relative">
        <div
          className={`relative flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 cursor-pointer 
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && onToggleOpen()}
        >
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="w-full text-sm text-foreground">
            {displayText}
          </span>
          <div className="absolute right-3 pointer-events-none text-muted-foreground text-[10px]">
            {disabled ? '' : (isOpen ? '▲' : '▼')}
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-40 overflow-y-auto">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer"
                onClick={() => {
                  onSelect(Number(group.id))
                  onToggleOpen() // Cerramos al seleccionar
                }}
              >
                <div className={`w-2 h-2 rounded-full ${selectedGroupId === group.id ? 'bg-primary' : 'bg-transparent'}`} />
                <span className={`text-sm ${selectedGroupId === group.id ? 'font-medium text-primary' : ''}`}>
                  {group.nombre}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </FieldWrapper>
  )
}