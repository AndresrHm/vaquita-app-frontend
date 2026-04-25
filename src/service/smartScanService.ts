/* eslint-disable no-undef */
import type { ScanResult } from '@/domain/smartScanDTO'
import api from './apiToken'


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