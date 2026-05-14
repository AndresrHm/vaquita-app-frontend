/* eslint-disable no-undef */
import { Usuario } from '@/domain/usuario'
import { Expense } from '@/domain/expense'
import { TipoDivision } from '@/domain/enums/tipoDivision'

interface Props {
    participants: Usuario[]
    expense: Expense
    onExactAmountChange?: (participantId: number, amount: number) => void
    onPercentageChange?: (participantId: number, percentage: number) => void
}

export default function AllocationSummary({ participants, expense, onExactAmountChange, onPercentageChange }: Props) {
    const activeParticipants = participants.filter(p => expense.participantIds.includes(p.id!))

    const getAmountForParticipant = (participantId: number): number => {
        if (expense.tipoDivision === TipoDivision.PARTES_IGUALES) {
            return expense.total / activeParticipants.length
        } else if (expense.tipoDivision === TipoDivision.PARTES_EXACTAS || expense.tipoDivision === TipoDivision.PORCENTUAL) {
            const allocation = expense.allocations.find(a => a.participantId === participantId)
            if (expense.tipoDivision === TipoDivision.PORCENTUAL && allocation) {
                return (allocation.total / 100) * expense.total
            }
            return allocation?.total || 0
        } else if (expense.tipoDivision === TipoDivision.ALEATORIO) {
            return 0
        }
        return 0
    }

    const getPercentageForParticipant = (participantId: number): number => {
        if (expense.tipoDivision === TipoDivision.PORCENTUAL) {
            const allocation = expense.allocations.find(a => a.participantId === participantId)
            return allocation?.total || 0
        }
        return 0
    }

    const totalAssigned = expense.allocations.reduce((acc, curr) => acc + curr.total, 0)
    const isValid = expense.tipoDivision === TipoDivision.PARTES_IGUALES ||
        (expense.tipoDivision === TipoDivision.PARTES_EXACTAS && Math.abs(totalAssigned - expense.total) < 0.01) ||
        (expense.tipoDivision === TipoDivision.PORCENTUAL && Math.abs(totalAssigned - 100) < 0.01)

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">

            <p className="text-xs text-muted-foreground px-1">
                {expense.tipoDivision === TipoDivision.PARTES_IGUALES && 'Cada integrante paga lo mismo. Nada de cosas raras.'}
                {expense.tipoDivision === TipoDivision.PARTES_EXACTAS && 'Definí el monto exacto a pagar por cada integrante.'}
                {expense.tipoDivision === TipoDivision.PORCENTUAL && 'Definí el porcentaje del total que le corresponde pagar a cada integrante.'}
                {expense.tipoDivision === TipoDivision.ALEATORIO && '¿No pueden ponerse de acuerdo? ¡Nosotros nos encargamos!'}
            </p>

            {activeParticipants.length > 0 && (
                <div className="rounded-xl border border-border bg-background/30 divide-y divide-border/50">
                    {activeParticipants.map((participant) => {
                        const amount = getAmountForParticipant(participant.id!)
                        const percentage = getPercentageForParticipant(participant.id!)
                        const isEditable = expense.tipoDivision === TipoDivision.PARTES_EXACTAS || expense.tipoDivision === TipoDivision.PORCENTUAL

                        return (
                            <div key={participant.id} className="flex items-center justify-between p-3 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{participant.nombre}</span>
                                    {participant.id === Number(localStorage.id) && (
                                        <span className="text-[9px] text-primary">Pagador</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {expense.tipoDivision === TipoDivision.PORCENTUAL && (
                                        <>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                className="w-16 bg-background/50 py-1.5 text-sm outline-none text-right border border-border rounded px-2"
                                                value={percentage || ''}
                                                onChange={(e) => onPercentageChange?.(participant.id!, Number(e.target.value))}
                                            />
                                            <span className="text-xs text-muted-foreground">%</span>
                                        </>
                                    )}

                                    <div className="flex items-center gap-2 bg-background/50 rounded-lg px-2 border border-border">
                                        <span className="text-xs text-muted-foreground">$</span>
                                        {isEditable && expense.tipoDivision === TipoDivision.PARTES_EXACTAS ? (
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-20 bg-transparent py-1.5 text-sm outline-none text-right"
                                                value={amount || ''}
                                                onChange={(e) => onExactAmountChange?.(participant.id!, Number(e.target.value))}
                                            />
                                        ) : (
                                            <span className="py-1.5 text-sm text-right min-w-[80px]">
                                                {expense.tipoDivision === TipoDivision.ALEATORIO ? '???' : amount.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Validador visual */}
            {expense.tipoDivision !== TipoDivision.PARTES_IGUALES && expense.tipoDivision !== TipoDivision.ALEATORIO && activeParticipants.length > 0 && (
                <div className="flex justify-between px-2">
                    <span className="text-[10px] text-muted-foreground">
                        {expense.tipoDivision === TipoDivision.PARTES_EXACTAS ? 'Suma asignada:' : 'Suma porcentajes:'}
                    </span>
                    <span className={`text-[10px] font-bold ${isValid ? 'text-green-500' : 'text-destructive'}`}>
                        {expense.tipoDivision === TipoDivision.PARTES_EXACTAS
                            ? `$${totalAssigned.toFixed(2)} / $${expense.total.toFixed(2)}`
                            : `${totalAssigned.toFixed(2)}% / 100%`
                        }
                    </span>
                </div>
            )}
        </div>
    )
}