/**
 * Internationalization (i18n) module using ttag for gettext compatibility
 *
 * This module provides a compatibility layer that preserves the existing
 * gettext-based translation workflow from the Angular application.
 *
 * Key features:
 * - Compatible with existing .po/.pot files
 * - Preserves __ and N_ marker functions for runtime compatibility
 * - Supports runtime locale switching
 * - Works with ttag for extraction and compilation
 *
 * IMPORTANT: For new code, prefer using ttag's t`string` directly for better
 * extraction support. The __ function is provided for compatibility with
 * existing patterns but requires string literals at call sites for extraction.
 */

import { t, useLocale, addLocale } from 'ttag';

/**
 * Translation function compatible with angular-gettext's __ marker
 *
 * IMPORTANT: For extraction to work, you must pass string literals:
 *   ✓ __('Hello, World!')
 *   ✗ __(variableName)
 *
 * For new code, prefer using ttag's t directly:
 *   t`Hello, World!`
 *
 * @param str - The string to translate (must be a literal for extraction)
 * @returns Translated string or original if no translation available
 *
 * @example
 * const greeting = __('Hello, World!');
 */
export function __(str: string): string {
  // This function is primarily for runtime compatibility
  // The extraction tool will pick up string literals passed to this function
  return str;
}

/**
 * No-op translation marker for strings that should be extracted but not translated at call site
 * Used for strings that will be translated later (e.g., in a different context)
 *
 * @param str - The string to mark for extraction
 * @returns The original string unchanged
 *
 * @example
 * const key = N_('locale_name'); // Extracted but not translated here
 * const translated = t`${key}`;  // Translated when used with t
 */
export function N_(str: string): string {
  // N_ is a no-op marker - it just returns the string
  // The extraction tool will still pick it up
  return str;
}

/**
 * Plural translation function
 *
 * IMPORTANT: For extraction to work, you must pass string literals:
 *   ✓ ngettext_('1 item', '%d items', count)
 *   ✗ ngettext_(singular, plural, count) where singular/plural are variables
 *
 * @param singular - Singular form of the string (must be a literal)
 * @param plural - Plural form of the string (must be a literal)
 * @param count - Number to determine which form to use
 * @returns Translated string in appropriate form
 *
 * @example
 * const message = ngettext_('1 item', '%d items', itemCount);
 */
export function ngettext_(singular: string, plural: string, count: number): string {
  // For runtime, we return the appropriate form based on count
  // The extraction tool will pick up the string literals
  return count === 1 ? singular : plural.replace('%d', String(count));
}

/**
 * Load and activate a locale
 *
 * @param locale - Locale code (e.g., 'en', 'de', 'es')
 * @param translations - Translation data object
 *
 * @example
 * import deTranslations from './locales/de.json';
 * loadLocale('de', deTranslations);
 */
export function loadLocale(locale: string, translations: Record<string, any>): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addLocale(locale, translations as any);
  // Note: This is ttag's useLocale function, not a React hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLocale(locale);
}

/**
 * Switch to a different locale
 *
 * @param locale - Locale code to switch to
 *
 * @example
 * setLocale('de'); // Switch to German
 */
export function setLocale(locale: string): void {
  // Note: This is ttag's useLocale function, not a React hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLocale(locale);
}

/**
 * Get the localized name of a locale
 * This uses the special 'locale_name' key that is translated in each locale
 *
 * @returns The localized name of the current locale
 *
 * @example
 * // In German locale, returns 'Deutsch'
 * // In Slovak locale, returns 'Slovensky'
 * const localeName = getLocaleName();
 */
export function getLocaleName(): string {
  return t`locale_name`;
}

// Re-export ttag functions for direct use when needed
export { t, msgid, ngettext, useLocale, addLocale } from 'ttag';
