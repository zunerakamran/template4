// src/templates/template4/utils/img.js
// All images are resolved from the local images index (ES module imports).
// This ensures Vite serves/bundles them from template4/assets/images/
// without needing any public-folder copies or custom middleware.

import { images } from '../assets/images.js';

// Build a multi-key lookup map to resolve any image key/filename/URL
// including Vite hashed names, raw filenames (intime-08.jpg), camelCase keys (intime08), etc.
const filenameMap = {};

if (images && typeof images === 'object') {
  Object.entries(images).forEach(([key, url]) => {
    if (typeof url !== 'string') return;

    // Extract raw filename from imported URL (e.g., intime-08-Bx9aL12z.jpg or intime-08.jpg)
    const rawFilename = url.split('/').pop().split('?')[0];

    // Strip Vite production hash if present (e.g. intime-08-C8a912b3.jpg -> intime-08.jpg)
    const cleanFilename = rawFilename.replace(/(-[a-zA-Z0-9_-]{8,})(\.[a-zA-Z0-9]+)$/, '$2');

    // Register all possible lookup variations
    const keysToRegister = [
      key,                                       // e.g. "intime08"
      key.toLowerCase(),                         // e.g. "intime08"
      rawFilename,                               // e.g. "intime-08-C8a912b3.jpg"
      rawFilename.toLowerCase(),
      cleanFilename,                             // e.g. "intime-08.jpg"
      cleanFilename.toLowerCase(),
      cleanFilename.replace(/\.[^/.]+$/, ''),    // e.g. "intime-08"
      cleanFilename.replace(/\.[^/.]+$/, '').toLowerCase(),
      cleanFilename.replace(/-/g, ''),           // e.g. "intime08.jpg"
      cleanFilename.replace(/-/g, '').replace(/\.[^/.]+$/, '') // e.g. "intime08"
    ];

    keysToRegister.forEach(k => {
      if (k && !filenameMap[k]) {
        filenameMap[k] = url;
      }
    });
  });
}

/**
 * Resolve any image path to the locally bundled URL.
 * - If url is already a data URL or blob URL, return as-is.
 * - If url is an unsplash placeholder from legacy backend, swap with high-res local asset.
 * - Looks up filename in the multi-key local images map.
 * - If not found and starts with / or http(s)://, returns url as-is.
 * - Otherwise falls back to images.intime08.
 */
export const getLocalImg = (url) => {
  if (!url) return images.intime08 || images.bgSlider1;

  if (typeof url === 'string') {
    // Intercept unsplash URLs from database and replace with local folder images
    if (url.includes('unsplash.com')) {
      if (url.includes('photo-1551836022')) return images.bgSlider1 || images.intime08;
      if (url.includes('photo-1560472354')) return images.bgSlider2 || images.intime12;
      if (url.includes('photo-1486406146')) return images.bgSlider3 || images.intime15;
      return images.bgSlider1 || images.intime08;
    }

    // Custom uploaded images from dashboard backend or data/blob URLs
    if (url.startsWith('/uploads') || url.includes('/uploads/') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }

    // Extract filename from given URL / string
    const filename = url.split('/').pop().split('?')[0];

    // Try filename lookup variations
    if (filenameMap[filename]) return filenameMap[filename];
    if (filenameMap[filename.toLowerCase()]) return filenameMap[filename.toLowerCase()];

    const noExt = filename.replace(/\.[^/.]+$/, '');
    if (filenameMap[noExt]) return filenameMap[noExt];

    const cleanHyphen = filename.replace(/-/g, '');
    if (filenameMap[cleanHyphen]) return filenameMap[cleanHyphen];

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url;
    }
  }

  return images.intime08 || images.bgSlider1;
};

/**
 * onError handler for <img> tags: swaps to local bundled copy on load failure.
 */
export const imgFallback = (fallbackUrl) => ({
  onError: (e) => {
    e.target.onerror = null;
    const defaultFallback = images.intime08 || images.bgSlider1;
    if (fallbackUrl) {
      const resolved = getLocalImg(fallbackUrl);
      e.target.src = (resolved !== fallbackUrl) ? resolved : defaultFallback;
    } else {
      e.target.src = defaultFallback;
    }
  },
});

// Re-export images for direct use in components
export { images };