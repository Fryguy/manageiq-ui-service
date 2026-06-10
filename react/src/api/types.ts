/**
 * Common API types for ManageIQ REST API
 *
 * These types represent the structure of API responses from the ManageIQ REST API.
 * They are based on the actual API payloads and should be validated against real responses.
 */

/**
 * Generic collection response structure
 */
export interface CollectionResponse<T> {
  name: string;
  count: number;
  subcount: number;
  pages?: number;
  resources: T[];
  actions?: Action[];
  links?: Links;
}

/**
 * Generic resource response structure
 */
export interface ResourceResponse {
  href: string;
  id: string;
  [key: string]: unknown;
}

/**
 * Action definition in API responses
 */
export interface Action {
  name: string;
  method: string;
  href: string;
}

/**
 * Links in collection responses
 */
export interface Links {
  self: string;
  first?: string;
  last?: string;
  next?: string;
  previous?: string;
}

/**
 * Query parameters for collection requests
 */
export interface QueryParams {
  expand?: string | string[];
  attributes?: string | string[];
  filter?: string[];
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
  [key: string]: unknown;
}

/**
 * Action request payload
 */
export interface ActionRequest {
  action: string;
  resource?: Record<string, unknown>;
  resources?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

/**
 * Action response
 */
export interface ActionResponse {
  success: boolean;
  message?: string;
  task_id?: string;
  task_href?: string;
  results?: unknown[];
  [key: string]: unknown;
}

/**
 * Error response structure
 */
export interface ApiError {
  error: {
    kind: string;
    message: string;
    klass: string;
  };
}

/**
 * Authorization data structure
 */
export interface Authorization {
  product_features: Record<string, unknown>;
  identity: {
    userid: string;
    name: string;
    user_href: string;
    group: string;
    group_href: string;
    role: string;
    role_href: string;
    tenant: string;
    groups: string[];
  };
}

/**
 * Session data structure
 */
export interface SessionData {
  auth_token: string;
  expires_on?: string;
  authorization?: Authorization;
}

/**
 * Tag structure
 */
export interface Tag {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    description?: string;
  };
}

/**
 * Generic resource with common fields
 */
export interface BaseResource {
  id: string;
  href: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  tags?: Tag[];
}
