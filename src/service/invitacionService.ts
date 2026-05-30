import apiToken from './apiToken' // O la ruta a tu instancia de Axios configurada

interface UnirseResponse {
  id: number
  nombre: string
}

export const unirsePorInvitacion = async (token: string): Promise<UnirseResponse> => {
  const response = await apiToken.post('/invitaciones/unirse', { token })
  return response.data
}