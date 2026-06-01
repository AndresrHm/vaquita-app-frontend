export interface CategoryOption {
  id: string
  label: string
  icon: string
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'COMIDA', label: 'Comida', icon: '🍔' },
  { id: 'BEBIDA', label: 'Bebida', icon: '🥤' },
  { id: 'TRANSPORTE', label: 'Transporte', icon: '🚌' },
  { id: 'SUPERMERCADO', label: 'Super', icon: '🛒' },
  { id: 'ENTRETENIMIENTO', label: 'Salida', icon: '🎬' },
  { id: 'HOGAR', label: 'Hogar', icon: '🏠' },
  { id: 'VARIOS', label: 'Varios', icon: '🧩' },
  { id: 'OTROS', label: 'Otros', icon: '📦' },
]

export type CategoriaGasto =
  | 'COMIDA'
  | 'BEBIDA'
  | 'HOGAR'
  | 'TRANSPORTE'
  | 'SUPERMERCADO'
  | 'ENTRETENIMIENTO'
  | 'VARIOS'
  | 'OTROS'