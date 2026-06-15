import { Validable } from '@/types/validable'
import { InputError } from '@/types/inputError'
import { ExpenseItem } from './expenseItem'
import type { ExpenseItemDTO } from './expenseItemDTO'
// Allocations are stored as Record<number, number> (participantId -> value)
import { TipoDivision } from './enums/tipoDivision'
export type { SupportedCurrency } from './currency'

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
    monedaOriginal?: string | null
    asignacionesExactas?: Record<number, number>
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
const MAX_CHARACTERS_DESCRIPTION = 200
const MAX_CHARACTERS_PRODUCT_NAME = 50

export class Expense extends Validable {
    id: number = 0
    constructor(
        public groupId = 0,
        public pagadorId = 0,
        public participantIds: number[] = [],
        public description = '',
        public _total = 0,
        public category = DEFAULT_CATEGORY,
        public date = new Date().toISOString().split('T')[0],
        public items: ExpenseItem[] = [],
        public tipoDivision: TipoDivision = TipoDivision.PARTES_IGUALES,
        // Mapeo participantId -> valor (monto o porcentaje según tipoDivision)
        public allocations: Record<number, number> = {},
        public useItemsTotal = false,
        public monedaOriginal: string | null = null,
    ) {
        super()
    }

    get total(): number {
        if (this.useItemsTotal && this.items.length > 0) {
            const totalEnCentavos = this.items.reduce(
                (acc, item) => acc + Math.round(item.total() * 100),
                0
            )

            return Number((totalEnCentavos / 100).toFixed(2))
        }

        return Number(this._total.toFixed(2))
    }

    set total(value: number) {
        this._total = Number(value.toFixed(2))
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

            if (!this.useItemsTotal) {
                const sumaItemsEnCentavos = this.items.reduce(
                    (acc, item) => acc + Math.round(item.total() * 100),
                    0
                )

                const totalEnCentavos = Math.round(this.total * 100)

                if (sumaItemsEnCentavos !== totalEnCentavos) {
                    this.agregarError(new InputError('itemsTotal', 'El total manual debe coincidir con la suma de los ítems'))
                }
            }

            const invalidProductName = this.items.find(
                (item) => item.nombre.length > MAX_CHARACTERS_PRODUCT_NAME
            )

            if (invalidProductName != null) {
                this.agregarError(new InputError('itemsName', `El nombre de un producto no puede superar los ${MAX_CHARACTERS_PRODUCT_NAME} caracteres`))
            }
        }

        if (this.tipoDivision === TipoDivision.PARTES_EXACTAS) {
            const sumaAsignada = Object.values(this.allocations).reduce((acc, curr) => acc + curr, 0)
            if (Math.abs(sumaAsignada - this.total) > 0.01) {
                this.agregarError(new InputError('allocations', 'La suma de las asignaciones exactas debe ser igual al total'))
            }
        }

        if (this.tipoDivision === TipoDivision.PORCENTUAL) {
            const sumaPorcentajes = Object.values(this.allocations).reduce((acc, curr) => acc + curr, 0)
            if (Math.abs(sumaPorcentajes - 100) > 0.01) {
                this.agregarError(new InputError('allocations', 'La suma de los porcentajes debe ser 100%'))
            }
        }
    }

    toJSON(): ExpenseJSON {
        const result: ExpenseJSON = {
            grupoID: this.groupId,
            pagadorID: this.pagadorId,
            participantesIDs: this.participantIds,
            descripcion: this.description,
            monto: this.total,
            categoria: this.category,
            fecha: this.date,
            items: this.items.map((item) => item.toDTO()),
            tipoGasto: this.tipoDivision,
            monedaOriginal: this.monedaOriginal
        }

        if (this.tipoDivision === TipoDivision.PARTES_EXACTAS || this.tipoDivision === TipoDivision.PORCENTUAL) {
            // Ya guardamos las asignaciones como Record<number, number>
            result.asignacionesExactas = this.allocations
        }

        return result
    }

    public static clone(expense: Expense): Expense {
        return new Expense(
            expense.groupId,
            expense.pagadorId,
            expense.participantIds,
            expense.description,
            expense._total,
            expense.category,
            expense.date,
            expense.items.map((item) => new ExpenseItem(item.nombre, item.cantidad, item.precioUnitario)),
            expense.tipoDivision,
            // Aceptar allocations tanto en formato array como en Record al clonar
                ((): Record<number, number> => {
                    const allocsAny = (expense as any).allocations
                    if (Array.isArray(allocsAny)) {
                        return allocsAny.reduce((acc: Record<number, number>, a: any) => {
                            acc[a.participantId] = a.total
                            return acc
                        }, {})
                    }

                    return allocsAny as Record<number, number>
                })(),
            expense.useItemsTotal,
            expense.monedaOriginal,
        )
    }
}
