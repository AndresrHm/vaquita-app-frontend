import api from './apiToken'

export type CurrencyConversionResult = {
    from: string
    to: string
    originalAmount: number
    convertedAmount: number
    exchangeRate: number
}

export async function convertCurrency(
    from: string,
    to: string,
    amount: number
): Promise<CurrencyConversionResult> {
    const normalizedFrom = from.trim().toUpperCase()
    const normalizedTo = to.trim().toUpperCase()

    if (!normalizedFrom || !normalizedTo) {
        throw new Error('Monedas invalidas para convertir')
    }

    const { data } = await api.get<CurrencyConversionResult>('/currency/convert', {
        params: {
            from: normalizedFrom,
            to: normalizedTo,
            amount,
        },
    })

    return data
}
