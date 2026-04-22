import { SlidersHorizontal } from 'lucide-react'

import Card from '@/components/common/card'

type FiltersTriggerCardProps = {
  activeFiltersCount: number
  onOpen: () => void
}

export default function FiltersTriggerCard({ activeFiltersCount, onOpen }: FiltersTriggerCardProps) {
  return (
    <Card className="rounded-2xl border border-border/70 bg-background/80 p-4" onClick={onOpen} aria-label="Abrir filtros">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filtros</p>
          <p className="text-sm text-foreground">
            {activeFiltersCount > 0 ? `${activeFiltersCount} filtro(s) aplicado(s)` : 'Abrir modal de filtros aplicables'}
          </p>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-foreground" />
      </div>
    </Card>
  )
}
