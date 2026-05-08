import { useState } from 'react'
import PageTitle from '@/components/common/pageTitle'
import ColumnContainer from '@/components/common/columnContainer'
import UserExpensesButton from '@/components/accountPage/UserExpensesButton'
import ActivityFilters from '@/components/activity/ActivityFilters'
import ActivityList from '@/components/activity/ActivityList'
import type { ActivityFiltersState } from '@/components/activity/ActivityFilters'

export default function ActivityPage() {
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
                <ActivityFilters onFilterChange={handleFilterChange} />

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

