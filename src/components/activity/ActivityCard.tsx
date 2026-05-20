/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/common/card'
import type { ActividadDTO, ActividadMetadata } from '@/domain/actividadDTO'
import { TipoActividad } from '@/domain/enums/tipoActividad'
import { activityMeta } from './activityMeta'

interface ActivityCardProps {
    actividad: ActividadDTO
}

const parseMetadata = (metadata: string): ActividadMetadata => {
    try {
        return JSON.parse(metadata)
    } catch {
        return {}
    }
}

const getTimeAgo = (fecha: string): string => {
    const now = new Date()
    const fechaDate = new Date(fecha)
    const diffMs = now.getTime() - fechaDate.getTime()

    const secs = Math.floor(diffMs / 1000)
    const mins = Math.floor(secs / 60)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)

    if (secs < 60) return 'Hace unos segundos'
    if (mins < 60) return `Hace ${mins}m`
    if (hours < 24) return `Hace ${hours}h`
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days}d`

    return fechaDate.toLocaleDateString('es-AR')
}

<<<<<<< Updated upstream
export default function ActivityCard({ actividad }: ActivityCardProps) {
    // Forzamos la clave del objeto para asegurarnos de que machee con el enum de Kotlin
    const meta = activityMeta[actividad.tipo as keyof typeof activityMeta]
    const metadata = parseMetadata(actividad.metadata)

    if (!meta) {
        return (
            <Card>
                <div className="flex items-center justify-between p-2 text-xs text-muted-foreground">
                    <div>
                        <p className="font-medium text-foreground">{actividad.descripcion}</p>
                        <p className="mt-0.5 text-[10px]">Tipo sin mapear: {String(actividad.tipo)}</p>
=======
const getCurrentUserId = (): number | null => {
    const storedId = typeof globalThis !== 'undefined' && 'localStorage' in globalThis
        ? globalThis.localStorage.getItem('id')
        : null

    return storedId ? Number(storedId) : null
}

const getDisplayName = (metadata: ActividadMetadata, currentUserId: number | null, fallback?: string) => {
    if (currentUserId !== null && metadata.usuarioId === currentUserId) {
        return 'Tú'
    }

    return metadata.usuarioNombre || fallback || 'Un usuario'
}

const ActivityCardGrupoIngreso = ({ actividad }: ActivityCardProps) => {
    const metadata = parseMetadata(actividad.metadata)
    const currentUserId = getCurrentUserId()
    const displayName = getDisplayName(metadata, currentUserId)
    const isCurrentUser = currentUserId !== null && metadata.usuarioId === currentUserId

    return (
        <Card>
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                            IN
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-foreground">
                                {isCurrentUser ? 'Te uniste al grupo' : `${displayName} se unió al grupo`}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="whitespace-nowrap text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
            </div>
        </Card>
    )
}

const ActivityCardGrupoEgreso = ({ actividad }: ActivityCardProps) => {
    const metadata = parseMetadata(actividad.metadata)
    const currentUserId = getCurrentUserId()
    const displayName = getDisplayName(metadata, currentUserId)
    const isCurrentUser = currentUserId !== null && metadata.usuarioId === currentUserId

    return (
        <Card>
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
                            OUT
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-foreground">
                                {isCurrentUser ? 'Saliste del grupo' : `${displayName} salió del grupo`}
                                const getCurrentUserId = (): number | null => {
                                    const storedId = typeof globalThis !== 'undefined' && 'localStorage' in globalThis
                                        ? globalThis.localStorage.getItem('id')
                                        : null

                                    return storedId ? Number(storedId) : null
                                }

                                const getDisplayName = (metadata: ActividadMetadata, currentUserId: number | null, fallback?: string) => {
                                    if (currentUserId !== null && metadata.usuarioId === currentUserId) {
                                        return 'Tú'
                                    }

                                    return metadata.usuarioNombre || fallback || 'Un usuario'
                                }

                                const ActivityCardGrupoIngreso = ({ actividad }: ActivityCardProps) => {
                                    const metadata = parseMetadata(actividad.metadata)
                                    const currentUserId = getCurrentUserId()
                                    const displayName = getDisplayName(metadata, currentUserId)
                                    const isCurrentUser = currentUserId !== null && metadata.usuarioId === currentUserId

                                    return (
                                        <Card>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                                                            IN
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-foreground">
                                                                {isCurrentUser ? 'Te uniste al grupo' : `${displayName} se unió al grupo`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="whitespace-nowrap text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
                                            </div>
                                        </Card>
                                    )
                                }

                                const ActivityCardGrupoEgreso = ({ actividad }: ActivityCardProps) => {
                                    const metadata = parseMetadata(actividad.metadata)
                                    const currentUserId = getCurrentUserId()
                                    const displayName = getDisplayName(metadata, currentUserId)
                                    const isCurrentUser = currentUserId !== null && metadata.usuarioId === currentUserId

                                    return (
                                        <Card>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
                                                            OUT
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-foreground">
                                                                {isCurrentUser ? 'Saliste del grupo' : `${displayName} salió del grupo`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="whitespace-nowrap text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
                                            </div>
                                        </Card>
                                    )
                                }

                                const ActivityCardGasto = ({ actividad }: ActivityCardProps) => {
                                    const metadata = parseMetadata(actividad.metadata)
                                    const icon = actividad.tipo === TipoActividad.GASTO_CREADO ? 'C' : actividad.tipo === TipoActividad.GASTO_ELIMINADO ? 'E' : 'A'

                                    return (
                                        <Card>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm">
                                                            {icon}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-foreground">{actividad.descripcion}</div>
                                                            {metadata.categoria && (
                                                                <div className="mt-1 text-xs text-muted-foreground">Categoría: {metadata.categoria}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="whitespace-nowrap text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
                                            </div>
                                        </Card>
                                    )
                                }

                                const ActivityCardGastoDeuda = ({ actividad }: ActivityCardProps) => {
                                    const metadata = parseMetadata(actividad.metadata)
                                    const currentUserId = getCurrentUserId()
                                    const isCurrentUser = currentUserId !== null && metadata.usuarioId === currentUserId
                                    const hasAcreedor = Boolean(metadata.acreedorNombre)
                                    const title = hasAcreedor
                                        ? isCurrentUser
                                            ? `Tienes una deuda con ${metadata.acreedorNombre}`
                                            : `${getDisplayName(metadata, currentUserId)} tiene una deuda con ${metadata.acreedorNombre}`
                                        : actividad.descripcion

                                    return (
                                        <Card>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                                                            DE
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-foreground">{title}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="whitespace-nowrap text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
                                            </div>
                                        </Card>
                                    )
                                }

                                const ActivityCardDeudaSaldada = ({ actividad }: ActivityCardProps) => {
                                    const metadata = parseMetadata(actividad.metadata)
                                    const currentUserId = getCurrentUserId()
                                    const isCurrentUser = currentUserId !== null && metadata.usuarioId === currentUserId
                                    const hasDeudor = Boolean(metadata.deudorNombre)
                                    const title = hasDeudor
                                        ? isCurrentUser
                                            ? `Pagaste a ${metadata.deudorNombre}`
                                            : `${getDisplayName(metadata, currentUserId)} pagó a ${metadata.deudorNombre}`
                                        : actividad.descripcion

                                    return (
                                        <Card>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600">
                                                            PS
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-foreground">{title}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="whitespace-nowrap text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
                                            </div>
                                        </Card>
                                    )
                                }

                                const ActivityCardPago = ({ actividad }: ActivityCardProps) => {
                                    const isPago = actividad.tipo === TipoActividad.PAGO_REALIZADO
                                    const icon = isPago ? 'PR' : 'RR'

                                    return (
                                        <Card>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600">
                                                            {icon}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-foreground">{actividad.descripcion}</div>
                                                            <div className="mt-1 text-xs text-muted-foreground">Pago registrado en el sistema</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="whitespace-nowrap text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
                                            </div>
                                        </Card>
                                    )
                                }

                                export default function ActivityCard({ actividad }: ActivityCardProps) {
                                    switch (actividad.tipo) {
                                        case TipoActividad.INGRESO_GRUPO:
                                            return <ActivityCardGrupoIngreso actividad={actividad} />
                                        case TipoActividad.EGRESO_GRUPO:
                                            return <ActivityCardGrupoEgreso actividad={actividad} />
                                        case TipoActividad.GASTO_DEUDA:
                                            return <ActivityCardGastoDeuda actividad={actividad} />
                                        case TipoActividad.DEUDA_SALDADA:
                                            return <ActivityCardDeudaSaldada actividad={actividad} />
                                        case TipoActividad.GASTO_CREADO:
                                        case TipoActividad.GASTO_ACTUALIZADO:
                                        case TipoActividad.GASTO_ELIMINADO:
                                            return <ActivityCardGasto actividad={actividad} />
                                        case TipoActividad.PAGO_REALIZADO:
                                        case TipoActividad.PAGO_RECIBIDO:
                                            return <ActivityCardPago actividad={actividad} />
                                        default:
                                            return (
                                                <Card>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <div className="text-sm font-semibold text-foreground">{actividad.descripcion}</div>
                                                            <div className="mt-1 text-xs text-muted-foreground">Tipo: {actividad.tipo}</div>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
                                                    </div>
                                                </Card>
                                            )
                                    }
                                }