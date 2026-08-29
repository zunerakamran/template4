import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { getLocalImg, imgFallback, images } from '../../utils/img';

const DEFAULT_ITEMS = [
  { heading: 'Market Expansion', category: 'Business Strategy', image_url: images.intime12, button_text: 'Read more', button_url: '#portfolio' },
  { heading: 'Business Growth', category: 'Investment', image_url: images.intime11, button_text: 'Read more', button_url: '#portfolio' },
  { heading: 'Tax Management', category: 'Tax Consulting', image_url: images.intime08, button_text: 'Read more', button_url: '#portfolio' },
  { heading: 'Investment Policy', category: 'Business Strategy', image_url: images.intime10, button_text: 'Read more', button_url: '#portfolio' },
  { heading: 'Manage Investment', category: 'Investment', image_url: images.intime04, button_text: 'Read more', button_url: '#portfolio' },
  { heading: 'Financial Advices', category: 'Tax Consulting', image_url: images.intime01, button_text: 'Read more', button_url: '#portfolio' },
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
    return [0, 1, 2, 3, 4, 5].map((i) => value[i] ?? value[String(i)]).filter((item) => item != null);
  }
  return [];
};

const extractSrc = (value) => {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (typeof value === 'object') {
    return firstText(
      value.url,
      value.path,
      value.relative_url,
      value.src,
      value.image_url,
      value.image,
      value.img,
    );
  }
  return '';
};

const pickImage = (data) => {
  const preview = extractSrc(data?.image_preview) || extractSrc(data?.preview_url) || extractSrc(data?.preview_image);
  if (preview) return preview;
  return (
    extractSrc(data?.image_url) ||
    extractSrc(data?.image) ||
    extractSrc(data?.img) ||
    extractSrc(data?.photo) ||
    extractSrc(data?.photo_url) ||
    extractSrc(data?.file) ||
    extractSrc(data?.src) ||
    ''
  );
};

const resolveItems = (data) => {
  const list = asList(data?.items).length
    ? asList(data?.items)
    : (asList(data?.projects).length ? asList(data?.projects) : asList(data?.boxes));

  return DEFAULT_ITEMS.map((fallback, i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const n = i + 1;
    const rawImg = pickImage({
      ...item,
      image_preview: data?.[`item_${n}_image_preview`] || item.image_preview,
      image_url: data?.[`item_${n}_image`] || data?.[`item_${n}_image_url`] || item.image_url,
    }) || fallback.image_url;

    return {
      heading: firstText(data?.[`item_${n}_heading`], item.heading, item.title, fallback.heading),
      category: firstText(data?.[`item_${n}_category`], item.category, item.cat, item.caption, fallback.category),
      image_url: getLocalImg(rawImg) || fallback.image_url,
      button_text: firstText(data?.[`item_${n}_button_text`], item.button_text, item.read_more, fallback.button_text),
      button_url: firstText(data?.[`item_${n}_button_url`], item.button_url, item.url, item.link, fallback.button_url),
    };
  });
};

const PortfolioSection = ({ data }) => {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const legacy = Boolean(data?.eyebrow && data?.subheading && !data?.items);
  const subheading = legacy
    ? firstText(data?.eyebrow)
    : (firstText(data?.subheading, data?.eyebrow) || 'COMPLETED PROJECTS');
  const heading = firstText(data?.heading) || 'You can check our projects as inspirations.';
  const items = resolveItems(data);
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, pageCount - 1);
  const visible = items.slice(safePage * perPage, safePage * perPage + perPage);

  return (
    <section id="portfolio" className="py-24 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          {subheading && <div className="intime-triple-slash justify-center">{subheading}</div>}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3">{heading}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {visible.map((p, i) => (
            <div key={`${p.heading}-${safePage}-${i}`} className="group relative h-[420px] overflow-hidden intime-shadow">
              <img {...imgFallback(p.image_url)} src={p.image_url} alt={p.heading} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/90 via-[#0B1B3D]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {p.category && (
                  <a href={p.button_url || '#portfolio'} className="text-[#C8102E] text-xs font-bold uppercase tracking-wider">{p.category}</a>
                )}
                <h3 className="text-white text-xl font-bold mt-1 mb-3">{p.heading}</h3>
                {p.button_text && (
                  <a href={p.button_url || '#portfolio'} className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.button_text} <FaArrowRight size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pageCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className={`h-2.5 rounded-full transition-all ${safePage === idx ? 'w-6 bg-[#C8102E]' : 'w-2.5 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
