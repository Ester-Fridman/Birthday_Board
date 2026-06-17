import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Birthday, Pagination, AppError } from '../../types';
import { fetchBirthdays, deleteBirthday } from './birthdayBoardActions';

interface BirthdayBoardState {
  birthdays: Birthday[];
  pagination: Pagination;
  search: string;
  loading: boolean;
  deletingId: string | null;
  error: AppError | null;
}

const initialState: BirthdayBoardState = {
  birthdays: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  search: '',
  loading: false,
  deletingId: null,
  error: null,
};

const birthdayBoardSlice = createSlice({
  name: 'birthdayBoard',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.pagination.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBirthdays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBirthdays.fulfilled, (state, action) => {
        state.loading = false;
        state.birthdays = action.payload.birthdays;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBirthdays.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload ?? { type: 'unknown' as const, message: 'Failed to load birthdays' }) as AppError;
      })
      .addCase(deleteBirthday.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteBirthday.fulfilled, (state) => {
        state.deletingId = null;
      })
      .addCase(deleteBirthday.rejected, (state, action) => {
        state.deletingId = null;
        state.error = (action.payload ?? { type: 'unknown' as const, message: 'Failed to delete birthday' }) as AppError;
      });
  },
});

export const { setSearch, setPage } = birthdayBoardSlice.actions;
export default birthdayBoardSlice.reducer;
