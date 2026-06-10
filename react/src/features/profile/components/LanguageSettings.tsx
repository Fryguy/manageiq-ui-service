/**
 * LanguageSettings component - language preference settings
 */

import React, { useState } from 'react';
import { Form, Select, SelectItem, Button, InlineNotification, Stack } from '@carbon/react';
import { Save } from '@carbon/icons-react';
import type { LanguageOption, UserSettings } from '../types';
import { __ } from '../../../i18n';

interface LanguageSettingsProps {
  currentLocale?: string;
  onSubmit: (settings: Partial<UserSettings>) => void;
  loading?: boolean;
  error?: string | null;
}

// Available languages - should match the languages supported by the application
const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
];

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  currentLocale = 'en',
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);
  const [isDirty, setIsDirty] = useState(false);

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    setSelectedLocale(newLocale);
    setIsDirty(newLocale !== currentLocale);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDirty) {
      onSubmit({ locale: selectedLocale });
    }
  };

  return (
    <Form onSubmit={handleSubmit} data-testid="language-settings-form">
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

        <Select
          id="locale"
          labelText={__('Language')}
          value={selectedLocale}
          onChange={handleLocaleChange}
          disabled={loading}
        >
          {AVAILABLE_LANGUAGES.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              text={`${lang.name} (${lang.nativeName})`}
            />
          ))}
        </Select>

        <InlineNotification
          kind="info"
          title={__('Note')}
          subtitle={__('The application will reload after changing the language.')}
          lowContrast
          hideCloseButton
        />

        <Button
          type="submit"
          renderIcon={Save}
          disabled={!isDirty || loading}
        >
          {__('Save Language Preference')}
        </Button>
      </Stack>
    </Form>
  );
};
