import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';

/**
 * Formats a date string or Date object to a standard display format
 * @param date - Date string (ISO 8601) or Date object
 * @param formatString - Optional format string (defaults to 'MMM d, yyyy h:mm a')
 * @returns Formatted date string or empty string if invalid
 */
export const formatDate = (
  date: string | Date | null | undefined,
  formatString: string = 'MMM d, yyyy h:mm a'
): string => {
  if (!date) {
    return '';
  }

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return '';
    }

    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Formats a date to a short format (e.g., "Jan 15, 2024")
 */
export const formatDateShort = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'MMM d, yyyy');
};

/**
 * Formats a date to a long format (e.g., "January 15, 2024 at 3:45 PM")
 */
export const formatDateLong = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'MMMM d, yyyy \'at\' h:mm a');
};

/**
 * Formats a date to show only time (e.g., "3:45 PM")
 */
export const formatTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'h:mm a');
};

/**
 * Formats a date to ISO 8601 format
 */
export const formatDateISO = (date: string | Date | null | undefined): string => {
  return formatDate(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

/**
 * Formats a date as relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date string (ISO 8601) or Date object
 * @param baseDate - Optional base date to compare against (defaults to now)
 * @returns Relative time string or empty string if invalid
 */
export const formatRelativeTime = (
  date: string | Date | null | undefined,
  baseDate?: Date
): string => {
  if (!date) {
    return '';
  }

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return '';
    }

    return formatDistance(dateObj, baseDate || new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

/**
 * Formats a date relative to now (e.g., "yesterday at 3:45 PM", "tomorrow at 10:00 AM")
 */
export const formatRelativeDate = (
  date: string | Date | null | undefined,
  baseDate?: Date
): string => {
  if (!date) {
    return '';
  }

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return '';
    }

    return formatRelative(dateObj, baseDate || new Date());
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return '';
  }
};

/**
 * Formats a duration in milliseconds to a human-readable string
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted duration string (e.g., "2h 30m", "45s")
 */
export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 0) {
    return '0s';
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  return `${seconds}s`;
};

/**
 * Parses an ISO 8601 date string to a Date object
 * @param dateString - ISO 8601 date string
 * @returns Date object or null if invalid
 */
export const parseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) {
    return null;
  }

  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Checks if a date string or Date object is valid
 */
export const isValidDate = (date: string | Date | null | undefined): boolean => {
  if (!date) {
    return false;
  }

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  } catch {
    return false;
  }
};

/**
 * Gets the current date/time as an ISO 8601 string
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString();
};

/**
 * Formats a date for display in tables (consistent format across the app)
 */
export const formatTableDate = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'MMM d, yyyy h:mm a');
};

/**
 * Formats a date for display in forms (ISO date format for input[type="date"])
 */
export const formatFormDate = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'yyyy-MM-dd');
};

/**
 * Formats a datetime for display in forms (ISO datetime format for input[type="datetime-local"])
 */
export const formatFormDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, "yyyy-MM-dd'T'HH:mm");
};
