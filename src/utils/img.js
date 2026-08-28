// All images are resolved from the local images index (ES module imports).
import { images } from '../assets/images.js';
import CONFIG from '../../config.js';

const uploadsOrigin = String(CONFIG.UPLOADS_ORIGIN || CONFIG.API_URL || '')
  .replace(/\/api\.php$/i, '');

const isAbsoluteOrInline = (url) =>
  /^(https?:|data:|blob:)/i.test(url);

const toUploadsUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  let next = url;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(next) && (next.includes('/uploads') || next.includes('/uploaded-images'))) {
    next = '/' + next.split('/').slice(-2).join('/');
  }
  if (isAbsoluteOrInline(next) && !next.includes('/uploads/') && !next.includes('/uploaded-images/')) return next;
  if (isAbsoluteOrInline(next)) return next;
  if (!uploadsOrigin) return next.startsWith('/') ? next : `/${next}`;
  const path = next.startsWith('/') ? next : `/${next}`;
  return `${uploadsOrigin}${path}`;
};

const isUploadPath = (url) =>
  typeof url === 'string' && (
    url.startsWith('/uploads') ||
    url.includes('/uploads/') ||
    url.startsWith('/uploaded-images') ||
    url.includes('/uploaded-images/')
  );

const filenameMap = {};

if (images && typeof images === 'object') {
  Object.entries(images).forEach(([key, url]) => {
    if (typeof url !== 'string') return;

    const rawFilename = url.split('/').pop().split('?')[0];
    const cleanFilename = rawFilename.replace(/-[A-Za-z0-9]{8}(\.[^.]+)$/, '$1');
    const stem = cleanFilename.replace(/\.[^/.]+$/, '');

    const keysToRegister = [
      key,
      key.toLowerCase(),
      rawFilename,
      rawFilename.toLowerCase(),
      cleanFilename,
      cleanFilename.toLowerCase(),
      stem,
      stem.toLowerCase(),
      cleanFilename.replace(/-/g, ''),
      stem.replace(/-/g, ''),
    ];

    keysToRegister.forEach((k) => {
      if (k && !filenameMap[k]) {
        filenameMap[k] = url;
      }
    });
  });
}

/**
 * Resolve any image path to a URL the browser can load.
 * Local names work with or without extension (intime-08 or intime-08.jpg).
 */
export const getLocalImg = (url) => {
  if (!url) return images.intime08 || images.bgSlider1;

  if (typeof url === 'object') {
    const nested = url.url || url.path || url.relative_url || url.src || url.image_url || url.image || url.img;
    if (nested) return getLocalImg(nested);
    return images.intime08 || images.bgSlider1;
  }

  if (typeof url === 'string') {
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }

    if (url.includes('unsplash.com')) {
      if (url.includes('photo-1551836022')) return images.bgSlider1 || images.intime08;
      if (url.includes('photo-1560472354')) return images.bgSlider2 || images.intime12;
      if (url.includes('photo-1486406146')) return images.bgSlider3 || images.intime15;
      return url;
    }

    if (isUploadPath(url) || (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(url) && (url.includes('/uploads') || url.includes('/uploaded-images')))) {
      return toUploadsUrl(url);
    }

    const filename = url.split('/').pop().split('?')[0];
    const noExt = filename.replace(/\.[^/.]+$/, '');

    if (filenameMap[filename]) return filenameMap[filename];
    if (filenameMap[filename.toLowerCase()]) return filenameMap[filename.toLowerCase()];
    if (filenameMap[noExt]) return filenameMap[noExt];
    if (filenameMap[noExt.toLowerCase()]) return filenameMap[noExt.toLowerCase()];

    const cleanHyphen = filename.replace(/-/g, '');
    if (filenameMap[cleanHyphen]) return filenameMap[cleanHyphen];
    if (filenameMap[noExt.replace(/-/g, '')]) return filenameMap[noExt.replace(/-/g, '')];

    if (isUploadPath(url)) return toUploadsUrl(url);
    if (isAbsoluteOrInline(url) || url.startsWith('/')) return isUploadPath(url) ? toUploadsUrl(url) : url;
  }

  return images.intime08 || images.bgSlider1;
};

const isKeptPreviewSrc = (url) =>
  typeof url === 'string' &&
  (/^(data:|blob:|https?:)/i.test(url) || isUploadPath(url));

export const imgFallback = (fallbackUrl) => ({
  onError: (e) => {
    e.target.onerror = null;
    const current = e.target.src || '';
    if (isKeptPreviewSrc(current) || isKeptPreviewSrc(fallbackUrl)) {
      return;
    }
    const defaultFallback = images.intime08 || images.bgSlider1;
    const resolved = fallbackUrl ? getLocalImg(fallbackUrl) : null;
    if (resolved && resolved !== current) {
      e.target.src = resolved;
    } else {
      e.target.src = defaultFallback;
    }
  },
});

export { images };
