import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertTriangle, UserPlus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
// 👇 Asegurate de que la ruta a tu service sea la correcta
import { unirsePorInvitacion } from '@/service/invitacionService' 
import { useToast } from '@/customHooks/useToast'

export default function JoinGroupPage() {
  const { inviteToken } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [isJoining, setIsJoining] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleJoinGroup = async () => {
    if (!inviteToken) return
    
    setIsJoining(true)
    setErrorMsg('')
    
    try {
      // Le pegamos al backend solo cuando el usuario hace clic
      const grupo = await unirsePorInvitacion(inviteToken)
      
      showToast(`¡Te uniste a ${grupo.nombre} con éxito!`, 'success')
      navigate(`/groups/${grupo.id}`, { replace: true })
      
    } catch (error: any) {
      const mensajeBackend = error.response?.data?.message || 'El enlace no es válido o ha expirado.'
      setErrorMsg(mensajeBackend)
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-300">
        
        {/* Si hay error, mostramos la pantalla roja */}
        {errorMsg ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No pudimos unirte</h2>
            <p className="text-sm text-muted-foreground">{errorMsg}</p>
            
            <Button 
              className="mt-4 w-full gap-2 rounded-xl"
              onClick={() => navigate('/')}
            >
              Volver al inicio
              <ArrowRight size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserPlus size={32} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">¡Te invitaron a un grupo!</h2>
            <p className="text-sm text-muted-foreground">
              Estás a un paso de sumarte para empezar a dividir los gastos.
            </p>
            
            <Button 
              className="mt-6 w-full gap-2 rounded-xl"
              onClick={handleJoinGroup}
              disabled={isJoining}
            >
              {isJoining ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <UserPlus size={18} />
              )}
              {isJoining ? 'Uniéndote...' : 'Confirmar y unirme al grupo'}
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}