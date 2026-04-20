import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useOnInit } from '@/customHooks/hooks'
import { obtenerBalancesGrupo } from '@/service/groupsService'
import type { BalanceDTO } from '@/domain/Grupo' // Asegurate de importar tu DTO

export default function GroupBalancesPage() {
    const { groupId } = useParams()
    const currentUserId = Number(localStorage.getItem('id'))
    const [balances, setBalances] = useState<BalanceDTO[]>([])
    const [loading, setLoading] = useState(true)

    useOnInit(() => {
        const fetchBalances = async () => {
            if (!groupId) return
            try {
                const data = await obtenerBalancesGrupo(Number(groupId))
                setBalances(data)
            } catch (err) {
                console.error('Error al cargar balances', err)
            } finally {
                setLoading(false)
            }
        }
        void fetchBalances()
    })

    if (loading) return <div>Cargando balances...</div>

    const owedToMe = balances.filter(b => b.acreedorId === currentUserId)
    const others = balances.filter(b => b.acreedorId !== currentUserId)

    return (
        <div style={{ padding: '20px' }}>
            <h1>Balances del grupo</h1>

            {/* Seccion 1: Lo que me deben */}
            <section style={{ marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                <h2>Lo que te deben</h2>
                {owedToMe.length === 0 ? (
                    <p>Nadie te debe nada.</p>
                ) : (
                    <ul>
                        {owedToMe.map((b, i) => (
                            <li key={i}>
                                <strong>{b.deudorNombre}</strong> te debe <strong>${b.monto}</strong>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Seccion 2: Los demás */}
            <section>
                <h2>Otras deudas</h2>
                {others.length === 0 ? (
                    <p>No hay más deudas en el grupo.</p>
                ) : (
                    <ul>
                        {others.map((b, i) => (
                            <li key={i}>
                                <strong>{b.deudorNombre}</strong> le debe a <strong>{b.acreedorNombre}</strong>: ${b.monto}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}