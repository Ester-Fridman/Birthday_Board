import type { AppDispatch } from '../../store';
import type { AppError } from '../../types';
import api from '../../services/api';
import { setLoading, setCredentials, setUser, setError, logout } from './loginSlice';

export const register = (name: string, email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await api.post('/auth/register', { name, email, password });
    dispatch(setCredentials({ user: data.user, token: data.token }));
  } catch (err: unknown) {
    dispatch(setError(err as AppError));
  }
};

export const login = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await api.post('/auth/login', { email, password });
    dispatch(setCredentials({ user: data.user, token: data.token }));
  } catch (err: unknown) {
    const appError = err as AppError;
    // 401 from login means wrong credentials — give a friendlier message than the generic one
    const error: AppError = appError.type === 'unknown'
      ? { type: 'unknown', message: 'Invalid email or password' }
      : appError;
    dispatch(setError(error));
  }
};

export const fetchCurrentUser = () => async (dispatch: AppDispatch) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  dispatch(setLoading(true));
  try {
    const { data } = await api.get('/auth/me');
    dispatch(setUser(data.user));
  } catch {
    dispatch(logout());
  }
};

export { logout };
