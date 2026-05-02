import { useCallback, useRef, useState } from 'react'
import GroupCard from '@/components/groupsPage/GroupCard'
import GroupsSearch from '@/components/groupsPage/GroupsSearch'
import CreateGroupButton from '@/components/groupsPage/CreateGroupButton'
import ColumnContainer from '@/components/common/columnContainer'
import { AppPagination } from '@/components/common/pagination'
import PageTitle from '@/components/common/pageTitle'
import type { GrupoCardDTO } from '@/domain/Grupo'
import { useOnInit } from '@/customHooks/hooks'
import { obtenerGrupos } from '@/service/groupsService'
import { expenseService } from '@/service/expenseService'
import { formatCurrency } from '@/utils/formatCurrency'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'

const PAGE_SIZE = 6

export default function GroupsPage() {
  const { showToast } = useToast()

  const [groups, setGroups] = useState<GrupoCardDTO[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [debt, setDebt] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const requestIdRef = useRef(0)
  const loadingRef = useRef(false)

  const fetchGroups = useCallback(async (pageToFetch = 0, query = '', filterParam = '') => {
    if (loadingRef.current) return

    const requestId = ++requestIdRef.current
    loadingRef.current = true
    setLoading(true)

    try {
      const res = await obtenerGrupos(pageToFetch, PAGE_SIZE, query, filterParam)

      if (requestId !== requestIdRef.current) return

      setGroups(res.content)

      setTotalPages(res.totalPages)
      setPage(pageToFetch)
    } catch (error: unknown) {
      const mensaje = getMensajeError(error)
      showToast(mensaje, 'error')
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [showToast])

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text)
    setGroups([])
    setPage(0)
    fetchGroups(0, text, filter)
  }, [fetchGroups, filter])

  const handleFilterChange = useCallback((f: string) => {
    setFilter(f)
    setGroups([])
    setPage(0)
    fetchGroups(0, searchQuery, f)
  }, [fetchGroups, searchQuery])

  const getDebt = async () => {
    try {
      const debtFetch = await expenseService.getUserDebt()

      setDebt(debtFetch)
    } catch (error: unknown) {
      const mensaje = getMensajeError(error)
      showToast(mensaje, 'error')
    }
  }

  useOnInit(() => {
    fetchGroups(0, searchQuery, filter)
    getDebt()
  }, [fetchGroups, searchQuery, filter])

  const handlePageChange = (nextPage: number) => {
    if (loading || nextPage === page) return
    fetchGroups(nextPage, searchQuery, filter)
  }

  return (
    <div className="flex flex-col space-y-4">
      <PageTitle>
        <div className="pl-2.5 pt-2">
          <h2 className="text-xl font-semibold text-foreground">
            {debt > 0 ? 'Tenés deuda' : 'Estás al día'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {debt > 0 ? `Debés ${formatCurrency(debt)}` : 'No debés nada, ¡genial!'}
          </p>
        </div>
        <GroupsSearch onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} />
      </PageTitle>

      <ColumnContainer>
        {/* Cantidad de grupos */}
        {/* TODO FIXEAR ESTO, tira el size actual */}
        {/* {hasNext && groups.length > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            Pertenecés a {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'}
          </p>
        )} */}

        {/* Empty state */}
        {groups.length === 0 && !loading && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto text-center rounded-xl border-2 border-dashed bg-card p-8 shadow-sm max-w-sm w-full mx-4">
              <p className="text-sm text-muted-foreground">
                Todavía no tenés grupos...
              </p>

              <p className="mt-1 text-sm font-medium">
                ¡Probá crear uno!
              </p>

              <div className="mt-4 flex justify-center">
                <CreateGroupButton fixed={false} />
              </div>
            </div>
          </div>
        )}

        {/* Lista */}
        {groups.map((g) => (
          <GroupCard key={g.id} group={g} />
        ))}

        {totalPages > 1 && (
          <div className="pt-1">
            <AppPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </ColumnContainer>

      {groups.length > 0 && <CreateGroupButton />}
    </div>
  )
}