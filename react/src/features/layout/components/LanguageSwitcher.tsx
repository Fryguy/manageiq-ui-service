/**
 * Language Switcher Component
 * 
 * Allows users to switch between available locales.
 * Persists the selection to localStorage and reloads translations.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown } from '@carbon/react';
import { 
  AVAILABLE_LOCALES, 
  LocaleCode, 
  getStoredLocale, 
  switchLocale,
  getLocaleName 
} from '../../../i18n/config';
import { __ } from '../../../i18n';

interface LanguageSwitcherProps {
  /**
   * Optional callback when locale changes
   */
  onLocaleChange?: (locale: LocaleCode) => void;
  
  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * LanguageSwitcher component for selecting application locale
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  onLocaleChange,
  className 
}) => {
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>(getStoredLocale());
  const [isChanging, setIsChanging] = useState(false);

  // Prepare dropdown items
  const items = AVAILABLE_LOCALES.map(locale => ({
    id: locale.code,
    text: locale.name,
  }));

  const handleLocaleChange = async (event: { selectedItem: { id: string } }) => {
    const newLocale = event.selectedItem.id as LocaleCode;
    
    if (newLocale === currentLocale) {
      return;
    }

    setIsChanging(true);

    try {
      await switchLocale(newLocale);
      setCurrentLocale(newLocale);
      
      // Notify parent component
      onLocaleChange?.(newLocale);
      
      // Reload the page to apply translations throughout the app
      // This is necessary because ttag translations are applied at module load time
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch locale:', error);
      setIsChanging(false);
    }
  };

  return (
    <Dropdown
      id="language-switcher"
      titleText={__('Language')}
      label={getLocaleName(currentLocale)}
      items={items}
      itemToString={(item) => item?.text || ''}
      onChange={handleLocaleChange}
      disabled={isChanging}
      className={className}
    />
  );
};

export default LanguageSwitcher;
