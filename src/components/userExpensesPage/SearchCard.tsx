/* eslint-disable no-undef */
import type { ChangeEvent } from 'react'
import { Search } from 'lucide-react'

type SearchCardProps = {
  searchTerm: string
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
  children?: React.ReactNode
}

export default function SearchCard({
  searchTerm,
  onSearchChange,
  children,
}: SearchCardProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative block flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="search"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Buscar gastos..."
          className="
                        h-11
                        w-full
                        rounded-2xl
                        border
                        border-border
                        bg-background
                        py-2
                        pl-9
                        pr-3
                        text-sm
                        text-foreground
                        outline-none
                        transition
                        focus:border-primary
                    "
        />
      </label>

      {children}
    </div>
  )
}