import type { CategoriaGasto } from './enums/categoriaGasto'

export interface ExpenseItemDTO {
    nombre: string
    cantidad: number
    precioUnitario: number
}

export interface ExpenseFiltersDTO{
    fechaIni: string | null
    fechaFin: string | null
    amigoID: number | null
    search: string | null
    rangoIni: number | null
    rangoFin: number | null
    page: number
    size: number
    categoria: CategoriaGasto[] | null
    vista: ExpensesFilterTabs | null
}

export type OrderMethodExpenses =
  | 'NOMBRE_ASC'
  | 'NOMBRE_DESC'
  | 'CREADOR_ASC'
  | 'CREADOR_DESC'
  | 'FECHA_ASC'
  | 'FECHA_DESC'
  ;

export enum ExpensesFilterTabs {
    TODOS = 'TODOS',
    AMIGOS = 'AMIGOS',
    DEUDA = 'DEUDA'
}

/*
val vista: TipoRelacionVista?,
    val categoria: List<TipoCategoria>?,
    val fechaInicio: LocalDate?,
    val fechaFin: LocalDate?,
    val amigoID: Long?,
    val search: String?,
    val rangoIni: Long?,
    val rangoFin: Long?,
    val page: Int = 0,
    val size: Int = 10
    */