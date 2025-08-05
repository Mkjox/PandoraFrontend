import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../config/apiConfig";
import { tokenStorage } from "./tokenStorage";

const api = axios.create({
  baseURL: API_URL,
})

let isRefreshing = false
let pendingQueue: Array<(token: string) => void> = []

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStorage.getAccessToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const bare = axios.create({ baseURL: API_URL }) // no interceptors here
  const response = await bare.post<{
    data: { accessToken: string; refreshToken: string; }
    resultStatus: number
    message: string
  }>('/auth/refresh', { refreshToken })

  if (response.data.resultStatus !== 0) {
    throw new Error(response.data.message || 'Token refresh failed')
  }

  const { accessToken, refreshToken: newRefresh } = response.data.data
  await tokenStorage.setTokens(accessToken, newRefresh)
  return accessToken
}

// Response: on 401 try to refresh once, replay queued requests.
api.interceptors.response.use(
  r => r,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const status = error.response?.status

    if (!original || status !== 401 || original._retry) {
      // Not eligible for refresh handling
      return Promise.reject(error)
    }

    // Already refreshing -> queue this request until refresh finishes
    if (isRefreshing) {
      return new Promise(resolve => {
        pendingQueue.push((newToken: string) => {
          if (original.headers) {
            original.headers.Authorization =  `Bearer ${newToken}`
          }
          original._retry = true
          resolve(axios(original)) // use axios to avoid this interceptor loop confusion
        })
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const newToken = await refreshAccessToken()

      pendingQueue.forEach(cb => cb(newToken))
      pendingQueue = []

      if (original.headers) {
        original.headers.Authorization = `Bearer ${newToken}`
      }
      return api(original)
    }
    catch (refreshErr) {
      await tokenStorage.clear()
      pendingQueue = []
      return Promise.reject(refreshErr)
    }
    finally {
      isRefreshing = false
    }
  }
)

export default api