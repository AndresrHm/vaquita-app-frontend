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
                    </div>
                    <span className="whitespace-nowrap">{getTimeAgo(actividad.fecha)}</span>
                </div>
            </Card>
        )
    }

    // Extraemos el componente del ícono de forma segura
    const Icon = meta.icon

    // Construcción plana de títulos y descripciones basados en lógica directa
    const esGrupo = actividad.tipo === TipoActividad.INGRESO_GRUPO || actividad.tipo === TipoActividad.EGRESO_GRUPO
    const tituloDinamico = (esGrupo && metadata.grupoNombre) ? `Grupo: ${metadata.grupoNombre}` : meta.title

    const tieneCategoria = metadata.categoria && (
        actividad.tipo === TipoActividad.MIS_DEUDAS ||
        actividad.tipo === TipoActividad.MIS_DEUDAS_SALDADAS ||
        actividad.tipo === TipoActividad.MIS_PAGOS ||
        actividad.tipo === TipoActividad.COBROS_RECIBIDOS
    )
    const descripcionDinamica = tieneCategoria ? `${actividad.descripcion} • Cat: ${metadata.categoria}` : actividad.descripcion

    return (
        <Card>
            <div className="flex items-start gap-4 p-1">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${meta.color || 'bg-muted'}`}>
                    {/* Render seguro: si por algún motivo no hay componente de ícono válido, evita romper la pantalla */}
                    {Icon ? <Icon className="h-5 w-5" /> : <span className="text-xs">⚠️</span>}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-foreground">
                                {tituloDinamico}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {descripcionDinamica}
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