/* eslint-disable no-undef */
import axios, {
  AxiosHeaders,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { REST_SERVER_URL } from './configurations'

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: REST_SERVER_URL,
})

let refreshTokenRequest: Promise<TokenResponse> | null = null

const guardarTokens = (data: TokenResponse) => {
  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)
}

const refrescarTokens = async () => {
  const refreshToken = localStorage.getItem('refreshToken')

  if (!refreshToken) {
    throw new Error('No hay refresh token para renovar la sesión')
  }

  if (!refreshTokenRequest) {
    refreshTokenRequest = axios
      .post<TokenResponse>(`${REST_SERVER_URL}/usuarios/refresh`, { refreshToken })
      .then(({ data }) => {
        guardarTokens(data)
        return data
      })
      .finally(() => {
        refreshTokenRequest = null
      })
  }

  return refreshTokenRequest
}

const aplicarMensajeDelBackend = (error: AxiosError) => {
  const data = error.response?.data

  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof data.message === 'string'
  ) {
    error.message = data.message
  } else if (error.request && !error.response) {
    error.message = 'No se pudo conectar con el servidor. Revisá tu conexión.'
  }
}

const esEndpointPublicoDeAuth = (url = '') =>
  url.includes('/usuarios/login') ||
  url.includes('/usuarios/register') ||
  url.includes('/usuarios/refresh')

const limpiarSesion = () => {
  console.error('Sesión expirada o inválida, redirigiendo al login...')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user_name')
  localStorage.removeItem('user_email')
  localStorage.removeItem('user_image')
  window.location.href = '/login'
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers = config.headers ?? new AxiosHeaders()
      config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    aplicarMensajeDelBackend(error)

    const originalRequest = error.config as RetriableRequestConfig | undefined
    const status = error.response?.status
    const requestUrl = originalRequest?.url ?? ''

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !esEndpointPublicoDeAuth(requestUrl)
    ) {
      originalRequest._retry = true

      try {
        const data = await refrescarTokens()

        originalRequest.headers = AxiosHeaders.from(originalRequest.headers)
        originalRequest.headers.set(
          'Authorization',
          `Bearer ${data.accessToken}`,
        )

        return api(originalRequest)
      } catch (refreshError) {
        limpiarSesion()
        return Promise.reject(refreshError)
      }
    }

    if (status === 401 && !esEndpointPublicoDeAuth(requestUrl)) {
      limpiarSesion()
    }

    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    console.log('RESPONSE OK', response)
    return response
  },)

export default api
