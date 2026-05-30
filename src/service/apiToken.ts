/* eslint-disable no-undef */
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
})

// Función auxiliar para no repetir código cuando tenemos que echar al usuario
const limpiarSesion = () => {
  console.error('Sesión expirada o inválida, rajando al login...')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken') // Agregamos el nuevo
  localStorage.removeItem('user_name')
  localStorage.removeItem('user_email')
  localStorage.removeItem('user_image')
  window.location.href = '/login'
}

// 1. Interceptor de PETICIONES
api.interceptors.request.use(
  (config) => {
    // AHORA buscamos el 'accessToken' (la llave rápida de 15 min)
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 2. Interceptor de RESPUESTAS
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si el error es 401 (Venció el Access Token) y NO estamos en la ruta de login ni intentamos ya recargar...
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/usuarios/login') &&
      !originalRequest.url.includes('/usuarios/refresh')
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          throw new Error('No hay refresh token, imposible salvar la sesión')
        }

        const { data } = await axios.post('http://localhost:8080/usuarios/refresh', {
          refreshToken: refreshToken
        })

        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

        return api(originalRequest)

      } catch (refreshError) {
        limpiarSesion()
        return Promise.reject(refreshError)
      }
    }

    // Si el error es 403 (No tiene permisos) o cualquier 401 que no pudimos salvar
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      limpiarSesion()
    }

    // 👇 ACA ENTRA LA MAGIA NUEVA (VAQUITA-237 y VAQUITA-239) 👇
    if (error.response) {
      // Si el backend mandó nuestro JSON prolijo con el "message", lo extraemos
      if (error.response.data && error.response.data.message) {
        // Pisamos el mensaje genérico de Axios con el nuestro de Spring Boot
        error.message = error.response.data.message
      }
    } else if (error.request) {
      // Si ni siquiera hay respuesta, es porque el backend está apagado o no hay internet
      error.message = 'No se pudo conectar con el servidor. Revisá tu conexión.'
    }
    // 👆 FIN DE LA MAGIA 👆

    // Rechazamos la promesa para que el frontend (el toast) lo muestre
    return Promise.reject(error)
  }

)

export default api