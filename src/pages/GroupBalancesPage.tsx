import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useOnInit } from '@/customHooks/hooks'
import { obtenerBalancesGrupo, obtenerDetalleGrupo } from '@/service/groupsService'
import type { BalanceDTO, GrupoDetalleDTO } from '@/domain/Grupo'
import ColumnContainer from '@/components/common/columnContainer'
import PageTitle from '@/components/common/pageTitle'
import { Divider } from '@/components/common/divider'
import { formatCurrency } from '@/utils/formatCurrency'
import { SectionCard } from '@/components/balancesPage/sectionCard'
import { BalanceRow } from '@/components/balancesPage/balanceRow'

export default function GroupBalancesPage() {
    const { groupId } = useParams()
    const currentUserId = Number(localStorage.getItem('id'))

    const [balances, setBalances] = useState<BalanceDTO[]>([])
    const [groupDetail, setGroupDetail] = useState<GrupoDetalleDTO | null>(null)
    const [loading, setLoading] = useState(true)

    useOnInit(() => {
        const fetchAll = async () => {
            if (!groupId) return
            try {
                const [data, detail] = await Promise.all([
                    obtenerBalancesGrupo(Number(groupId)),
                    obtenerDetalleGrupo(Number(groupId)),
                ])
                setBalances(data)
                setGroupDetail(detail)
            } catch (err) {
                console.error('Error al cargar balances', err)
            } finally {
                setLoading(false)
            }
        }
        void fetchAll()
    })

    const owedToMe = balances.filter((b) => b.acreedorId === currentUserId)
    const iOwe = balances.filter((b) => b.deudorId === currentUserId)
    const others = balances.filter(
        (b) => b.acreedorId !== currentUserId && b.deudorId !== currentUserId
    )

    const totalOwedToMe = owedToMe.reduce((acc, b) => acc + b.monto, 0)
    const totalIOwe = iOwe.reduce((acc, b) => acc + b.monto, 0)

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-background/70 p-4 animate-pulse h-24" />
                <div className="rounded-2xl border border-border bg-background/70 p-4 animate-pulse h-40" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <PageTitle
                title="Balances"
                subtitle={groupDetail?.nombre ?? 'del grupo'}
                onBack={() => window.history.back()}
            />

            <ColumnContainer>
                {/* Resumen numérico */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm">
                        <div className="text-xs text-muted-foreground">Te deben</div>
                        <div
                            className="mt-1 text-xl font-semibold"
                            style={{ color: totalOwedToMe > 0 ? 'var(--success)' : undefined }}
                        >
                            {formatCurrency(totalOwedToMe)}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm">
                        <div className="text-xs text-muted-foreground">Debés</div>
                        <div
                            className="mt-1 text-xl font-semibold"
                            style={{ color: totalIOwe > 0 ? 'var(--danger)' : undefined }}
                        >
                            {formatCurrency(totalIOwe)}
                        </div>
                    </div>
                </div>

                {balances.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-background/50 px-4 py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            No hay deudas pendientes en este grupo 🎉
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Lo que te deben */}
                        {owedToMe.length > 0 && (
                            <SectionCard title="Lo que te deben">
                                {owedToMe.map((b, i) => (
                                    <div key={`owed-${b.deudorId}-${i}`}>
                                        {i > 0 && <Divider />}
                                        <BalanceRow
                                            avatarNombre={b.deudorNombre}
                                            label={b.deudorNombre}
                                            sublabel="pendiente"
                                            amount={`+${formatCurrency(b.monto)}`}
                                            variant="success"
                                        />
                                    </div>
                                ))}
                            </SectionCard>
                        )}

                        {/* Lo que debés */}
                        {iOwe.length > 0 && (
                            <SectionCard title="Lo que debés">
                                {iOwe.map((b, i) => (
                                    <div key={`iowe-${b.acreedorId}-${i}`}>
                                        {i > 0 && <Divider />}
                                        <BalanceRow
                                            avatarNombre={b.acreedorNombre}
                                            label={
                                                <>
                                                    A <span className="font-medium">{b.acreedorNombre}</span>
                                                </>
                                            }
                                            sublabel="pendiente"
                                            amount={`-${formatCurrency(b.monto)}`}
                                            variant="danger"
                                        />
                                    </div>
                                ))}
                            </SectionCard>
                        )}

                        {/* Otras deudas del grupo */}
                        {others.length > 0 && (
                            <SectionCard title="Otras deudas del grupo">
                                {others.map((b, i) => (
                                    <div key={`other-${b.deudorId}-${b.acreedorId}-${i}`}>
                                        {i > 0 && <Divider />}
                                        <BalanceRow
                                            avatarNombre={b.deudorNombre}
                                            label={
                                                <>
                                                    <span className="font-medium">{b.deudorNombre}</span>
                                                    {' → '}
                                                    <span className="font-medium">{b.acreedorNombre}</span>
                                                </>
                                            }
                                            sublabel="pendiente"
                                            amount={formatCurrency(b.monto)}
                                            variant="neutral"
                                        />
                                    </div>
                                ))}
                            </SectionCard>
                        )}
                    </>
                )}
            </ColumnContainer>
        </div>
    )
}