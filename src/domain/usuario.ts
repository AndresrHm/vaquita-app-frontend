import type { GrupoGastosPorAnioDTO } from '@/domain/Grupo'

export class Usuario {
    id?: number
    nombre: string = ''
    email: string = ''
    contrasena: string = ''
    username: string = ''

    constructor(data?: Partial<Usuario>) {
        if (data) {
            Object.assign(this, data)
        }
    }

    static fromJSON(json: any): Usuario {
        const usuario = new Usuario()
        usuario.id = json.id
        usuario.nombre = json.nombre
        usuario.email = json.email
        return usuario
    }

    static fromNombreIdJSON(json: UsuarioNombreIdDTO): Usuario {
        const usuario = new Usuario()
        usuario.id = json.id
        usuario.nombre = json.nombre
        return usuario
    }

    toJSON(): any {
        return {
            nombre: this.nombre,
            email: this.email,
            contrasena: this.contrasena,
            username: this.username,
        }
    }

    /* perteneceA(grupo: any): boolean {
        return true; // Lógica de negocio
    } */
}

export interface UsuarioRegistradoDTO {
    nombre: string;
    email: string;
    contrasena: string;
    username: string;
}

export interface UsuarioLoginDTO {
    email: string
    contrasena: string
}

export interface UsuarioLogueadoDTO {
    id: number
    accessToken: string  
    refreshToken: string
    nombre: string
    email: string
    username: string
    imagenUrl?: string
}

export interface UsuarioNombreIdDTO {
    id: number,
    nombre: string,
    username: string,
}

export interface UsuarioConBalanceDTO {
    id: number,
    nombre: string,
    username: string,
    monto: number,
}

export interface UsuarioBusquedaDTO {
    id: number,
    nombre: string,
    username: string,
    imagenUrl: string,
}

export interface SolicitudAmistadFront {
    id: number,
    nombre: string,
    imagenUrl: string,
}

export interface UsuarioInfoDTO {
    nombre: string,
    username: string,
    imagenUrl: string,
    esAmigo: boolean,
    solicitudPendiente: boolean,
    gruposCompartidos: { id: number; nombre: string }[],
    gastosPendientes: GrupoGastosPorAnioDTO[],
}

export interface UsuarioEditarDTO {
  nombre: string
  email: string
  imagenUrl: string
}

export interface CambioContrasenaDTO {
  contrasenaActual: string
  contrasenaNueva: string
}