import { ordersApi } from './orders';
import { getApiClient } from './client';
import { Order } from './orders';
import { CollectionResponse, ActionResponse } from './types';
import { RequestTask } from './catalogs';

// Mock the API client
jest.mock('./client');
const mockGetApiClient = getApiClient as jest.MockedFunction<typeof getApiClient>;

describe('Orders API', () => {
  let mockClient: {
    get: jest.Mock;
    post: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockClient = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    };

    mockGetApiClient.mockReturnValue(mockClient as any);
  });

  describe('getOrders', () => {
    it('fetches orders collection without params', async () => {
      const mockResponse: CollectionResponse<Order> = {
        name: 'service_requests',
        count: 2,
        subcount: 2,
        resources: [
          {
            id: '1',
            name: 'Order 1',
            href: '/api/service_requests/1',
            description: 'Service order 1',
            approval_state: 'approved',
          },
          {
            id: '2',
            name: 'Order 2',
            href: '/api/service_requests/2',
            description: 'Service order 2',
            approval_state: 'pending_approval',
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await ordersApi.getOrders();

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('fetches orders with query params', async () => {
      const params = {
        filter: ['approval_state=pending_approval'],
        sort_by: 'created_on',
        sort_order: 'desc',
        limit: 20,
      };

      const mockResponse: CollectionResponse<Order> = {
        name: 'service_requests',
        count: 1,
        subcount: 1,
        resources: [
          {
            id: '2',
            name: 'Order 2',
            href: '/api/service_requests/2',
            approval_state: 'pending_approval',
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await ordersApi.getOrders(params);

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getOrder', () => {
    it('fetches a single order by ID', async () => {
      const mockOrder: Order = {
        id: '1',
        name: 'Test Order',
        href: '/api/service_requests/1',
        description: 'Test service order',
        approval_state: 'approved',
        request_state: 'finished',
        status: 'Ok',
        created_on: '2026-06-01T10:00:00Z',
      };

      mockClient.get.mockResolvedValue(mockOrder);

      const result = await ordersApi.getOrder('1');

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests/1', { params: undefined });
      expect(result).toEqual(mockOrder);
    });

    it('fetches order with expanded attributes', async () => {
      const params = { expand: 'miq_request_tasks,resources' };
      const mockOrder: Order = {
        id: '1',
        name: 'Test Order',
        href: '/api/service_requests/1',
        miq_request_tasks: [
          {
            id: 'task1',
            description: 'Provision VM',
            state: 'finished',
            status: 'Ok',
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockOrder);

      const result = await ordersApi.getOrder('1', params);

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests/1', { params });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getOrderTasks', () => {
    it('fetches order tasks', async () => {
      const mockResponse: CollectionResponse<RequestTask> = {
        name: 'request_tasks',
        count: 2,
        subcount: 2,
        resources: [
          {
            id: 'task1',
            description: 'Provision VM',
            state: 'finished',
            status: 'Ok',
            created_on: '2026-06-01T10:00:00Z',
          },
          {
            id: 'task2',
            description: 'Configure network',
            state: 'finished',
            status: 'Ok',
            created_on: '2026-06-01T10:05:00Z',
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await ordersApi.getOrderTasks('1');

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests/1/request_tasks', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('fetches order tasks with params', async () => {
      const params = { expand: 'resources' };
      const mockResponse: CollectionResponse<RequestTask> = {
        name: 'request_tasks',
        count: 1,
        subcount: 1,
        resources: [
          {
            id: 'task1',
            description: 'Provision VM',
            state: 'finished',
            status: 'Ok',
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await ordersApi.getOrderTasks('1', params);

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests/1/request_tasks', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('approveOrder', () => {
    it('approves an order without reason', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Order approved',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await ordersApi.approveOrder('1');

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'approve',
        reason: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('approves an order with reason', async () => {
      const reason = 'Approved for production deployment';
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Order approved',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await ordersApi.approveOrder('1', reason);

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'approve',
        reason,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('denyOrder', () => {
    it('denies an order without reason', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Order denied',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await ordersApi.denyOrder('1');

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'deny',
        reason: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('denies an order with reason', async () => {
      const reason = 'Insufficient resources';
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Order denied',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await ordersApi.denyOrder('1', reason);

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'deny',
        reason,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('cancelOrder', () => {
    it('cancels an order', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Order cancelled',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await ordersApi.cancelOrder('1');

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'cancel',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteOrder', () => {
    it('deletes a single order', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Order deleted',
      };

      mockClient.delete.mockResolvedValue(mockResponse);

      const result = await ordersApi.deleteOrder('1');

      expect(mockClient.delete).toHaveBeenCalledWith('/service_requests/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteOrders', () => {
    it('deletes multiple orders', async () => {
      const orderIds = ['1', '2', '3'];
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Orders deleted',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await ordersApi.deleteOrders(orderIds);

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests', {
        action: 'delete',
        resources: [
          { href: '/api/service_requests/1' },
          { href: '/api/service_requests/2' },
          { href: '/api/service_requests/3' },
        ],
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('addComment', () => {
    it('adds a comment to an order', async () => {
      const comment = 'This order needs additional review';
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Comment added',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await ordersApi.addComment('1', comment);

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'add_comment',
        comment,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getOrderApprovalWorkflow', () => {
    it('fetches order approval workflow details', async () => {
      const mockOrder: Order = {
        id: '1',
        name: 'Test Order',
        href: '/api/service_requests/1',
        approval_state: 'pending_approval',
        request_state: 'pending',
        status: 'Ok',
      };

      mockClient.get.mockResolvedValue(mockOrder);

      const result = await ordersApi.getOrderApprovalWorkflow('1');

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests/1', {
        params: {
          attributes: 'approval_state,approvers,request_state,status',
        },
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('Error Handling', () => {
    it('handles API errors for getOrders', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      };

      mockClient.get.mockRejectedValue(mockError);

      await expect(ordersApi.getOrders()).rejects.toEqual(mockError);
    });

    it('handles API errors for approveOrder', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { error: 'Forbidden' },
        },
      };

      mockClient.post.mockRejectedValue(mockError);

      await expect(ordersApi.approveOrder('1')).rejects.toEqual(mockError);
    });

    it('handles API errors for deleteOrder', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Order not found' },
        },
      };

      mockClient.delete.mockRejectedValue(mockError);

      await expect(ordersApi.deleteOrder('999')).rejects.toEqual(mockError);
    });
  });
});
