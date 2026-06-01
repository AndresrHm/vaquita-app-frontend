import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

import Modal from '@/components/common/modal'
import { Button } from '@/components/ui/button'
import Select from '@/components/ui/select'
import { ExpensesFilterTabs } from '@/domain/expenseItemDTO'

import { categoryOptions } from './constants'
import type { FilterState } from './types'

type UserExpensesFiltersModalProps = {
  isOpen: boolean
  draftFilters: FilterState
  hasInvalidFilters: boolean
  hasInvalidDateRange: boolean
  hasInvalidAmountRange: boolean
  onClose: () => void
  onClear: () => void
  onApply: () => void
  onToggleCategory: (category: FilterState['categoria'][number]) => void
  setDraftFilters: Dispatch<SetStateAction<FilterState>>
}

export default function UserExpensesFiltersModal({
  isOpen,
  draftFilters,
  hasInvalidFilters,
  hasInvalidDateRange,
  hasInvalidAmountRange,
  onClose,
  onClear,
  onApply,
  onToggleCategory,
  setDraftFilters,
}: UserExpensesFiltersModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="Filtros aplicables"
      description="Ajustá qué gastos querés ver en la lista principal."
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClear}>
            Limpiar
          </Button>
          <Button onClick={onApply} disabled={hasInvalidFilters}>
            Aplicar
          </Button>
        </>
      }
    >
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vista</p>
        <Select
          value={draftFilters.vista}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setDraftFilters((previous) => ({
              ...previous,
              vista: event.target.value as ExpensesFilterTabs,
            }))
          }
        >
          <option value={ExpensesFilterTabs.TODOS}>Todos</option>
          <option value={ExpensesFilterTabs.AMIGOS}>Te Deben</option>
          <option value={ExpensesFilterTabs.DEUDA}>Deudas Activas</option>
        </Select>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rango de fechas</p>
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1 text-xs text-muted-foreground">
            Desde
            <input
              type="date"
              value={draftFilters.fechaIni}
              onChange={(event) =>
                setDraftFilters((previous) => ({
                  ...previous,
                  fechaIni: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>
          <label className="space-y-1 text-xs text-muted-foreground">
            Hasta
            <input
              type="date"
              value={draftFilters.fechaFin}
              onChange={(event) =>
                setDraftFilters((previous) => ({
                  ...previous,
                  fechaFin: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rango de monto</p>
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1 text-xs text-muted-foreground">
            Mínimo
            <input
              type="number"
              min={0}
              step="1"
              value={draftFilters.rangoIni}
              onChange={(event) =>
                setDraftFilters((previous) => ({
                  ...previous,
                  rangoIni: event.target.value,
                }))
              }
              placeholder="0"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>
          <label className="space-y-1 text-xs text-muted-foreground">
            Máximo
            <input
              type="number"
              min={0}
              step="1"
              value={draftFilters.rangoFin}
              onChange={(event) =>
                setDraftFilters((previous) => ({
                  ...previous,
                  rangoFin: event.target.value,
                }))
              }
              placeholder="0"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categorías</p>
        <div className="max-h-36 space-y-2 overflow-y-auto rounded-xl border border-border p-2">
          {categoryOptions.map((category) => (
            <label key={category.id} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={draftFilters.categoria.includes(category.id)}
                onChange={() => onToggleCategory(category.id)}
                className="h-4 w-4 rounded border-border"
              />
              {category.label}
            </label>
          ))}
        </div>
      </section>

      {hasInvalidDateRange ? (
        <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          El rango de fechas es inválido: la fecha inicial no puede ser mayor que la final.
        </p>
      ) : null}

      {hasInvalidAmountRange ? (
        <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          El rango de monto es inválido: el mínimo no puede ser mayor que el máximo.
        </p>
      ) : null}
    </Modal>
  )
}
