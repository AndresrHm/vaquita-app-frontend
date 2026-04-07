import React from 'react'
import { PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CreateGroupButton({
    children = 'Crear grupo',
}: {
    children?: React.ReactNode
}) {
    const navigate = useNavigate()

    return (
        <div className="fixed right-4 bottom-24 z-50">
            <button
                type="button"
                onClick={() => navigate('/groups/new')}
                className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition"
            >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <PlusCircle className="h-5 w-5" />
                </span>
                {children}
            </button>
        </div>
    )
}
