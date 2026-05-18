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
      originalRequest._retry = true // Marcamos para no entrar en un bucle infinito

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          throw new Error('No hay refresh token, imposible salvar la sesión')
        }

        // Le pedimos a nuestro nuevo endpoint las llaves frescas
        const { data } = await axios.post('http://localhost:8080/usuarios/refresh', {
          refreshToken: refreshToken
        })

        // Guardamos las llaves nuevas en el navegador
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)

        // Actualizamos la mochila de la petición original con la llave nueva
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

        // Reintentamos la petición que había fallado, pero ahora va a pasar
        return api(originalRequest)

      } catch (refreshError) {
        // VAQUITA-301: Si el refresh falla (porque pasaron 7 días o lo borraron), lo echamos
        limpiarSesion()
        return Promise.reject(refreshError)
      }
    }

    // Si el error es 403 (No tiene permisos) o cualquier 401 que no pudimos salvar
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      limpiarSesion()
    }

    return Promise.reject(error)
  }
)

export default api