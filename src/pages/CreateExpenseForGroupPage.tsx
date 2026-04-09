import { useParams, useNavigate } from 'react-router-dom'
import CreateExpense from '@/components/createExpense/CreateExpense'

export default function CreateExpenseForGroupPage() {
    const { groupId } = useParams()
    const navigate = useNavigate()

    return (
        <div className="min-h-[calc(100vh-5rem)]">
            <CreateExpense groupId={groupId} onBack={() => navigate(-1)} />
        </div>
    )
}
