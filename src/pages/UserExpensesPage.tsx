import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import ColumnContainer from '@/components/common/columnContainer'
import PageTitle from '@/components/common/pageTitle'
import { categoryLabelById, INITIAL_FILTERS, MIN_SEARCH_CHARACTERS, PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@/components/userExpensesPage/constants'
import ExpensesResultsCard from '@/components/userExpensesPage/ExpensesResultsCard'
import FiltersTriggerCard from '@/components/userExpensesPage/FiltersTriggerCard'
import SearchCard from '@/components/userExpensesPage/SearchCard'
import SortCard from '@/components/userExpensesPage/SortCard'
import type { FilterState, SortValue } from '@/components/userExpensesPage/types'
import UserExpensesFiltersModal from '@/components/userExpensesPage/UserExpensesFiltersModal'
import { buildRequestFilters, formatDateFromApi, normalizeNumberOrNull } from '@/components/userExpensesPage/utils'
import { Button } from '@/components/ui/button'
import type { ExpenseFilteredJSON } from '@/domain/expense'
import { ExpensesFilterTabs } from '@/domain/expenseItemDTO'
import { CategoriaGasto } from '@/domain/enums/categoriaGasto'
import axios from 'axios'
import { expenseService } from '@/service/expenseService'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'

export default function UserExpensesPage() {
  const userId = Number(localStorage.getItem('id'))
  const { showToast } = useToast()
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
    if (!userId) {
      setError('No se encontró un usuario logueado. Iniciá sesión nuevamente.')
      setExpenses([])
      setTotalPages(0)
      setTotalElements(0)
      return
    }

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
      } catch (error: unknown) {
        const mensaje = getMensajeError(error)
        showToast(mensaje, 'error')
        if (axios.isAxiosError(error)) {
          console.error('Error fetching user expenses', {
            status: error.response?.status,
            data: error.response?.data,
            params: error.config?.params,
          })
        } else {
          console.error('Error fetching user expenses', error)
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
    if (activeFilters.vista !== ExpensesFilterTabs.TODOS) count++
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


      return {
        id: String(expense.id),
        title: expense.descripcion,
        payer: payerName.length > 0 ? payerName : 'Sin pagador',
        category: categoryLabelById[expense.categoria as CategoriaGasto] ?? expense.categoria,
        date: formatDateFromApi(expense.fecha),
        amountToPay: expense.monto,
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
      <PageTitle
        title="Mis gastos"
        subtitle="Tu historial de gastos"
        onBack={() => { window.history.back() }}
      >
      </PageTitle>

      <ColumnContainer>
        <div className="flex items-center gap-2 overflow-x-hidden">
          <SearchCard
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          >
            <SortCard
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />

            <FiltersTriggerCard
              activeFiltersCount={activeFiltersCount}
              onOpen={openFiltersModal}
            />
          </SearchCard>
        </div>

        <ExpensesResultsCard
          loading={loading}
          error={error}
          totalElements={totalElements}
          totalPages={totalPages}
          page={page}
          expenses={expensesForCards}
          onPageChange={setPage}
        />
      </ColumnContainer>

      <UserExpensesFiltersModal
        isOpen={isFilterModalOpen}
        draftFilters={draftFilters}
        hasInvalidFilters={hasInvalidFilters}
        hasInvalidDateRange={hasInvalidDateRange}
        hasInvalidAmountRange={hasInvalidAmountRange}
        onClose={() => setIsFilterModalOpen(false)}
        onClear={clearDraftFilters}
        onApply={applyDraftFilters}
        onToggleCategory={toggleCategory}
        setDraftFilters={setDraftFilters}
      />
    </section>
  )
}



