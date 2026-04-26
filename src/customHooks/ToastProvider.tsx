import React, { createContext, useContext, useState } from 'react'
import type { ToastMessage } from './toastTypes'
import { Toast } from '../components/toast/toast'

type ToastContextType = {
  toast: ToastMessage | null
  showToast: (message: string, type: ToastMessage['type'], duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const showToast = (message: string, type: ToastMessage['type'], duration = 4000) => {
    setToast({ message, type, duration })
    setTimeout(() => setToast(null), duration)
  }

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
      <div id="toast-container">
        <Toast toast={toast} />
      </div>
    </ToastContext.Provider>
  )
}

export const useToastContext = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      toast: null as ToastMessage | null,
      showToast: (_m: string, _t: ToastMessage['type']) => {},
    }
  }
  return ctx
}

export default ToastProvider
