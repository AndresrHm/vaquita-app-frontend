import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Participant {
  id: string
  name: string
  paid: number
}

interface Settlement {
  from: string
  to: string
  amount: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 8)
}

function calcSettlements(participants: Participant[]): Settlement[] {
  const total = participants.reduce((s, p) => s + p.paid, 0)
  const n = participants.length
  if (n === 0 || total === 0) return []

  const perPerson = total / n
  const balances = participants.map((p) => ({
    name: p.name || 'Sin nombre',
    balance: p.paid - perPerson,
  }))

  const creditors = balances
    .filter((b) => b.balance > 0.005)
    .sort((a, b) => b.balance - a.balance)
  const debtors = balances
    .filter((b) => b.balance < -0.005)
    .sort((a, b) => a.balance - b.balance)

  const settlements: Settlement[] = []
  let ci = 0
  let di = 0
  const cArr = creditors.map((c) => ({ ...c }))
  const dArr = debtors.map((d) => ({ ...d }))

  while (ci < cArr.length && di < dArr.length) {
    const credit = cArr[ci].balance
    const debt = Math.abs(dArr[di].balance)
    const amount = Math.min(credit, debt)

    settlements.push({
      from: dArr[di].name,
      to: cArr[ci].name,
      amount: Math.round(amount * 100) / 100,
    })

    cArr[ci].balance -= amount
    dArr[di].balance += amount

    if (Math.abs(cArr[ci].balance) < 0.005) ci++
    if (Math.abs(dArr[di].balance) < 0.005) di++
  }

  return settlements
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ParticipantRow({
  participant,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  participant: Participant
  index: number
  onChange: (id: string, field: 'name' | 'paid', value: string) => void
  onRemove: (id: string) => void
  canRemove: boolean
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {/* Name */}
      <div className="relative flex-1">
        <Input
          value={participant.name}
          onChange={(e) => onChange(participant.id, 'name', e.target.value)}
          className="rounded-xl border border-border bg-card text-sm h-11 pl-3 pr-3"
        />
        {participant.name === '' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none select-none">
            Amigo {index + 1}
          </span>
        )}
      </div>

      {/* Paid */}
      <div className="relative w-28">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none select-none">
          $
        </span>
        <Input
          type="number"
          min={0}
          placeholder="0"
          value={participant.paid === 0 ? '' : participant.paid}
          onChange={(e) => onChange(participant.id, 'paid', e.target.value)}
          className="rounded-xl border border-border bg-card text-sm h-11 pl-6 pr-3 text-right"
        />
      </div>

      {/* Remove */}
      {canRemove && (
        <button
          onClick={() => onRemove(participant.id)}
          className="text-muted-foreground hover:text-danger transition-colors p-1.5 rounded-lg hover:bg-danger-muted"
          aria-label="Eliminar participante"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function QuickSplitPage() {
  const navigate = useNavigate()

  const [participants, setParticipants] = useState<Participant[]>([
    { id: uid(), name: '', paid: 0 },
    { id: uid(), name: '', paid: 0 },
  ])
  const [sliced, setSliced] = useState(false)

  const total = participants.reduce((s, p) => s + p.paid, 0)
  const settlements = sliced ? calcSettlements(participants) : []
  const perPerson = total > 0 && participants.length > 0
    ? Math.round((total / participants.length) * 100) / 100
    : 0

  const handleChange = useCallback(
    (id: string, field: 'name' | 'paid', value: string) => {
      setSliced(false)
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, [field]: field === 'paid' ? parseFloat(value) || 0 : value }
            : p
        )
      )
    },
    []
  )

  const addParticipant = () => {
    setSliced(false)
    setParticipants((prev) => [...prev, { id: uid(), name: '', paid: 0 }])
  }

  const removeParticipant = (id: string) => {
    setSliced(false)
    setParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSlice = () => {
    if (total === 0) return
    setSliced(true)
  }

  const reset = () => {
    setSliced(false)
    setParticipants([
      { id: uid(), name: '', paid: 0 },
      { id: uid(), name: '', paid: 0 },
    ])
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-md px-4 py-6 flex flex-col gap-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {/* Vaquita logo placeholder */}
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-base font-medium text-foreground tracking-tight">División rápida</span>
            <Badge className="bg-primary/10 text-primary border-0 text-xs px-2 py-0.5 rounded-full font-normal">Beta</Badge>
          </div>
          <button
            onClick={reset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
          >
            Limpiar
          </button>
        </div>

        {/* ── Intro card ── */}
        <Card className="rounded-2xl border border-border shadow-none bg-card">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-foreground mb-2">Dividí gastos al toque</p>
            <ul className="space-y-1.5">
              {[
                '🧊 Anotá quién puso qué',
                '🍕 Sumá todos los participantes',
                '💸 Ves exactamente quién le debe a quién',
              ].map((line) => (
                <li key={line} className="text-sm text-muted-foreground">{line}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              No hace falta crear cuenta. Los datos no se guardan.
            </p>
          </CardContent>
        </Card>

        {/* ── Participants ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Participantes</span>
            {total > 0 && (
              <span className="text-xs text-muted-foreground">
                Total: <span className="font-medium text-foreground">${total.toLocaleString()}</span>
              </span>
            )}
          </div>

          {/* Column headers */}
          <div className="flex items-center gap-2 mb-1 px-0">
            <span className="flex-1 text-xs text-muted-foreground pl-1">Nombre</span>
            <span className="w-28 text-xs text-muted-foreground text-right pr-1">Pagó</span>
            <div className="w-8" />
          </div>

          {participants.map((p, i) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              index={i}
              onChange={handleChange}
              onRemove={removeParticipant}
              canRemove={participants.length > 2}
            />
          ))}

          <button
            onClick={addParticipant}
            className="w-full mt-1 h-11 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Sumar un amigo
          </button>
        </div>

        {/* ── Slice button ── */}
        <button
          onClick={handleSlice}
          disabled={total === 0}
          className="w-full h-13 rounded-2xl bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l9 7H3l9-7z" />
            <path d="M3 9l9 13 9-13" />
          </svg>
          ¡DIVIDIR!
        </button>

        {/* ── Results ── */}
        {sliced && settlements.length > 0 && (
          <div className="flex flex-col gap-3">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Total gastado</p>
                <p className="text-lg font-medium text-foreground">${total.toLocaleString()}</p>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Cada uno paga</p>
                <p className="text-lg font-medium text-foreground">${perPerson.toLocaleString()}</p>
              </div>
            </div>

            {/* Settlements */}
            <Card className="rounded-2xl border border-border shadow-none bg-card">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-foreground mb-3">Quién le debe a quién</p>
                <div className="flex flex-col gap-2">
                  {settlements.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-muted"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Avatar from */}
                        <div className="w-7 h-7 rounded-full bg-danger-muted flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-danger">
                            {s.from.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {s.from}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            le paga a{' '}
                            <span className="font-medium text-foreground">{s.to}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <span className="text-base font-medium text-foreground">
                          ${s.amount.toLocaleString()}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        <div className="w-7 h-7 rounded-full bg-success-muted flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-success">
                            {s.to.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {sliced && settlements.length === 0 && total > 0 && (
          <Card className="rounded-2xl border border-border shadow-none bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl mb-1">🎉</p>
              <p className="text-sm font-medium text-foreground">¡Todo balanceado!</p>
              <p className="text-xs text-muted-foreground mt-0.5">Todos pusieron exactamente lo mismo.</p>
            </CardContent>
          </Card>
        )}

        {/* ── CTA: sign up ── */}
        <Card className="rounded-2xl border border-primary/20 shadow-none overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-primary/5 px-4 pt-4 pb-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">
                    ¿Querés hacer esto de verdad?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Con Vaquita podés guardar gastos, escanear tickets con IA, crear grupos, agregar amigos y llevar el historial completo. Gratis.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
              <Button
                onClick={() => navigate('/register')}
                className="w-full h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
              >
                Crear cuenta gratis
              </Button>
              <button
                onClick={() => navigate('/login')}
                className="w-full h-9 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ya tengo cuenta →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* bottom spacer */}
        <div className="h-4" />
      </div>
    </div>
  )
}