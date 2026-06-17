import axios from 'axios';
import type { AppError } from '../types';
import { store } from '../store';
import { logout } from '../components/Login/loginSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Central error classifier — every failed request is converted to a typed AppError
// before it reaches any Redux action or component.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

    // Session expired on a protected route — clear auth state and let
    // ProtectedRoute handle the redirect via React Router.
    if (error.response?.status === 401 && !isAuthEndpoint) {
      store.dispatch(logout());
    }

    const appError: AppError = classifyError(error);
    return Promise.reject(appError);
  }
);

function classifyError(error: unknown): AppError {
  const axiosError = error as { response?: { status: number; data?: { message?: string; errors?: { msg: string }[] } } };

  if (!axiosError.response) {
    return { type: 'network', message: 'Unable to connect — check your internet connection' };
  }

  const status = axiosError.response.status;
  const serverMessage =
    axiosError.response.data?.message ??
    axiosError.response.data?.errors?.[0]?.msg;

  if (status === 400) return { type: 'validation', message: serverMessage ?? 'Invalid data submitted' };
  if (status === 401) return { type: 'unknown',    message: serverMessage ?? 'Authentication failed' };
  if (status === 409) return { type: 'conflict',   message: serverMessage ?? 'Resource already exists' };
  if (status === 429) return { type: 'rate_limited', message: 'Too many failed attempts. Please wait 15 minutes before trying again.' };
  if (status === 404) return { type: 'not_found',  message: serverMessage ?? 'Resource not found' };
  if (status >= 500)  return { type: 'server',     message: 'Server error — please try again later' };

  return { type: 'unknown', message: serverMessage ?? 'Something went wrong' };
}

export default api;
