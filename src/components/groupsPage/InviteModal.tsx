import { Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/customHooks/useToast'
// Ajustá esta ruta dependiendo de dónde tengas guardado tu componente Modal
import Modal from '@/components/common/modal'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  groupId: string | undefined
  inviteToken: string
}

export function InviteModal({ isOpen, onClose, groupId, inviteToken }: InviteModalProps) {
  const { showToast } = useToast()

  const inviteLink = `${window.location.origin}/groups/join/${inviteToken}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      showToast('¡Enlace copiado al portapapeles!', 'success')
      onClose() 
    } catch (err) {
      showToast('No se pudo copiar el enlace', 'error')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '¡Unite a mi grupo en La Vaquita!',
          text: 'Hacé clic en el enlace para sumarte a nuestro grupo y dividir los gastos.',
          url: inviteLink,
        })
      } catch (error) {
        console.log('El usuario canceló el share o hubo un error', error)
      }
    } else {
      handleCopyLink()
    }
  }

  const modalFooter = (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <Button 
        variant="outline" 
        // 👇 Cambiamos w-full por flex-1
        className="flex-1 gap-2 rounded-xl" 
        onClick={handleCopyLink}
      >
        <Copy size={16} />
        Copiar enlace
      </Button>
      
      <Button 
        className="flex-1 gap-2 rounded-xl" 
        onClick={handleNativeShare}
      >
        <Share2 size={16} />
        Compartir
      </Button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invitar amigos"
      description="Compartí este enlace para que otros se sumen a tu grupo."
      footer={modalFooter}
    >
      {/* El children (Body del modal) solo necesita el input con el link */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-input/50 p-2">
        <input
          type="text"
          readOnly
          value={inviteLink}
          className="w-full bg-transparent px-2 text-sm text-foreground outline-none"
          onClick={(e) => e.currentTarget.select()} // Pequeño truco UX: selecciona todo el texto al hacer clic
        />
      </div>
    </Modal>
  )
}