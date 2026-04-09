import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import ColumnContainer from '@/components/common/columnContainer'
import { ChevronLeft, Settings } from 'lucide-react'
import IconNavButton from '@/components/common/IconNavButton'
import { useOnInit } from '@/customHooks/hooks'
import { obtenerDetalleGrupo } from '@/service/groups'
import type { GrupoDetalleDTO } from '@/domain/Grupo'
import GroupHeader from '@/components/groupsPage/GroupHeader'

export default function GroupDetailPage() {
    const { groupId } = useParams()
    const navigate = useNavigate()

    const grupoId = Number(groupId)

    const [groupDetail, setGroupDetail] = useState<GrupoDetalleDTO | null>(null)
    const [accentGradient, setAccentGradient] = useState<string>('linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.10))')
    const [badgeGradient, setBadgeGradient] = useState<string>('linear-gradient(to right, rgba(255,255,255,0.92), rgba(255,255,255,0.06))')
    const [badgeTextColor, setBadgeTextColor] = useState<string>('#000')
    const [chipVariant, setChipVariant] = useState<'light' | 'dark'>('light')

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
            <GroupHeader groupDetail={groupDetail} />

            <ColumnContainer>
                <div className="p-4">
                    <p className="text-sm text-foreground">{groupDetail.descripcion}</p>
                    <p className="mt-2 text-sm text-foreground">Integrantes: {groupDetail.cantidadIntegrantes}</p>
                </div>
            </ColumnContainer>
        </div>
    )
}
