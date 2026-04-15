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
    vista: string | null
}

export type OrderMethodExpenses =
  | 'NOMBRE_ASC'
  | 'NOMBRE_DESC'
  | 'AUTOR_ASC'
  | 'AUTOR_DESC';

export enum ExpensesFilterTabs {
    AMIGOS = 'AMIGOS',
    GENERAL = 'GENERAL'
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