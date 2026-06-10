import {
  formatDate,
  formatDateShort,
  formatDateLong,
  formatTime,
  formatDateISO,
  formatRelativeTime,
  formatRelativeDate,
  formatDuration,
  parseDate,
  isValidDate,
  getCurrentDateISO,
  formatTableDate,
  formatFormDate,
  formatFormDateTime,
} from './dateFormatting';

describe('dateFormatting', () => {
  const testDate = '2024-01-15T15:45:30Z';
  const testDateObj = new Date(testDate);

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const result = formatDate(testDate);
      expect(result).toMatch(/Jan 15, 2024/);
    });

    it('should format date with custom format', () => {
      const result = formatDate(testDate, 'yyyy-MM-dd');
      expect(result).toBe('2024-01-15');
    });

    it('should handle Date objects', () => {
      const result = formatDate(testDateObj, 'yyyy-MM-dd');
      expect(result).toBe('2024-01-15');
    });

    it('should return empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(formatDate(undefined)).toBe('');
    });

    it('should return empty string for invalid date', () => {
      expect(formatDate('invalid')).toBe('');
    });
  });

  describe('formatDateShort', () => {
    it('should format date in short format', () => {
      const result = formatDateShort(testDate);
      expect(result).toBe('Jan 15, 2024');
    });
  });

  describe('formatDateLong', () => {
    it('should format date in long format', () => {
      const result = formatDateLong(testDate);
      expect(result).toMatch(/January 15, 2024 at/);
    });
  });

  describe('formatTime', () => {
    it('should format time only', () => {
      const result = formatTime(testDate);
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });
  });

  describe('formatDateISO', () => {
    it('should format date in ISO format', () => {
      const result = formatDateISO(testDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time for past dates', () => {
      const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const result = formatRelativeTime(pastDate.toISOString());
      expect(result).toMatch(/ago/);
    });

    it('should format relative time for future dates', () => {
      const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
      const result = formatRelativeTime(futureDate.toISOString());
      expect(result).toMatch(/in/);
    });

    it('should return empty string for null', () => {
      expect(formatRelativeTime(null)).toBe('');
    });

    it('should handle custom base date', () => {
      const baseDate = new Date('2024-01-15T12:00:00Z');
      const result = formatRelativeTime(testDate, baseDate);
      // testDate is 15:45:30, baseDate is 12:00:00, so testDate is in the future
      expect(result).toMatch(/in|about/);
    });
  });

  describe('formatRelativeDate', () => {
    it('should format relative date', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const result = formatRelativeDate(yesterday.toISOString());
      expect(result).toMatch(/yesterday/i);
    });

    it('should return empty string for null', () => {
      expect(formatRelativeDate(null)).toBe('');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds', () => {
      expect(formatDuration(5000)).toBe('5s');
    });

    it('should format minutes', () => {
      expect(formatDuration(90000)).toBe('1m 30s');
    });

    it('should format hours', () => {
      expect(formatDuration(3600000)).toBe('1h');
    });

    it('should format hours and minutes', () => {
      expect(formatDuration(5400000)).toBe('1h 30m');
    });

    it('should format days', () => {
      expect(formatDuration(86400000)).toBe('1d');
    });

    it('should format days and hours', () => {
      expect(formatDuration(90000000)).toBe('1d 1h');
    });

    it('should handle zero', () => {
      expect(formatDuration(0)).toBe('0s');
    });

    it('should handle negative values', () => {
      expect(formatDuration(-1000)).toBe('0s');
    });
  });

  describe('parseDate', () => {
    it('should parse valid ISO date string', () => {
      const result = parseDate(testDate);
      expect(result).toBeInstanceOf(Date);
      // Allow for milliseconds in the ISO string
      expect(result?.toISOString()).toMatch(/^2024-01-15T15:45:30/);
    });

    it('should return null for invalid date string', () => {
      expect(parseDate('invalid')).toBeNull();
    });

    it('should return null for null', () => {
      expect(parseDate(null)).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(parseDate(undefined)).toBeNull();
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date string', () => {
      expect(isValidDate(testDate)).toBe(true);
    });

    it('should return true for valid Date object', () => {
      expect(isValidDate(testDateObj)).toBe(true);
    });

    it('should return false for invalid date string', () => {
      expect(isValidDate('invalid')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidDate(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidDate(undefined)).toBe(false);
    });
  });

  describe('getCurrentDateISO', () => {
    it('should return current date in ISO format', () => {
      const result = getCurrentDateISO();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('formatTableDate', () => {
    it('should format date for table display', () => {
      const result = formatTableDate(testDate);
      expect(result).toMatch(/Jan 15, 2024/);
    });
  });

  describe('formatFormDate', () => {
    it('should format date for form input', () => {
      const result = formatFormDate(testDate);
      expect(result).toBe('2024-01-15');
    });
  });

  describe('formatFormDateTime', () => {
    it('should format datetime for form input', () => {
      const result = formatFormDateTime(testDate);
      expect(result).toMatch(/^2024-01-15T\d{2}:\d{2}$/);
    });
  });
});