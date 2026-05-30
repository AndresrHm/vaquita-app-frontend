
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState, type UIEvent } from 'react'
import ColumnContainer from '@/components/common/columnContainer'
import { useOnInit } from '@/customHooks/hooks'
import { obtenerDetalleGrupo, obtenerGastosGrupo, obtenerGrupoSettings, obtenerMiembrosDeGrupoSettings, generarTokenInvitacion } from '@/service/groupsService'
import type { GrupoDetalleDTO, GrupoGastosPorAnioDTO, Miembro } from '@/domain/Grupo'
import GroupHeader from '@/components/groupsPage/GroupHeader'
import ExpensesList, { type ExpensesByMonth } from '@/components/groupsPage/ExpensesList'
import { type Expense } from '@/components/groupsPage/ExpenseItem'
import CreateExpenseButton from '@/components/groupsPage/CreateExpenseButton'
import { BarChart3 } from 'lucide-react'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
import { AvatarCircle } from '@/components/common/avatarCircle'
import GroupActivitiesModal from '@/components/groupsPage/GroupActivitiesModal'
import { UserPlus } from 'lucide-react'
import { InviteModal } from '@/components/groupsPage/InviteModal'

const MEMBERS_PAGE_SIZE = 8

export default function GroupDetailPage() {
    const { groupId } = useParams()
    const grupoId = Number(groupId)
    const navigate = useNavigate()
    const { showToast } = useToast()


    // Detalle del grupo (info básica)
    const [groupDetail, setGroupDetail] = useState<GrupoDetalleDTO | null>(null)
    const [miembros, setMiembros] = useState<Miembro[]>([])
    const [modoRataActivo, setModoRataActivo] = useState(false)
    const [showGroupInfo, setShowGroupInfo] = useState(false)
    const [visibleMembersCount, setVisibleMembersCount] = useState(MEMBERS_PAGE_SIZE)
    const [showActivitiesModal, setShowActivitiesModal] = useState(false)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [inviteToken, setInviteToken] = useState<string>('')
    const [isGeneratingInvite, setIsGeneratingInvite] = useState(false)

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
        } catch (error: unknown) {
            const mensaje = getMensajeError(error)
            showToast(mensaje, 'error')
        } finally {
            setLoadingGastos(false)
        }
    }

    const handleOpenInviteModal = async () => {
        setIsGeneratingInvite(true)
        try {
            // Reemplazá esto por la función real de tu groupsService que le pegue a Axios
            // Ej: const response = await api.post(`/grupos/${grupoId}/invitacion`)
            // Y de ahí sacás el token.
            const response = await generarTokenInvitacion(grupoId) 
            
            setInviteToken(response.token)
            setIsInviteModalOpen(true)
        } catch (error: unknown) {
            const mensaje = getMensajeError(error)
            showToast(mensaje || 'Error al generar el link de invitación', 'error')
        } finally {
            setIsGeneratingInvite(false)
        }
    }

    useOnInit(() => {
        if (Number.isNaN(grupoId)) return

        const fetchAll = async () => {
            try {
                const [groupData, membersData, settingsData] = await Promise.all([
                    obtenerDetalleGrupo(grupoId),
                    obtenerMiembrosDeGrupoSettings(grupoId),
                    obtenerGrupoSettings(grupoId),
                ])

                setGroupDetail(groupData)
                setMiembros(membersData)
                setModoRataActivo(settingsData.modoRata)

                await fetchGastos(0)
            } catch (error: unknown) {
                const mensaje = getMensajeError(error)
                showToast(mensaje, 'error')
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

    useEffect(() => {
        if (showGroupInfo) {
            setVisibleMembersCount(MEMBERS_PAGE_SIZE)
        }
    }, [showGroupInfo, miembros.length])

    const handleMembersScroll = (event: UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
        const nearBottom = scrollTop + clientHeight >= scrollHeight - 24

        if (nearBottom) {
            setVisibleMembersCount(prev => Math.min(prev + MEMBERS_PAGE_SIZE, miembros.length))
        }
    }

    const visibleMembers = miembros.slice(0, visibleMembersCount)

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
            <GroupHeader
                groupDetail={groupDetail}
                miembros={miembros}
                expanded={showGroupInfo}
                onToggle={() => setShowGroupInfo(prev => !prev)}
            />

            <ColumnContainer>
                {showGroupInfo && (
                    <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-4">
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">Descripción</h2>
                            <p className="mt-1 text-sm text-foreground">
                                {groupDetail.descripcion || 'Sin descripción'}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-foreground">
                                Integrantes ({groupDetail.cantidadIntegrantes})
                            </h2>

                            <div className="mt-2 max-h-56 space-y-2 overflow-y-auto pr-1" onScroll={handleMembersScroll}>
                                {visibleMembers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No hay integrantes para mostrar.</p>
                                ) : (
                                    visibleMembers.map((miembro) => (
                                        <div key={miembro.id} className="grid grid-cols-[1fr_36px_auto] items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
                                            <button type="button" onClick={() => navigate(`/friends/${miembro.id}`)} className="flex items-center gap-3 text-left hover:opacity-75 transition-opacity">
                                                <AvatarCircle nombre={miembro.nombre} />
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{miembro.nombre}</p>
                                                    {miembro.username && <p className="text-xs text-muted-foreground">@{miembro.username}</p>}
                                                </div>
                                            </button>

                                            <div className="flex items-center justify-center">
                                                {modoRataActivo && miembro.esRata ? (
                                                    <span title="Modo rata" className="text-sm leading-none">🐀</span>
                                                ) : null}
                                            </div>

                                            <div className="flex items-center justify-end">
                                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                                                    {miembro.rol}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {visibleMembersCount < miembros.length && (
                                    <p className="pt-1 text-center text-xs text-muted-foreground">Desliza para cargar mas integrantes...</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleOpenInviteModal}
                    disabled={isGeneratingInvite}
                    className="w-full inline-flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition disabled:opacity-70"
                >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        {isGeneratingInvite ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        ) : (
                            <UserPlus className="h-5 w-5" />
                        )}
                    </span>
                    {isGeneratingInvite ? 'Generando link...' : 'Invitar amigos al grupo'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate(`/groups/${grupoId}/balances`)}
                    className="w-full inline-flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition"
                >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <BarChart3 className="h-5 w-5" />
                    </span>
                    Ver balances del grupo
                </button>

                <button
                    type="button"
                    onClick={() => setShowActivitiesModal(true)}
                    className="w-full inline-flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition"
                >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <BarChart3 className="h-5 w-5" />
                    </span>
                    Ver actividades del grupo
                </button>

                <GroupActivitiesModal
                    isOpen={showActivitiesModal}
                    groupId={grupoId}
                    groupName={groupDetail.nombre}
                    onClose={() => setShowActivitiesModal(false)}
                />

                <InviteModal 
                    isOpen={isInviteModalOpen} 
                    onClose={() => setIsInviteModalOpen(false)} 
                    groupId={String(grupoId)}
                    inviteToken={inviteToken} 
                />

                <div className="mt-4 space-y-6">
                    {gastos.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground">Aún no hay gastos</div>
                    ) : (
                        gastos.map((yearGroup) => {
                            const months: ExpensesByMonth = yearGroup.months.map((m) => ({
                                month: m.month,
                                expenses: m.expenses.map((e) => ({
                                    id: String(e.id),
                                    date: { day: e.day, month: m.month, year: yearGroup.year },
                                    title: e.title,
                                    amount: e.amount,
                                    currency: e.currency,
                                    paymentType: e.paymentType as Expense['paymentType'],
                                    imageUrl: e.imageUrl,
                                    tieneTicket: e.tieneTicket,
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
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => void fetchGastos(page)}
                                disabled={loadingGastos}
                                className="
                                    inline-flex items-center gap-3
                                    rounded-2xl border border-border
                                    bg-background/70
                                    px-3 py-2
                                    text-sm font-medium text-foreground
                                    shadow-sm
                                    hover:bg-muted
                                    transition
                                    disabled:opacity-50 disabled:cursor-not-allowed"
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
