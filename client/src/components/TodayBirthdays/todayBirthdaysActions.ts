import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppError, Birthday } from '../../types';
import api from '../../services/api';

export const fetchTodayBirthdays = createAsyncThunk<
  Birthday[],
  void,
  { rejectValue: AppError }
>(
  'todayBirthdays/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/birthdays/today');
      return data.birthdays;
    } catch (err) {
      return rejectWithValue(err as AppError);
    }
  }
);
