export const SUPPORTED_CURRENCIES = ['ARS', 'USD', 'EUR', 'UYU', 'BRL', 'CLP', 'COP'] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export type Currency = SupportedCurrency

export const CURRENCY_LABELS: Record<SupportedCurrency, string> = {
    ARS: 'Peso argentino',
    USD: 'Dólar estadounidense',
    EUR: 'Euro',
    UYU: 'Peso uruguayo',
    BRL: 'Real brasileño',
    CLP: 'Peso chileno',
    COP: 'Peso colombiano',
}

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
    ARS: '$',
    USD: '$',
    EUR: '€',
    UYU: '$',
    BRL: 'R$',
    CLP: '$',
    COP: '$',
}

export function isSupportedCurrency(currency?: string): currency is SupportedCurrency {
    return !!currency && currency in CURRENCY_SYMBOLS
}

export function getCurrencySymbol(currency?: string): string {
    return isSupportedCurrency(currency) ? CURRENCY_SYMBOLS[currency] : CURRENCY_SYMBOLS.ARS
}