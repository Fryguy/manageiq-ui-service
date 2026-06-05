import { vmsApi } from './vms';
import { getApiClient } from './client';
import { VM, Snapshot, PowerOperation } from './services';
import { CollectionResponse, ActionResponse } from './types';
import { ConsoleType, ConsoleConnection } from './vms';

// Mock the API client
jest.mock('./client');
const mockGetApiClient = getApiClient as jest.MockedFunction<typeof getApiClient>;

describe('VMs API', () => {
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

  describe('getVMs', () => {
    it('fetches VMs collection without params', async () => {
      const mockResponse: CollectionResponse<VM> = {
        name: 'vms',
        count: 2,
        subcount: 2,
        resources: [
          { id: 'vm1', name: 'VM 1', href: '/api/vms/vm1', power_state: 'on' },
          { id: 'vm2', name: 'VM 2', href: '/api/vms/vm2', power_state: 'off' },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await vmsApi.getVMs();

      expect(mockClient.get).toHaveBeenCalledWith('/vms', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('fetches VMs with query params', async () => {
      const params = {
        expand: 'resources',
        filter: ['power_state=on'],
        attributes: 'name,power_state,cpu_total_cores,memory_mb',
      };

      const mockResponse: CollectionResponse<VM> = {
        name: 'vms',
        count: 1,
        subcount: 1,
        resources: [
          {
            id: 'vm1',
            name: 'VM 1',
            href: '/api/vms/vm1',
            power_state: 'on',
            cpu_total_cores: 4,
            memory_mb: 8192,
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await vmsApi.getVMs(params);

      expect(mockClient.get).toHaveBeenCalledWith('/vms', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getVM', () => {
    it('fetches a single VM by ID', async () => {
      const mockVM: VM = {
        id: 'vm1',
        name: 'Test VM',
        href: '/api/vms/vm1',
        power_state: 'on',
        cpu_total_cores: 4,
        memory_mb: 8192,
        vendor: 'vmware',
      };

      mockClient.get.mockResolvedValue(mockVM);

      const result = await vmsApi.getVM('vm1');

      expect(mockClient.get).toHaveBeenCalledWith('/vms/vm1', { params: undefined });
      expect(result).toEqual(mockVM);
    });

    it('fetches VM with expanded attributes', async () => {
      const params = { expand: 'snapshots,operating_system' };
      const mockVM: VM = {
        id: 'vm1',
        name: 'Test VM',
        href: '/api/vms/vm1',
        power_state: 'on',
        snapshots: [
          { id: 'snap1', name: 'Snapshot 1', href: '/api/vms/vm1/snapshots/snap1' },
        ],
        operating_system: {
          product_name: 'Red Hat Enterprise Linux',
          product_type: 'linux',
        },
      };

      mockClient.get.mockResolvedValue(mockVM);

      const result = await vmsApi.getVM('vm1', params);

      expect(mockClient.get).toHaveBeenCalledWith('/vms/vm1', { params });
      expect(result).toEqual(mockVM);
    });
  });

  describe('powerOperation', () => {
    it.each<PowerOperation>(['start', 'stop', 'suspend', 'shutdown_guest', 'reboot_guest', 'reset'])(
      'executes %s power operation',
      async (operation) => {
        const mockResponse: ActionResponse = {
          success: true,
          message: `VM ${operation} initiated`,
          task_id: 'task-123',
        };

        mockClient.post.mockResolvedValue(mockResponse);

        const result = await vmsApi.powerOperation('vm1', operation);

        expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1', {
          action: operation,
        });
        expect(result).toEqual(mockResponse);
      }
    );
  });

  describe('retireVM', () => {
    it('retires a VM without date', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'VM retirement initiated',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await vmsApi.retireVM('vm1');

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1', {
        action: 'retire',
      });
      expect(result).toEqual(mockResponse);
    });

    it('retires a VM with specific date', async () => {
      const retireDate = '2026-12-31';
      const mockResponse: ActionResponse = {
        success: true,
        message: 'VM retirement scheduled',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await vmsApi.retireVM('vm1', retireDate);

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1', {
        action: 'retire',
        date: retireDate,
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

      const result = await vmsApi.setOwnership('vm1', 'user123');

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1', {
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

      const result = await vmsApi.setOwnership('vm1', undefined, 'group456');

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1', {
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

      const result = await vmsApi.setOwnership('vm1', 'user123', 'group456');

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1', {
        action: 'set_ownership',
        resource: {
          owner: { id: 'user123' },
          group: { id: 'group456' },
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSnapshots', () => {
    it('fetches VM snapshots', async () => {
      const mockResponse: CollectionResponse<Snapshot> = {
        name: 'snapshots',
        count: 2,
        subcount: 2,
        resources: [
          {
            id: 'snap1',
            name: 'Snapshot 1',
            href: '/api/vms/vm1/snapshots/snap1',
            description: 'Before update',
            current: false,
            create_time: '2026-06-01T10:00:00Z',
          },
          {
            id: 'snap2',
            name: 'Snapshot 2',
            href: '/api/vms/vm1/snapshots/snap2',
            description: 'After update',
            current: true,
            create_time: '2026-06-02T10:00:00Z',
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await vmsApi.getSnapshots('vm1');

      expect(mockClient.get).toHaveBeenCalledWith('/vms/vm1/snapshots', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('fetches snapshots with params', async () => {
      const params = { expand: 'resources' };
      const mockResponse: CollectionResponse<Snapshot> = {
        name: 'snapshots',
        count: 1,
        subcount: 1,
        resources: [
          {
            id: 'snap1',
            name: 'Snapshot 1',
            href: '/api/vms/vm1/snapshots/snap1',
            current: true,
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await vmsApi.getSnapshots('vm1', params);

      expect(mockClient.get).toHaveBeenCalledWith('/vms/vm1/snapshots', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createSnapshot', () => {
    it('creates a snapshot without description', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Snapshot creation initiated',
        task_id: 'task-456',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await vmsApi.createSnapshot('vm1', 'My Snapshot');

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1/snapshots', {
        action: 'create',
        resource: {
          name: 'My Snapshot',
          description: undefined,
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('creates a snapshot with description', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Snapshot creation initiated',
        task_id: 'task-456',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await vmsApi.createSnapshot('vm1', 'My Snapshot', 'Before major update');

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1/snapshots', {
        action: 'create',
        resource: {
          name: 'My Snapshot',
          description: 'Before major update',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('revertSnapshot', () => {
    it('reverts to a snapshot', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Snapshot revert initiated',
        task_id: 'task-789',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await vmsApi.revertSnapshot('vm1', 'snap1');

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1/snapshots/snap1', {
        action: 'revert',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteSnapshot', () => {
    it('deletes a snapshot', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Snapshot deleted',
      };

      mockClient.delete.mockResolvedValue(mockResponse);

      const result = await vmsApi.deleteSnapshot('vm1', 'snap1');

      expect(mockClient.delete).toHaveBeenCalledWith('/vms/vm1/snapshots/snap1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getConsoleConnection', () => {
    it.each<ConsoleType>(['vnc', 'spice', 'webmks'])(
      'gets %s console connection',
      async (consoleType) => {
        const mockResponse: ConsoleConnection = {
          type: consoleType,
          url: `https://console.example.com/${consoleType}`,
          proxy_url: 'https://proxy.example.com',
          secret: 'secret-token-123',
          ticket: 'ticket-456',
        };

        mockClient.post.mockResolvedValue(mockResponse);

        const result = await vmsApi.getConsoleConnection('vm1', consoleType);

        expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1', {
          action: 'request_console',
          resource: {
            console_type: consoleType,
          },
        });
        expect(result).toEqual(mockResponse);
      }
    );
  });

  describe('addTags', () => {
    it('adds tags to a VM', async () => {
      const tags = [
        { category: 'environment', name: 'production' },
        { category: 'department', name: 'engineering' },
      ];

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Tags assigned',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await vmsApi.addTags('vm1', tags);

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1/tags', {
        action: 'assign',
        resources: tags,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeTags', () => {
    it('removes tags from a VM', async () => {
      const tags = [
        { category: 'environment', name: 'staging' },
      ];

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Tags unassigned',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await vmsApi.removeTags('vm1', tags);

      expect(mockClient.post).toHaveBeenCalledWith('/vms/vm1/tags', {
        action: 'unassign',
        resources: tags,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteVM', () => {
    it('deletes a VM', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'VM deleted',
      };

      mockClient.delete.mockResolvedValue(mockResponse);

      const result = await vmsApi.deleteVM('vm1');

      expect(mockClient.delete).toHaveBeenCalledWith('/vms/vm1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('handles API errors for getVMs', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      };

      mockClient.get.mockRejectedValue(mockError);

      await expect(vmsApi.getVMs()).rejects.toEqual(mockError);
    });

    it('handles API errors for power operations', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { error: 'Forbidden' },
        },
      };

      mockClient.post.mockRejectedValue(mockError);

      await expect(vmsApi.powerOperation('vm1', 'start')).rejects.toEqual(mockError);
    });

    it('handles API errors for snapshot operations', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Snapshot not found' },
        },
      };

      mockClient.delete.mockRejectedValue(mockError);

      await expect(vmsApi.deleteSnapshot('vm1', 'snap999')).rejects.toEqual(mockError);
    });
  });
});
