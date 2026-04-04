interface TotalAmountControllerProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  currencySymbol?: string
}

export default function TotalAmount({
  label,
  value,
  onChange,
  placeholder,
  currencySymbol = '$',
}: TotalAmountControllerProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-xl flex flex-col items-center">
      <span className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-1 w-full max-w-md">
        <span className="text-3xl font-bold text-primary">{currencySymbol}</span>
        <input
          type="number"
          step="0.01"
          placeholder={placeholder}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-4xl font-bold text-foreground outline-none placeholder:text-muted-foreground/30 text-center"
        />
      </div>
    </div>
  )
}

