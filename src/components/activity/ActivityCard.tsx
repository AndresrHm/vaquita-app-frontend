import type { ActividadDTO, ActividadMetadata } from '@/domain/actividadDTO'
import { TipoActividad, TipoActividadLabel } from '@/domain/enums/tipoActividad'
import Card from '@/components/common/card'

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
    const fecha_date = new Date(fecha)
    const diffMs = now.getTime() - fecha_date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return 'hace unos segundos'
    if (diffMins < 60) return `hace ${diffMins} m`
    if (diffHours < 24) return `hace ${diffHours} h`
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `hace ${diffDays} d`
    return fecha_date.toLocaleDateString('es-ES')
}

// Componentes específicos por tipo de actividad
const ActivityCardGrupo = ({ actividad }: ActivityCardProps) => {
    const metadata = parseMetadata(actividad.metadata)

    return (
        <Card>
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                            👥
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-foreground">
                                {metadata.grupoNombre ? `Grupo: ${metadata.grupoNombre}` : 'Te agregaron a un grupo'}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">{actividad.descripcion}</div>
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
    const isCreated = actividad.tipo === TipoActividad.MIS_DEUDAS
    const isDeleted = actividad.tipo === TipoActividad.MIS_PAGOS
    const icon = isCreated ? '➕' : isDeleted ? '🗑️' : '✏️'

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

const ActivityCardCuenta = ({ actividad }: ActivityCardProps) => {
    return (
        <Card>
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm">
                            👤
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-foreground">{actividad.descripcion}</div>
                            <div className="mt-1 text-xs text-muted-foreground">Cuenta registrada en el sistema</div>
                        </div>
                    </div>
                </div>
                <div className="whitespace-nowrap text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
            </div>
        </Card>
    )
}

// Componente selector de tipo de actividad
export default function ActivityCard({ actividad }: ActivityCardProps) {
    switch (actividad.tipo) {
        case TipoActividad.INGRESO_GRUPO:
            return <ActivityCardGrupo actividad={actividad} />
        case TipoActividad.EGRESO_GRUPO:
            return <ActivityCardGrupo actividad={actividad} />
        case TipoActividad.MIS_DEUDAS:
        case TipoActividad.MIS_PAGOS:
        case TipoActividad.COBROS_RECIBIDOS:
        case TipoActividad.MIS_DEUDAS_SALDADAS:
            return <ActivityCardGasto actividad={actividad} />
        case TipoActividad.CUENTA_CREADA:
            return <ActivityCardCuenta actividad={actividad} />
        default:
            return (
                <Card>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-foreground">{actividad.descripcion}</div>
                            <div className="mt-1 text-xs text-muted-foreground">Tipo: {TipoActividadLabel[actividad.tipo] ?? actividad.tipo}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{getTimeAgo(actividad.fecha)}</div>
                    </div>
                </Card>
            )
    }
}
