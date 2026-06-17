import type { RootState } from '../../store/rootReducer';

export const selectTodayBirthdays = (state: RootState) => state.todayBirthdays.birthdays;
export const selectTodayBirthdaysLoading = (state: RootState) => state.todayBirthdays.loading;
export const selectTodayBirthdaysError = (state: RootState) => state.todayBirthdays.error;
