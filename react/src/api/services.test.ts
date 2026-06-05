import { servicesApi } from './services';
import { getApiClient } from './client';
import { Service, PowerOperation } from './services';
import { CollectionResponse, ActionResponse } from './types';

// Mock the API client
jest.mock('./client');
const mockGetApiClient = getApiClient as jest.MockedFunction<typeof getApiClient>;

describe('Services API', () => {
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

  describe('getServices', () => {
    it('fetches services collection without params', async () => {
      const mockResponse: CollectionResponse<Service> = {
        name: 'services',
        count: 2,
        subcount: 2,
        resources: [
          { id: '1', name: 'Service 1', href: '/api/services/1', type: 'Service' },
          { id: '2', name: 'Service 2', href: '/api/services/2', type: 'Service' },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await servicesApi.getServices();

      expect(mockClient.get).toHaveBeenCalledWith('/services', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('fetches services collection with query params', async () => {
      const params = {
        expand: 'resources',
        filter: ['name=Test'],
        limit: 10,
        offset: 0,
      };

      const mockResponse: CollectionResponse<Service> = {
        name: 'services',
        count: 1,
        subcount: 1,
        resources: [{ id: '1', name: 'Test Service', href: '/api/services/1', type: 'Service' }],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await servicesApi.getServices(params);

      expect(mockClient.get).toHaveBeenCalledWith('/services', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getService', () => {
    it('fetches a single service by ID', async () => {
      const mockService: Service = {
        id: '1',
        name: 'Test Service',
        href: '/api/services/1',
        type: 'Service',
        description: 'Test description',
        power_state: 'on',
      };

      mockClient.get.mockResolvedValue(mockService);

      const result = await servicesApi.getService('1');

      expect(mockClient.get).toHaveBeenCalledWith('/services/1', { params: undefined });
      expect(result).toEqual(mockService);
    });

    it('fetches a service with expand params', async () => {
      const params = { expand: 'resources,vms' };
      const mockService: Service = {
        id: '1',
        name: 'Test Service',
        href: '/api/services/1',
        type: 'Service',
        vms: [{ id: 'vm1', name: 'VM 1', href: '/api/vms/vm1' }],
      };

      mockClient.get.mockResolvedValue(mockService);

      const result = await servicesApi.getService('1', params);

      expect(mockClient.get).toHaveBeenCalledWith('/services/1', { params });
      expect(result).toEqual(mockService);
    });
  });

  describe('powerOperation', () => {
    it.each<PowerOperation>(['start', 'stop', 'suspend', 'shutdown_guest', 'reboot_guest', 'reset'])(
      'executes %s power operation',
      async (operation) => {
        const mockResponse: ActionResponse = {
          success: true,
          message: `Service ${operation} initiated`,
          task_id: 'task-123',
        };

        mockClient.post.mockResolvedValue(mockResponse);

        const result = await servicesApi.powerOperation('1', operation);

        expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
          action: operation,
        });
        expect(result).toEqual(mockResponse);
      }
    );
  });

  describe('retireService', () => {
    it('retires a service without date', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service retirement initiated',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.retireService('1');

      expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
        action: 'retire',
      });
      expect(result).toEqual(mockResponse);
    });

    it('retires a service with specific date', async () => {
      const retireDate = '2026-12-31';
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service retirement scheduled',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.retireService('1', retireDate);

      expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
        action: 'retire',
        date: retireDate,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('retireServicesNow', () => {
    it('retires multiple services immediately', async () => {
      const serviceIds = ['1', '2', '3'];
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Services retired',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.retireServicesNow(serviceIds);

      expect(mockClient.post).toHaveBeenCalledWith('/services', {
        action: 'retire',
        resources: [
          { href: '/api/services/1' },
          { href: '/api/services/2' },
          { href: '/api/services/3' },
        ],
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('editService', () => {
    it('edits a service with partial data', async () => {
      const updateData = {
        name: 'Updated Service Name',
        description: 'Updated description',
      };

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service updated',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.editService('1', updateData);

      expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
        action: 'edit',
        resource: updateData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('reconfigureService', () => {
    it('reconfigures a service with dialog data', async () => {
      const dialogData = {
        dialog_param_1: 'value1',
        dialog_param_2: 'value2',
      };

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service reconfiguration initiated',
        task_id: 'task-456',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.reconfigureService('1', dialogData);

      expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
        action: 'reconfigure',
        resource: dialogData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('setOwnership', () => {
    it('sets owner only', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Ownership updated',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.setOwnership('1', 'user123');

      expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
        action: 'set_ownership',
        resource: {
          owner: { id: 'user123' },
          group: undefined,
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('sets group only', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Ownership updated',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.setOwnership('1', undefined, 'group456');

      expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
        action: 'set_ownership',
        resource: {
          owner: undefined,
          group: { id: 'group456' },
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('sets both owner and group', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Ownership updated',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.setOwnership('1', 'user123', 'group456');

      expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
        action: 'set_ownership',
        resource: {
          owner: { id: 'user123' },
          group: { id: 'group456' },
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('executeCustomButton', () => {
    it('executes custom button without dialog data', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Custom button executed',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.executeCustomButton('1', 'button-123');

      expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
        action: 'custom_button',
        button_id: 'button-123',
        resource: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('executes custom button with dialog data', async () => {
      const dialogData = {
        param1: 'value1',
        param2: 'value2',
      };

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Custom button executed',
        task_id: 'task-789',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.executeCustomButton('1', 'button-123', dialogData);

      expect(mockClient.post).toHaveBeenCalledWith('/services/1', {
        action: 'custom_button',
        button_id: 'button-123',
        resource: dialogData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('addTags', () => {
    it('adds tags to a service', async () => {
      const tags = [
        { category: 'environment', name: 'production' },
        { category: 'department', name: 'engineering' },
      ];

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Tags assigned',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.addTags('1', tags);

      expect(mockClient.post).toHaveBeenCalledWith('/services/1/tags', {
        action: 'assign',
        resources: tags,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeTags', () => {
    it('removes tags from a service', async () => {
      const tags = [
        { category: 'environment', name: 'staging' },
      ];

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Tags unassigned',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.removeTags('1', tags);

      expect(mockClient.post).toHaveBeenCalledWith('/services/1/tags', {
        action: 'unassign',
        resources: tags,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteService', () => {
    it('deletes a single service', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service deleted',
      };

      mockClient.delete.mockResolvedValue(mockResponse);

      const result = await servicesApi.deleteService('1');

      expect(mockClient.delete).toHaveBeenCalledWith('/services/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteServices', () => {
    it('deletes multiple services', async () => {
      const serviceIds = ['1', '2', '3'];
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Services deleted',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await servicesApi.deleteServices(serviceIds);

      expect(mockClient.post).toHaveBeenCalledWith('/services', {
        action: 'delete',
        resources: [
          { href: '/api/services/1' },
          { href: '/api/services/2' },
          { href: '/api/services/3' },
        ],
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('handles API errors for getServices', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      };

      mockClient.get.mockRejectedValue(mockError);

      await expect(servicesApi.getServices()).rejects.toEqual(mockError);
    });

    it('handles API errors for power operations', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { error: 'Forbidden' },
        },
      };

      mockClient.post.mockRejectedValue(mockError);

      await expect(servicesApi.powerOperation('1', 'start')).rejects.toEqual(mockError);
    });
  });
});
