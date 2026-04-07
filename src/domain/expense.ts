import { Validable } from '@/types/validable'

export type ExpenseJSON = {
    id: string
    descripcion: string
    grupoId: string
    pagadorId: string
    participantIds: string[]
    monto: number
    categoria: string
    fecha: string
}

const DEFAULT_CATEGORY = 'OTROS'

export class Expense extends Validable {
    constructor(
        public id = '',
        public groupId = '',
        public pagadorId = '',
        public participantIds: string[] = [],
        public description = '',
        public total = 0,
        public category = DEFAULT_CATEGORY,
        public date = new Date().toISOString().split('T')[0],
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
    }

    toJSON(): ExpenseJSON {
        return {
            id: this.id,
            descripcion: this.description,
            grupoId: this.groupId,
            pagadorId: this.pagadorId,
            participantIds: this.participantIds,
            monto: this.total,
            categoria: this.category,
            fecha: this.date,
        }
    }

    static fromJSON(json: ExpenseJSON): Expense {
        return new Expense(
            json.id,
            json.grupoId,
            json.pagadorId,
            json.participantIds,
            json.descripcion,
            json.monto,
            json.categoria,
            json.fecha
        )
    }

    public static clone(expense: Expense): Expense {
        return new Expense(
            expense.id,
            expense.groupId,
            expense.pagadorId,
            expense.participantIds,
            expense.description,
            expense.total,
            expense.category,
            expense.date,
        )
    }
}
