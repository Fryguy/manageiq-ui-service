import React from 'react';
import {
  Modal as CarbonModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@carbon/react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  danger?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  preventCloseOnClickOutside?: boolean;
  hasScrollingContent?: boolean;
  modalHeading?: string;
  modalLabel?: string;
  passiveModal?: boolean;
  loading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  primaryButtonText = 'Submit',
  secondaryButtonText = 'Cancel',
  onPrimaryClick,
  onSecondaryClick,
  primaryButtonDisabled = false,
  secondaryButtonDisabled = false,
  danger = false,
  size = 'md',
  preventCloseOnClickOutside = false,
  hasScrollingContent = false,
  modalHeading,
  modalLabel,
  passiveModal = false,
  loading = false,
}) => {
  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      onClose();
    }
  };

  return (
    <CarbonModal
      open={open}
      onRequestClose={onClose}
      modalHeading={modalHeading || title}
      modalLabel={modalLabel}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      onRequestSubmit={handlePrimaryClick}
      onSecondarySubmit={handleSecondaryClick}
      primaryButtonDisabled={primaryButtonDisabled || loading}
      secondaryButtonDisabled={secondaryButtonDisabled || loading}
      danger={danger}
      size={size}
      preventCloseOnClickOutside={preventCloseOnClickOutside}
      hasScrollingContent={hasScrollingContent}
      passiveModal={passiveModal}
    >
      {children}
    </CarbonModal>
  );
};
