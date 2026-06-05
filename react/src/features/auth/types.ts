/**
 * Authentication and Authorization Types
 * 
 * These types define the structure for user identity, authentication state,
 * and RBAC (Role-Based Access Control) functionality.
 */

/**
 * User identity information from the ManageIQ API
 */
export interface UserIdentity {
  /** User's unique identifier */
  id?: string;
  /** User's name */
  name?: string;
  /** User's email address */
  email?: string;
  /** User's role (e.g., 'admin', 'user', 'operator') */
  role?: string;
  /** User's group */
  group?: string;
  /** User's tenant */
  tenant?: string;
  /** Additional user properties */
  [key: string]: unknown;
}

/**
 * Authorization data containing user permissions and features
 */
export interface Authorization {
  /** User identity information */
  identity: UserIdentity | null;
  /** Product features available to the user (feature_id -> feature_data) */
  product_features: Record<string, unknown>;
  /** User's role information */
  role?: string;
  /** User's group information */
  group?: string;
  /** Additional authorization properties */
  [key: string]: unknown;
}

/**
 * Authentication credentials for login
 */
export interface LoginCredentials {
  /** Username */
  username: string;
  /** Password */
  password: string;
}

/**
 * OIDC authentication parameters
 */
export interface OIDCParams {
  /** OIDC provider */
  provider?: string;
  /** OIDC token */
  token?: string;
  /** Additional OIDC parameters */
  [key: string]: unknown;
}

/**
 * Authentication response from the API
 */
export interface AuthResponse {
  /** Authentication token */
  auth_token: string;
  /** Token expiration time */
  expires_on?: string;
  /** User identity */
  identity?: UserIdentity;
  /** Authorization data */
  authorization?: Authorization;
}

/**
 * Session data stored in the application
 */
export interface SessionData {
  /** Authentication token */
  token: string | null;
  /** User identity */
  identity: UserIdentity | null;
  /** Product features available to the user */
  features: Record<string, unknown>;
  /** Token expiration time */
  expiresOn?: string;
}

/**
 * Authentication state in Redux store
 */
export interface AuthState {
  /** Current session data */
  session: SessionData;
  /** Whether authentication is in progress */
  loading: boolean;
  /** Authentication error message */
  error: string | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * RBAC state in Redux store
 */
export interface RBACState {
  /** User identity */
  identity: UserIdentity | null;
  /** Product features available to the user */
  features: Record<string, unknown>;
  /** Whether RBAC data is loading */
  loading: boolean;
}

/**
 * Permission check result
 */
export interface PermissionCheck {
  /** Whether the permission check passed */
  allowed: boolean;
  /** Reason for denial (if not allowed) */
  reason?: string;
}

/**
 * Feature permission identifiers
 * These correspond to ManageIQ product features
 */
export type FeatureId = string;

/**
 * Role identifiers
 */
export type RoleId = string;
