import type { ChangeEvent } from 'react'

import Card from '@/components/common/card'
import Select from '@/components/ui/select'

import { sortOptions } from './constants'
import type { SortValue } from './types'

type SortCardProps = {
  sortBy: SortValue
  onSortChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

export default function SortCard({ sortBy, onSortChange }: SortCardProps) {
  return (
    <Card className="rounded-2xl border border-border/70 bg-background/80 p-4" interactive={false}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ordenar</p>
        <Select value={sortBy} onChange={onSortChange}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </Card>
  )
}
