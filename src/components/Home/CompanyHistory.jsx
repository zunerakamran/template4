import React, { useState } from 'react';
import { getLocalImg, imgFallback, images } from '../../utils/img';

const DEFAULT_YEARS = [
  { year: '2010', red_text: '2010 Milestone', grey_text: 'Company Founded', heading: 'Started Business', image_url: images.intime06, text: "We partner with you to enable your technology so you focus on your organization's mission, leveraging our top-tier talent." },
  { year: '2012', red_text: '2012 Milestone', grey_text: '10+ Key Partners', heading: 'Resilience & Expansion', image_url: images.intime07, text: 'A dedicated People Ops leader committed to the growth and continuous development of leaders across operations.' },
  { year: '2016', red_text: '2016 Milestone', grey_text: '24/7 Support Launched', heading: 'Crisis & Opportunity', image_url: images.intime09, text: 'Our support works around the clock to ensure your business operations are secure, resilient, and monitored safely.' },
  { year: '2017', red_text: '2017 Milestone', grey_text: '50+ Nationwide Branches', heading: '50+ Branches Milestone', image_url: images.intime01, text: 'We cross industries and provide services to almost every business either as a co-managed or supplemental asset.' },
  { year: '2019', red_text: '2019 Milestone', grey_text: 'Global Market Entry', heading: '100+ Global Branches', image_url: images.intime04, text: 'Providing consulting expertise on vendor technology, IT budget strategy, and multi-cloud enterprise security.' },
  { year: '2021', red_text: '2021 Milestone', grey_text: 'Top Enterprise Award', heading: 'Industry Excellence Award', image_url: images.intime10, text: 'Our team is held to the highest level of accountability to ensure exceptional satisfaction and proven results.' },
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

const yearFromRedText = (redText, fallbackYear) => {
  const match = String(redText || '').match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : fallbackYear;
};

const resolveYears = (data) => {
  const list = asList(data?.years).length
    ? asList(data?.years)
    : (asList(data?.items).length ? asList(data?.items) : asList(data?.milestones));

  return DEFAULT_YEARS.map((fallback, i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const n = i + 1;
    const redText = firstText(
      data?.[`year_${n}_red_text`],
      data?.[`year_${n}_milestone`],
      item.red_text,
      item.milestone,
      item.badge,
      item.year_label,
      item.year ? `${item.year} Milestone` : '',
      fallback.red_text,
    );
    const year = firstText(
      data?.[`year_${n}`],
      data?.[`year_${n}_year`],
      item.year,
      yearFromRedText(redText, fallback.year),
      fallback.year,
    );
    const greyText = firstText(
      data?.[`year_${n}_grey_text`],
      data?.[`year_${n}_highlight`],
      item.grey_text,
      item.highlight,
      item.caption,
      item.subtitle,
      fallback.grey_text,
    );
    const heading = firstText(
      data?.[`year_${n}_heading`],
      data?.[`year_${n}_title`],
      item.heading,
      item.title,
      fallback.heading,
    );
    const text = firstText(
      data?.[`year_${n}_text`],
      data?.[`year_${n}_desc`],
      item.text,
      item.desc,
      item.description,
      fallback.text,
    );
    const rawImg = pickImage({
      ...item,
      image_preview: data?.[`year_${n}_image_preview`] || item.image_preview,
      image_url: data?.[`year_${n}_image`] || data?.[`year_${n}_image_url`] || item.image_url,
    }) || fallback.image_url;

    return {
      year,
      red_text: redText || `${year} Milestone`,
      grey_text: greyText,
      heading,
      text,
      image_url: getLocalImg(rawImg) || fallback.image_url,
    };
  });
};

const CompanyHistory = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const legacyBodyAsText = Boolean(data?.eyebrow && data?.subheading && !data?.text && !data?.years);
  const subheading = legacyBodyAsText
    ? firstText(data?.eyebrow)
    : (firstText(data?.subheading, data?.eyebrow) || 'OUR JOURNEY');
  const heading = firstText(data?.heading) || 'Our Company History';
  const text = legacyBodyAsText
    ? firstText(data?.subheading)
    : (firstText(data?.text) || 'A decade of growth, innovation, and unwavering commitment to client success.');

  const years = resolveYears(data);
  const safeIndex = Math.min(activeIndex, years.length - 1);
  const activeItem = years[safeIndex];

  return (
    <section className="py-20 bg-slate-50/70 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14 text-center max-w-3xl mx-auto flex flex-col items-center">
          {subheading && <div className="intime-triple-slash justify-center">{subheading}</div>}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] tracking-tight mt-1 text-center">{heading}</h2>
          {text && <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed text-center">{text}</p>}
        </div>

        <div className="relative mb-14 px-4">
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-200 -translate-y-1/2 rounded-full hidden md:block z-0" />
          <div
            className="absolute top-1/2 left-8 h-1 bg-[#C8102E] -translate-y-1/2 rounded-full hidden md:block transition-all duration-500 z-0"
            style={{ width: `${(safeIndex / (years.length - 1)) * 85}%` }}
          />

          <div className="relative z-10 flex flex-wrap md:flex-nowrap justify-between gap-4 md:gap-0">
            {years.map((item, index) => {
              const isActive = index === safeIndex;
              return (
                <button
                  key={`${item.year}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  className="flex flex-col items-center group focus:outline-none transition-all duration-300 flex-1 min-w-[90px]"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all duration-300 shadow-sm ${
                      isActive
                        ? 'bg-[#C8102E] text-white border-[#C8102E] scale-110 shadow-lg ring-4 ring-[#C8102E]/20'
                        : 'bg-white text-[#0B1B3D] border-gray-300 group-hover:border-[#C8102E] group-hover:text-[#C8102E]'
                    }`}
                  >
                    {item.year}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mb-16 transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">

            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#C8102E]/10 text-[#C8102E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {activeItem.red_text}
                </span>
                {activeItem.grey_text && (
                  <span className="text-gray-400 text-xs font-medium">• {activeItem.grey_text}</span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1B3D] mb-4">
                {activeItem.heading}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                {activeItem.text}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : years.length - 1))}
                  className="px-4 py-2 border border-gray-200 hover:border-[#0B1B3D] rounded-lg text-xs font-bold text-[#0B1B3D] hover:bg-[#0B1B3D] hover:text-white transition-all"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev < years.length - 1 ? prev + 1 : 0))}
                  className="px-5 py-2 bg-[#C8102E] hover:bg-[#A00C23] text-white rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  Next Milestone →
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden bg-slate-900">
              <img
                key={activeItem.image_url}
                {...imgFallback(activeItem.image_url)}
                src={activeItem.image_url}
                alt={activeItem.heading}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/20 lg:to-transparent" />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg">
                <p className="text-xs font-bold text-[#0B1B3D]">Year {activeItem.year}</p>
                <p className="text-[10px] text-gray-500">{activeItem.heading}</p>
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {years.map((item, idx) => {
            const isSelected = idx === safeIndex;
            return (
              <div
                key={`${item.year}-card-${idx}`}
                onClick={() => setActiveIndex(idx)}
                className={`cursor-pointer bg-white rounded-xl border p-6 transition-all duration-300 relative hover:-translate-y-1 hover:shadow-lg ${
                  isSelected
                    ? 'border-[#C8102E] ring-2 ring-[#C8102E]/20 shadow-md'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#C8102E] font-serif">{item.year}</span>
                  <span className="text-xs font-bold text-gray-400">0{idx + 1}</span>
                </div>
                <h4 className="text-base font-bold text-[#0B1B3D] mb-2">{item.heading}</h4>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.text}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CompanyHistory;
