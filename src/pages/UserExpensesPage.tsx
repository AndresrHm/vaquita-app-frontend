import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'

import Card from '@/components/common/card'
import ColumnContainer from '@/components/common/columnContainer'
import ExpenseCard from '@/components/common/expenseCard'
import Modal from '@/components/common/modal'
import { AppPagination } from '@/components/common/pagination'
import PageTitle from '@/components/common/pageTitle'
import { Button } from '@/components/ui/button'
import Select from '@/components/ui/select'
import type { ExpenseFilteredJSON } from '@/domain/expense'
import { ExpensesFilterTabs, type ExpenseFiltersDTO, type OrderMethodExpenses } from '@/domain/expenseItemDTO'
import { CategoriaGasto } from '@/domain/enums/categoriaGasto'
import axios from 'axios'
import { expenseService } from '@/service/expenseService'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 500
const MIN_SEARCH_CHARACTERS = 3

type SortOption = {
  value: OrderMethodExpenses
  label: string
}

const sortOptions = [
  { value: 'NOMBRE_ASC', label: 'Nombre: A a Z' },
  { value: 'NOMBRE_DESC', label: 'Nombre: Z a A' },
  { value: 'AUTOR_ASC', label: 'Autor: A a Z' },
  { value: 'AUTOR_DESC', label: 'Autor: Z a A' },
] satisfies SortOption[]

type SortValue = OrderMethodExpenses

type FilterState = {
  vista: ExpensesFilterTabs
  fechaIni: string
  fechaFin: string
  rangoIni: string
  rangoFin: string
  categoria: CategoriaGasto[]
}

const INITIAL_FILTERS: FilterState = {
  vista: ExpensesFilterTabs.GENERAL,
  fechaIni: '',
  fechaFin: '',
  rangoIni: '',
  rangoFin: '',
  categoria: [],
}

const categoryOptions = [
  { id: CategoriaGasto.COMIDA, label: 'Comida' },
  { id: CategoriaGasto.BEBIDA, label: 'Bebida' },
  { id: CategoriaGasto.HOGAR, label: 'Hogar' },
  { id: CategoriaGasto.TRANSPORTE, label: 'Transporte' },
  { id: CategoriaGasto.SUPERMERCADO, label: 'Supermercado' },
  { id: CategoriaGasto.ENTRETENIMIENTO, label: 'Entretenimiento' },
  { id: CategoriaGasto.VARIOS, label: 'Varios' },
  { id: CategoriaGasto.OTROS, label: 'Otros' },
]

const categoryLabelById = categoryOptions.reduce<Record<CategoriaGasto, string>>((acc, category) => {
  acc[category.id] = category.label
  return acc
}, {} as Record<CategoriaGasto, string>)

function normalizeTextOrNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeNumberOrNull(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) return null

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null
}

function formatDateFromApi(date: string): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat('es-AR').format(parsed)
}

function buildRequestFilters(filters: FilterState, search: string, page: number): ExpenseFiltersDTO {
  return {
    fechaIni: normalizeTextOrNull(filters.fechaIni),
    fechaFin: normalizeTextOrNull(filters.fechaFin),
    amigoID: null,
    search: normalizeTextOrNull(search),
    rangoIni: normalizeNumberOrNull(filters.rangoIni),
    rangoFin: normalizeNumberOrNull(filters.rangoFin),
    page,
    size: PAGE_SIZE,
    categoria: filters.categoria.length > 0 ? filters.categoria : null,
    vista: filters.vista,
  }
}

export default function UserExpensesPage() {
  const userId = 1
  const currentUserName = (localStorage.user_name ?? '').trim().toLowerCase()

  const [expenses, setExpenses] = useState<ExpenseFilteredJSON[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortValue>('NOMBRE_ASC')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [draftFilters, setDraftFilters] = useState<FilterState>(INITIAL_FILTERS)

  function toggleCategory(category: CategoriaGasto) {
    setDraftFilters((previous) => ({
      ...previous,
      categoria: previous.categoria.includes(category)
        ? previous.categoria.filter((item) => item !== category)
        : [...previous.categoria, category],
    }))
  }

  function clearDraftFilters() {
    setDraftFilters(INITIAL_FILTERS)
  }

  function applyDraftFilters() {
    setActiveFilters(draftFilters)
    setPage(0)
    setIsFilterModalOpen(false)
  }

  function openFiltersModal() {
    setDraftFilters(activeFilters)
    setIsFilterModalOpen(true)
  }

  useEffect(() => {
    const normalizedSearch = searchTerm.trim()

    if (normalizedSearch.length === 0) {
      setDebouncedSearchTerm('')
      return
    }

    if (normalizedSearch.length < MIN_SEARCH_CHARACTERS) {
      setDebouncedSearchTerm('')
      return
    }

    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    if (!userId) return

    const fetchExpenses = async () => {
      setLoading(true)
      setError(null)

      try {
        const filtros = buildRequestFilters(activeFilters, debouncedSearchTerm, page)
        const response = await expenseService.getExpensesFiltered(
          filtros,
          page,
          PAGE_SIZE,
          userId,
          sortBy,
          activeFilters.vista
        )

        setExpenses(response.content)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
      } catch (fetchError) {
        if (axios.isAxiosError(fetchError)) {
          console.error('Error fetching user expenses', {
            status: fetchError.response?.status,
            data: fetchError.response?.data,
            params: fetchError.config?.params,
          })
        } else {
          console.error('Error fetching user expenses', fetchError)
        }
        setError('No se pudieron cargar los gastos. Intentá nuevamente.')
        setExpenses([])
        setTotalPages(0)
        setTotalElements(0)
      } finally {
        setLoading(false)
      }
    }

    void fetchExpenses()
  }, [activeFilters, debouncedSearchTerm, page, sortBy, userId])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (activeFilters.vista !== ExpensesFilterTabs.GENERAL) count++
    if (activeFilters.fechaIni.trim().length > 0) count++
    if (activeFilters.fechaFin.trim().length > 0) count++
    if (activeFilters.rangoIni.trim().length > 0) count++
    if (activeFilters.rangoFin.trim().length > 0) count++
    if (activeFilters.categoria.length > 0) count++
    return count
  }, [activeFilters])

  const expensesForCards = useMemo(() => {
    return expenses.map((expense) => {
      const payerName = expense.pagador?.trim() ?? ''
      const payerNormalized = payerName.toLowerCase()
      const sourceLabel = payerNormalized === currentUserName ? 'Creado por vos' : 'Participás'

      return {
        id: String(expense.id),
        title: expense.descripcion,
        payer: payerName.length > 0 ? payerName : 'Sin pagador',
        category: categoryLabelById[expense.categoria as CategoriaGasto] ?? expense.categoria,
        date: formatDateFromApi(expense.fecha),
        amountToPay: expense.monto,
        sourceLabel,
      }
    })
  }, [expenses, currentUserName])

  const hasInvalidAmountRange = useMemo(() => {
    const min = normalizeNumberOrNull(draftFilters.rangoIni)
    const max = normalizeNumberOrNull(draftFilters.rangoFin)

    if (min === null || max === null) return false
    return min > max
  }, [draftFilters.rangoIni, draftFilters.rangoFin])

  const hasInvalidDateRange = useMemo(() => {
    if (!draftFilters.fechaIni || !draftFilters.fechaFin) return false
    return new Date(draftFilters.fechaIni) > new Date(draftFilters.fechaFin)
  }, [draftFilters.fechaIni, draftFilters.fechaFin])

  const hasInvalidFilters = hasInvalidAmountRange || hasInvalidDateRange

  const activeCategorySummary =
    activeFilters.categoria.length > 0
      ? activeFilters.categoria.map((category) => categoryLabelById[category] ?? category).join(', ')
      : 'Todas'

  const activeDateSummary =
    activeFilters.fechaIni || activeFilters.fechaFin
      ? `${activeFilters.fechaIni || '...'} a ${activeFilters.fechaFin || '...'}`
      : 'Sin rango'

  const activeAmountSummary =
    activeFilters.rangoIni || activeFilters.rangoFin
      ? `${activeFilters.rangoIni || '...'} a ${activeFilters.rangoFin || '...'}`
      : 'Sin rango'

  const activeViewLabel = activeFilters.vista === ExpensesFilterTabs.AMIGOS ? 'Con amigos' : 'General'

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as SortValue)
    setPage(0)
  }

  return (
    <section className="space-y-4">
      <PageTitle title="Mis gastos" subtitle="Historial real de gastos, filtrado desde backend.">
        <Button asChild variant="ghost" size="sm" className="rounded-full px-3">
          <Link to="/account">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
      </PageTitle>

      <ColumnContainer>
        <p className="text-xs text-muted-foreground">Los resultados se obtienen del endpoint de gastos filtrados.</p>

        <Card className="rounded-2xl border border-border/70 bg-background/80 p-4" interactive={false}>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Buscar</p>
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por título, grupo o categoría (mínimo 3 caracteres)"
                className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </label>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-background/80 p-4" interactive={false}>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ordenar</p>
            <Select value={sortBy} onChange={handleSortChange}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </Card>

        <Card
          className="rounded-2xl border border-border/70 bg-background/80 p-4"
          onClick={openFiltersModal}
          aria-label="Abrir filtros"
        >
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

        <Card className="rounded-2xl border border-border/70 bg-background/80 p-4" interactive={false}>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              Vista: <span className="font-medium text-foreground">{activeViewLabel}</span>
            </p>
            <p>
              Categorías: <span className="font-medium text-foreground">{activeCategorySummary}</span>
            </p>
            <p>
              Fecha: <span className="font-medium text-foreground">{activeDateSummary}</span>
            </p>
            <p>
              Monto: <span className="font-medium text-foreground">{activeAmountSummary}</span>
            </p>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-background/80 p-4" interactive={false}>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Resultados</h3>
                <p className="mt-1 text-xs text-muted-foreground">Listado paginado según los filtros aplicados.</p>
              </div>
              <p className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                {totalElements} gasto(s)
              </p>
            </div>

            {loading ? (
              <p className="rounded-xl border border-border px-3 py-6 text-center text-sm text-muted-foreground">
                Cargando gastos...
              </p>
            ) : error ? (
              <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-6 text-center text-sm text-destructive">
                {error}
              </p>
            ) : expensesForCards.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                No hay gastos para los filtros seleccionados.
              </p>
            ) : (
              <div className="space-y-3">
                {expensesForCards.map((expense) => (
                  <div key={expense.id} className="space-y-1">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {expense.sourceLabel}
                    </p>
                    <ExpenseCard
                      title={expense.title}
                      group={expense.payer}
                      groupLabel="Pagador"
                      category={expense.category}
                      date={expense.date}
                      amountToPay={expense.amountToPay}
                    />
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <div className="pt-1">
                <AppPagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            ) : null}
          </div>
        </Card>
      </ColumnContainer>

      <Modal
        isOpen={isFilterModalOpen}
        title="Filtros aplicables"
        description="Ajustá qué gastos querés ver en la lista principal."
        onClose={() => setIsFilterModalOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={clearDraftFilters}>
              Limpiar
            </Button>
            <Button onClick={applyDraftFilters} disabled={hasInvalidFilters}>
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
            <option value={ExpensesFilterTabs.GENERAL}>General</option>
            <option value={ExpensesFilterTabs.AMIGOS}>Con amigos</option>
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
                  onChange={() => toggleCategory(category.id)}
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
    </section>
  )
}



