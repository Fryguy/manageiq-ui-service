import { getApiClient } from './client';
import { CollectionResponse, QueryParams, ActionRequest, ActionResponse, BaseResource } from './types';

/**
 * Services API endpoints
 *
 * Based on the Angular implementation in:
 * - client/app/services/services-state.service.js
 * - client/app/core/collections-api.factory.js
 */

/**
 * Service resource structure
 */
export interface Service extends BaseResource {
  type: string;
  description?: string;
  ancestry?: string;
  display?: boolean;
  evm_owner_id?: string;
  evm_owner_name?: string;
  miq_group_id?: string;
  miq_group_description?: string;
  service_template_id?: string;
  service_template_name?: string;
  tenant_id?: string;
  retired?: boolean;
  retirement_state?: string;
  retirement_warn?: number;
  retires_on?: string;
  retired_on?: string;
  power_state?: string;
  power_status?: string;
  orchestration_stack_id?: string;
  orchestration_stack_name?: string;
  options?: Record<string, unknown>;
  custom_actions?: CustomAction[];
  custom_action_buttons?: CustomActionButton[];
  vms?: VM[];
  all_vms?: VM[];
  generic_objects?: GenericObject[];
  service_resources?: ServiceResource[];
  actions?: Array<{ name: string; method: string; href: string }>;
}

/**
 * Custom action definition
 */
export interface CustomAction {
  button_id: string;
  button_label: string;
  button_icon?: string;
  button_color?: string;
  dialog_id?: string;
  open_url?: boolean;
  target_id?: string;
  resource_action?: {
    action: string;
    dialog_id?: string;
  };
}

/**
 * Custom action button
 */
export interface CustomActionButton {
  id: string;
  name: string;
  description?: string;
  applies_to_class?: string;
  visibility?: Record<string, unknown>;
  enablement?: Record<string, unknown>;
  resource_action?: {
    action: string;
    dialog_id?: string;
  };
}

/**
 * VM resource
 */
export interface VM extends BaseResource {
  uid_ems?: string;
  ems_id?: string;
  vendor?: string;
  raw_power_state?: string;
  power_state?: string;
  connection_state?: string;
  cpu_total_cores?: number;
  cpu_cores_per_socket?: number;
  cpu_sockets?: number;
  memory_mb?: number;
  disk_capacity?: number;
  operating_system?: {
    product_name?: string;
    product_type?: string;
  };
  ipaddresses?: string[];
  hostnames?: string[];
  snapshots?: Snapshot[];
}

/**
 * Snapshot resource
 */
export interface Snapshot extends BaseResource {
  uid?: string;
  parent_id?: string;
  description?: string;
  current?: boolean;
  total_size?: number;
  create_time?: string;
}

/**
 * Generic object resource
 */
export interface GenericObject extends BaseResource {
  generic_object_definition_id?: string;
  generic_object_definition_name?: string;
  property_attributes?: Record<string, unknown>;
}

/**
 * Service resource relationship
 */
export interface ServiceResource {
  id: string;
  resource_id: string;
  resource_type: string;
  resource?: VM | Service;
}

/**
 * Power operation types
 */
export type PowerOperation = 'start' | 'stop' | 'suspend' | 'shutdown_guest' | 'reboot_guest' | 'reset';

/**
 * Services API
 */
export const servicesApi = {
  /**
   * Get services collection
   * GET /api/services
   */
  async getServices(params?: QueryParams): Promise<CollectionResponse<Service>> {
    const client = getApiClient();
    return client.get<CollectionResponse<Service>>('/services', { params });
  },

  /**
   * Get a single service by ID
   * GET /api/services/:id
   */
  async getService(id: string, params?: QueryParams): Promise<Service> {
    const client = getApiClient();
    return client.get<Service>(`/services/${id}`, { params });
  },

  /**
   * Execute a power operation on a service
   * POST /api/services/:id
   */
  async powerOperation(id: string, operation: PowerOperation): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/services/${id}`, {
      action: operation,
    });
  },

  /**
   * Retire a service
   * POST /api/services/:id
   */
  async retireService(id: string, date?: string): Promise<ActionResponse> {
    const client = getApiClient();
    const payload: ActionRequest = {
      action: 'retire',
    };
    if (date) {
      payload.date = date;
    }
    return client.post<ActionResponse>(`/services/${id}`, payload);
  },

  /**
   * Retire services immediately
   * POST /api/services
   */
  async retireServicesNow(serviceIds: string[]): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>('/services', {
      action: 'retire',
      resources: serviceIds.map((id) => ({ href: `/api/services/${id}` })),
    });
  },

  /**
   * Edit a service
   * POST /api/services/:id
   */
  async editService(id: string, data: Partial<Service>): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/services/${id}`, {
      action: 'edit',
      resource: data,
    });
  },

  /**
   * Reconfigure a service
   * POST /api/services/:id
   */
  async reconfigureService(id: string, dialogData: Record<string, unknown>): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/services/${id}`, {
      action: 'reconfigure',
      resource: dialogData,
    });
  },

  /**
   * Set ownership of a service
   * POST /api/services/:id
   */
  async setOwnership(id: string, owner?: string, group?: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/services/${id}`, {
      action: 'set_ownership',
      resource: {
        owner: owner ? { id: owner } : undefined,
        group: group ? { id: group } : undefined,
      },
    });
  },

  /**
   * Execute a custom button action
   * POST /api/services/:id
   */
  async executeCustomButton(
    id: string,
    buttonId: string,
    dialogData?: Record<string, unknown>
  ): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/services/${id}`, {
      action: 'custom_button',
      button_id: buttonId,
      resource: dialogData,
    });
  },

  /**
   * Add tags to a service
   * POST /api/services/:id/tags
   */
  async addTags(id: string, tags: Array<{ category: string; name: string }>): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/services/${id}/tags`, {
      action: 'assign',
      resources: tags.map((tag) => ({
        category: tag.category,
        name: tag.name,
      })),
    });
  },

  /**
   * Remove tags from a service
   * POST /api/services/:id/tags
   */
  async removeTags(id: string, tags: Array<{ category: string; name: string }>): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/services/${id}/tags`, {
      action: 'unassign',
      resources: tags.map((tag) => ({
        category: tag.category,
        name: tag.name,
      })),
    });
  },

  /**
   * Delete a service
   * DELETE /api/services/:id
   */
  async deleteService(id: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.delete<ActionResponse>(`/services/${id}`);
  },

  /**
   * Delete multiple services
   * POST /api/services
   */
  async deleteServices(serviceIds: string[]): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>('/services', {
      action: 'delete',
      resources: serviceIds.map((id) => ({ href: `/api/services/${id}` })),
    });
  },
};
