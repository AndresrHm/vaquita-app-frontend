import { useState } from 'react'
import PageTitle from '@/components/common/pageTitle'
import ColumnContainer from '@/components/common/columnContainer'
import UserExpensesButton from '@/components/accountPage/UserExpensesButton'
import ActivityFilters from '@/components/activity/ActivityFilters'
import ActivityList from '@/components/activity/ActivityList'
import type { ActivityFiltersState } from '@/components/activity/ActivityFilters'

// 1. Importamos tu hook
import { useNetwork } from '@/customHooks/useNetwork'

export default function ActivityPage() {
    // 2. Activamos el radar
    const isOnline = useNetwork()

    const [filters, setFilters] = useState<ActivityFiltersState>({
        searchText: '',
        tipo: undefined,
        desde: undefined,
        hasta: undefined,
    })

    const handleFilterChange = (newFilters: ActivityFiltersState) => {
        setFilters(newFilters)
    }

    return (
        <div className="space-y-4">
            <PageTitle title="Actividad" subtitle="Resumen de todos tus movimientos" />

            <UserExpensesButton />

            <ColumnContainer>
                {/* 3. Bloqueamos los filtros si estamos offline usando CSS */}
                <div className={!isOnline ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}>
                    <ActivityFilters onFilterChange={handleFilterChange} />
                </div>

                <div className="max-h-[52vh] overflow-y-auto pr-1">
                    <ActivityList
                        searchText={filters.searchText}
                        tipo={filters.tipo}
                        desde={filters.desde}
                        hasta={filters.hasta}
                    />
                </div>
            </ColumnContainer>
        </div>
    )
}