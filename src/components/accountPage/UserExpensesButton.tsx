import { Link } from 'react-router-dom'
import { ChevronRight, ReceiptText } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function UserExpensesButton() {
  return (
    <Button
      asChild
      className="
    mt-4 w-full justify-between rounded-xl px-4
    text-1xl text-gray-700
    border border-border
    bg-card/70
    hover:bg-muted!"
    >
      <Link to="/account/expenses">
        <span className="flex items-center gap-2">
          <ReceiptText className="h-4 w-4" />
          Ver mis gastos
        </span>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </Button>
  )
}