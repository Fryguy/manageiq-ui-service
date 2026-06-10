/**
 * Profile feature type definitions
 */

export interface UserProfile {
  id: string;
  name: string;
  userid: string;
  email?: string;
  group?: {
    id: string;
    description: string;
  };
  role?: {
    id: string;
    name: string;
  };
  current_group?: {
    id: string;
    description: string;
  };
  settings?: UserSettings;
}

export interface UserSettings {
  locale?: string;
  timezone?: string;
  display?: {
    theme?: string;
    density?: 'compact' | 'normal' | 'comfortable';
  };
  notifications?: {
    email?: boolean;
    browser?: boolean;
  };
}

export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateError: string | null;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  settings?: Partial<UserSettings>;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}
