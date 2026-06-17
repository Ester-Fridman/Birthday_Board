import type { RootState } from '../../store/rootReducer';

export const selectBirthdays = (state: RootState) => state.birthdayBoard.birthdays;
export const selectBirthdaysPagination = (state: RootState) => state.birthdayBoard.pagination;
export const selectBirthdaysSearch = (state: RootState) => state.birthdayBoard.search;
export const selectBirthdaysLoading = (state: RootState) => state.birthdayBoard.loading;
export const selectBirthdaysDeletingId = (state: RootState) => state.birthdayBoard.deletingId;
export const selectBirthdaysError = (state: RootState) => state.birthdayBoard.error;
