import type { InputError } from './inputError'

export abstract class Validable {
  errors: InputError[] = []

  tieneError(errorName: string) {
    return this.errors.find(it => it.nombre == errorName)
  }

  tieneErrores() {
    return this.errors.length > 0
  }

  obtenerMensajeDeError(errorName: string) {
    return this.errors.find(it => it.nombre == errorName)?.mensaje
  }

  agregarError(error: InputError) {
    this.errors.push(error)
  }

  validar() {
    this.errors = []
    this.validarEspecifico()
  }

  abstract validarEspecifico(): void

  valido() {
    return this.errors.length == 0
  }

  limpiarErrores() {
    return this.errors.length = 0
  }
}