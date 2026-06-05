import uiReducer, {
  addNotification,
  clearNotifications,
  closeModal,
  openModal,
  removeNotification,
  setGlobalLoading,
} from './uiSlice';

describe('uiSlice', () => {
  it('returns the initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual({
      globalLoading: false,
      notifications: [],
      activeModal: {
        name: null,
        props: null,
      },
    });
  });

  it('handles loading state updates', () => {
    const state = uiReducer(undefined, setGlobalLoading(true));

    expect(state.globalLoading).toBe(true);
  });

  it('adds, removes, and clears notifications', () => {
    const notification = {
      id: 'notice-1',
      kind: 'success' as const,
      title: 'Saved',
      message: 'Changes were saved.',
    };

    const withNotification = uiReducer(undefined, addNotification(notification));
    expect(withNotification.notifications).toEqual([notification]);

    const withoutNotification = uiReducer(withNotification, removeNotification(notification.id));
    expect(withoutNotification.notifications).toEqual([]);

    const cleared = uiReducer(withNotification, clearNotifications());
    expect(cleared.notifications).toEqual([]);
  });

  it('opens and closes modals', () => {
    const opened = uiReducer(
      undefined,
      openModal({
        name: 'details-modal',
        props: { id: '123' },
      })
    );

    expect(opened.activeModal).toEqual({
      name: 'details-modal',
      props: { id: '123' },
    });

    const closed = uiReducer(opened, closeModal());

    expect(closed.activeModal).toEqual({
      name: null,
      props: null,
    });
  });
});
