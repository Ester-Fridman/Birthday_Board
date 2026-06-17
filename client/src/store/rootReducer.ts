import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../components/Login/loginSlice';
import birthdayBoardReducer from '../components/BirthdayBoard/birthdayBoardSlice';
import todayBirthdaysReducer from '../components/TodayBirthdays/todayBirthdaysSlice';
import birthdayFormReducer from '../components/BirthdayForm/birthdayFormSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  birthdayBoard: birthdayBoardReducer,
  todayBirthdays: todayBirthdaysReducer,
  birthdayForm: birthdayFormReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
