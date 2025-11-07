# The Cat API Middleware Worker

A Cloudflare Worker that provides a secure proxy to [The Cat API](https://thecatapi.com/), keeping your API key server-side and not exposed to browsers.

## Setup

### 1. Install Dependencies

```bash
cd middleware-worker
npm install
```

### 2. Set Your Cat API Key

You need to set your Cat API key as a secret (it won't be committed to git):

```bash
wrangler secret put CAT_API_KEY
```

When prompted, paste your API key from: https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR

### 3. Test Locally

```bash
npm run dev
```

The worker will start at `http://localhost:8787`

## Available Endpoints

### GET / (Root)
Returns available routes and documentation.

```bash
curl http://localhost:8787/
```

### GET /cats/random
Get random cat images.

**Query Parameters:**
- `limit` - Number of images to return (default: 10)
- `breed_ids` - Filter by breed IDs (comma-separated)

**Example:**
```bash
curl "http://localhost:8787/cats/random?limit=5"
curl "http://localhost:8787/cats/random?limit=3&breed_ids=beng,siam"
```

**Response:**
```json
[
  {
    "id": "abc123",
    "url": "https://cdn2.thecatapi.com/images/abc123.jpg",
    "width": 1200,
    "height": 800
  }
]
```

### GET /cats/breeds
Get all available cat breeds.

**Example:**
```bash
curl http://localhost:8787/cats/breeds
```

**Response:**
```json
[
  {
    "id": "abys",
    "name": "Abyssinian",
    "temperament": "Active, Energetic, Independent",
    "origin": "Egypt",
    "description": "The Abyssinian is easy to care for..."
  }
]
```

### GET /cats/search
Search for cats with filters.

**Query Parameters:**
- `limit` - Number of images to return (default: 10)
- `breed_ids` - Filter by breed IDs (comma-separated)
- `category_ids` - Filter by category IDs (e.g., boxes, hats)

**Example:**
```bash
curl "http://localhost:8787/cats/search?limit=5&category_ids=5"
```

### POST /cats/vote
Vote on a cat image (upvote or downvote).

**Body:**
```json
{
  "image_id": "abc123",
  "value": 1
}
```

- `value`: 1 for upvote, 0 for downvote

**Example:**
```bash
curl -X POST http://localhost:8787/cats/vote \
  -H "Content-Type: application/json" \
  -d '{"image_id":"abc123","value":1}'
```

## Using from Your EDS Site

From your Edge Delivery Services site, you can call the worker endpoints:

```javascript
// Get random cats
async function getRandomCats(limit = 10) {
  const response = await fetch(`https://your-worker.workers.dev/cats/random?limit=${limit}`);
  return response.json();
}

// Get breeds
async function getBreeds() {
  const response = await fetch('https://your-worker.workers.dev/cats/breeds');
  return response.json();
}

// Vote on a cat
async function voteCat(imageId, upvote = true) {
  const response = await fetch('https://your-worker.workers.dev/cats/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_id: imageId,
      value: upvote ? 1 : 0
    })
  });
  return response.json();
}
```

## Deployment

### Deploy to Cloudflare

```bash
npm run deploy
```

### Set Production Secret

After deploying, set your API key for production:

```bash
wrangler secret put CAT_API_KEY --env production
```

Your worker will be available at: `https://middleware-worker.YOUR_SUBDOMAIN.workers.dev`

## Security

1. **API Key is Secret** - Never committed to git, only stored in Cloudflare
2. **CORS Enabled** - Adjust in production to limit allowed origins (see `getCORSHeaders()` in `src/index.js`)
3. **Rate Limiting** - Consider adding rate limiting for production use

## Testing with Vitest

Run the included tests:

```bash
npm test
```

## Resources

- [The Cat API Documentation](https://developers.thecatapi.com/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
