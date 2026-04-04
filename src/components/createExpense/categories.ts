export interface CategoryOption {
  id: string
  label: string
  icon: string
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'COMIDA', label: 'Comida', icon: '🍔' },
  { id: 'TRANSPORTE', label: 'Transporte', icon: '🚌' },
  { id: 'SUPERMERCADO', label: 'Super', icon: '🛒' },
  { id: 'ENTRETENIMIENTO', label: 'Salida', icon: '🎬' },
  { id: 'HOGAR', label: 'Hogar', icon: '🏠' },
  { id: 'OTROS', label: 'Otros', icon: '📦' },
]
