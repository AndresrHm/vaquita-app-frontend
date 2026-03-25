import React from 'react'

interface MoneyBadgeProps {
    amount: number;
    currency?: string;
    locale?: string;
}

export const MoneyBadge: React.FC<MoneyBadgeProps> = ({
    amount,
    currency = '$',
    locale = 'es-AR',
}) => {
    const isPositive = amount <= 0 // <= 0 = saldo a favor o en cero

    const formatted = Math.abs(amount).toLocaleString(locale)

    const styles = isPositive
        ? 'bg-green-100 text-green-700 border-green-300'
        : 'bg-red-100 text-red-700 border-red-300'

    const sign = isPositive ? '+' : '-'

    return (
        <div className="text-right">
            <div
                className={`inline-flex rounded-lg border px-1.5 py-0.5 text-xs font-semibold ${styles}`}
            >
                {sign}
                {currency}
                {formatted}
            </div>
        </div>
    )
}

export default MoneyBadge