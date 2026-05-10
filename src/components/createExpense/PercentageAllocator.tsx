import { Usuario } from '@/domain/usuario'
import { Expense } from '@/domain/expense'

interface Props {
    participants: Usuario[]
    expense: Expense
    totalAsignado: number
    onPercentageChange: (participantId: number, percentage: number) => void
}

export default function PercentageAllocator({ participants, expense, totalAsignado, onPercentageChange }: Props) {
    const activeParticipants = participants.filter(p => expense.participantIds.includes(p.id!))

    const totalPercentage = expense.allocations.reduce((acc, curr) => acc + curr.total, 0)

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase px-1">Asignar porcentajes</span>

            <div className="rounded-xl border border-border bg-background/30 divide-y divide-border/50">
                {activeParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 gap-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{participant.nombre}</span>
                            {participant.id === Number(localStorage.id) && (
                                <span className="text-[9px] text-primary">Pagador</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 bg-background/50 rounded-lg px-2 border border-border focus-within:border-primary/50 transition-colors">
                            <input
                                type="number"
                                placeholder="0"
                                min="0"
                                max="100"
                                step="0.01"
                                className="w-16 bg-transparent py-1.5 text-sm outline-none text-right"
                                value={expense.allocations.find(a => a.participantId === participant.id)?.total ?? ''}
                                onChange={(e) => onPercentageChange(participant.id!, Number(e.target.value))}
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Validador visual */}
            <div className="flex justify-between px-2">
                <span className="text-[10px] text-muted-foreground">Suma porcentajes:</span>
                <span className={`text-[10px] font-bold ${Math.abs(totalPercentage - 100) < 0.01 ? 'text-green-500' : 'text-destructive'}`}>
                    {totalPercentage.toFixed(2)}% / 100%
                </span>
            </div>
        </div>
    )
}