import Card from '@/components/common/card'

type ActiveFiltersSummaryCardProps = {
  activeViewLabel: string
  activeCategorySummary: string
  activeDateSummary: string
  activeAmountSummary: string
}

export default function ActiveFiltersSummaryCard({
  activeViewLabel,
  activeCategorySummary,
  activeDateSummary,
  activeAmountSummary,
}: ActiveFiltersSummaryCardProps) {
  return (
    <Card className="rounded-2xl border border-border/70 bg-background/80 p-4" interactive={false}>
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>
          Vista: <span className="font-medium text-foreground">{activeViewLabel}</span>
        </p>
        <p>
          Categorías: <span className="font-medium text-foreground">{activeCategorySummary}</span>
        </p>
        <p>
          Fecha: <span className="font-medium text-foreground">{activeDateSummary}</span>
        </p>
        <p>
          Monto: <span className="font-medium text-foreground">{activeAmountSummary}</span>
        </p>
      </div>
    </Card>
  )
}
