import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  kind: 'error' | 'info' | 'success' | 'warning';
  title: string;
  message?: string;
  dismissible?: boolean;
}

export interface ModalState {
  name: string | null;
  props: Record<string, unknown> | null;
}

export interface UiState {
  globalLoading: boolean;
  notifications: Notification[];
  activeModal: ModalState;
}

const initialState: UiState = {
  globalLoading: false,
  notifications: [],
  activeModal: {
    name: null,
    props: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    openModal(
      state,
      action: PayloadAction<{
        name: string;
        props?: Record<string, unknown>;
      }>
    ) {
      state.activeModal = {
        name: action.payload.name,
        props: action.payload.props ?? null,
      };
    },
    closeModal(state) {
      state.activeModal = {
        name: null,
        props: null,
      };
    },
  },
});

export const {
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;