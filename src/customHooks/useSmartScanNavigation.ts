// ══════════════════════════════════════════════════════════════════════════════
// useSmartScanNavigation.ts
// Hook para navegar desde SmartScan a CreateExpense con estado
// ══════════════════════════════════════════════════════════════════════════════

import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import type { ScanToExpenseNavParams, ScanResult } from '@/domain/smartScanDTO'

/**
 * Hook que facilita navegar desde la página de SmartScan
 * hacia CreateExpense pasando los datos del escaneo
 */
export function useSmartScanNavigation() {
    const navigate = useNavigate()

    /**
     * Navega a CreateExpense con los datos del escaneo
     * Los datos se pasan via location.state para no contaminar la URL
     */
    const navigateToCreateExpense = useCallback(
        (scanResult: ScanResult, groupId?: number) => {
            const navParams: ScanToExpenseNavParams = {
                title: scanResult.title,
                description: scanResult.description,
                totalAmount: scanResult.totalAmount,
                currency: scanResult.currency || 'ARS',
                date: scanResult.date,
                category: scanResult.category,
                items: scanResult.items,
            }

            // Navegar pasando estado + params en URL si hay groupId
            const path = groupId ? `/groups/${groupId}/create-expense` : '/create-expense'
            navigate(path, { state: navParams })
        },
        [navigate]
    )

    return { navigateToCreateExpense }
}

/**
 * Hook para leer los datos que vienen desde SmartScan en CreateExpense
 */
export function useScanResultFromLocation() {
    const location = useLocation()

    const scanData = location.state as ScanToExpenseNavParams | null

    return { scanData, hasScanData: !!scanData }
}