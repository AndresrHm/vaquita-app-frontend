// React import not required with automatic JSX runtime
import { PlusCircle } from 'lucide-react'

export default function CreateExpenseButton({ onClick }: { onClick?: () => void }) {
    return (
        <div className="fixed bottom-24 right-4 z-10">
            <button
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition"
            >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <PlusCircle className="h-5 w-5" />
                </span>
                Crear gasto
            </button>
        </div>
    )
}
