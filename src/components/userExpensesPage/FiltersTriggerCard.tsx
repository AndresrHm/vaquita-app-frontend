import { SlidersHorizontal } from 'lucide-react'

type FiltersTriggerCardProps = {
  activeFiltersCount: number
  onOpen: () => void
}

export default function FiltersTriggerCard({
  activeFiltersCount,
  onOpen,
}: FiltersTriggerCardProps) {
  return (
    <button
      onClick={onOpen}
      className="
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-border
                bg-background
                transition
                hover:bg-secondary
            "
      aria-label="Abrir filtros"
    >
      <SlidersHorizontal className="h-4 w-4" />

      {activeFiltersCount > 0 && (
        <span
          className="
                        absolute
                        right-7
                        top-0
                        flex
                        h-5
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-primary
                        px-1
                        text-[10px]
                        font-semibold
                        text-primary-foreground
                    "
        >
          {activeFiltersCount}
        </span>
      )}
    </button>
  )
}