import { Validable } from '@/types/validable'
import { InputError } from '@/types/inputError'
import { ExpenseItem } from './expenseItem'
import type { ExpenseItemDTO } from './expenseItemDTO'

export type ExpenseJSON = {
    descripcion: string
    grupoID: number
    pagadorID: number
    participantesIDs: number[]
    monto: number
    categoria: string
    fecha: string
    items: ExpenseItemDTO[]
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
        if (!this.groupId) {
            this.agregarError(new InputError('groupId', 'Seleccioná un grupo'))
        }

        if (this.participantIds.length === 0) {
            this.agregarError(new InputError('participantIds', 'Seleccioná al menos una persona que participe'))
        }

        if (this.description.trim().length === 0) {
            this.agregarError(new InputError('description', 'Agregá una descripción'))
        }

        if (this.total <= 0 || Number.isNaN(this.total)) {
            this.agregarError(new InputError('total', 'Ingresá un monto válido'))
        }

        if (!this.category.trim()) {
            this.agregarError(new InputError('category', 'Elegí una categoría'))
        }

        if (!this.date.trim()) {
            this.agregarError(new InputError('date', 'Ingresá una fecha'))
        }

        if (this.items.length > 0) {
            const invalidItem = this.items.find(
                (item) => !item.nombre.trim() || item.cantidad <= 0 || item.precioUnitario <= 0
            )

            if (invalidItem) {
                this.agregarError(new InputError('items', 'Cada ítem debe tener nombre, cantidad y precio unitario válidos'))
            }

            if (this.total != this.totalItems()) {
                this.agregarError(new InputError('itemsTotal', 'La suma de los valores de los ítems debe ser igual al total'))
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
            items: this.items.map((item) => item.toDTO()),
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
            (json.items ?? []).map((item) => new ExpenseItem(item.nombre, item.cantidad, item.precioUnitario))
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
            expense.items.map((item) => new ExpenseItem(item.nombre, item.cantidad, item.precioUnitario)),
        )
    }

    private totalItems() {
        var total = 0
        this.items.forEach(it => total += it.total())
        return total
    }

}
