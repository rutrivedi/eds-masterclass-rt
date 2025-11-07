import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Cat API Middleware Worker', () => {
	it('responds with route information at root (unit style)', async () => {
		const request = new Request('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		const data = await response.json();
		expect(data.message).toBe('The Cat API Middleware');
		expect(data.routes).toBeDefined();
		expect(data.routes['/cats/random']).toBeDefined();
	});

	it('responds with route information at root (integration style)', async () => {
		const response = await SELF.fetch('http://example.com');
		const data = await response.json();
		expect(data.message).toBe('The Cat API Middleware');
		expect(data.routes).toBeDefined();
	});

	it('handles CORS preflight requests', async () => {
		const request = new Request('http://example.com/cats/random', {
			method: 'OPTIONS',
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
		expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
	});

	it('returns 404 for unknown routes', async () => {
		const request = new Request('http://example.com/unknown-route');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(404);
		const data = await response.json();
		expect(data.error).toBe('Not Found');
	});
});
