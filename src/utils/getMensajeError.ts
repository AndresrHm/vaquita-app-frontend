import axios from 'axios'

export function getMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; error?: string; detalle?: string; detail?: string; errors?: string[] }
      | string
      | undefined

    if (typeof responseData === 'string' && responseData.trim().length > 0) {
      return responseData
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      'message' in responseData &&
      typeof responseData.message === 'string' &&
      responseData.message.trim().length > 0
    ) {
      return responseData.message
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      'error' in responseData &&
      typeof responseData.error === 'string' &&
      responseData.error.trim().length > 0
    ) {
      return responseData.error
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      'detail' in responseData &&
      typeof responseData.detail === 'string' &&
      responseData.detail.trim().length > 0
    ) {
      return responseData.detail
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      'detalle' in responseData &&
      typeof responseData.detalle === 'string' &&
      responseData.detalle.trim().length > 0
    ) {
      return responseData.detalle
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      Array.isArray(responseData.errors) &&
      responseData.errors.length > 0 &&
      typeof responseData.errors[0] === 'string' &&
      responseData.errors[0].trim().length > 0
    ) {
      return responseData.errors[0]
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return 'Ocurrio un error inesperado'
}
