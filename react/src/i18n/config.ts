/**
 * i18n configuration and locale management
 *
 * This module handles loading translation files and managing locale state.
 * It maintains compatibility with the existing ManageIQ translation workflow.
 */

import { addLocale, useLocale } from 'ttag';

/**
 * Available locales in the application
 * This should match the locales available in client/gettext/po/
 */
export const AVAILABLE_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
] as const;

export type LocaleCode = typeof AVAILABLE_LOCALES[number]['code'];

/**
 * Default locale for the application
 */
export const DEFAULT_LOCALE: LocaleCode = 'en';

/**
 * Storage key for persisting user's locale preference
 */
const LOCALE_STORAGE_KEY = 'manageiq-ui-locale';

/**
 * Normalize locale code to match our format
 * Converts underscore to hyphen (e.g., 'pt_BR' -> 'pt-BR')
 *
 * @param locale - Locale code to normalize
 * @returns Normalized locale code
 */
export function normalizeLocale(locale: string): string {
  return locale.replace('_', '-');
}

/**
 * Get the user's preferred locale from localStorage
 *
 * @returns Stored locale code or default locale
 */
export function getStoredLocale(): LocaleCode {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isValidLocale(stored)) {
      return stored as LocaleCode;
    }
  } catch (error) {
    console.warn('Failed to read locale from localStorage:', error);
  }
  return DEFAULT_LOCALE;
}

/**
 * Save the user's locale preference to localStorage
 *
 * @param locale - Locale code to save
 */
export function saveLocale(locale: LocaleCode): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed to save locale to localStorage:', error);
  }
}

/**
 * Check if a locale code is valid/supported
 *
 * @param locale - Locale code to validate
 * @returns True if locale is supported
 */
export function isValidLocale(locale: string): boolean {
  return AVAILABLE_LOCALES.some(l => l.code === locale);
}

/**
 * Load translation data for a specific locale
 *
 * @param locale - Locale code to load
 * @returns Promise resolving to translation data
 */
export async function loadTranslations(locale: LocaleCode): Promise<Record<string, unknown>> {
  // For English, no translations needed (source language)
  if (locale === 'en') {
    return {};
  }

  try {
    // Dynamic import of translation JSON files
    // These will be generated from .po files during build
    const translations = await import(`../../public/locales/${locale}.json`);
    return translations.default || translations;
  } catch (error) {
    console.warn(`Failed to load translations for locale '${locale}':`, error);
    return {};
  }
}

/**
 * Initialize the i18n system with a specific locale
 *
 * @param locale - Locale code to initialize (defaults to stored or default locale)
 * @returns Promise resolving when locale is loaded and activated
 */
export async function initializeI18n(locale?: LocaleCode): Promise<LocaleCode> {
  const targetLocale = locale || getStoredLocale();
  const normalizedLocale = normalizeLocale(targetLocale) as LocaleCode;

  try {
    // Load translations for non-English locales
    if (normalizedLocale !== 'en') {
      const translations = await loadTranslations(normalizedLocale);
      // Note: addLocale and useLocale are from ttag library, not React hooks
      // They are called at module initialization, not during render
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addLocale(normalizedLocale, translations as any);
    }

    // Activate the locale
    // Note: This is ttag's useLocale function, not a React hook
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLocale(normalizedLocale);

    // Save preference
    saveLocale(normalizedLocale);

    return normalizedLocale;
  } catch (error) {
    console.error(`Failed to initialize locale '${normalizedLocale}':`, error);

    // Fallback to English on error
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLocale(DEFAULT_LOCALE);
    return DEFAULT_LOCALE;
  }
}

/**
 * Switch to a different locale at runtime
 *
 * @param locale - Locale code to switch to
 * @returns Promise resolving when locale is loaded and activated
 */
export async function switchLocale(locale: LocaleCode): Promise<void> {
  const normalizedLocale = normalizeLocale(locale) as LocaleCode;

  if (!isValidLocale(normalizedLocale)) {
    throw new Error(`Invalid locale: ${normalizedLocale}`);
  }

  await initializeI18n(normalizedLocale);
}

/**
 * Get locale name in the target language
 * This is used to display locale options to users
 *
 * @param locale - Locale code
 * @returns Localized name of the locale
 */
export function getLocaleName(locale: LocaleCode): string {
  const localeInfo = AVAILABLE_LOCALES.find(l => l.code === locale);
  return localeInfo?.name || locale;
}
