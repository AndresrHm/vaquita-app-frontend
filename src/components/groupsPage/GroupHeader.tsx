import { ChevronLeft, Settings, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import IconNavButton from '@/components/common/IconNavButton'
import type { GrupoDetalleDTO } from '@/domain/Grupo'

function GroupMembersCount({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs">
            <Users className="h-3.5 w-3.5" />
            <span>{count}</span>
            <span>falta pasar nombre + icono . . .</span>
        </div>
    )
}

export default function GroupHeader({ groupDetail }: { groupDetail: GrupoDetalleDTO | null }) {
    const navigate = useNavigate()

    if (!groupDetail) return null

    return (
        <div className="space-y-4">
            <div className="-mx-4 rounded-b-2xl rounded-t-none overflow-hidden shadow-sm">
                <div className="relative h-44 w-full">
                    {/* Imagen */}
                    <img
                        src={groupDetail.imagenUrl}
                        alt={groupDetail.nombre}
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* Overlay mejorado para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />

                    {/* Top buttons */}
                    <div className="absolute inset-x-4 top-3 flex items-center justify-between">
                        <IconNavButton
                            ariaLabel="Volver"
                            onClick={() => navigate(-1)}
                            icon={<ChevronLeft className="h-5 w-5" />}
                        />

                        <IconNavButton
                            ariaLabel="Ajustes"
                            to={`/groups/${groupDetail.id}/settings`}
                            icon={<Settings className="h-5 w-5" />}
                        />
                    </div>

                    {/* Título + integrantes */}
                    <div className="absolute inset-x-4 bottom-4 space-y-1.5">
                        <h1 className="text-xl font-semibold text-white drop-shadow-sm leading-tight line-clamp-2">
                            {groupDetail.nombre}
                        </h1>

                        <GroupMembersCount
                            count={groupDetail.cantidadIntegrantes ?? 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
