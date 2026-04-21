import { useState } from 'react'
import GroupCard from '@/components/groupsPage/GroupCard'
import GroupsSearch from '@/components/groupsPage/GroupsSearch'
import CreateGroupButton from '@/components/groupsPage/CreateGroupButton'
import ColumnContainer from '@/components/common/columnContainer'
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
  const usuarioId = Number(localStorage.id)
  const { showToast } = useToast()

  const [groups, setGroups] = useState<GrupoCardDTO[]>([])
  const [page, setPage] = useState(0)
  const [hasNext, setHasNext] = useState(true)
  const [loading, setLoading] = useState(false)
  const [debt, setDebt] = useState(0)

  const fetchGroups = async (pageToFetch = 0) => {
    if (loading) return

    setLoading(true)

    try {
      const res = await obtenerGrupos(usuarioId, pageToFetch, PAGE_SIZE)

      setGroups(prev =>
        pageToFetch === 0
          ? res.content
          : [...prev, ...res.content]
      )

      setHasNext(res.hasNext)
      setPage(pageToFetch)
    } catch (error: unknown) {
      const mensaje = getMensajeError(error)
      showToast(mensaje, 'error')
    } finally {
      setLoading(false)
    }
  }

  const getDebt = async (userId: number) => {
    try {
      const debtFetch = await expenseService.getUserDebt(userId)

      setDebt(debtFetch)
    } catch (error: unknown) {
      const mensaje = getMensajeError(error)
      showToast(mensaje, 'error')
    }
  }

  useOnInit(() => {
    fetchGroups(0)
    getDebt(Number(localStorage.id))
    console.log(debt)
  })

  const handleLoadMore = () => {
    if (!hasNext || loading) return
    fetchGroups(page + 1)
  }

  return (
    <div className="flex flex-col space-y-4 min-h-[calc(100vh-5rem)]">
      <PageTitle>
        <div className="pl-2.5 pt-2">
          <h2 className="text-xl font-semibold text-foreground">
            {debt > 0 ? 'Tenés deuda' : 'Estás al día'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {debt > 0 ? `Debés ${formatCurrency(debt)}` : 'No debés nada, ¡genial!'}
          </p>
        </div>
        <GroupsSearch />
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

        {/* Cargar más */}
        {hasNext && groups.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="mt-4 p-2 rounded-md bg-muted hover:bg-muted/80 text-sm"
          >
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        )}
      </ColumnContainer>

      {groups.length > 0 && <CreateGroupButton />}
    </div>
  )
}