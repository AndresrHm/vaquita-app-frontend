import type { ChangeEvent } from 'react'
import { ArrowUpDown } from 'lucide-react'

import type { SortValue } from './types'
import { sortOptions } from './constants'

type SortCardProps = {
  sortBy: SortValue
  onSortChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

export default function SortCard({
  sortBy,
  onSortChange,
}: SortCardProps) {
  return (
    <div className="relative">
      <ArrowUpDown className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2" />

      <select
        value={sortBy}
        onChange={onSortChange}
        className="
                    h-11
                    w-11
                    cursor-pointer
                    appearance-none
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    text-transparent
                    transition
                    hover:bg-secondary
                "
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}