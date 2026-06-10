/**
 * ProfilePage - main page for user profile management
 */

import React, { useEffect, useState } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, InlineNotification, Button } from '@carbon/react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProfile, updateProfile, updateSettings, clearUpdateError } from '../store/profileSlice';
import { ProfileInfo } from '../components/ProfileInfo';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { LanguageSettings } from '../components/LanguageSettings';
import { NotificationSettings } from '../components/NotificationSettings';
import type { UpdateProfilePayload, UserSettings } from '../types';
import { __ } from '../../../i18n';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error, updating, updateError } = useAppSelector(
    (state) => state.profile
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!updating && !updateError && isEditing) {
      // Successfully updated, exit edit mode
      setIsEditing(false);
    }
  }, [updating, updateError, isEditing]);

  const handleProfileUpdate = (payload: UpdateProfilePayload) => {
    dispatch(updateProfile(payload));
  };

  const handleSettingsUpdate = (settings: Partial<UserSettings>) => {
    dispatch(updateSettings(settings));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    dispatch(clearUpdateError());
  };

  const handleTabChange = (evt: { selectedIndex: number }) => {
    setSelectedTab(evt.selectedIndex);
    setIsEditing(false);
    dispatch(clearUpdateError());
  };

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <InlineNotification
          kind="error"
          title={__('Error loading profile')}
          subtitle={error}
          lowContrast
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }} data-testid="profile-page">
      <h1 style={{ marginBottom: '2rem' }}>{__('User Profile')}</h1>

      <Tabs selectedIndex={selectedTab} onChange={handleTabChange}>
        <TabList aria-label={__('Profile tabs')}>
          <Tab>{__('Profile Information')}</Tab>
          <Tab>{__('Language Settings')}</Tab>
          <Tab>{__('Notification Settings')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div style={{ marginTop: '2rem' }}>
              {!isEditing ? (
                <>
                  <ProfileInfo profile={profile} loading={loading} />
                  {profile && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      style={{ marginTop: '1rem' }}
                      disabled={loading}
                    >
                      {__('Edit Profile')}
                    </Button>
                  )}
                </>
              ) : (
                profile && (
                  <ProfileEditForm
                    profile={profile}
                    onSubmit={handleProfileUpdate}
                    onCancel={handleCancelEdit}
                    loading={updating}
                    error={updateError}
                  />
                )
              )}
            </div>
          </TabPanel>
          <TabPanel>
            <div style={{ marginTop: '2rem' }}>
              <LanguageSettings
                currentLocale={profile?.settings?.locale}
                onSubmit={handleSettingsUpdate}
                loading={updating}
                error={updateError}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div style={{ marginTop: '2rem' }}>
              <NotificationSettings
                currentSettings={profile?.settings?.notifications}
                onSubmit={handleSettingsUpdate}
                loading={updating}
                error={updateError}
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
