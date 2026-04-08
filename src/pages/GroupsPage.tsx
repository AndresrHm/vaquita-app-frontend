import GroupCard from '@/components/groupsPage/GroupCard'
import GroupsSearch from '@/components/groupsPage/GroupsSearch'
import CreateGroupButton from '@/components/groupsPage/CreateGroupButton'
import ColumnContainer from '@/components/common/columnContainer'
import PageTitle from '@/components/common/pageTitle'

const getAvatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`

const mockGroups = [
  { id: 'g1', name: 'Centro de Estudiantes', status: 'Pendiente de pago', outstanding: 12400, currency: '$' },
  { id: 'g2', name: 'Cátedra - Comisión 2', status: 'Parcialmente pagada', outstanding: 7800, currency: '$' },
  { id: 'g3', name: 'Viaje de Fin de Año', status: 'Pagada', outstanding: 0, currency: '$' },

  { id: 'g4', name: 'Depto Palermo', status: 'Pendiente de pago', outstanding: 45200, currency: '$' },
  { id: 'g5', name: 'Cumple Juan', status: 'Parcialmente pagada', outstanding: 3200, currency: '$' },
  { id: 'g6', name: 'Asado del Finde', status: 'Pendiente de pago', outstanding: 8900, currency: '$' },

  { id: 'g7', name: 'Viaje a Bariloche', status: 'Parcialmente pagada', outstanding: 15600, currency: '$' },
  { id: 'g8', name: 'Equipo de Fútbol 5', status: 'Pendiente de pago', outstanding: 5400, currency: '$' },
  { id: 'g9', name: 'Regalo Profe', status: 'Pagada', outstanding: 0, currency: '$' },

  { id: 'g10', name: 'Vacaciones Brasil', status: 'Pendiente de pago', outstanding: 68400, currency: '$' },
  { id: 'g11', name: 'Salida Cine', status: 'Parcialmente pagada', outstanding: 2100, currency: '$' },
  { id: 'g12', name: 'Gastos Oficina', status: 'Pagada', outstanding: 0, currency: '$' },
].map(group => ({
  ...group,
  imageUrl: getAvatarUrl(group.name),
}))

// initials util removed (not used in this file)

export default function GroupsPage() {
  return (
    // Título y search
    <div className="flex flex-col space-y-4 min-h-[calc(100vh-5rem)]">

      <PageTitle>
        <div className="pl-2.5 pt-2">
          <h2 className="text-xl font-semibold text-foreground">Tenés deudas</h2>
          <p className="mt-1 text-sm text-muted-foreground">Debes $8,430</p>
        </div>

        <GroupsSearch />
      </PageTitle>

      {/* Contenedor de groupCards - estira para ocupar el espacio restante */}
      <ColumnContainer>
        {mockGroups.map((g) => (
          <GroupCard key={g.id} group={g} />
        ))}
      </ColumnContainer>

      {/* Mini card/button al final para agregar grupo */}
      <div className="mt-2">
        <CreateGroupButton />
      </div>
    </div>
  )
}

