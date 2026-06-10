import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import uiReducer from './uiSlice';

const placeholderReducer = (state = {}) => state;

export const rootReducer = combineReducers({
  auth: authReducer,
  catalogs: placeholderReducer,
  services: placeholderReducer,
  orders: placeholderReducer,
  cart: placeholderReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
