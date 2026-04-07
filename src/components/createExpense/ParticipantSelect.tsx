import { useState } from 'react'
import { Users } from 'lucide-react'
import FieldWrapper from './FieldWrapper'

export interface ParticipantOption {
  id: string
  name: string
}

interface ParticipantSelectProps {
  label: string
  value: string[]
  options: ParticipantOption[]
  onChange: (ids: string[]) => void
  disabled?: boolean
}

export default function ParticipantSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: ParticipantSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const displayText =
    options.length === 0
      ? 'Sin participantes'
      : value.length === 0
      ? 'Todos'
      : value.map((id) => options.find((o) => o.id === id)?.name).filter(Boolean).join(', ')

  const handleToggle = (id: string) => {
    const newValue = value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    onChange(newValue)
  }

  return (
    <FieldWrapper label={label}>
      <div className="relative">
        <div
          className={`relative flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="w-full text-sm text-foreground">{displayText}</span>
          <div className="absolute right-3 pointer-events-none text-muted-foreground text-[10px]">▼</div>
        </div>
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
            {options.map(option => (
              <label key={option.id} className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.includes(option.id)}
                  onChange={() => handleToggle(option.id)}
                  className="rounded"
                />
                <span className="text-sm">{option.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </FieldWrapper>
  )
}