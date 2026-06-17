import type { RootState } from '../../store/rootReducer';

export const selectBirthdayFormLoading = (state: RootState) => state.birthdayForm.loading;
export const selectBirthdayFormError = (state: RootState) => state.birthdayForm.error;
export const selectBirthdayFormSuccess = (state: RootState) => state.birthdayForm.success;
