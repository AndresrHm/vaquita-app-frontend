import { Validable } from '@/types/validable'
import type { ItemGastoDTO } from './itemGasto'

export type ExpenseJSON = {
    descripcion: string
    grupoID: number
    pagadorID: number
    participantesIDs: number[]
    monto: number
    categoria: string
    fecha: string
    items: ItemGastoDTO[]
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
            grupoID: this.groupId,
            pagadorID: this.pagadorId,
            participantesIDs: this.participantIds,
            descripcion: this.description,
            monto: this.total,
            categoria: this.category,
            fecha: this.date,
            items: [] //TODO()
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
            json.fecha
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
        )
    }
}
