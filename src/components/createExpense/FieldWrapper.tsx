import React from 'react'

interface FieldWrapperProps {
  label: string
  instruction?: string
  children: React.ReactNode
}

export default function FieldWrapper({ label, instruction, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-xs font-medium text-muted-foreground ml-1">{label}</label>
        {instruction ? <span className="text-[10px] text-muted-foreground">{instruction}</span> : null}
      </div>
      {children}
    </div>
  )
}
