import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/customHooks/useToast'

const SessionTimeoutContext = createContext(undefined)

export function SessionTimeoutProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  
  const [showModal, setShowModal] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutos en segundos para mostrar en el modal (opcional)

  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // No queremos que corra el cronómetro si el usuario está en Login o Register
  const isPublicPage = location.pathname === '/login' || location.pathname === '/register'
  const token = localStorage.getItem('accessToken')
  const isAuthenticated = !isPublicPage && !!token

  const handleLogout = () => {
    cleanupTimers()
    window.localStorage.clear()
    setShowModal(false)
    showToast('Tu sesión fue cerrada por inactividad.', 'info')
    navigate('/login')
  }

  const handleKeepSessionAlive = () => {
    setShowModal(false)
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    // Reiniciamos el ciclo completo de escucha
    startWarningTimer()
  }

  const startWarningTimer = () => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    
    // PRIMER RELOJ: 5 minutos de inactividad (5 * 60 * 1000 ms)
    warningTimerRef.current = setTimeout(() => {
      if (isAuthenticated) {
        setShowModal(true)
        startLogoutTimer()
      }
    }, 5 * 60 * 1000)
  }

  const startLogoutTimer = () => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)

    setCountdown(300) // Reseteamos la cuenta regresiva visible a 5 minutos

    // SEGUNDO RELOJ: Si pasa 5 minutos más en el modal, se cierra (5 * 60 * 1000 ms)
    logoutTimerRef.current = setTimeout(() => {
      handleLogout()
    }, 5 * 60 * 1000)

    // Intervalo para actualizar el segundero del modal (opcional, queda pro)
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const cleanupTimers = () => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      cleanupTimers()
      setShowModal(false)
      return
    }

    const resetActivityTimer = () => {
      // Si el modal de advertencia ya está abierto, mover el mouse no debería resetear el reloj
      if (showModal) return 
      startWarningTimer()
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, resetActivityTimer))

    // Arrancamos el primer cronómetro al montar
    startWarningTimer()

    return () => {
      cleanupTimers()
      events.forEach((event) => window.removeEventListener(event, resetActivityTimer))
    }
  }, [isAuthenticated, showModal])

  return (
    <SessionTimeoutContext.Provider value={undefined}>
      {children}

      {/* MODAL DE ADVERTENCIA FLOTANTE */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-lg text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-xl">
              ⚠️
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">¿Seguís ahí?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu sesión está a punto de expirar por inactividad debido a regulaciones de seguridad.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={handleKeepSessionAlive} className="w-full rounded-xl">
                Mantener sesión iniciada
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="w-full rounded-xl text-muted-foreground hover:text-destructive">
                Cerrar sesión ahora
              </Button>
            </div>
          </div>
        </div>
      )}
    </SessionTimeoutContext.Provider>
  )
}