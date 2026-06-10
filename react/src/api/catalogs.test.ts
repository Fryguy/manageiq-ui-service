import { catalogsApi } from './catalogs';
import { getApiClient } from './client';
import { ServiceCatalog, ServiceTemplate, Dialog, ServiceRequest } from './catalogs';
import { CollectionResponse, ActionResponse } from './types';

// Mock the API client
jest.mock('./client');
const mockGetApiClient = getApiClient as jest.MockedFunction<typeof getApiClient>;

describe('Catalogs API', () => {
  let mockClient: {
    get: jest.Mock;
    post: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockClient = {
      get: jest.fn(),
      post: jest.fn(),
    } as unknown as ApiClient;

    mockGetApiClient.mockReturnValue(mockClient);
  });

  describe('getServiceCatalogs', () => {
    it('fetches service catalogs collection', async () => {
      const mockResponse: CollectionResponse<ServiceCatalog> = {
        name: 'service_catalogs',
        count: 2,
        subcount: 2,
        resources: [
          { id: '1', name: 'Catalog 1', href: '/api/service_catalogs/1' },
          { id: '2', name: 'Catalog 2', href: '/api/service_catalogs/2' },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await catalogsApi.getServiceCatalogs();

      expect(mockClient.get).toHaveBeenCalledWith('/service_catalogs', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('fetches service catalogs with query params', async () => {
      const params = { expand: 'resources', filter: ['name=Test'] };
      const mockResponse: CollectionResponse<ServiceCatalog> = {
        name: 'service_catalogs',
        count: 1,
        subcount: 1,
        resources: [{ id: '1', name: 'Test Catalog', href: '/api/service_catalogs/1' }],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await catalogsApi.getServiceCatalogs(params);

      expect(mockClient.get).toHaveBeenCalledWith('/service_catalogs', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getServiceCatalog', () => {
    it('fetches a single service catalog by ID', async () => {
      const mockCatalog: ServiceCatalog = {
        id: '1',
        name: 'Test Catalog',
        href: '/api/service_catalogs/1',
        description: 'Test catalog description',
      };

      mockClient.get.mockResolvedValue(mockCatalog);

      const result = await catalogsApi.getServiceCatalog('1');

      expect(mockClient.get).toHaveBeenCalledWith('/service_catalogs/1', { params: undefined });
      expect(result).toEqual(mockCatalog);
    });
  });

  describe('getServiceTemplates', () => {
    it('fetches service templates collection', async () => {
      const mockResponse: CollectionResponse<ServiceTemplate> = {
        name: 'service_templates',
        count: 2,
        subcount: 2,
        resources: [
          { id: '1', name: 'Template 1', href: '/api/service_templates/1', type: 'ServiceTemplate' },
          { id: '2', name: 'Template 2', href: '/api/service_templates/2', type: 'ServiceTemplate' },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await catalogsApi.getServiceTemplates();

      expect(mockClient.get).toHaveBeenCalledWith('/service_templates', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('fetches service templates with filters', async () => {
      const params = {
        expand: 'resources',
        filter: ['service_template_catalog_id=1'],
        attributes: 'picture,resource_actions',
      };

      const mockResponse: CollectionResponse<ServiceTemplate> = {
        name: 'service_templates',
        count: 1,
        subcount: 1,
        resources: [
          {
            id: '1',
            name: 'Template 1',
            href: '/api/service_templates/1',
            type: 'ServiceTemplate',
            service_template_catalog_id: '1',
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await catalogsApi.getServiceTemplates(params);

      expect(mockClient.get).toHaveBeenCalledWith('/service_templates', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getServiceTemplate', () => {
    it('fetches a single service template by ID', async () => {
      const mockTemplate: ServiceTemplate = {
        id: '1',
        name: 'Test Template',
        href: '/api/service_templates/1',
        type: 'ServiceTemplate',
        description: 'Test template description',
        service_type: 'atomic',
      };

      mockClient.get.mockResolvedValue(mockTemplate);

      const result = await catalogsApi.getServiceTemplate('1');

      expect(mockClient.get).toHaveBeenCalledWith('/service_templates/1', { params: undefined });
      expect(result).toEqual(mockTemplate);
    });

    it('fetches service template with expanded resource actions', async () => {
      const params = { expand: 'resource_actions' };
      const mockTemplate: ServiceTemplate = {
        id: '1',
        name: 'Test Template',
        href: '/api/service_templates/1',
        type: 'ServiceTemplate',
        resource_actions: [
          { id: 'ra1', action: 'Provision', dialog_id: 'dialog1' },
        ],
      };

      mockClient.get.mockResolvedValue(mockTemplate);

      const result = await catalogsApi.getServiceTemplate('1', params);

      expect(mockClient.get).toHaveBeenCalledWith('/service_templates/1', { params });
      expect(result).toEqual(mockTemplate);
    });
  });

  describe('getServiceDialog', () => {
    it('fetches a service dialog', async () => {
      const mockDialog: Dialog = {
        id: 'dialog1',
        label: 'Provisioning Dialog',
        description: 'Dialog for provisioning',
        content: [
          {
            id: 'field1',
            name: 'vm_name',
            label: 'VM Name',
            type: 'DialogFieldTextBox',
            required: true,
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockDialog);

      const result = await catalogsApi.getServiceDialog('template1', 'dialog1');

      expect(mockClient.get).toHaveBeenCalledWith('/service_templates/template1/service_dialogs/dialog1');
      expect(result).toEqual(mockDialog);
    });
  });

  describe('refreshDialogFields', () => {
    it('refreshes dialog fields without resource action ID', async () => {
      const fields = {
        dialog_field_1: 'value1',
        dialog_field_2: 'value2',
      };

      const mockDialog: Dialog = {
        id: 'dialog1',
        label: 'Updated Dialog',
        content: [],
      };

      mockClient.post.mockResolvedValue(mockDialog);

      const result = await catalogsApi.refreshDialogFields('dialog1', fields);

      expect(mockClient.post).toHaveBeenCalledWith('/service_dialogs/dialog1', {
        action: 'refresh_dialog_fields',
        resource: {
          dialog_fields: fields,
          resource_action_id: undefined,
        },
      });
      expect(result).toEqual(mockDialog);
    });

    it('refreshes dialog fields with resource action ID', async () => {
      const fields = { dialog_field_1: 'value1' };
      const resourceActionId = 'ra123';

      const mockDialog: Dialog = {
        id: 'dialog1',
        label: 'Updated Dialog',
        content: [],
      };

      mockClient.post.mockResolvedValue(mockDialog);

      const result = await catalogsApi.refreshDialogFields('dialog1', fields, resourceActionId);

      expect(mockClient.post).toHaveBeenCalledWith('/service_dialogs/dialog1', {
        action: 'refresh_dialog_fields',
        resource: {
          dialog_fields: fields,
          resource_action_id: resourceActionId,
        },
      });
      expect(result).toEqual(mockDialog);
    });
  });

  describe('orderServiceTemplate', () => {
    it('orders a service template', async () => {
      const catalogId = 'catalog1';
      const templateId = 'template1';
      const dialogData = {
        dialog_vm_name: 'my-vm',
        dialog_cpu_count: 2,
        dialog_memory_mb: 4096,
      };

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service order submitted',
        task_id: 'task-123',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await catalogsApi.orderServiceTemplate(catalogId, templateId, dialogData);

      expect(mockClient.post).toHaveBeenCalledWith('/service_catalogs/catalog1/service_templates', {
        action: 'order',
        resource: {
          href: '/api/service_templates/template1',
          ...dialogData,
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('orderMultipleServiceTemplates', () => {
    it('orders multiple service templates (shopping cart checkout)', async () => {
      const catalogId = 'catalog1';
      const items = [
        {
          templateId: 'template1',
          dialogData: { dialog_vm_name: 'vm1' },
        },
        {
          templateId: 'template2',
          dialogData: { dialog_vm_name: 'vm2' },
        },
      ];

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Multiple services ordered',
        task_ids: ['task-123', 'task-456'],
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await catalogsApi.orderMultipleServiceTemplates(catalogId, items);

      expect(mockClient.post).toHaveBeenCalledWith('/service_catalogs/catalog1/service_templates', {
        action: 'order',
        resources: [
          {
            href: '/api/service_templates/template1',
            dialog_vm_name: 'vm1',
          },
          {
            href: '/api/service_templates/template2',
            dialog_vm_name: 'vm2',
          },
        ],
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getServiceRequests', () => {
    it('fetches service requests collection', async () => {
      const mockResponse: CollectionResponse<ServiceRequest> = {
        name: 'service_requests',
        count: 2,
        subcount: 2,
        resources: [
          {
            id: '1',
            name: 'Request 1',
            href: '/api/service_requests/1',
            description: 'Service request 1',
            approval_state: 'approved',
          },
          {
            id: '2',
            name: 'Request 2',
            href: '/api/service_requests/2',
            description: 'Service request 2',
            approval_state: 'pending_approval',
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await catalogsApi.getServiceRequests();

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('fetches service requests with filters', async () => {
      const params = {
        filter: ['approval_state=pending_approval'],
        sort_by: 'created_on',
        sort_order: 'desc',
      };

      const mockResponse: CollectionResponse<ServiceRequest> = {
        name: 'service_requests',
        count: 1,
        subcount: 1,
        resources: [
          {
            id: '2',
            name: 'Request 2',
            href: '/api/service_requests/2',
            approval_state: 'pending_approval',
          },
        ],
      };

      mockClient.get.mockResolvedValue(mockResponse);

      const result = await catalogsApi.getServiceRequests(params);

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getServiceRequest', () => {
    it('fetches a single service request by ID', async () => {
      const mockRequest: ServiceRequest = {
        id: '1',
        name: 'Test Request',
        href: '/api/service_requests/1',
        description: 'Test service request',
        approval_state: 'approved',
        request_state: 'finished',
        status: 'Ok',
      };

      mockClient.get.mockResolvedValue(mockRequest);

      const result = await catalogsApi.getServiceRequest('1');

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests/1', { params: undefined });
      expect(result).toEqual(mockRequest);
    });

    it('fetches service request with expanded tasks', async () => {
      const params = { expand: 'miq_request_tasks' };
      const mockRequest: ServiceRequest = {
        id: '1',
        name: 'Test Request',
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

      mockClient.get.mockResolvedValue(mockRequest);

      const result = await catalogsApi.getServiceRequest('1', params);

      expect(mockClient.get).toHaveBeenCalledWith('/service_requests/1', { params });
      expect(result).toEqual(mockRequest);
    });
  });

  describe('approveServiceRequest', () => {
    it('approves a service request without reason', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service request approved',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await catalogsApi.approveServiceRequest('1');

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'approve',
        reason: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('approves a service request with reason', async () => {
      const reason = 'Approved for production deployment';
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service request approved',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await catalogsApi.approveServiceRequest('1', reason);

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'approve',
        reason,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('denyServiceRequest', () => {
    it('denies a service request without reason', async () => {
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service request denied',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await catalogsApi.denyServiceRequest('1');

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'deny',
        reason: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('denies a service request with reason', async () => {
      const reason = 'Insufficient resources';
      const mockResponse: ActionResponse = {
        success: true,
        message: 'Service request denied',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await catalogsApi.denyServiceRequest('1', reason);

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1', {
        action: 'deny',
        reason,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('addRequestTask', () => {
    it('adds a request task', async () => {
      const requestId = '1';
      const options = {
        description: 'Additional provisioning task',
        state: 'pending',
      };

      const mockResponse: ActionResponse = {
        success: true,
        message: 'Request task added',
        task_id: 'task-789',
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await catalogsApi.addRequestTask(requestId, options);

      expect(mockClient.post).toHaveBeenCalledWith('/service_requests/1/request_tasks', {
        action: 'create',
        resource: options,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('handles API errors for getServiceCatalogs', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      };

      mockClient.get.mockRejectedValue(mockError);

      await expect(catalogsApi.getServiceCatalogs()).rejects.toEqual(mockError);
    });

    it('handles API errors for orderServiceTemplate', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { error: 'Invalid dialog data' },
        },
      };

      mockClient.post.mockRejectedValue(mockError);

      await expect(
        catalogsApi.orderServiceTemplate('catalog1', 'template1', {})
      ).rejects.toEqual(mockError);
    });

    it('handles API errors for approveServiceRequest', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { error: 'Forbidden' },
        },
      };

      mockClient.post.mockRejectedValue(mockError);

      await expect(catalogsApi.approveServiceRequest('1')).rejects.toEqual(mockError);
    });
  });
});
