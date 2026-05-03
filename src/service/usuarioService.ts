import axios from 'axios'
import { Usuario, type UsuarioLoginDTO, type UsuarioLogueadoDTO, type UsuarioNombreIdDTO, type SolicitudAmistadFront, type UsuarioInfoDTO, type UsuarioEditarDTO, type CambioContrasenaDTO } from '../domain/usuario'
import type { Miembro } from '@/domain/Grupo'
import api from './apiToken'

const API_URL = '/usuarios' 

const manejarError = (error: any): never => {
    const mensaje = error.response?.data?.message || 'Error de conexión'
    throw new Error(mensaje)
}

export const usuarioService = {

    async registrarUsuario(nuevoUsuario: Usuario): Promise<Usuario> {
        try {
            // Sincronizado con el backend: /register
            const { data } = await api.post(`${API_URL}/register`, nuevoUsuario.toJSON())
            return Usuario.fromJSON(data)
        } catch (error: any) {
            return manejarError(error)
        }
    },

    async login(credenciales: UsuarioLoginDTO): Promise<UsuarioLogueadoDTO> {
        try {
            const { data } = await api.post<UsuarioLogueadoDTO>('/usuarios/login', credenciales)

            if (data.token) {
                localStorage.setItem('token', data.token) 
                localStorage.setItem('user_name', data.nombre)
                localStorage.setItem('user_email', data.email)
                localStorage.setItem('id', data.id.toString())
                localStorage.setItem('user_image', data.imagenUrl || '')
            }

            return data
        } catch (error: any) {
            return manejarError(error)
        }
    },   

    async obtenerTodos(): Promise<Usuario[]> {
        try {
            const { data } = await api.get<any[]>(`${API_URL}`)
            return data.map(userJson => Usuario.fromJSON(userJson))
        } catch (error: any) {
            return manejarError(error)
        }
    },

    async obtenerUsuariosDeGrupo(grupoId: number): Promise<Usuario[]> {
        const { data } = await api.get<UsuarioNombreIdDTO[]>(`${API_URL}/grupo/${grupoId}`)
        return data.map(userJson => Usuario.fromNombreIdJSON(userJson))
    },

    async actualizarPerfil(datos: UsuarioEditarDTO): Promise<any> {
        try {
            const { data } = await api.put(`/usuarios/me`, datos)
            
            localStorage.setItem('token', data.token) 
            
            return data
        } catch (error: any) {
            const mensaje = error.response?.data?.message || 'No se pudo actualizar el perfil'
            throw new Error(mensaje)
        }
    },

    async cambiarContrasena(datos: CambioContrasenaDTO): Promise<void> {
        try {
            await api.patch(`/usuarios/me/contrasena`, datos)
        } catch (error: any) {
            const mensaje = error.response?.data?.message || 'No se pudo cambiar la contraseña'
            throw new Error(mensaje)
        }
    },

    // --- MÓDULO AMIGOS ---

    async obtenerAmigos(): Promise<UsuarioConBalanceDTO[]> {
        const { data } = await api.get<UsuarioConBalanceDTO[]>(`${API_URL}/me/amigos`)
        return data
    },

    async obtenerSolicitudesPendientes(): Promise<SolicitudAmistadFront[]> {
        const { data } = await api.get<SolicitudAmistadFront[]>(`${API_URL}/me/solicitudes`)
        return data
    },

    async enviarSolicitudAmistad(idReceptor: number): Promise<number> {
        const { data } = await api.post<number>(`${API_URL}/me/invitar/${idReceptor}`)
        return data
    },

    async responderSolicitudAmistad(idSolicitud: number, aceptar: boolean): Promise<number> {
        // Sincronizado con el backend: api.patch en lugar de api.post
        const { data } = await api.patch<number>(
            `${API_URL}/me/solicitud/${idSolicitud}`,
            null,
            { params: { aceptar } }
        )
        return data
    },

    async obtenerUsuarioInfo(id: number, idBuscado: number): Promise<UsuarioInfoDTO> {
        const { data } = await axios.get<UsuarioInfoDTO>(`${API_URL}/${id}/info/${idBuscado}`)
        return data
    },

    async eliminarAmigo(idUsuario: number, idAmigo: number): Promise<void> {
        await axios.delete(`${API_URL}/${idUsuario}/amigos/${idAmigo}`)
    },
}