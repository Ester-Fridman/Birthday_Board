import { createSlice } from '@reduxjs/toolkit';
import type { AppError } from '../../types';
import { createBirthday, updateBirthday } from './birthdayFormActions';

interface BirthdayFormState {
  loading: boolean;
  error: AppError | null;
  success: boolean;
}

const initialState: BirthdayFormState = {
  loading: false,
  error: null,
  success: false,
};

const pending = (state: BirthdayFormState) => {
  state.loading = true;
  state.error = null;
  state.success = false;
};

const birthdayFormSlice = createSlice({
  name: 'birthdayForm',
  initialState,
  reducers: {
    reset(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBirthday.pending, pending)
      .addCase(createBirthday.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createBirthday.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload ?? { type: 'unknown' as const, message: 'Failed to create birthday' }) as AppError;
      })
      .addCase(updateBirthday.pending, pending)
      .addCase(updateBirthday.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateBirthday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { type: 'unknown' as const, message: 'Failed to update birthday' };
      });
  },
});

export const { reset } = birthdayFormSlice.actions;
export default birthdayFormSlice.reducer;
