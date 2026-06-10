import React from 'react';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  danger?: boolean;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  danger = false,
  loading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      primaryButtonText={confirmButtonText}
      secondaryButtonText={cancelButtonText}
      onPrimaryClick={handleConfirm}
      onSecondaryClick={onClose}
      danger={danger}
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
