import { useParams, useNavigate } from 'react-router-dom'
import ColumnContainer from '@/components/common/columnContainer'
import { ChevronLeft, Settings } from 'lucide-react'
import ExpensesList from '@/components/groupsPage/ExpensesList'
import type { ExpensesByMonth } from '@/components/groupsPage/ExpensesList'
import CreateExpense from '@/components/groupsPage/CreateExpense'
import GroupDetailSearch from '@/components/groupsPage/GroupDetailSearch'
import IconNavButton from '@/components/common/IconNavButton'

// avatar helper (not used in this file currently)

const mockGroupDetail = {
    id: 'g1',
    name: 'Los Pibes',
    status: 'Pendiente de pago',
    outstanding: 12400,
    currency: '$',
    imageUrl: 'https://resizer.iproimg.com/unsafe/640x/filters:format(webp)/https://assets.iprofesional.com/assets/jpg/2022/11/545871.jpg',
}

type ExpensesByYear = {
    year: number
    months: ExpensesByMonth
}[]

const mockExpensesByYear: ExpensesByYear = [
    {
        year: 2026,
        months: [
            {
                month: 'Marzo',
                expenses: [
                    {
                        id: 'e1',
                        date: { day: 28 },
                        title: 'Supermercado',
                        amount: 12500,
                        currency: '$',
                        paymentType: 'split_equal',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/891/891462.png'
                    },
                    {
                        id: 'e2',
                        date: { day: 15 },
                        title: 'Cena en restaurante',
                        amount: 8400,
                        currency: '$',
                        paymentType: 'paid_by_you',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/891/891462.png'
                    },
                    {
                        id: 'e3',
                        date: { day: 3 },
                        title: 'Uber',
                        amount: 3200,
                        currency: '$',
                        paymentType: 'you_owe',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/891/891462.png'
                    }
                ]
            },
            {
                month: 'Febrero',
                expenses: [
                    {
                        id: 'e4',
                        date: { day: 22 },
                        title: 'Entradas cine',
                        amount: 5400,
                        currency: '$',
                        paymentType: 'split_equal',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/891/891462.png'
                    },
                    {
                        id: 'e5',
                        date: { day: 10 },
                        title: 'Delivery',
                        amount: 6100,
                        currency: '$',
                        paymentType: 'paid_by_other',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/891/891462.png'
                    }
                ]
            }
        ]
    },
    {
        year: 2025,
        months: [
            {
                month: 'Enero',
                expenses: [
                    {
                        id: 'e6',
                        date: { day: 30 },
                        title: 'Nafta',
                        amount: 15000,
                        currency: '$',
                        paymentType: 'you_owe',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/891/891462.png'
                    },
                    {
                        id: 'e7',
                        date: { day: 18 },
                        title: 'Airbnb',
                        amount: 45200,
                        currency: '$',
                        paymentType: 'split_unequal',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/891/891462.png'
                    },
                    {
                        id: 'e8',
                        date: { day: 5 },
                        title: 'Compras varias',
                        amount: 7800,
                        currency: '$',
                        paymentType: 'paid_by_you',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/891/891462.png'
                    }
                ]
            }
        ]
    }
]

export default function GroupDetailPage() {
    const { groupId } = useParams()
    const navigate = useNavigate()

    const group = groupId === mockGroupDetail.id ? mockGroupDetail : { ...mockGroupDetail, id: groupId }

    return (
        <div className="space-y-4">
            {/* Header image container (full-width within layout) */}
            <div className="-mx-4 rounded-b-2xl rounded-t-none overflow-hidden shadow-sm">
                <div className="relative h-44 w-full">
                    <img src={group.imageUrl} alt={group.name} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30" />

                    <div className="absolute inset-x-4 top-3 flex items-center justify-between">
                        <IconNavButton ariaLabel="Volver" onClick={() => navigate(-1)} icon={<ChevronLeft className="h-5 w-5" />} />

                        <IconNavButton ariaLabel="Ajustes" to={`/groups/${group.id}/settings`} icon={<Settings className="h-5 w-5" />} />
                    </div>

                    <div className="absolute left-4 bottom-4">
                        <h1 className="text-xl font-semibold text-white">{group.name}</h1>
                    </div>
                </div>
            </div>

            <ColumnContainer>
                <GroupDetailSearch />

                <div className="mt-4 text-sm text-foreground">Total pendiente: {group.currency} {group.outstanding.toLocaleString('es-AR')}</div>

                {/* inline-block rounded-md bg-muted/80 px-3 py-1 text-xs font-semibold text-muted-foreground */}
                <div className="mt-4 space-y-6">
                    {mockExpensesByYear.map((yearGroup) => (
                        <div key={yearGroup.year} className="">
                            <h2 className="rounded-md bg-muted/80 px-3 py-1 text-lg font-semibold text-muted-foreground">{yearGroup.year}</h2>
                            <ExpensesList data={yearGroup.months} />
                        </div>
                    ))}
                </div>

            </ColumnContainer>

            <CreateExpense onClick={() => navigate(`/groups/${group.id}/expense/create`)} />
        </div>
    )
}
