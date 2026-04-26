import { TipoDivision } from '@/domain/enums/tipoDivision'

interface Props {
  value: TipoDivision
  onChange: (type: TipoDivision) => void
}

export default function DivisionTypeSelector({ value, onChange }: Props) {
  const options = [
    { id: TipoDivision.PARTES_IGUALES, label: 'Partes Iguales' },
    { id: TipoDivision.PARTES_EXACTAS, label: 'Partes Exactas' },
  ]

  return (
    <div className="flex p-1 bg-background/50 rounded-xl border border-border">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
            value === option.id 
              ? 'bg-card shadow-sm text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}