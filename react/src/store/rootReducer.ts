import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';

const placeholderReducer = (state = {}) => state;

export const rootReducer = combineReducers({
  auth: placeholderReducer,
  catalogs: placeholderReducer,
  services: placeholderReducer,
  orders: placeholderReducer,
  cart: placeholderReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
