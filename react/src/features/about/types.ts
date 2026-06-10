/**
 * Types for the about feature
 */

export interface AppInfo {
  version?: string;
  buildDate?: string;
  gitCommit?: string;
  licenseName?: string;
  licenseUrl?: string;
  copyrightYear?: string;
  copyrightHolder?: string;
}

export interface AboutState {
  appInfo: AppInfo | null;
  loading: boolean;
  error: string | null;
}
