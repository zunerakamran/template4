import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from 'react-icons/fa';
import { getLocalImg, imgFallback, images } from '../../utils/img';

const DEFAULT_ITEMS = [
  { quote: 'Working with several word press themes and templates the last years, I only can say this is the best in every level. I use it for my company and the reviews that I have already are all excellent.', name: 'Alina Lora', role: 'Former Manager, Intime', image_url: images.testimonial01 },
  { quote: 'This is one of the BEST THEMES I have ever worked with. The extra bells and whistles added to it are amazing. Elementor features add extra flavor. The customer support is very responsive.', name: 'Rohan Jho', role: 'Former Manager, Intime', image_url: images.testimonial02 },
  { quote: 'Great theme, one of the best I have worked with in a while. Full featured and great support for the minor issues I had which were really my not being skilled/experienced enough.', name: 'Donald Frew', role: 'Former Manager, Intime', image_url: images.testimonial03 },
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
  return extractSrc(data?.image_url) || extractSrc(data?.image) || extractSrc(data?.img) || extractSrc(data?.photo) || '';
};

const resolveItems = (data) => {
  const list = asList(data?.items).length ? asList(data?.items) : asList(data?.testimonials);
  return DEFAULT_ITEMS.map((fallback, i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const n = i + 1;
    const rawImg = pickImage({
      ...item,
      image_preview: data?.[`item_${n}_image_preview`] || item.image_preview,
      image_url: data?.[`item_${n}_image`] || data?.[`item_${n}_image_url`] || item.image_url,
    }) || fallback.image_url;
    return {
      quote: firstText(item.quote, item.text, item.review, fallback.quote),
      name: firstText(item.name, item.title, item.author, fallback.name),
      role: firstText(item.role, item.position, item.job, item.desc, fallback.role),
      img: getLocalImg(rawImg),
    };
  });
};

const TestimonialsCarousel = ({ data }) => {
  const eyebrow = firstText(data?.eyebrow, data?.tagline, "CLIENT'S TESTIMONIALS");
  const heading = firstText(data?.heading, "We are Very Happy to Get Our Client's Reviews.");
  const subheading = firstText(data?.subheading, data?.reviews_label, data?.label, 'Clients Reviews:');
  const sideImage = getLocalImg(
    pickImage(data) || data?.side_image || images.intime17
  );
  const testimonials = resolveItems(data);

  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
  }, [data]);

  const safeIndex = testimonials.length ? i % testimonials.length : 0;
  const t = testimonials[safeIndex] || testimonials[0];
  const next = () => setI((prev) => (prev + 1) % testimonials.length);
  const prev = () => setI((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (!t) return null;

  return (
    <section className="py-24 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="intime-triple-slash">{eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3 mb-6">{heading}</h2>
          <p className="text-sm font-bold text-[#C8102E] uppercase tracking-wider mb-4">{subheading}</p>

          <div className="relative">
            <FaQuoteRight className="text-[#C8102E]/20 absolute -top-2 right-0" size={40} />
            <blockquote className="testimonial-quote-border text-gray-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <img {...imgFallback(t.img)} src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h4 className="font-bold text-[#0B1B3D]">{t.name}</h4>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button type="button" onClick={prev} className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-[#C8102E] hover:border-[#C8102E] hover:text-white transition-colors">
              <FaChevronLeft size={12} />
            </button>
            <button type="button" onClick={next} className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-[#C8102E] hover:border-[#C8102E] hover:text-white transition-colors">
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <img
            {...imgFallback(sideImage)}
            src={sideImage}
            alt="Client"
            className="w-full h-[480px] object-cover intime-shadow"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
