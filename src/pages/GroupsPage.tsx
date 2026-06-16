import { useCallback, useRef, useState } from 'react'
import GroupCard, { GroupCardSkeleton } from '@/components/groupsPage/GroupCard'
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

// 1. IMPORTAMOS TU HOOK
import { useNetwork } from '@/customHooks/useNetwork'

const PAGE_SIZE = 5

export default function GroupsPage() {
  const { showToast } = useToast()

  // 2. ACTIVAMOS EL RADAR
  const isOnline = useNetwork()

  const [groups, setGroups] = useState<GrupoCardDTO[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [debt, setDebt] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const requestIdRef = useRef(0)
  const loadingRef = useRef(false)
  const errorShownRef = useRef(false)

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

      errorShownRef.current = false

    } catch (error: unknown) {
      if (!errorShownRef.current) {
        const mensaje = getMensajeError(error)
        showToast(mensaje, 'error')
        errorShownRef.current = true
      }
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
      // Si estamos offline, no queremos que salten 80 toasts de error de red, 
      // así que podés atajarlo acá o dejarlo como está.
      if (isOnline) showToast(mensaje, 'error')
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
            {/* 1. Verificamos si es null (no sabemos el saldo todavía) */}
            {debt === null
              ? 'Saldo desconocido'
              : debt > 0
                ? 'Tenés deuda'
                : 'Estás al día'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {/* 2. Mostramos el mensaje acorde al estado */}
            {debt === null
              ? 'Conectate para actualizar tu estado.'
              : debt > 0
                ? `Debés ${formatCurrency(debt)}`
                : 'No debés nada, ¡genial!'}
          </p>
        </div>
        <GroupsSearch onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} />
      </PageTitle>

      <ColumnContainer>
        {loading && groups.length === 0 ? (
          <>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <GroupCardSkeleton key={i} />)}
          </>
        ) : groups.length === 0 ? (
          // 3. SEPARAMOS LOS CAMINOS: OFFLINE VS VACÍO REAL
          !isOnline ? (
            // A. ESTADO DE ERROR DE RED
            <div className="flex items-center justify-center min-h-45 w-full">
              <div className="text-center rounded-xl border-2 border-red-300/50 bg-red-50/50 p-8 shadow-sm max-w-sm w-full dark:border-red-900/50 dark:bg-red-950/20">
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  ¡Ups! No hay conexión
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  No pudimos cargar tus grupos.
                </p>
                <p className="mt-1 text-sm text-muted-foreground font-medium">
                  Conectate a internet e intentá de nuevo.
                </p>
              </div>
            </div>
          ) : (
            // B. ESTADO VACÍO ORIGINAL
            <div className="flex items-center justify-center min-h-45 w-full">
              <div className="text-center rounded-xl border-2 border-dashed bg-card p-8 shadow-sm max-w-sm w-full">
                <p className="text-sm text-muted-foreground">
                  Todavía no tenés grupos...
                </p>
                <p className="mt-1 text-sm font-medium">
                  ¡Probá crear uno!
                </p>
                <div className="mt-4 flex justify-center">
                  {/* Le pasamos la prop disabled al botón por si acaso */}
                  <CreateGroupButton fixed={false} />
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            {/* Lista */}
            {groups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}

            {totalPages > 1 && (
              <div className="pt-1">
                <AppPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </ColumnContainer>

      {groups.length > 0 && <CreateGroupButton />}
    </div>
  )
}