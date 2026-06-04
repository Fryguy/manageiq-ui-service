import { getApiClient } from './client';
import { CollectionResponse, QueryParams, ActionResponse } from './types';
import { ServiceRequest, RequestTask } from './catalogs';

/**
 * Orders API endpoints
 *
 * Orders in ManageIQ are represented as service_requests.
 * This module provides a simplified interface for order management.
 *
 * Based on the Angular implementation in:
 * - client/app/orders/orders-state.service.js
 * - client/app/core/collections-api.factory.js
 */

/**
 * Order (alias for ServiceRequest)
 */
export type Order = ServiceRequest;

/**
 * Order filter options
 */
export interface OrderFilters {
  state?: string;
  approval_state?: string;
  type?: string;
  created_on?: string;
  userid?: string;
}

/**
 * Orders API
 */
export const ordersApi = {
  /**
   * Get orders (service requests) collection
   * GET /api/service_requests
   */
  async getOrders(params?: QueryParams): Promise<CollectionResponse<Order>> {
    const client = getApiClient();
    return client.get<CollectionResponse<Order>>('/service_requests', { params });
  },

  /**
   * Get a single order by ID
   * GET /api/service_requests/:id
   */
  async getOrder(id: string, params?: QueryParams): Promise<Order> {
    const client = getApiClient();
    return client.get<Order>(`/service_requests/${id}`, { params });
  },

  /**
   * Get order tasks
   * GET /api/service_requests/:id/request_tasks
   */
  async getOrderTasks(orderId: string, params?: QueryParams): Promise<CollectionResponse<RequestTask>> {
    const client = getApiClient();
    return client.get<CollectionResponse<RequestTask>>(`/service_requests/${orderId}/request_tasks`, { params });
  },

  /**
   * Approve an order
   * POST /api/service_requests/:id
   */
  async approveOrder(id: string, reason?: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/service_requests/${id}`, {
      action: 'approve',
      reason,
    });
  },

  /**
   * Deny an order
   * POST /api/service_requests/:id
   */
  async denyOrder(id: string, reason?: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/service_requests/${id}`, {
      action: 'deny',
      reason,
    });
  },

  /**
   * Cancel an order
   * POST /api/service_requests/:id
   */
  async cancelOrder(id: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/service_requests/${id}`, {
      action: 'cancel',
    });
  },

  /**
   * Delete an order
   * DELETE /api/service_requests/:id
   */
  async deleteOrder(id: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.delete<ActionResponse>(`/service_requests/${id}`);
  },

  /**
   * Delete multiple orders
   * POST /api/service_requests
   */
  async deleteOrders(orderIds: string[]): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>('/service_requests', {
      action: 'delete',
      resources: orderIds.map((id) => ({ href: `/api/service_requests/${id}` })),
    });
  },

  /**
   * Add a comment to an order
   * POST /api/service_requests/:id
   */
  async addComment(id: string, comment: string): Promise<ActionResponse> {
    const client = getApiClient();
    return client.post<ActionResponse>(`/service_requests/${id}`, {
      action: 'add_comment',
      comment,
    });
  },

  /**
   * Get order approval workflow
   * GET /api/service_requests/:id?attributes=approval_state,approvers
   */
  async getOrderApprovalWorkflow(id: string): Promise<Order> {
    const client = getApiClient();
    return client.get<Order>(`/service_requests/${id}`, {
      params: {
        attributes: 'approval_state,approvers,request_state,status',
      },
    });
  },
};
