import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button' 

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-4 p-6 text-center">
      <div className="space-y-2">
        <h1 className="text-8xl font-black text-primary drop-shadow-sm">404</h1>
        <h2 className="text-2xl font-bold text-foreground">¡Ups! Te fuiste del pastizal</h2>
      </div>
      
      <p className="text-sm text-muted-foreground max-w-xs mx-auto pb-4">
        Parece que la vaca se perdió. La ruta que estás buscando no existe o fue movida.
      </p>

      <Button 
        onClick={() => navigate('/')} 
        className="rounded-xl px-6"
      >
        Volver a la Vaquita
      </Button>
    </div>
  )
}