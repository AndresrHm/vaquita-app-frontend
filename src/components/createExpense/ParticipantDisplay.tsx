import type { Usuario } from '@/domain/usuario'

interface ParticipantDisplayProps {
  participants: Usuario[]
  selectedIds: number[]
}

export default function ParticipantDisplay({ participants, selectedIds }: ParticipantDisplayProps) {
  if (participants.length === 0) {
    return <span>Sin participantes</span>
  }

  if (selectedIds.length === participants.length) {
    return <span>Todos</span>
  }

  if (selectedIds.length === 0) {
    return <span>Ninguno</span>
  }

  if (selectedIds.length > participants.length / 2) {
    const excludedNames = participants
      .filter(p => !selectedIds.includes(p.id!))
      .map(p => p.nombre)
      .join(', ')
    return <span>Todos excepto {excludedNames}</span>
  }

  const selectedNames = selectedIds
    .map(id => participants.find(p => p.id === id)?.nombre)
    .filter(Boolean)
    .join(', ')
  return <span>{selectedNames}</span>
}