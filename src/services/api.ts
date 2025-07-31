import axios from "axios";
import { API_URL } from "../config/apiConfig";
import AuthService from "./AuthService";

const api = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false
let pendingRequests: ((token: string) => void)[] = []

api.interceptors.request.use(async config => {
  const token = await AuthService.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  r => r,
  async err => {
    const { config, response } = err
    if (response?.status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise(resolve => {
          pendingRequests.push((newToken: string) => {
            config.headers.Authorization = `Bearer ${newToken}`
            resolve(axios(config))
          })
        })
      }

      config._retry = true
      isRefreshing = true

      try {
        const newToken = await AuthService.refreshToken()
        pendingRequests.forEach(cb => cb(newToken))
        pendingRequests = []
        return api(config)
      }
      catch (refreshErr) {
        await AuthService.logout()
        return Promise.reject(refreshErr)
      }
      finally {
        isRefreshing = false
      }
    }
  }
)

export default api;