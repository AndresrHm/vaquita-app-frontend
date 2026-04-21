import { useToastContext } from './ToastProvider'
import type { ToastMessage } from './toastTypes'

// useToast hook — consumer for the ToastContext. Components call this to get showToast.
export const useToast = () => {
  const ctx = useToastContext()
  return {
    toast: ctx.toast,
    showToast: ctx.showToast,
  }
}

export type { ToastMessage }