import type { ExpenseItemDTO } from './expenseItemDTO'

export class ExpenseItem {
  constructor(
    public nombre = '',
    public cantidad = 1,
    public precioUnitario = 0,
  ) {}

  total(): number {
    return this.cantidad * this.precioUnitario
  }

  toDTO(): ExpenseItemDTO {
    return {
      nombre: this.nombre,
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario,
    }
  }
}
