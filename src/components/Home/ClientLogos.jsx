import React from 'react';
import { getLocalImg, imgFallback } from '../../utils/img';

const DEFAULT_ITEMS = [
  { name: 'slack', image_url: '' },
  { name: 'Google', image_url: '' },
  { name: 'envato', image_url: '' },
  { name: 'Sketch', image_url: '' },
  { name: 'Figma', image_url: '' },
];

const firstText = (...vals) => {
  for (const v of vals) {
    if (v == null) continue;
    if (typeof v === 'object') continue;
    if (String(v).trim() !== '') return v;
  }
  return '';
};

const asList = (raw) => {
  if (!raw) return [];
  let value = raw;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return []; }
  }
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') {
    return [0, 1, 2, 3, 4].map((i) => value[i] ?? value[String(i)]).filter((item) => item != null);
  }
  return [];
};

const extractSrc = (value) => {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (typeof value === 'object') {
    return firstText(value.url, value.path, value.relative_url, value.src, value.image_url, value.image, value.img, value.logo);
  }
  return '';
};

const pickImage = (item, data, index) => {
  const n = index + 1;
  const preview = extractSrc(item?.image_preview) || extractSrc(data?.[`logo_${n}_preview`]);
  if (preview) return preview;
  return extractSrc(item?.image_url) || extractSrc(item?.image) || extractSrc(item?.img) || extractSrc(item?.logo) || extractSrc(data?.[`logo_${n}`]) || '';
};

const resolveItems = (data) => {
  const list = asList(data?.items).length ? asList(data?.items) : asList(data?.logos);
  return DEFAULT_ITEMS.map((fallback, i) => {
    const raw = list[i];
    const item = typeof raw === 'string' ? { name: raw } : (raw && typeof raw === 'object' ? raw : {});
    const image = pickImage(item, data, i);
    return {
      name: firstText(item.name, item.label, item.title, item.text, fallback.name),
      img: image ? getLocalImg(image) : '',
    };
  });
};

const ClientLogos = ({ data }) => {
  const logos = resolveItems(data);

  return (
    <section className="py-14 bg-[#F9F9F9] border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-14">
        {logos.map((logo, index) => (
          <span
            key={`${logo.name}-${index}`}
            className="client-logo-item text-2xl font-bold text-gray-400 grayscale hover:grayscale-0 transition-all cursor-pointer"
          >
            {logo.img ? (
              <img
                {...imgFallback(logo.img)}
                src={logo.img}
                alt={logo.name}
                className="h-8 sm:h-10 w-auto max-w-[140px] object-contain"
              />
            ) : (
              logo.name
            )}
          </span>
        ))}
      </div>
    </section>
  );
};

export default ClientLogos;
