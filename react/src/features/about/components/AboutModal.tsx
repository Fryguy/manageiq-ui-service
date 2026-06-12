/**
 * AboutModal - displays application information in a modal dialog
 * Aligned with IBM Carbon and PatternFly About modal patterns
 */

import React from 'react';
import { Modal, StructuredListWrapper, StructuredListBody, StructuredListRow, StructuredListCell } from '@carbon/react';
import { __ } from '../../../i18n';
import './AboutModal.css';

export interface AboutModalProps {
  open: boolean;
  onClose: () => void;
  appInfo?: {
    version?: string;
    suiVersion?: string;
    serverName?: string;
    userName?: string;
    userRole?: string;
    copyright?: string;
    supportWebsiteText?: string;
    supportWebsite?: string;
    documentationUrl?: string;
  };
}

export const AboutModal: React.FC<AboutModalProps> = ({
  open,
  onClose,
  appInfo = {},
}) => {
  const {
    version = 'N/A',
    suiVersion = 'N/A',
    serverName = 'N/A',
    userName = 'N/A',
    userRole = 'N/A',
    copyright = '',
    supportWebsiteText = 'Support Website',
    supportWebsite = '',
    documentationUrl = '/support/index?support_tab=about',
  } = appInfo;

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      modalHeading={__('About ManageIQ Service UI')}
      passiveModal
      size="md"
      className="about-modal"
    >
      <div className="about-modal__content">
        <div className="about-modal__logo">
          <img
            src="/images/logo.svg"
            alt={__('Product logo')}
            className="about-modal__logo-image"
          />
        </div>

        <div className="about-modal__info">
          <StructuredListWrapper>
            <StructuredListBody>
              <StructuredListRow>
                <StructuredListCell>{__('Version:')}</StructuredListCell>
                <StructuredListCell>{version}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>{__('SUI Version:')}</StructuredListCell>
                <StructuredListCell>{suiVersion}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>{__('Server Name:')}</StructuredListCell>
                <StructuredListCell>{serverName}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>{__('User Name:')}</StructuredListCell>
                <StructuredListCell>{userName}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>{__('User Role:')}</StructuredListCell>
                <StructuredListCell>{userRole}</StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </div>

        <div className="about-modal__links">
          {documentationUrl && (
            <a
              href={documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="about-modal__link"
            >
              {__('Documentation')}
            </a>
          )}
          {supportWebsite && (
            <a
              href={supportWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="about-modal__link"
            >
              {supportWebsiteText}
            </a>
          )}
        </div>

        {copyright && (
          <div className="about-modal__copyright">
            {copyright}
          </div>
        )}
      </div>
    </Modal>
  );
};