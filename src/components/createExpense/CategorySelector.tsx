import { Tag } from 'lucide-react'
import type { CategoryOption } from './categories'
import FieldWrapper from './FieldWrapper'

interface CategorySelectorProps {
  label: string
  instruction?: string
  categories: CategoryOption[]
  selectedCategory: string
  isOpen: boolean
  onToggleOpen: () => void
  onSelect: (categoryId: string) => void
}

export default function CategorySelector({
  label,
  instruction,
  categories,
  selectedCategory,
  isOpen,
  onToggleOpen,
  onSelect,
}: CategorySelectorProps) {

  const selected = categories.find(c => c.id === selectedCategory)

  const displayText = selected
    ? `${selected.icon} ${selected.label}`
    : 'Seleccioná una categoría'

  return (
    <FieldWrapper label={label} instruction={instruction}>
      <div className="relative">

        {/* TRIGGER */}
        <div
          className="relative flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 cursor-pointer"
          onClick={onToggleOpen}
        >
          <Tag className="h-4 w-4 text-muted-foreground shrink-0" />

          <span className="w-full text-sm text-foreground">
            {displayText}
          </span>

          <div className="absolute right-3 pointer-events-none text-muted-foreground text-[10px]">
            {isOpen ? '▲' : '▼'}
          </div>
        </div>

        {/* DROPDOWN */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">

            {categories.map((category) => {
              const isActive = selectedCategory === category.id

              return (
                <div
                  key={category.id}
                  onClick={() => {
                    onSelect(category.id)
                    onToggleOpen()
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer"
                >
                  <span className="text-base">{category.icon}</span>

                  <span className={`text-sm ${isActive ? 'font-medium text-primary' : ''
                    }`}>
                    {category.label}
                  </span>

                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              )
            })}

          </div>
        )}
      </div>
    </FieldWrapper>
  )
}