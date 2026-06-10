import { http, HttpResponse } from 'msw';

/**
 * Mock Service Worker (MSW) handlers for ManageIQ REST API endpoints.
 * These handlers intercept API requests during testing and return mock responses.
 */

// Base API URL
const API_BASE = '/api';

// Mock data
const mockUser = {
  id: '1',
  name: 'Test User',
  userid: 'testuser',
  email: 'testuser@example.com',
  role: 'EvmRole-administrator',
  group: 'EvmGroup-super_administrator',
};

const mockAuthorization = {
  identity: mockUser,
  authorization: {
    product_features: {
      'service_view': {},
      'service_edit': {},
      'service_delete': {},
      'catalog_items_view': {},
      'svc_catalog_provision': {},
      'miq_request_view': {},
      'miq_request_approval': {},
    },
  },
};

const mockServices = [
  {
    id: '1',
    name: 'Test Service 1',
    description: 'Test service description 1',
    power_state: 'on',
    retired: false,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Test Service 2',
    description: 'Test service description 2',
    power_state: 'off',
    retired: false,
    created_at: '2026-01-02T00:00:00Z',
  },
];

const mockCatalogs = [
  {
    id: '1',
    name: 'Test Catalog 1',
    description: 'Test catalog description 1',
    service_templates_count: 5,
  },
  {
    id: '2',
    name: 'Test Catalog 2',
    description: 'Test catalog description 2',
    service_templates_count: 3,
  },
];

const mockServiceTemplates = [
  {
    id: '1',
    name: 'Test Template 1',
    description: 'Test template description 1',
    service_template_catalog_id: '1',
    picture: null,
  },
  {
    id: '2',
    name: 'Test Template 2',
    description: 'Test template description 2',
    service_template_catalog_id: '1',
    picture: null,
  },
];

const mockOrders = [
  {
    id: '1',
    description: 'Test Order 1',
    state: 'pending',
    status: 'Ok',
    created_on: '2026-01-01T00:00:00Z',
    updated_on: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    description: 'Test Order 2',
    state: 'finished',
    status: 'Ok',
    created_on: '2026-01-02T00:00:00Z',
    updated_on: '2026-01-02T00:00:00Z',
  },
];

const mockVMs = [
  {
    id: '1',
    name: 'Test VM 1',
    power_state: 'on',
    vendor: 'vmware',
    operating_system: 'linux_generic',
  },
  {
    id: '2',
    name: 'Test VM 2',
    power_state: 'off',
    vendor: 'vmware',
    operating_system: 'windows_generic',
  },
];

/**
 * MSW request handlers for ManageIQ API endpoints
 */
export const handlers = [
  // Authentication endpoints
  http.post(`${API_BASE}/auth`, () => {
    return HttpResponse.json({
      auth_token: 'mock-auth-token-12345',
      token_ttl: 3600,
      expires_on: new Date(Date.now() + 3600000).toISOString(),
    });
  }),

  http.delete(`${API_BASE}/auth`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(`${API_BASE}`, ({ request }) => {
    const url = new URL(request.url);
    const attributes = url.searchParams.get('attributes');

    if (attributes === 'authorization') {
      return HttpResponse.json(mockAuthorization);
    }

    return HttpResponse.json({
      name: 'ManageIQ API',
      description: 'REST API',
      version: '5.0',
    });
  }),

  // Services endpoints
  http.get(`${API_BASE}/services`, ({ request }) => {
    const url = new URL(request.url);
    const expand = url.searchParams.get('expand');

    return HttpResponse.json({
      name: 'services',
      count: mockServices.length,
      subcount: mockServices.length,
      resources: expand === 'resources' ? mockServices : mockServices.map(s => ({ href: `${API_BASE}/services/${s.id}` })),
    });
  }),

  http.get(`${API_BASE}/services/:id`, ({ params }) => {
    const service = mockServices.find(s => s.id === params.id);
    if (!service) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(service);
  }),

  http.post(`${API_BASE}/services/:id`, async ({ request }) => {
    const body = await request.json() as { action: string };
    const action = body.action;

    return HttpResponse.json({
      success: true,
      message: `Action ${action} initiated`,
      task_id: 'mock-task-123',
    });
  }),

  // Catalogs endpoints
  http.get(`${API_BASE}/service_catalogs`, ({ request }) => {
    const url = new URL(request.url);
    const expand = url.searchParams.get('expand');

    return HttpResponse.json({
      name: 'service_catalogs',
      count: mockCatalogs.length,
      subcount: mockCatalogs.length,
      resources: expand === 'resources' ? mockCatalogs : mockCatalogs.map(c => ({ href: `${API_BASE}/service_catalogs/${c.id}` })),
    });
  }),

  http.get(`${API_BASE}/service_catalogs/:id`, ({ params }) => {
    const catalog = mockCatalogs.find(c => c.id === params.id);
    if (!catalog) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(catalog);
  }),

  http.get(`${API_BASE}/service_templates`, ({ request }) => {
    const url = new URL(request.url);
    const expand = url.searchParams.get('expand');

    return HttpResponse.json({
      name: 'service_templates',
      count: mockServiceTemplates.length,
      subcount: mockServiceTemplates.length,
      resources: expand === 'resources' ? mockServiceTemplates : mockServiceTemplates.map(t => ({ href: `${API_BASE}/service_templates/${t.id}` })),
    });
  }),

  http.get(`${API_BASE}/service_templates/:id`, ({ params }) => {
    const template = mockServiceTemplates.find(t => t.id === params.id);
    if (!template) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(template);
  }),

  http.post(`${API_BASE}/service_templates/:id`, async ({ request }) => {
    const body = await request.json() as { action: string };
    const action = body.action;

    if (action === 'order') {
      return HttpResponse.json({
        results: [{
          id: 'mock-order-123',
          href: `${API_BASE}/service_requests/mock-order-123`,
        }],
      });
    }

    return HttpResponse.json({
      success: true,
      message: `Action ${action} initiated`,
    });
  }),

  // Orders/Requests endpoints
  http.get(`${API_BASE}/service_requests`, ({ request }) => {
    const url = new URL(request.url);
    const expand = url.searchParams.get('expand');

    return HttpResponse.json({
      name: 'service_requests',
      count: mockOrders.length,
      subcount: mockOrders.length,
      resources: expand === 'resources' ? mockOrders : mockOrders.map(o => ({ href: `${API_BASE}/service_requests/${o.id}` })),
    });
  }),

  http.get(`${API_BASE}/service_requests/:id`, ({ params }) => {
    const order = mockOrders.find(o => o.id === params.id);
    if (!order) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(order);
  }),

  http.post(`${API_BASE}/service_requests/:id`, async ({ request }) => {
    const body = await request.json() as { action: string };
    const action = body.action;

    return HttpResponse.json({
      success: true,
      message: `Action ${action} completed`,
    });
  }),

  // VMs endpoints
  http.get(`${API_BASE}/vms`, ({ request }) => {
    const url = new URL(request.url);
    const expand = url.searchParams.get('expand');

    return HttpResponse.json({
      name: 'vms',
      count: mockVMs.length,
      subcount: mockVMs.length,
      resources: expand === 'resources' ? mockVMs : mockVMs.map(v => ({ href: `${API_BASE}/vms/${v.id}` })),
    });
  }),

  http.get(`${API_BASE}/vms/:id`, ({ params }) => {
    const vm = mockVMs.find(v => v.id === params.id);
    if (!vm) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(vm);
  }),

  http.post(`${API_BASE}/vms/:id`, async ({ request }) => {
    const body = await request.json() as { action: string };
    const action = body.action;

    return HttpResponse.json({
      success: true,
      message: `Action ${action} initiated`,
      task_id: 'mock-task-456',
    });
  }),
];

export default handlers;
