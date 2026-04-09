import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ColumnContainer from '@/components/common/columnContainer'
import { ChevronLeft, Settings } from 'lucide-react'
import IconNavButton from '@/components/common/IconNavButton'
import { useOnInit } from '@/customHooks/hooks'
import { obtenerDetalleGrupo } from '@/service/groups'
import type { GrupoDetalleDTO } from '@/domain/Grupo'

export default function GroupDetailPage() {
    const { groupId } = useParams()
    const navigate = useNavigate()

    const grupoId = Number(groupId)

    const [groupDetail, setGroupDetail] = useState<GrupoDetalleDTO | null>(null)

    useOnInit(() => {
        // TODO
        // if (Number.isNaN(grupoId)) {
        //     navigate('/404')
        //     return
        // }

        console.log('Grupo ID:', grupoId)

        const fetchGroupDetail = async () => {
            try {
                const data = await obtenerDetalleGrupo(Number(grupoId))
                setGroupDetail(data)
            } catch (error) {
                console.log(error)
            }
        }

        void fetchGroupDetail()
    }, [grupoId])

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
            <div className="-mx-4 rounded-b-2xl rounded-t-none overflow-hidden shadow-sm">
                <div className="relative h-44 w-full">
                    <img src={groupDetail.imagenUrl} alt={groupDetail.nombre} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30" />

                    <div className="absolute inset-x-4 top-3 flex items-center justify-between">
                        <IconNavButton ariaLabel="Volver" onClick={() => navigate(-1)} icon={<ChevronLeft className="h-5 w-5" />} />

                        <IconNavButton ariaLabel="Ajustes" to={`/groups/${groupDetail.id}/settings`} icon={<Settings className="h-5 w-5" />} />
                    </div>

                    <div className="absolute left-4 bottom-4">
                        <h1 className="text-xl font-semibold text-white">{groupDetail.nombre}</h1>
                    </div>
                </div>
            </div>

            <ColumnContainer>
                <div className="p-4">
                    <p className="text-sm text-foreground">{groupDetail.descripcion}</p>
                    <p className="mt-2 text-sm text-foreground">Integrantes: {groupDetail.cantidadIntegrantes}</p>
                </div>
            </ColumnContainer>
        </div>
    )
}
