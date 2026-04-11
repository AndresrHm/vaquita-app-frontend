 
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import ColumnContainer from '@/components/common/columnContainer'
import { useOnInit } from '@/customHooks/hooks'
import { obtenerDetalleGrupo, obtenerGastosGrupo } from '@/service/groupsService'
import type { GrupoDetalleDTO, GrupoGastosPorAnioDTO } from '@/domain/Grupo'
import GroupHeader from '@/components/groupsPage/GroupHeader'
import ExpensesList, { type ExpensesByMonth } from '@/components/groupsPage/ExpensesList'
import { type Expense } from '@/components/groupsPage/ExpenseItem'
import CreateExpenseButton from '@/components/groupsPage/CreateExpenseButton'

export default function GroupDetailPage() {
    const { groupId } = useParams()
    const grupoId = Number(groupId)
    const navigate = useNavigate()


    // Detalle del grupo (info básica)
    const [groupDetail, setGroupDetail] = useState<GrupoDetalleDTO | null>(null)

    // Gastos del grupo
    const [gastos, setGastos] = useState<GrupoGastosPorAnioDTO[]>([])
    const [page, setPage] = useState(0)
    const [hasNext, setHasNext] = useState(true)
    const [loadingGastos, setLoadingGastos] = useState(false)

    const fetchGastos = async (pageToFetch: number) => {
        if (loadingGastos || !hasNext) return

        setLoadingGastos(true)

        try {
            const data = await obtenerGastosGrupo(grupoId, pageToFetch, 10)

            setGastos(prev => mergeGastos(prev, data.content))
            setHasNext(data.hasNext)
            setPage(data.page + 1)
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingGastos(false)
        }
    }

    useOnInit(() => {
        if (Number.isNaN(grupoId)) return

        const fetchAll = async () => {
            try {
                const data = await obtenerDetalleGrupo(grupoId)
                setGroupDetail(data)

                await fetchGastos(0)
            } catch (error) {
                console.log(error)
            }
        }

        void fetchAll()
    }, [grupoId])

    const mergeGastos = (
        prev: GrupoGastosPorAnioDTO[],
        incoming: GrupoGastosPorAnioDTO[]
    ): GrupoGastosPorAnioDTO[] => {
        const result = [...prev]

        incoming.forEach((newYear) => {
            const existingYear = result.find(y => y.year === newYear.year)

            if (!existingYear) {
                result.push(newYear)
                return
            }

            newYear.months.forEach((newMonth) => {
                const existingMonth = existingYear.months.find(m => m.month === newMonth.month)

                if (!existingMonth) {
                    existingYear.months.push(newMonth)
                    return
                }

                const existingIds = new Set(existingMonth.expenses.map(e => e.id))

                const filteredExpenses = newMonth.expenses.filter(e => !existingIds.has(e.id))

                existingMonth.expenses.push(...filteredExpenses)
            })
        })

        return result
    }

    // Skeleton mientras carga el detalle del grupo
    if (groupDetail === null) {
        return (
            <div className="space-y-4">
                <div className="-mx-4 rounded-b-2xl rounded-t-none overflow-hidden shadow-sm">
                    <div className="relative h-44 w-full bg-muted/60 animate-pulse" />
                </div>

                <ColumnContainer>
                    <div className="p-4">
                        <div className="h-6 w-1/3 rounded bg-muted/60 animate-pulse" />
                        <div className="mt-3 h-4 w-2/3 rounded bg-muted/60 animate-pulse" />
                        <div className="mt-2 h-4 w-1/4 rounded bg-muted/60 animate-pulse" />
                    </div>
                </ColumnContainer>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <GroupHeader groupDetail={groupDetail} />

            <ColumnContainer>
                <div className="p-4">
                    <p className="text-sm text-foreground">{groupDetail.descripcion}</p>
                    <p className="mt-2 text-sm text-foreground">Integrantes: {groupDetail.cantidadIntegrantes}</p>
                </div>

                <div className="mt-4 space-y-6">
                    {gastos.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground">Aún no hay gastos</div>
                    ) : (
                        gastos.map((yearGroup) => {
                            const months: ExpensesByMonth = yearGroup.months.map((m) => ({
                                month: m.month,
                                expenses: m.expenses.map((e) => ({
                                    id: String(e.id),
                                    date: { day: e.day },
                                    title: e.title,
                                    amount: e.amount,
                                    currency: e.currency,
                                    paymentType: e.paymentType as Expense['paymentType'],
                                    imageUrl: e.imageUrl,
                                })),
                            }))

                            return (
                                <div key={yearGroup.year}>
                                    <h2 className="rounded-md bg-muted/80 px-3 py-1 text-lg font-semibold text-muted-foreground">
                                        {yearGroup.year}
                                    </h2>
                                    <ExpensesList data={months} />
                                </div>
                            )
                        })
                    )}

                    {hasNext && (
                        <div className="flex justify-center py-4">
                            <button
                                onClick={() => void fetchGastos(page)}
                                disabled={loadingGastos}
                                className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingGastos ? 'Cargando...' : 'Cargar más'}
                            </button>
                        </div>
                    )}
                </div>
            </ColumnContainer>

            <CreateExpenseButton onClick={() => navigate(`/groups/${groupDetail.id}/expense/create`)} />
        </div>
    )
}
