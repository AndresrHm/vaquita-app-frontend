import React from 'react'
import { Users } from 'lucide-react'
import FieldWrapper from './FieldWrapper'

export interface GroupOption {
  id: string
  name: string
  emoji: string
}

interface GroupSelectProps {
  label: string
  instruction: string
  value: string
  options: GroupOption[]
  onChange: (groupId: string) => void
}

export default function GroupSelect({
  label,
  instruction,
  value,
  options,
  onChange,
}: GroupSelectProps) {
  return (
    <FieldWrapper label={label} instruction={instruction}>
      <div className="relative flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5">
        <Users className="h-4 w-4 text-muted-foreground shrink-0" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
        >
          <option value="" disabled className="bg-card text-muted-foreground">
            {instruction}
          </option>
          {options.map((group) => (
            <option key={group.id} value={group.id} className="bg-card text-foreground">
              {group.emoji} {group.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-muted-foreground text-[10px]">▼</div>
      </div>
    </FieldWrapper>
  )
}
