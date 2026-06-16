import { useParams } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { useToast } from '@/customHooks/useToast'
import { getMensajeError } from '@/utils/getMensajeError'
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
    type MaybeLocalStorage = {
        localStorage: {
            getItem(key: string): string | null
        }
    }
    const currentUserId = Number(
        typeof globalThis !== 'undefined' && 'localStorage' in globalThis
            ? (globalThis as unknown as MaybeLocalStorage).localStorage.getItem('id')
            : null
    )
    const groupNumericId = groupId ? Number(groupId) : NaN

    const [balances, setBalances] = useState<BalanceDTO[]>([])
    const [groupDetail, setGroupDetail] = useState<GrupoDetalleDTO | null>(null)
    const [loading, setLoading] = useState(true)

    const { showToast } = useToast()

    const fetchBalances = useCallback(async () => {
        if (!groupId || Number.isNaN(groupNumericId)) return

        try {
            const data = await obtenerBalancesGrupo(groupNumericId)
            setBalances(data)
        } catch (err) {
            const mensaje = getMensajeError(err)
            showToast(mensaje, 'error')
            console.error('Error al actualizar balances', err)
        }
    }, [groupId, groupNumericId])

    const fetchGroupData = useCallback(async () => {
        if (!groupId || Number.isNaN(groupNumericId)) return

        try {
            const [data, detail] = await Promise.all([
                obtenerBalancesGrupo(groupNumericId),
                obtenerDetalleGrupo(groupNumericId),
            ])
            setBalances(data)
            setGroupDetail(detail)
        } catch (err) {
            const mensaje = getMensajeError(err)
            showToast(mensaje, 'error')
            console.error('Error al cargar balances', err)
        } finally {
            setLoading(false)
        }
    }, [groupId, groupNumericId])

    useOnInit(() => {
        void fetchGroupData()
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
            <div className="space-y-4 animate-pulse">
                {/* Summary row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm">
                        <div className="h-3 w-16 rounded bg-muted/60" />
                        <div className="mt-2 h-6 w-24 rounded bg-muted/60" />
                    </div>
                    <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm">
                        <div className="h-3 w-16 rounded bg-muted/60" />
                        <div className="mt-2 h-6 w-24 rounded bg-muted/60" />
                    </div>
                </div>
                {/* Section card */}
                <div className="rounded-2xl border border-border bg-background/70 shadow-sm overflow-hidden">
                    <div className="border-b border-border px-4 py-2.5">
                        <div className="h-3.5 w-28 rounded bg-muted/60" />
                    </div>
                    <div className="py-1 space-y-0 divide-y divide-border">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                                <div className="h-9 w-9 shrink-0 rounded-full bg-muted/60" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3.5 w-32 rounded bg-muted/60" />
                                    <div className="h-3 w-16 rounded bg-muted/60" />
                                </div>
                                <div className="h-3.5 w-16 rounded bg-muted/60" />
                            </div>
                        ))}
                    </div>
                </div>
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
                                            showPayButton
                                            grupoId={groupNumericId}
                                            totalMonto={b.monto}
                                            acreedorId={b.acreedorId}
                                            acreedorNombre={b.acreedorNombre}
                                            onPagoExitoso={fetchBalances}
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