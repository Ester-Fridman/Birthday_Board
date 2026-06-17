import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppError, BirthdayFormData } from '../../types';
import api from '../../services/api';

export const createBirthday = createAsyncThunk<
  void,
  BirthdayFormData,
  { rejectValue: AppError }
>(
  'birthdayForm/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/birthdays', data);
    } catch (err) {
      return rejectWithValue(err as AppError);
    }
  }
);

export const updateBirthday = createAsyncThunk<
  void,
  { id: string; data: BirthdayFormData },
  { rejectValue: AppError }
>(
  'birthdayForm/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.patch(`/birthdays/${id}`, data);
    } catch (err) {
      return rejectWithValue(err as AppError);
    }
  }
);
