export interface ToastMessage {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}
