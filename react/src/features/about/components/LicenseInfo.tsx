/**
 * LicenseInfo - displays application license information
 */

import React from 'react';
import { SkeletonText } from '@carbon/react';
import { __ } from '../../../i18n';

export interface LicenseInfoProps {
  licenseName?: string;
  licenseUrl?: string;
  copyrightYear?: string;
  copyrightHolder?: string;
  loading?: boolean;
}

export const LicenseInfo: React.FC<LicenseInfoProps> = ({
  licenseName = 'Apache License 2.0',
  licenseUrl = 'https://www.apache.org/licenses/LICENSE-2.0',
  copyrightYear = new Date().getFullYear().toString(),
  copyrightHolder = 'ManageIQ',
  loading = false,
}) => {
  if (loading) {
    return (
      <div data-testid="license-info-loading">
        <SkeletonText heading />
        <SkeletonText paragraph lineCount={3} />
      </div>
    );
  }

  return (
    <div data-testid="license-info">
      <h3 style={{ marginBottom: '1rem' }}>{__('License Information')}</h3>
      <div style={{ marginBottom: '1rem' }}>
        <p>
          <strong>{__('License')}:</strong>{' '}
          <a href={licenseUrl} target="_blank" rel="noopener noreferrer">
            {licenseName}
          </a>
        </p>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <p>
          <strong>{__('Copyright')}:</strong> © {copyrightYear} {copyrightHolder}
        </p>
      </div>
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f4f4f4', borderRadius: '4px' }}>
        <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
          {__('Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at')}
        </p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          <a href={licenseUrl} target="_blank" rel="noopener noreferrer">
            {licenseUrl}
          </a>
        </p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
          {__('Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.')}
        </p>
      </div>
    </div>
  );
};
