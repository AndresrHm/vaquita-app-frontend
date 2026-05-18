import Card from '@/components/common/card'
import { type ActividadDTO } from '@/domain/actividadDTO'
import { activityMeta } from './activityMeta'

interface ActivityCardProps {
    actividad: ActividadDTO
}

const getTimeAgo = (fecha: string): string => {
    const now = new Date()
    const fechaDate = new Date(fecha)

    const diffMs = now.getTime() - fechaDate.getTime()

    const mins = Math.floor(diffMs / 1000 / 60)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)

    if (mins < 1) return 'Ahora'
    if (mins < 60) return `Hace ${mins}m`
    if (hours < 24) return `Hace ${hours}h`
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days}d`

    return fechaDate.toLocaleDateString('es-AR')
}

export default function ActivityCard({ actividad }: ActivityCardProps) {
    const meta = activityMeta[actividad.tipo]

    // Esto es para debugear un error
    // if (!meta) {
    //     console.error('Tipo de actividad sin metadata:', actividad.tipo)

    //     return (
    //         <Card>
    //             <div className="p-4 text-sm text-red-500">
    //                 Tipo desconocido: {String(actividad.tipo)}
    //             </div>
    //         </Card>
    //     )
    // }

    if (!meta) return null

    const Icon = meta.icon

    return (
        <Card>
            <div className="flex items-start gap-4 p-1">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${meta.color}`}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-foreground">
                                {meta.title}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {actividad.descripcion}
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 pt-1">
                            <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                                {getTimeAgo(actividad.fecha)}
                            </span>

                            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                {meta.badge}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}