import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppError, Birthday, Pagination } from '../../types';
import type { RootState } from '../../store/rootReducer';
import api from '../../services/api';

export const fetchBirthdays = createAsyncThunk<
  { birthdays: Birthday[]; pagination: Pagination },
  void,
  { state: RootState; rejectValue: AppError }
>(
  'birthdayBoard/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { pagination, search } = getState().birthdayBoard;
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        ...(search ? { search } : {}),
      });
      const { data } = await api.get(`/birthdays?${params}`);
      return { birthdays: data.birthdays, pagination: data.pagination };
    } catch (err) {
      return rejectWithValue(err as AppError);
    }
  }
);

export const deleteBirthday = createAsyncThunk<
  string,
  string,
  { rejectValue: AppError }
>(
  'birthdayBoard/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/birthdays/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err as AppError);
    }
  }
);
