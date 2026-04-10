export class Usuario {
    id?: number
    nombre: string = ''
    email: string = ''
    contrasena: string = ''

    constructor(data?: Partial<Usuario>) {
        if (data) {
            Object.assign(this, data)
        }
    }

    // Convierte el JSON del Backend en un Objeto "vivo" de TS
    static fromJSON(json: any): Usuario {
        const usuario = new Usuario()
        usuario.id = json.id
        usuario.nombre = json.nombre
        usuario.email = json.email
        // La contraseña no solemos traerla del back por seguridad, 
        // pero la dejamos si el DTO la incluye.
        return usuario
    }

    static fromNombreIdJSON(json: UsuarioNombreIdDTO): Usuario {
        const usuario = new Usuario()
        usuario.id = json.id
        usuario.nombre = json.nombre
        return usuario
    }

    // Prepara el objeto para ser enviado al Backend (POST/PUT)
    toJSON(): any {
        return {
            nombre: this.nombre,
            email: this.email,
            contrasena: this.contrasena
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
}

export interface UsuarioLoginDTO {
    email: string
    contrasena: string
}

export interface UsuarioLogueadoDTO {
    token: string
    nombre: string
    email: string
}

export interface UsuarioNombreIdDTO {
    id: number,
    nombre: string,
}