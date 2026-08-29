import React from 'react';
import { FaUser, FaFolder, FaArrowRight } from 'react-icons/fa';
import { getLocalImg, imgFallback, images } from '../../utils/img';

const DEFAULT_EXCERPT = 'The theory was first published in 2008 a press released under the name of Cliff Arnall, who at the time was a tutor at the…';

const DEFAULT_ITEMS = [
  { date: '10', month: 'Nov, 20', author: 'John Doe', cat: 'Consulting', title: 'We would love to share a similar experience', excerpt: DEFAULT_EXCERPT, image_url: images.intime03, button_text: 'Read more', button_url: '#news' },
  { date: '06', month: 'Nov, 20', author: 'John Doe', cat: 'HR Consulting', title: 'We glad to discuss your organisation situation.', excerpt: DEFAULT_EXCERPT, image_url: images.intime02, button_text: 'Read more', button_url: '#news' },
  { date: '20', month: 'Oct, 20', author: 'John Doe', cat: 'Consulting', title: 'In this context our main approach was to build.', excerpt: DEFAULT_EXCERPT, image_url: images.intime05, button_text: 'Read more', button_url: '#news' },
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
    return [0, 1, 2].map((i) => value[i] ?? value[String(i)]).filter((item) => item != null);
  }
  return [];
};

const extractSrc = (value) => {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (typeof value === 'object') {
    return firstText(value.url, value.path, value.relative_url, value.src, value.image_url, value.image, value.img);
  }
  return '';
};

const pickImage = (data) => {
  const preview = extractSrc(data?.image_preview) || extractSrc(data?.preview_url);
  if (preview) return preview;
  return extractSrc(data?.image_url) || extractSrc(data?.image) || extractSrc(data?.img) || '';
};

const resolveItems = (data) => {
  const list = asList(data?.items).length ? asList(data?.items) : asList(data?.posts);
  return DEFAULT_ITEMS.map((fallback, i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const n = i + 1;
    const rawImg = pickImage({
      ...item,
      image_preview: data?.[`item_${n}_image_preview`] || item.image_preview,
      image_url: data?.[`item_${n}_image`] || data?.[`item_${n}_image_url`] || item.image_url,
    }) || fallback.image_url;
    return {
      date: firstText(item.date, item.day, fallback.date),
      month: firstText(item.month, item.month_label, fallback.month),
      author: firstText(item.author, item.by, fallback.author),
      cat: firstText(item.cat, item.category, item.tag, fallback.cat),
      title: firstText(item.title, item.heading, fallback.title),
      excerpt: firstText(item.excerpt, item.text, item.desc, item.description, fallback.excerpt),
      img: getLocalImg(rawImg),
      button_text: firstText(item.button_text, item.read_more, data?.button_text, fallback.button_text),
      button_url: firstText(item.button_url, item.url, item.link, data?.button_url, fallback.button_url),
    };
  });
};

const LatestNews = ({ data }) => {
  const eyebrow = firstText(data?.eyebrow, data?.tagline, 'OUR LATEST NEWS');
  const heading = firstText(data?.heading, 'Learn about our latest news from blog.');
  const posts = resolveItems(data);

  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="intime-triple-slash justify-center">{eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3">{heading}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((p, index) => (
            <article key={`${p.title}-${index}`} className="intime-shadow border border-gray-100 group">
              <div className="relative h-52 overflow-hidden">
                <img {...imgFallback(p.img)} src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-[#C8102E] text-white text-center px-3 py-2 leading-none">
                  <div className="text-lg font-bold">{p.date}</div>
                  <div className="text-[10px]">{p.month}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-3">
                  <span className="flex items-center gap-1.5"><FaUser size={9} /> {p.author}</span>
                  <span className="flex items-center gap-1.5"><FaFolder size={9} /> {p.cat}</span>
                </div>
                <h3 className="text-base font-bold text-[#0B1B3D] mb-3 leading-snug">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{p.excerpt}</p>
                <a href={p.button_url} className="inline-flex items-center gap-2 text-[#C8102E] text-xs font-bold uppercase tracking-wider">
                  {p.button_text} <FaArrowRight size={10} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
