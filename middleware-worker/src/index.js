/**
 * Cloudflare Worker - The Cat API Middleware
 *
 * This worker provides a secure proxy to The Cat API, keeping API keys server-side.
 *
 * Setup:
 * 1. Set your API key: wrangler secret put CAT_API_KEY
 * 2. Run locally: npm run dev
 * 3. Deploy: npm run deploy
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return handleCORS();
		}

		// Route: Get random cat images
		if (url.pathname === '/cats/random') {
			return handleRandomCats(request, env, url.searchParams);
		}

		// Route: Get cat breeds
		if (url.pathname === '/cats/breeds') {
			return handleBreeds(request, env);
		}

		// Root path: Show available routes
		if (url.pathname === '/') {
			return new Response(JSON.stringify({
				message: 'The Cat API Middleware',
				routes: {
					'/cats/random': 'Get random cat images (params: limit, breed_ids)',
					'/cats/breeds': 'Get all cat breeds',
				},
			}, null, 2), {
				headers: {
					'Content-Type': 'application/json',
					...getCORSHeaders(),
				},
			});
		}

		// 404 - Not Found
		return new Response(JSON.stringify({
			error: 'Not Found',
			path: url.pathname,
			availableRoutes: ['/cats/random', '/cats/breeds'],
		}), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
				...getCORSHeaders(),
			},
		});
	},
};

/**
 * Get random cat images
 */
async function handleRandomCats(request, env, params) {
	try {
		const limit = params.get('limit') || '10';
		const breedIds = params.get('breed_ids') || '';

		const apiUrl = `${env.CAT_API_URL}/images/search?limit=${limit}${breedIds ? `&breed_ids=${breedIds}` : ''}`;

		const response = await fetch(apiUrl, {
			headers: {
				'x-api-key': env.CAT_API_KEY || '',
			},
		});

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json',
				...getCORSHeaders(),
			},
		});
	} catch (error) {
		return errorResponse('Failed to fetch random cats', error);
	}
}

/**
 * Get all cat breeds
 */
async function handleBreeds(request, env) {
	try {
		const apiUrl = `${env.CAT_API_URL}/breeds`;

		const response = await fetch(apiUrl, {
			headers: {
				'x-api-key': env.CAT_API_KEY || '',
			},
		});

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json',
				...getCORSHeaders(),
			},
		});
	} catch (error) {
		return errorResponse('Failed to fetch breeds', error);
	}
}

/**
 * Get CORS headers for cross-origin requests
 */
function getCORSHeaders() {
	return {
		'Access-Control-Allow-Origin': '*', // In production, restrict to your domain
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	};
}

/**
 * Handle CORS preflight requests
 */
function handleCORS() {
	return new Response(null, {
		status: 204,
		headers: getCORSHeaders(),
	});
}

/**
 * Create an error response
 */
function errorResponse(message, error) {
	return new Response(JSON.stringify({
		error: message,
		details: error.message,
	}), {
		status: 500,
		headers: {
			'Content-Type': 'application/json',
			...getCORSHeaders(),
		},
	});
}
