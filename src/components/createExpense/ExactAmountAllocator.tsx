import { Usuario } from '@/domain/usuario'
import { Expense } from '@/domain/expense'

interface Props {
    participants: Usuario[]
    expense: Expense
    totalAsignado: number
    onAmountChange: (participantId: number, amount: number) => void
}

export default function ExactAmountAllocator({ participants, expense, totalAsignado, onAmountChange }: Props) {
    const activeParticipants = participants.filter(p => expense.participantIds.includes(p.id!))

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase px-1">Asignar montos</span>
            
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
                            <span className="text-xs text-muted-foreground">$</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-20 bg-transparent py-1.5 text-sm outline-none text-right"
                                value={expense.allocations.find(a => a.participantId === participant.id)?.total ?? ''}
                                onChange={(e) => onAmountChange(participant.id!, Number(e.target.value))}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Validador visual */}
            <div className="flex justify-between px-2">
                <span className="text-[10px] text-muted-foreground">Suma asignada:</span>
                <span className={`text-[10px] font-bold ${Math.abs(totalAsignado - expense.total) < 0.01 ? 'text-green-500' : 'text-destructive'}`}>
                    ${totalAsignado.toFixed(2)} / ${expense.total.toFixed(2)}
                </span>
            </div>
        </div>
    )
}