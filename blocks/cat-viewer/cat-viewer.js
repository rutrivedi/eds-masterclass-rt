// Default middleware worker URL
const DEFAULT_WORKER_URL = 'http://localhost:8787';

/**
 * Extract worker URL from block content
 * @param {HTMLElement} block - The block element
 * @returns {string} Worker URL
 */
function extractWorkerUrl(block) {
  const link = block.querySelector('a');
  if (link && link.href) {
    // Use the link's href and remove trailing slash to avoid double slashes in API calls
    return link.href.replace(/\/$/, '');
  }
  return DEFAULT_WORKER_URL;
}

/**
 * Create controls section with breed selector and buttons
 * @returns {HTMLElement} Controls container
 */
function createControls() {
  const controls = document.createElement('div');
  controls.className = 'cat-viewer-controls';

  // Breed selector
  const breedSelect = document.createElement('select');
  breedSelect.className = 'cat-viewer-breed-select';
  breedSelect.innerHTML = '<option value="">Loading breeds...</option>';

  // Refresh button
  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'cat-viewer-refresh-btn';
  refreshBtn.innerHTML = '<span aria-hidden="true">🔄</span> New Cat';
  refreshBtn.setAttribute('aria-label', 'Get a new random cat');
  refreshBtn.setAttribute('title', 'Get a new random cat');

  // Info button
  const infoBtn = document.createElement('button');
  infoBtn.className = 'cat-viewer-info-btn';
  infoBtn.innerHTML = '<span aria-hidden="true">ℹ️</span> Info';
  infoBtn.setAttribute('aria-label', 'Show cat breed information');
  infoBtn.setAttribute('title', 'Show cat breed information');

  controls.appendChild(breedSelect);
  controls.appendChild(refreshBtn);
  controls.appendChild(infoBtn);

  return controls;
}

/**
 * Create image container
 * @returns {HTMLElement} Image container
 */
function createImageContainer() {
  const container = document.createElement('div');
  container.className = 'cat-viewer-image-container';

  const img = document.createElement('img');
  img.className = 'cat-viewer-image';
  img.alt = 'Random cat image';

  const loader = document.createElement('div');
  loader.className = 'cat-viewer-loader';
  loader.textContent = 'Loading...';

  container.appendChild(loader);
  container.appendChild(img);

  return container;
}

/**
 * Create info dialog
 * @returns {HTMLDialogElement} Info dialog
 */
function createInfoDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'cat-viewer-dialog';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'cat-viewer-dialog-close';
  closeBtn.innerHTML = '<span aria-hidden="true">✕</span>';
  closeBtn.setAttribute('aria-label', 'Close breed information');
  closeBtn.setAttribute('title', 'Close breed information');

  const body = document.createElement('div');
  body.className = 'cat-viewer-dialog-body';

  dialog.appendChild(closeBtn);
  dialog.appendChild(body);

  return dialog;
}

/**
 * Fetch breeds from the API
 * @param {string} workerUrl - Middleware worker URL
 * @returns {Promise<Array>} Array of breeds
 */
async function fetchBreeds(workerUrl) {
  const response = await fetch(`${workerUrl}/cats/breeds`);
  if (!response.ok) {
    throw new Error(`Failed to fetch breeds: ${response.status}`);
  }
  return response.json();
}

/**
 * Populate breed select dropdown
 * @param {HTMLSelectElement} select - Select element
 * @param {Array} breeds - Array of breeds
 */
function populateBreedSelect(select, breeds) {
  select.innerHTML = '<option value="">Random (All Breeds)</option>';
  breeds.forEach((breed) => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    select.appendChild(option);
  });
}

/**
 * Fetch a random cat image
 * @param {string} workerUrl - Middleware worker URL
 * @param {string} breedId - Optional breed ID to filter by
 * @returns {Promise<Object>} Cat data
 */
async function fetchRandomCat(workerUrl, breedId = '') {
  const url = breedId
    ? `${workerUrl}/cats/random?limit=1&breed_ids=${breedId}`
    : `${workerUrl}/cats/random?limit=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch cat: ${response.status}`);
  }

  const cats = await response.json();
  if (!cats || cats.length === 0) {
    throw new Error('No cats returned from API');
  }

  return cats[0];
}

/**
 * Show error message in block
 * @param {HTMLElement} block - The block element
 * @param {string} message - Error message
 */
function showError(block, message) {
  const error = document.createElement('div');
  error.className = 'cat-viewer-error';
  error.textContent = message;
  block.appendChild(error);

  // Remove error after 5 seconds
  setTimeout(() => {
    error.remove();
  }, 5000);
}

/**
 * Initialize the block with data and event listeners
 * @param {HTMLElement} block - The block element
 * @param {string} workerUrl - Middleware worker URL
 * @param {HTMLElement} controls - Controls container
 * @param {HTMLElement} imageContainer - Image container
 * @param {HTMLDialogElement} dialog - Info dialog
 */
async function initialize(block, workerUrl, controls, imageContainer, dialog) {
  const breedSelect = controls.querySelector('.cat-viewer-breed-select');
  const refreshBtn = controls.querySelector('.cat-viewer-refresh-btn');
  const infoBtn = controls.querySelector('.cat-viewer-info-btn');
  const img = imageContainer.querySelector('.cat-viewer-image');
  const loader = imageContainer.querySelector('.cat-viewer-loader');

  let currentCat = null;
  let breeds = [];

  /**
   * Show/hide loader
   * @param {boolean} show - Whether to show loader
   */
  function showLoader(show) {
    if (show) {
      loader.style.display = 'block';
      img.style.opacity = '0';
    } else {
      loader.style.display = 'none';
      img.style.opacity = '1';
    }
  }

  /**
   * Show breed information in dialog
   * @param {Object} breed - Breed data
   */
  function showDialog(breed) {
    const dialogBody = dialog.querySelector('.cat-viewer-dialog-body');
    dialogBody.innerHTML = `
      <h3>${breed.name}</h3>
      <p><strong>Origin:</strong> ${breed.origin}</p>
      <p><strong>Temperament:</strong> ${breed.temperament}</p>
      <p>${breed.description}</p>
      ${breed.wikipedia_url ? `<p><a href="${breed.wikipedia_url}" target="_blank" rel="noopener">Learn more on Wikipedia</a></p>` : ''}
    `;
    dialog.showModal();
  }

  /**
   * Close dialog
   */
  function closeDialog() {
    dialog.close();
  }

  /**
   * Load a random cat image
   * @param {string} breedId - Optional breed ID to filter by
   */
  async function loadRandomCat(breedId = '') {
    try {
      showLoader(true);
      closeDialog();

      const cat = await fetchRandomCat(workerUrl, breedId);
      currentCat = cat;

      img.src = cat.url;
      img.alt = cat.breeds && cat.breeds.length > 0
        ? `${cat.breeds[0].name} cat`
        : 'Random cat';

      // Update info button state
      if (cat.breeds && cat.breeds.length > 0) {
        infoBtn.disabled = false;
      } else {
        infoBtn.disabled = true;
      }
    } catch (error) {
      showError(block, 'Failed to load cat image');
      // eslint-disable-next-line no-console
      console.error('Failed to load cat:', error);
    }
  }

  // Load breeds
  try {
    breeds = await fetchBreeds(workerUrl);
    populateBreedSelect(breedSelect, breeds);
  } catch (error) {
    breedSelect.innerHTML = '<option value="">Failed to load breeds</option>';
    // eslint-disable-next-line no-console
    console.error('Failed to load breeds:', error);
  }

  // Load initial random cat
  await loadRandomCat();

  // Event listeners
  breedSelect.addEventListener('change', async () => {
    await loadRandomCat(breedSelect.value);
  });

  refreshBtn.addEventListener('click', async () => {
    await loadRandomCat(breedSelect.value);
  });

  infoBtn.addEventListener('click', () => {
    if (currentCat && currentCat.breeds && currentCat.breeds.length > 0) {
      showDialog(currentCat.breeds[0]);
    }
  });

  // Dialog event listeners
  const closeBtn = dialog.querySelector('.cat-viewer-dialog-close');
  closeBtn.addEventListener('click', () => {
    closeDialog();
  });

  // Close dialog when clicking on backdrop
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      closeDialog();
    }
  });

  // When image loads, hide loader
  img.addEventListener('load', () => {
    showLoader(false);
  });

  // Handle image load errors
  img.addEventListener('error', () => {
    showLoader(false);
    showError(block, 'Failed to load cat image');
  });
}

/**
 * Decorate the cat viewer block
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  // Extract worker URL from content or use default
  const workerUrl = extractWorkerUrl(block);

  // Clear the block content
  block.textContent = '';

  // Create the block structure
  const container = document.createElement('div');
  container.className = 'cat-viewer-container';

  // Create controls section
  const controls = createControls();
  container.appendChild(controls);

  // Create image display section
  const imageContainer = createImageContainer();
  container.appendChild(imageContainer);

  // Create info dialog
  const dialog = createInfoDialog();
  container.appendChild(dialog);

  block.appendChild(container);

  // Initialize the block
  try {
    await initialize(block, workerUrl, controls, imageContainer, dialog);
  } catch (error) {
    showError(block, 'Failed to initialize cat viewer. Please check that the middleware worker is running.');
    // eslint-disable-next-line no-console
    console.error('Cat viewer initialization error:', error);
  }
}
