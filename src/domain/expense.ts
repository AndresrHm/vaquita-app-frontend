import { Validable } from '@/types/validable'
import type { ExpenseItem } from './expenseItem'

export type ExpenseJSON = {
    descripcion: string
    grupoID: number
    pagadorID: number
    participantesIDs: number[]
    monto: number
    categoria: string
    fecha: string
    items: ExpenseItem[]
}

const DEFAULT_CATEGORY = 'OTROS'

export class Expense extends Validable {
    id: number = 0
    constructor(
        public groupId = 0,
        public pagadorId = 0,
        public participantIds: number[] = [],
        public description = '',
        public total = 0,
        public category = DEFAULT_CATEGORY,
        public date = new Date().toISOString().split('T')[0],
        public items: ExpenseItem[] = [],
    ) {
        super()
    }

    validarEspecifico(): void {
        const errors: string[] = []

        if (!this.groupId) {
            errors.push('Seleccioná un grupo')
        }

        if (this.participantIds.length === 0) {
            errors.push('Seleccioná al menos una persona que participe')
        }

        if (this.description.trim().length === 0) {
            errors.push('Agregá una descripción')
        }

        if (this.total <= 0 || Number.isNaN(this.total)) {
            errors.push('Ingresá un monto válido')
        }

        if (!this.category.trim()) {
            errors.push('Elegí una categoría')
        }

        if (!this.date.trim()) {
            errors.push('Ingresá una fecha')
        }

        if (this.items.length > 0) {
            const invalidItem = this.items.find(
                (item) => !item.nombre.trim() || item.cantidad <= 0 || item.precioUnitario <= 0
            )

            if (invalidItem) {
                errors.push('Cada ítem debe tener nombre, cantidad y precio unitario válidos')
            }
        }
    }

    toJSON(): ExpenseJSON {
        return {
            grupoID: this.groupId,
            pagadorID: this.pagadorId,
            participantesIDs: this.participantIds,
            descripcion: this.description,
            monto: this.total,
            categoria: this.category,
            fecha: this.date,
            items: this.items,
        }
    }

    static fromJSON(json: ExpenseJSON): Expense {
        return new Expense(
            json.grupoID,
            json.pagadorID,
            json.participantesIDs,
            json.descripcion,
            json.monto,
            json.categoria,
            json.fecha,
            json.items ?? []
        )
    }

    public static clone(expense: Expense): Expense {
        return new Expense(
            expense.groupId,
            expense.pagadorId,
            expense.participantIds,
            expense.description,
            expense.total,
            expense.category,
            expense.date,
            expense.items.map((item) => ({ ...item })),
        )
    }
}
