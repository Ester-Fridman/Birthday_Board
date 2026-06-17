import { createSlice } from '@reduxjs/toolkit';
import type { Birthday, AppError } from '../../types';
import { fetchTodayBirthdays } from './todayBirthdaysActions';

interface TodayBirthdaysState {
  birthdays: Birthday[];
  loading: boolean;
  error: AppError | null;
}

const initialState: TodayBirthdaysState = {
  birthdays: [],
  loading: false,
  error: null,
};

const todayBirthdaysSlice = createSlice({
  name: 'todayBirthdays',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayBirthdays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayBirthdays.fulfilled, (state, action) => {
        state.loading = false;
        state.birthdays = action.payload;
      })
      .addCase(fetchTodayBirthdays.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload ?? { type: 'unknown' as const, message: "Failed to load today's birthdays" }) as AppError;
      });
  },
});

export default todayBirthdaysSlice.reducer;
