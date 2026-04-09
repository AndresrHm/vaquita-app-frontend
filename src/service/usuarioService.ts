import axios from 'axios'
import { Usuario, type UsuarioNombreIdDTO } from '../domain/usuario'

const API_URL = 'http://localhost:8080/auth'

const manejarError = (error: any): never => {
    const mensaje = error.response?.data?.message || 'Error de conexión'
    throw new Error(mensaje)
}

export const usuarioService = {

    async registrarUsuario(nuevoUsuario: Usuario): Promise<Usuario> {
        try {
            const { data } = await axios.post(`${API_URL}/register`, nuevoUsuario.toJSON())
            return Usuario.fromJSON(data)
        } catch (error: any) {
            // Agregamos el return para que TS vea que el flujo termina aquí
            return manejarError(error)
        }
    },

    async obtenerTodos(): Promise<Usuario[]> {
        try {
            const { data } = await axios.get<any[]>(`${API_URL}/usuarios`)
            return data.map(userJson => Usuario.fromJSON(userJson))
        } catch (error: any) {
            // Agregamos el return aquí también
            return manejarError(error)
        }
    },

    async obtenerUsuariosDeGrupo(grupoId: number): Promise<Usuario[]> {
        const { data } = await axios.get<UsuarioNombreIdDTO[]>(`${API_URL}/grupo/${grupoId}`)
        return data.map(userJson => Usuario.fromNombreIdJSON(userJson))
    },
}
