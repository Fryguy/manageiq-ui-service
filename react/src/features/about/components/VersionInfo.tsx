/**
 * VersionInfo - displays application version information
 */

import React from 'react';
import { StructuredListWrapper, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell, SkeletonText } from '@carbon/react';
import { __ } from '../../../i18n';

export interface VersionInfoProps {
  version?: string;
  buildDate?: string;
  gitCommit?: string;
  loading?: boolean;
}

export const VersionInfo: React.FC<VersionInfoProps> = ({
  version = 'N/A',
  buildDate = 'N/A',
  gitCommit = 'N/A',
  loading = false,
}) => {
  if (loading) {
    return (
      <div data-testid="version-info-loading">
        <SkeletonText heading />
        <SkeletonText paragraph lineCount={3} />
      </div>
    );
  }

  return (
    <div data-testid="version-info">
      <h3 style={{ marginBottom: '1rem' }}>{__('Version Information')}</h3>
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>{__('Property')}</StructuredListCell>
            <StructuredListCell head>{__('Value')}</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          <StructuredListRow>
            <StructuredListCell>{__('Application Version')}</StructuredListCell>
            <StructuredListCell>{version}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>{__('Build Date')}</StructuredListCell>
            <StructuredListCell>{buildDate}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>{__('Git Commit')}</StructuredListCell>
            <StructuredListCell>
              <code>{gitCommit}</code>
            </StructuredListCell>
          </StructuredListRow>
        </StructuredListBody>
      </StructuredListWrapper>
    </div>
  );
};
