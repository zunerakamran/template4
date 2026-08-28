// src/templates/template4/utils/img.js
// All images are resolved from the local images index (ES module imports).
// This ensures Vite serves/bundles them from template4/assets/images/
// without needing any public-folder copies or custom middleware.

import { images } from '../assets/images';

// Map of filename → imported URL (populated from the images index)
const filenameMap = Object.fromEntries(
  Object.values(images).map((url) => {
    const filename = url.split('/').pop().split('?')[0];
    return [filename, url];
  })
);

/**
 * Resolve any image path to the locally bundled URL.
 * - If url is already a bundled/data URL (starts with /, data:, or blob:), return as-is.
 * - Otherwise extract the filename and look it up in the local images map.
 * - Falls back to placeholder.png if not found.
 */
export const getLocalImg = (url) => {
  if (!url) return images.intime08 || images.placeholder;
  if (
    typeof url === 'string' &&
    (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/uploads') || url.startsWith('data:') || url.startsWith('blob:'))
  ) {
    return url;
  }
  const filename = String(url).split('/').pop().split('?')[0];
  return filenameMap[filename] || (typeof url === 'string' && url.startsWith('/') ? url : (images.intime08 || images.placeholder));
};

/**
 * onError handler for <img> tags: swaps to the local bundled copy on load failure.
 */
export const imgFallback = (fallbackUrl) => ({
  onError: (e) => {
    e.target.onerror = null;
    if (fallbackUrl) {
      const filename = fallbackUrl.split('/').pop().split('?')[0];
      e.target.src = filenameMap[filename] || images.placeholder;
    } else {
      e.target.src = images.placeholder;
    }
  },
});

// Re-export images for direct use in components
export { images };