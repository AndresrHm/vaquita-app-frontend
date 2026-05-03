import { useNavigate } from 'react-router-dom'
import MoneyBadge from '@/components/moneyBadge/moneyBadge'
import PayDebtModal from '@/components/balancesPage/PayDebtModal'

type Friend = {
    id: string
    name: string
    role: string
    due: number
    imageUrl?: string
}

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
}

export default function FriendCard({ friend }: { friend: Friend }) {
    const navigate = useNavigate()

    const handlePagoExitoso = () => {
        // Recargar la página para actualizar balances
        window.location.reload()
    }

    return (
        <div
            className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => navigate(`/friends/${friend.id}`)}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {friend.imageUrl ? (
                        <img
                            src={friend.imageUrl}
                            alt={friend.name}
                            className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
                        />
                    ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-muted/80 text-xs font-semibold text-muted-foreground">
                            {getInitials(friend.name)}
                        </div>
                    )}
                    <div>
                        <div className="text-sm font-semibold text-foreground">{friend.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{friend.role}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <MoneyBadge amount={friend.due} />
                    {friend.due > 0 && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <PayDebtModal
                                acreedorId={Number(friend.id)}
                                acreedorNombre={friend.name}
                                totalMonto={Math.abs(friend.due)}
                                onPagoExitoso={handlePagoExitoso}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
