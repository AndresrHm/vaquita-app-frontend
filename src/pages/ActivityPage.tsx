import { useState } from 'react'
import PageTitle from '@/components/common/pageTitle'
import ColumnContainer from '@/components/common/columnContainer'
import UserExpensesButton from '@/components/accountPage/UserExpensesButton'
import ActivityFilters from '@/components/activity/ActivityFilters'
import ActivityList from '@/components/activity/ActivityList'
import ActivityChartsModal from '@/components/activity/ActivityChartsModal'
import type { ActivityFiltersState } from '@/components/activity/ActivityFilters'

// 1. Importamos tu hook
import { useNetwork } from '@/customHooks/useNetwork'
import Card from '@/components/common/card'
import ActionButton from '@/components/common/ActionButton'
import { BarChart3 } from 'lucide-react'

export default function ActivityPage() {
    // 2. Activamos el radar
    const isOnline = useNetwork()

    const [filters, setFilters] = useState<ActivityFiltersState>({
        searchText: '',
        tipo: undefined,
        desde: undefined,
        hasta: undefined,
    })
    const [isChartsModalOpen, setIsChartsModalOpen] = useState(false)

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

                <Card interactive={false}>
                    <ActivityList
                        searchText={filters.searchText}
                        tipo={filters.tipo}
                        desde={filters.desde}
                        hasta={filters.hasta}
                    />
                </Card>

                <ActionButton
                    className="w-full justify-start"
                    icon={<BarChart3 className="h-5 w-5" />}
                    onClick={() => setIsChartsModalOpen(true)}
                >
                    Ver graficos de actividad
                </ActionButton>
            </ColumnContainer>

            <ActivityChartsModal
                isOpen={isChartsModalOpen}
                initialDesde={filters.desde}
                initialHasta={filters.hasta}
                onClose={() => setIsChartsModalOpen(false)}
            />
        </div>
    )
}