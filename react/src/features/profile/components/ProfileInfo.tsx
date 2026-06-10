/**
 * ProfileInfo component - displays user profile information
 */

import React from 'react';
import { StructuredListWrapper, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell, SkeletonText } from '@carbon/react';
import type { UserProfile } from '../types';
import { __ } from '../../../i18n';

interface ProfileInfoProps {
  profile: UserProfile | null;
  loading?: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, loading = false }) => {
  if (loading) {
    return (
      <div data-testid="profile-info-loading">
        <SkeletonText heading />
        <SkeletonText paragraph lineCount={4} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div data-testid="profile-info-empty">
        {__('No profile information available')}
      </div>
    );
  }

  return (
    <StructuredListWrapper data-testid="profile-info">
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>{__('Field')}</StructuredListCell>
          <StructuredListCell head>{__('Value')}</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        <StructuredListRow>
          <StructuredListCell>{__('Name')}</StructuredListCell>
          <StructuredListCell>{profile.name}</StructuredListCell>
        </StructuredListRow>
        <StructuredListRow>
          <StructuredListCell>{__('User ID')}</StructuredListCell>
          <StructuredListCell>{profile.userid}</StructuredListCell>
        </StructuredListRow>
        {profile.email && (
          <StructuredListRow>
            <StructuredListCell>{__('Email')}</StructuredListCell>
            <StructuredListCell>{profile.email}</StructuredListCell>
          </StructuredListRow>
        )}
        {profile.group && (
          <StructuredListRow>
            <StructuredListCell>{__('Group')}</StructuredListCell>
            <StructuredListCell>{profile.group.description}</StructuredListCell>
          </StructuredListRow>
        )}
        {profile.role && (
          <StructuredListRow>
            <StructuredListCell>{__('Role')}</StructuredListCell>
            <StructuredListCell>{profile.role.name}</StructuredListCell>
          </StructuredListRow>
        )}
        {profile.current_group && (
          <StructuredListRow>
            <StructuredListCell>{__('Current Group')}</StructuredListCell>
            <StructuredListCell>{profile.current_group.description}</StructuredListCell>
          </StructuredListRow>
        )}
      </StructuredListBody>
    </StructuredListWrapper>
  );
};
