import { getApiClient } from './client';
import { CollectionResponse, QueryParams, ActionResponse, BaseResource } from './types';
import { VM, Snapshot, PowerOperation } from './services';

/**
 * VMs API endpoints
 *
 * Based on the Angular implementation in:
 * - client/app/states/vms/vms-state.service.js
 * - client/app/core/collections-api.factory.js
 */

/**
 * Console type
 */
export type ConsoleType = 'vnc' | 'spice' | 'webmks';

/**
 * Console connection info
 */
export interface ConsoleConnection {
  type: ConsoleType;
  url: string;
  proxy_url?: string;
  secret?: string;
  ticket?: string;
}

/**
 * VMs API
 */
export const vmsApi = {
  /**
   * Get VMs collection
   * GET /api/vms
   */
  async getVMs(params?: QueryParams): Promise<CollectionResponse<VM>> {
    const client = getApiClient();
    return client.get<CollectionResponse<VM>>('/vms', { params });
  },

  /**
   * Get a single VM by ID
   * GET /api/vms/:id
   */
  async getVM(id: string, params?: QueryParams): Promise<VM> {
    const client = getApiClient();
    return client.get<VM>(`/vms/${id}`, { params });
  },

  /**
   * Execute a power operation on a VM
   * POST /api/vms/:id
   */
  async powerOperation(id: string, operation: PowerOperation): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/vms/${id}`, {
      action: operation,
    });
  },

  /**
   * Retire a VM
   * POST /api/vms/:id
   */
  async retireVM(id: string, date?: string): Promise<ActionResponse> {
    const client = getApiClient();
    const payload: { action: string; date?: string } = {
      action: 'retire',
    };
    if (date) {
      payload.date = date;
    }
    return client.post<ActionResponse>(`/vms/${id}`, payload);
  },

  /**
   * Set ownership of a VM
   * POST /api/vms/:id
   */
  async setOwnership(id: string, owner?: string, group?: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/vms/${id}`, {
      action: 'set_ownership',
      resource: {
        owner: owner ? { id: owner } : undefined,
        group: group ? { id: group } : undefined,
      },
    });
  },

  /**
   * Get VM snapshots
   * GET /api/vms/:id/snapshots
   */
  async getSnapshots(vmId: string, params?: QueryParams): Promise<CollectionResponse<Snapshot>> {
    const client = getApiClient();
    return client.get<CollectionResponse<Snapshot>>(`/vms/${vmId}/snapshots`, { params });
  },

  /**
   * Create a VM snapshot
   * POST /api/vms/:id/snapshots
   */
  async createSnapshot(vmId: string, name: string, description?: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/vms/${vmId}/snapshots`, {
      action: 'create',
      resource: {
        name,
        description,
      },
    });
  },

  /**
   * Revert to a snapshot
   * POST /api/vms/:vm_id/snapshots/:id
   */
  async revertSnapshot(vmId: string, snapshotId: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/vms/${vmId}/snapshots/${snapshotId}`, {
      action: 'revert',
    });
  },

  /**
   * Delete a snapshot
   * DELETE /api/vms/:vm_id/snapshots/:id
   */
  async deleteSnapshot(vmId: string, snapshotId: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.delete<ActionResponse>(`/vms/${vmId}/snapshots/${snapshotId}`);
  },

  /**
   * Get console connection info
   * POST /api/vms/:id
   */
  async getConsoleConnection(id: string, consoleType: ConsoleType): Promise<ConsoleConnection> {
    const client = getApiClient();
    const response = await client.post<ActionResponse>(`/vms/${id}`, {
      action: 'request_console',
      resource: {
        console_type: consoleType,
      },
    });
    // The actual response structure may vary; adjust based on real API behavior
    return response as unknown as ConsoleConnection;
  },

  /**
   * Add tags to a VM
   * POST /api/vms/:id/tags
   */
  async addTags(id: string, tags: Array<{ category: string; name: string }>): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/vms/${id}/tags`, {
      action: 'assign',
      resources: tags.map((tag) => ({
        category: tag.category,
        name: tag.name,
      })),
    });
  },

  /**
   * Remove tags from a VM
   * POST /api/vms/:id/tags
   */
  async removeTags(id: string, tags: Array<{ category: string; name: string }>): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/vms/${id}/tags`, {
      action: 'unassign',
      resources: tags.map((tag) => ({
        category: tag.category,
        name: tag.name,
      })),
    });
  },

  /**
   * Delete a VM
   * DELETE /api/vms/:id
   */
  async deleteVM(id: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.delete<ActionResponse>(`/vms/${id}`);
  },
};
