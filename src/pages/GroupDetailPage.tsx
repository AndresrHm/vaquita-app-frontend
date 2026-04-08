import { useParams, useNavigate } from 'react-router-dom'
import ColumnContainer from '@/components/common/columnContainer'
import { ChevronLeft, Settings } from 'lucide-react'
import ExpensesList from '@/components/groupsPage/ExpensesList'
import type { ExpensesByMonth } from '@/components/groupsPage/ExpensesList'
import CreateExpense from '@/components/groupsPage/CreateExpense'

// avatar helper (not used in this file currently)

const mockGroupDetail = {
    id: 'g1',
    name: 'Los Pibes',
    status: 'Pendiente de pago',
    outstanding: 12400,
    currency: '$',
    imageUrl: 'https://resizer.iproimg.com/unsafe/640x/filters:format(webp)/https://assets.iprofesional.com/assets/jpg/2022/11/545871.jpg',
}

const mockExpensesByMonth: ExpensesByMonth = [
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
    },
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

export default function GroupDetailPage() {
    const { groupId } = useParams()
    const navigate = useNavigate()

    const group = groupId === mockGroupDetail.id ? mockGroupDetail : { ...mockGroupDetail, id: groupId }

    return (
        <div className="flex flex-col space-y-4 min-h-[calc(98vh-5rem)]">
            {/* Header image container (full-width within layout) */}
            <div className="-mx-4 rounded-b-2xl rounded-t-none overflow-hidden shadow-sm">
                <div className="relative h-44 w-full">
                    <img src={group.imageUrl} alt={group.name} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30" />

                    <div className="absolute inset-x-4 top-3 flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center justify-center rounded-md p-2 bg-black/30 text-white hover:bg-black/40 cursor-pointer"
                            aria-label="Volver"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            onClick={() => navigate(`/groups/${group.id}/settings`)}
                            className="inline-flex items-center justify-center rounded-md p-2 bg-black/30 text-white hover:bg-black/40 cursor-pointer"
                            aria-label="Ajustes"
                        >
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="absolute left-4 bottom-4">
                        <h1 className="text-xl font-semibold text-white">{group.name}</h1>
                    </div>
                </div>
            </div>

            <ColumnContainer>
                <div>
                    <div className="mt-4 text-sm text-foreground">Total pendiente: {group.currency} {group.outstanding.toLocaleString('es-AR')}</div>

                    <div className="mt-4">
                        <ExpensesList data={mockExpensesByMonth} />
                    </div>

                </div>
            </ColumnContainer>

            <CreateExpense onClick={() => { /* placeholder: abrir crear gasto */ }} />
        </div>
    )
}
