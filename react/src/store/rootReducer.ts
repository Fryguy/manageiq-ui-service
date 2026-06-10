import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import dashboardReducer from '../features/dashboard/store/dashboardSlice';
import uiReducer from './uiSlice';

const placeholderReducer = (state = {}) => state;

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  catalogs: placeholderReducer,
  services: placeholderReducer,
  orders: placeholderReducer,
  cart: placeholderReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
