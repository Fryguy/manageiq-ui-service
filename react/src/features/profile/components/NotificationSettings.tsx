/**
 * NotificationSettings component - notification preferences
 */

import React, { useState } from 'react';
import { Form, Toggle, Button, InlineNotification, Stack } from '@carbon/react';
import { Save } from '@carbon/icons-react';
import type { UserSettings } from '../types';
import { __ } from '../../../i18n';

interface NotificationSettingsProps {
  currentSettings?: UserSettings['notifications'];
  onSubmit: (settings: Partial<UserSettings>) => void;
  loading?: boolean;
  error?: string | null;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  currentSettings = { email: true, browser: true },
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [emailNotifications, setEmailNotifications] = useState(
    currentSettings.email ?? true
  );
  const [browserNotifications, setBrowserNotifications] = useState(
    currentSettings.browser ?? true
  );
  const [isDirty, setIsDirty] = useState(false);

  const handleEmailToggle = (checked: boolean) => {
    setEmailNotifications(checked);
    setIsDirty(
      checked !== currentSettings.email ||
      browserNotifications !== currentSettings.browser
    );
  };

  const handleBrowserToggle = (checked: boolean) => {
    setBrowserNotifications(checked);
    setIsDirty(
      emailNotifications !== currentSettings.email ||
      checked !== currentSettings.browser
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDirty) {
      onSubmit({
        notifications: {
          email: emailNotifications,
          browser: browserNotifications,
        },
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit} data-testid="notification-settings-form">
      <Stack gap={6}>
        {error && (
          <InlineNotification
            kind="error"
            title={__('Error')}
            subtitle={error}
            lowContrast
            hideCloseButton
          />
        )}

        <Toggle
          id="email-notifications"
          labelText={__('Email Notifications')}
          labelA={__('Off')}
          labelB={__('On')}
          toggled={emailNotifications}
          onToggle={handleEmailToggle}
          disabled={loading}
        />

        <Toggle
          id="browser-notifications"
          labelText={__('Browser Notifications')}
          labelA={__('Off')}
          labelB={__('On')}
          toggled={browserNotifications}
          onToggle={handleBrowserToggle}
          disabled={loading}
        />

        <InlineNotification
          kind="info"
          title={__('Note')}
          subtitle={__('Browser notifications require permission from your browser.')}
          lowContrast
          hideCloseButton
        />

        <Button
          type="submit"
          renderIcon={Save}
          disabled={!isDirty || loading}
        >
          {__('Save Notification Preferences')}
        </Button>
      </Stack>
    </Form>
  );
};
