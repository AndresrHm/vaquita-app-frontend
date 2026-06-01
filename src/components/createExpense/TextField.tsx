/* eslint-disable no-undef */
import type { ReactNode } from 'react'
import FieldWrapper from './FieldWrapper'

interface TextFieldProps {
  label: string
  instruction?: string
  icon?: ReactNode
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}

export default function TextField({
  label,
  instruction,
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  inputMode,
}: TextFieldProps) {
  return (
    <FieldWrapper label={label} instruction={instruction}>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5">
        {icon ? <span className="text-muted-foreground shrink-0">{icon}</span> : null}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
        />
      </div>
    </FieldWrapper>
  )
}
