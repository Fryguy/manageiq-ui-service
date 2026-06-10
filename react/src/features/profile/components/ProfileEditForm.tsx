/**
 * ProfileEditForm component - form for editing user profile
 */

import React, { useState, useEffect } from 'react';
import { Form, TextInput, Button, InlineNotification, Stack } from '@carbon/react';
import { Save, Close } from '@carbon/icons-react';
import type { UserProfile, UpdateProfilePayload } from '../types';
import { __ } from '../../../i18n';

interface ProfileEditFormProps {
  profile: UserProfile;
  onSubmit: (payload: UpdateProfilePayload) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profile,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    name: profile.name,
    email: profile.email || '',
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const hasChanges =
      formData.name !== profile.name ||
      formData.email !== (profile.email || '');
    setIsDirty(hasChanges);
  }, [formData, profile]);

  const handleChange = (field: keyof UpdateProfilePayload) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDirty) {
      onSubmit(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit} data-testid="profile-edit-form">
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

        <TextInput
          id="name"
          labelText={__('Name')}
          value={formData.name || ''}
          onChange={handleChange('name')}
          disabled={loading}
          required
        />

        <TextInput
          id="email"
          labelText={__('Email')}
          type="email"
          value={formData.email || ''}
          onChange={handleChange('email')}
          disabled={loading}
        />

        <TextInput
          id="userid"
          labelText={__('User ID')}
          value={profile.userid}
          disabled
          readOnly
        />

        {profile.group && (
          <TextInput
            id="group"
            labelText={__('Group')}
            value={profile.group.description}
            disabled
            readOnly
          />
        )}

        {profile.role && (
          <TextInput
            id="role"
            labelText={__('Role')}
            value={profile.role.name}
            disabled
            readOnly
          />
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button
            type="submit"
            renderIcon={Save}
            disabled={!isDirty || loading}
          >
            {__('Save')}
          </Button>
          <Button
            kind="secondary"
            renderIcon={Close}
            onClick={onCancel}
            disabled={loading}
          >
            {__('Cancel')}
          </Button>
        </div>
      </Stack>
    </Form>
  );
};
