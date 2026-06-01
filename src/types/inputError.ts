export class InputError {
  nombre: string
  mensaje: string

  constructor(name: string, message: string) {
    this.nombre = name
    this.mensaje = message
  }
}
