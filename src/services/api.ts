import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_URL } from '../config/apiConfig';
import { tokenStorage } from './tokenStorage';
import AuthService from './AuthService';

const api = axios.create({ baseURL: API_URL });

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

// Attach access token to every request
api.interceptors.request.use(async config => {
  const token = await tokenStorage.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try refresh once
api.interceptors.response.use(
  res => res,
  async (err: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const original = err.config;
    if (err.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise(resolve => {
          queue.push((newToken: string) => {
            if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await AuthService.refreshToken();
        queue.forEach(cb => cb(newToken));
        queue = [];
        original.headers!.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshErr) {
        await AuthService.logout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
