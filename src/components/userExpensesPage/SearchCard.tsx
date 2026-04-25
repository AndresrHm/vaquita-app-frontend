import type { ChangeEvent } from 'react'
import { Search } from 'lucide-react'

import Card from '@/components/common/card'

type SearchCardProps = {
  searchTerm: string
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function SearchCard({ searchTerm, onSearchChange }: SearchCardProps) {
  return (
    <Card className="rounded-2xl border border-border/70 bg-background/80 p-4" interactive={false}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Buscar</p>
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Buscar por título, grupo o categoría (mínimo 3 caracteres)"
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </label>
      </div>
    </Card>
  )
}
