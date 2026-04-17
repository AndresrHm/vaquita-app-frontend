import Card from '@/components/common/card'
import { formatCurrency } from '@/utils/formatCurrency'

type ExpenseCardProps = {
	title: string
	group: string
	groupLabel?: string
	category: string
	date: string
	amountToPay: number
}

export default function ExpenseCard({ title, group, groupLabel = 'Grupo', category, date, amountToPay }: ExpenseCardProps) {
	return (
		<Card className="rounded-xl px-4 py-3" interactive={false}>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 space-y-1">
					<p className="truncate text-sm font-semibold text-foreground">{title}</p>
					<p className="truncate text-xs text-muted-foreground">{groupLabel}: {group}</p>
					<p className="truncate text-xs text-muted-foreground">Categoría: {category}</p>
					<p className="text-xs text-muted-foreground">Fecha: {date}</p>
				</div>

				<div className="shrink-0 text-right">
					<p className="text-[11px] text-muted-foreground">A pagar</p>
					<p className="text-sm font-semibold text-foreground">{formatCurrency(amountToPay)}</p>
				</div>
			</div>
		</Card>
	)
}
