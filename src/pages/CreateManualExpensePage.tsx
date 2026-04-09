import { useNavigate } from 'react-router-dom'
import CreateExpense from '@/components/createExpense/CreateExpense'

export default function CreateManualExpensePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <CreateExpense onBack={() => navigate(-1)} />
    </div>
  )
}
