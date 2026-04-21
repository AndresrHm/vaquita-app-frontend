/* eslint-disable no-undef */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const api = axios.create({ baseURL: BASE_URL })

// ── Types ─────────────────────────────────────────────────────────────────────

export type LineItem = {
    name: string
    quantity: number
    price: number
}

export type ScanResult = {
    title: string
    totalAmount: number
    date?: string
    category?: 'food' | 'transport' | 'entertainment' | 'other'
    items: LineItem[]
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

export async function scan(image: File): Promise<ScanResult> {
    const formData = new FormData()
    formData.append('image', image)

    const { data } = await api.post<ScanResult>('/api/smart-scan/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return data
}

// Para probar cuando se cae la API de gemini (saturada)
export async function scanMock(image: File): Promise<ScanResult> {
    const formData = new FormData()
    formData.append('image', image)

    const { data } = await api.post<ScanResult>('/api/smart-scan/scan/mock', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return data
}