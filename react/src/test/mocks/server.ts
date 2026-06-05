import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Mock Service Worker server for Node.js testing environment.
 * This server intercepts API requests during tests and returns mock responses.
 * 
 * Usage in tests:
 * 
 * ```typescript
 * import { server } from '@/test/mocks/server';
 * 
 * beforeAll(() => server.listen());
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 * ```
 * 
 * To override handlers for specific tests:
 * 
 * ```typescript
 * import { http, HttpResponse } from 'msw';
 * import { server } from '@/test/mocks/server';
 * 
 * test('handles error response', async () => {
 *   server.use(
 *     http.get('/api/services', () => {
 *       return new HttpResponse(null, { status: 500 });
 *     })
 *   );
 *   // ... test code
 * });
 * ```
 */
export const server = setupServer(...handlers);

export default server;
