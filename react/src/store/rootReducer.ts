import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import dashboardReducer from '../features/dashboard/store/dashboardSlice';
import profileReducer from '../features/profile/store/profileSlice';
import aboutReducer from '../features/about/store/aboutSlice';
import uiReducer from './uiSlice';

const placeholderReducer = (state = {}) => state;

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  profile: profileReducer,
  about: aboutReducer,
  catalogs: placeholderReducer,
  services: placeholderReducer,
  orders: placeholderReducer,
  cart: placeholderReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
