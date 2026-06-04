import { getApiClient } from './client';
import { CollectionResponse, QueryParams, ActionRequest, ActionResponse, BaseResource } from './types';

/**
 * Catalogs API endpoints
 *
 * Based on the Angular implementation in:
 * - client/app/catalogs/catalogs-state.service.js
 * - client/app/core/collections-api.factory.js
 */

/**
 * Service catalog resource
 */
export interface ServiceCatalog extends BaseResource {
  description?: string;
  service_templates?: ServiceTemplate[];
}

/**
 * Service template resource
 */
export interface ServiceTemplate extends BaseResource {
  type: string;
  description?: string;
  long_description?: string;
  service_template_catalog_id?: string;
  service_template_catalog_name?: string;
  display?: boolean;
  picture?: {
    id: string;
    resource_id: string;
    image_href: string;
  };
  resource_actions?: ResourceAction[];
  service_type?: string;
  prov_type?: string;
  provision_cost?: number;
  currency?: string;
  price?: string;
  config_info?: Record<string, unknown>;
  tenant_id?: string;
  generic_subtype?: string;
}

/**
 * Resource action (e.g., Provision, Reconfigure)
 */
export interface ResourceAction {
  id: string;
  action: string;
  dialog_id?: string;
  dialog?: Dialog;
  fqname?: string;
}

/**
 * Dialog structure for service ordering
 */
export interface Dialog {
  id: string;
  label: string;
  description?: string;
  dialog_tabs?: DialogTab[];
  content?: DialogField[];
}

/**
 * Dialog tab
 */
export interface DialogTab {
  id: string;
  label: string;
  description?: string;
  position?: number;
  dialog_groups?: DialogGroup[];
}

/**
 * Dialog group
 */
export interface DialogGroup {
  id: string;
  label: string;
  description?: string;
  position?: number;
  dialog_fields?: DialogField[];
}

/**
 * Dialog field
 */
export interface DialogField {
  id: string;
  name: string;
  label: string;
  description?: string;
  type: string;
  data_type?: string;
  display?: string;
  display_method_options?: Record<string, unknown>;
  required?: boolean;
  required_method_options?: Record<string, unknown>;
  default_value?: unknown;
  values?: Array<[string, string]>;
  values_method_options?: Record<string, unknown>;
  options?: Record<string, unknown>;
  validator_type?: string;
  validator_rule?: string;
  reconfigurable?: boolean;
  visible?: boolean;
  read_only?: boolean;
  position?: number;
  dynamic?: boolean;
  show_refresh_button?: boolean;
  load_values_on_init?: boolean;
  auto_refresh?: boolean;
  trigger_auto_refresh?: boolean;
}

/**
 * Service request (order)
 */
export interface ServiceRequest extends BaseResource {
  description?: string;
  approval_state?: string;
  type?: string;
  request_type?: string;
  request_state?: string;
  status?: string;
  options?: Record<string, unknown>;
  userid?: string;
  source_id?: string;
  source_type?: string;
  created_on?: string;
  updated_on?: string;
  fulfilled_on?: string;
  requester_name?: string;
  request_task_id?: string;
  miq_request_tasks?: RequestTask[];
}

/**
 * Request task
 */
export interface RequestTask {
  id: string;
  description?: string;
  state?: string;
  status?: string;
  message?: string;
  created_on?: string;
  updated_on?: string;
}

/**
 * Shopping cart item
 */
export interface CartItem {
  service_template_id: string;
  service_template: ServiceTemplate;
  data: Record<string, unknown>;
  quantity?: number;
}

/**
 * Catalogs API
 */
export const catalogsApi = {
  /**
   * Get service catalogs collection
   * GET /api/service_catalogs
   */
  async getServiceCatalogs(params?: QueryParams): Promise<CollectionResponse<ServiceCatalog>> {
    const client = getApiClient();
    return client.get<CollectionResponse<ServiceCatalog>>('/service_catalogs', { params });
  },

  /**
   * Get a single service catalog by ID
   * GET /api/service_catalogs/:id
   */
  async getServiceCatalog(id: string, params?: QueryParams): Promise<ServiceCatalog> {
    const client = getApiClient();
    return client.get<ServiceCatalog>(`/service_catalogs/${id}`, { params });
  },

  /**
   * Get service templates collection
   * GET /api/service_templates
   */
  async getServiceTemplates(params?: QueryParams): Promise<CollectionResponse<ServiceTemplate>> {
    const client = getApiClient();
    return client.get<CollectionResponse<ServiceTemplate>>('/service_templates', { params });
  },

  /**
   * Get a single service template by ID
   * GET /api/service_templates/:id
   */
  async getServiceTemplate(id: string, params?: QueryParams): Promise<ServiceTemplate> {
    const client = getApiClient();
    return client.get<ServiceTemplate>(`/service_templates/${id}`, { params });
  },

  /**
   * Get service template dialog
   * GET /api/service_templates/:id/service_dialogs/:dialog_id
   */
  async getServiceDialog(templateId: string, dialogId: string): Promise<Dialog> {
    const client = getApiClient();
    return client.get<Dialog>(`/service_templates/${templateId}/service_dialogs/${dialogId}`);
  },

  /**
   * Refresh dialog fields (for dynamic fields)
   * POST /api/service_dialogs/:dialog_id
   */
  async refreshDialogFields(
    dialogId: string,
    fields: Record<string, unknown>,
    resourceActionId?: string
  ): Promise<Dialog> {
    const client = getApiClient();
    return client.post<Dialog>(`/service_dialogs/${dialogId}`, {
      action: 'refresh_dialog_fields',
      resource: {
        dialog_fields: fields,
        resource_action_id: resourceActionId,
      },
    });
  },

  /**
   * Order a service template
   * POST /api/service_catalogs/:catalog_id/service_templates
   */
  async orderServiceTemplate(
    catalogId: string,
    templateId: string,
    dialogData: Record<string, unknown>
  ): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/service_catalogs/${catalogId}/service_templates`, {
      action: 'order',
      resource: {
        href: `/api/service_templates/${templateId}`,
        ...dialogData,
      },
    });
  },

  /**
   * Order multiple service templates (shopping cart checkout)
   * POST /api/service_catalogs/:catalog_id/service_templates
   */
  async orderMultipleServiceTemplates(
    catalogId: string,
    items: Array<{ templateId: string; dialogData: Record<string, unknown> }>
  ): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/service_catalogs/${catalogId}/service_templates`, {
      action: 'order',
      resources: items.map((item) => ({
        href: `/api/service_templates/${item.templateId}`,
        ...item.dialogData,
      })),
    });
  },

  /**
   * Get service requests (orders)
   * GET /api/service_requests
   */
  async getServiceRequests(params?: QueryParams): Promise<CollectionResponse<ServiceRequest>> {
    const client = getApiClient();
    return client.get<CollectionResponse<ServiceRequest>>('/service_requests', { params });
  },

  /**
   * Get a single service request by ID
   * GET /api/service_requests/:id
   */
  async getServiceRequest(id: string, params?: QueryParams): Promise<ServiceRequest> {
    const client = getApiClient();
    return client.get<ServiceRequest>(`/service_requests/${id}`, { params });
  },

  /**
   * Approve a service request
   * POST /api/service_requests/:id
   */
  async approveServiceRequest(id: string, reason?: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/service_requests/${id}`, {
      action: 'approve',
      reason,
    });
  },

  /**
   * Deny a service request
   * POST /api/service_requests/:id
   */
  async denyServiceRequest(id: string, reason?: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/service_requests/${id}`, {
      action: 'deny',
      reason,
    });
  },

  /**
   * Add a request task
   * POST /api/service_requests/:id/request_tasks
   */
  async addRequestTask(requestId: string, options: Record<string, unknown>): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/service_requests/${requestId}/request_tasks`, {
      action: 'create',
      resource: options,
    });
  },
};
