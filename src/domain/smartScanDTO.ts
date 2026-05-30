// ══════════════════════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Estados posibles del flujo de escaneo
 */
export type ScanState = 'idle' | 'preview' | 'loading' | 'result' | 'error'

/**
 * Monedas soportadas (sincronizadas con el backend)
 */
export type Currency = 'ARS' | 'USD' | 'EUR' | 'UYU' | 'BRL' | 'CLP' | 'COP'

/**
 * Categorías de gastos (sincronizadas con el backend)
 * Enum del backend: COMIDA, BEBIDA, HOGAR, TRANSPORTE, SUPERMERCADO, ENTRETENIMIENTO, VARIOS, OTROS
 * Mapped to frontend strings para compatibilidad
 */
export type CategoryType = 'food' | 'transport' | 'entertainment' | 'other'

/**
 * Mapa de etiquetas para mostrar en UI
 * Ahora sincronizado con las categorías del backend
 */
export const CATEGORY_LABELS: Record<CategoryType, string> = {
    food: '🍴 Comida',
    transport: '🚗 Transporte',
    entertainment: '🎉 Entretenimiento',
    other: '📦 Otro',
}

/**
 * Mapa de monedas con símbolos para mostrar en UI
 */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
    ARS: '$',
    USD: '$',
    EUR: '€',
    UYU: '$',
    BRL: 'R$',
    CLP: '$',
    COP: '$',
}

export const CURRENCY_LABELS: Record<Currency, string> = {
    ARS: 'Peso Argentino',
    USD: 'Dólar Estadounidense',
    EUR: 'Euro',
    UYU: 'Peso Uruguayo',
    BRL: 'Real Brasileño',
    CLP: 'Peso Chileno',
    COP: 'Peso Colombiano',
}

export function isSupportedScanCurrency(currency?: string): currency is Currency {
    return !!currency && currency in CURRENCY_SYMBOLS
}

export function getCurrencySymbol(currency?: string): string {
    return isSupportedScanCurrency(currency) ? CURRENCY_SYMBOLS[currency] : CURRENCY_SYMBOLS.ARS
}

/**
 * Item individual en un gasto/ticket
 */
export type LineItem = {
    name: string
    quantity?: number
    price: number
}

/**
 * Resultado del escaneo de un ticket
 * Sincronizado con ReceiptScanResultDto del backend
 */
export type ScanResult = {
    title: string
    description?: string // NUEVO: descripción detallada del gasto
    totalAmount: number
    currency?: string // moneda detectada por el scan (puede venir libre)
    date?: string // Formato YYYY-MM-DD
    category?: CategoryType
    items?: LineItem[]
}

export type BackendScanResult = ScanResult

/**
 * Parametros que se pasan al navegar hacia CreateExpense desde SmartScan
 */
export type ScanToExpenseNavParams = {
    title: string
    description?: string
    totalAmount: number
    currency?: string
    date?: string
    category?: CategoryType
    items?: LineItem[]
    attachments?: ExpenseAttachment[]
}

/**
 * Estado completo que maneja la página de SmartScan
 */
export type SmartScanPageState = {
    state: ScanState
    // eslint-disable-next-line no-undef
    imageFile: File | null
    imagePreview: string | null
    errorMsg: string | null
    editableResult: ScanResult | null
}

// Para las imágenes
export type ExpenseAttachment = {
    id: string
    file: File
    preview: string
}