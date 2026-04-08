import React from 'react'
import type { CategoryOption } from './categories'
import FieldWrapper from './FieldWrapper'

interface CategorySelectorProps {
  label: string
  instruction?: string
  categories: CategoryOption[]
  selectedCategory: string
  onSelect: (categoryId: string) => void
}

export default function CategorySelector({
  label,
  instruction,
  categories,
  selectedCategory,
  onSelect,
}: CategorySelectorProps) {
  return (
    <FieldWrapper label={label} instruction={instruction}>
      <div className="grid grid-cols-3 gap-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`flex flex-col items-center justify-center rounded-xl border p-2 transition-all ${
                isActive
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border bg-background/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-[10px] font-medium mt-1">{category.label}</span>
            </button>
          )
        })}
      </div>
    </FieldWrapper>
  )
}
