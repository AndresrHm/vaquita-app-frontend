import type { ExpenseItemDTO } from './expenseItemDTO'

export class ExpenseItem {
  constructor(
    public nombre = '',
    public cantidad = 1,
    public precioUnitario = 0,
  ) { }

  total(): number {

    const totalEnCentavos =
      Math.round(this.precioUnitario * 100) *
      this.cantidad

    return totalEnCentavos / 100
  }

  toDTO(): ExpenseItemDTO {
    return {
      nombre: this.nombre,
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario,
    }
  }
}
