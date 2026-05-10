import { Validable } from '@/types/validable'
import { InputError } from '@/types/inputError'
import { ExpenseItem } from './expenseItem'
import type { ExpenseItemDTO } from './expenseItemDTO'
import { ExpenseAllocation } from './expenseAllocation'
import type { ExpenseAllocationDTO } from './expenseAllocationDTO'
import { TipoDivision } from './enums/tipoDivision'

export type ExpenseJSON = {
    descripcion: string
    grupoID: number
    pagadorID: number
    participantesIDs: number[]
    monto: number
    categoria: string
    fecha: string
    items: ExpenseItemDTO[]
    tipoGasto: TipoDivision
    asignacionesExactas?: ExpenseAllocationDTO[]
}

export type ExpenseParticipantJSON = {
    id: number
    nombre: string
    email: string
    contrasena: string
    imagenUrl: string
}

export type ExpenseFilteredJSON = {
    id: number
    descripcion: string
    categoria: string
    monto: number
    fecha: string
    pagador: string
    participantes: ExpenseParticipantJSON[]
    tipoGasto: string
}

const DEFAULT_CATEGORY = 'OTROS'
const MAX_CHARACTERS_DESCRIPTION = 50
const MAX_CHARACTERS_PRODUCT_NAME = 20

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
        public tipoDivision: TipoDivision = TipoDivision.PARTES_IGUALES,
        public allocations: ExpenseAllocation[] = [],
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

        if (this.description.trim().length > MAX_CHARACTERS_DESCRIPTION) {
            this.agregarError(new InputError('description', `La descripción no puede tener más de ${MAX_CHARACTERS_DESCRIPTION} caracteres`))
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

            const invalidProductName = this.items.find(
                (item) => item.nombre.length > MAX_CHARACTERS_PRODUCT_NAME
            )

            if (invalidProductName != null) {
                this.agregarError(new InputError('itemsName', `El nombre de un producto no puede superar los ${MAX_CHARACTERS_PRODUCT_NAME} caracteres`))
            }
        }

        if (this.tipoDivision === TipoDivision.PARTES_EXACTAS) {
            const sumaAsignada = this.allocations.reduce((acc, curr) => acc + curr.total, 0)
            if (Math.abs(sumaAsignada - this.total) > 0.01) {
                this.agregarError(new InputError('allocations', 'La suma de las asignaciones exactas debe ser igual al total'))
            }
        }

        if (this.tipoDivision === TipoDivision.PORCENTUAL) {
            const sumaPorcentajes = this.allocations.reduce((acc, curr) => acc + curr.total, 0)
            if (Math.abs(sumaPorcentajes - 100) > 0.01) {
                this.agregarError(new InputError('allocations', 'La suma de los porcentajes debe ser 100%'))
            }
        }
    }

    toJSON(): ExpenseJSON {
        const asignacionesMap: Record<number, number> = {}
        this.allocations.forEach(alloc => {
            asignacionesMap[alloc.participantId] = alloc.total
        })

        const result: ExpenseJSON = {
            grupoID: this.groupId,
            pagadorID: this.pagadorId,
            participantesIDs: this.participantIds,
            descripcion: this.description,
            monto: this.total,
            categoria: this.category,
            fecha: this.date,
            items: this.items.map((item) => item.toDTO()),
            tipoGasto: this.tipoDivision
        }

        if (this.tipoDivision === TipoDivision.PARTES_EXACTAS || this.tipoDivision === TipoDivision.PORCENTUAL) {
            result.asignacionesExactas = asignacionesMap as any
        }

        return result
    }
    /* No se usa (por ahora)
        static fromJSON(json: ExpenseJSON): Expense {
            return new Expense(
                json.grupoID,
                json.pagadorID,
                json.participantesIDs,
                json.descripcion,
                json.monto,
                json.categoria,
                json.fecha,
                (json.items ?? []).map((item) => new ExpenseItem(item.nombre, item.cantidad, item.precioUnitario)),
                json.tipoGasto,
                (json.asignacionesExactas ?? []).map((allocation) => new ExpenseAllocation(allocation.participantId, allocation.total))
            )
        }*/

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
            expense.tipoDivision,
            expense.allocations.map((allocation) => new ExpenseAllocation(allocation.participantId, allocation.total)),
        )
    }

    private totalItems() {
        var total = 0
        this.items.forEach(it => total += it.total())
        return total
    }

}
