import { ChevronDown, ChevronLeft, ChevronUp, Settings } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconNavButton from '@/components/common/IconNavButton'
import type { GrupoDetalleDTO, Miembro } from '@/domain/Grupo'
import { AvatarCircle } from '@/components/common/avatarCircle'
import { getAvatarColorClass, getInitials } from '@/components/common/initials'

function GroupMembersCount({ count }: { count: number }) {
    return (
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white">
            <span className="text-sm font-semibold">{count}</span>
        </div>
    )
}

export default function GroupHeader({
    groupDetail,
    miembros = [],
    expanded,
    onToggle,
}: {
    groupDetail: GrupoDetalleDTO | null
    miembros?: Miembro[]
    expanded: boolean
    onToggle: () => void
}) {
    const navigate = useNavigate()

    if (!groupDetail) return null

    const initials = getInitials(groupDetail.nombre)
    const avatarColor = getAvatarColorClass(groupDetail.nombre)
    const [coverImageFailed, setCoverImageFailed] = useState(false)
    const showCoverImage = Boolean(groupDetail.imagenUrl?.trim()) && !coverImageFailed

    return (
        <div className="space-y-4">
            <div className="-mx-4 rounded-b-2xl rounded-t-none overflow-hidden shadow-sm">
                <div className="relative h-44 w-full">
                    {/* Imagen */}
                    {showCoverImage ? (
                        <img
                            src={groupDetail.imagenUrl}
                            alt={groupDetail.nombre}
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={() => setCoverImageFailed(true)}
                        />
                    ) : null}

                    <div className={`absolute inset-0 flex items-center justify-center ${showCoverImage ? 'bg-black/10' : avatarColor.bg}`}>
                        {!showCoverImage && (
                            <span className={`text-5xl font-black tracking-tight ${avatarColor.text}`}>
                                {initials}
                            </span>
                        )}
                    </div>

                    {showCoverImage && (
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
                    )}

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
                    <div className="absolute inset-x-4 bottom-8">
                        <div className="flex flex-col gap-2">
                            <h1 className={`text-xl font-semibold drop-shadow-sm leading-tight line-clamp-2 ${showCoverImage ? 'text-white' : 'text-foreground'}`}>
                                {groupDetail.nombre}
                            </h1>

                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3 items-center">
                                    {miembros.slice(0, 5).map((m) => (
                                        <div key={m.id} className="rounded-full bg-transparent">
                                            <AvatarCircle nombre={m.nombre} imagenUrl={m.imagenUrl} sizeClass="h-7 w-7" />
                                        </div>
                                    ))}

                                    {miembros.length > 5 && (
                                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-transparent text-[11px] text-white">
                                            ...
                                        </div>
                                    )}
                                </div>

                                <GroupMembersCount count={groupDetail.cantidadIntegrantes ?? 0} />
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-x-0 -bottom-5 flex justify-center">
                        <button
                            type="button"
                            onClick={onToggle}
                            aria-expanded={expanded}
                            aria-label={expanded ? 'Ocultar info del grupo' : 'Mostrar info del grupo'}
                            className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-slate-900/80 text-white shadow-[0_8px_24px_rgba(2,8,23,0.45)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800/90"
                        >
                            <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
                            {expanded ? (
                                <ChevronUp className="relative h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                            ) : (
                                <ChevronDown className="relative h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
