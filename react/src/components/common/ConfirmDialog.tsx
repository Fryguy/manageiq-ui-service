import React from 'react';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmKind?: 'primary' | 'danger' | 'secondary' | 'tertiary' | 'ghost';
  danger?: boolean;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText,
  cancelText,
  confirmButtonText,
  cancelButtonText,
  confirmKind,
  danger = false,
  loading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  // Support both old and new prop names
  const confirmLabel = confirmText || confirmButtonText || 'Confirm';
  const cancelLabel = cancelText || cancelButtonText || 'Cancel';
  const isDanger = danger || confirmKind === 'danger';

  return (
    <Modal
      open={open}
      onClose={onClose || handleCancel}
      title={title}
      primaryButtonText={confirmLabel}
      secondaryButtonText={cancelLabel}
      onPrimaryClick={handleConfirm}
      onSecondaryClick={handleCancel}
      danger={isDanger}
      size="sm"
      loading={loading}
      passiveModal={false}
    >
      <div style={{ padding: '1rem 0' }}>
        {typeof message === 'string' ? <p>{message}</p> : message}
      </div>
    </Modal>
  );
};
