import React from 'react';
import { getLocalImg, imgFallback, images } from '../../utils/img';

const DEFAULT_GAUGES = [
  { value: '50%', label: 'Business strategy growth' },
  { value: '75%', label: 'Finance valuable ideas' },
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
    return [0, 1].map((i) => value[i] ?? value[String(i)]).filter((item) => item != null);
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

const resolveGauges = (data) => {
  const list = asList(data?.gauges).length ? asList(data?.gauges) : asList(data?.stats);
  return [0, 1].map((i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const scalar = typeof list[i] === 'string' || typeof list[i] === 'number' ? list[i] : '';
    return {
      value: firstText(
        data?.[`percent_${i + 1}`],
        data?.[`percentage_${i + 1}`],
        data?.[`gauge_${i + 1}`],
        data?.[`gauge_${i + 1}_value`],
        item.value,
        item.percentage,
        item.percent,
        item.pct,
        item.number,
        scalar,
        DEFAULT_GAUGES[i].value,
      ),
      label: firstText(
        data?.[`percent_${i + 1}_text`],
        data?.[`percentage_${i + 1}_text`],
        data?.[`gauge_${i + 1}_text`],
        item.label,
        item.text,
        item.heading,
        item.title,
        item.caption,
        DEFAULT_GAUGES[i].label,
      ),
    };
  });
};

const AboutSection = ({ data }) => {
  const eyebrow = firstText(data?.eyebrow) || 'ABOUT US';
  const heading = firstText(data?.heading) || 'Why will you choose our?';
  const subheading = firstText(data?.subheading) || 'Our agency can only be as strong as our people & because of this, our team have designed game changing products.';
  const text = firstText(data?.text) || "Intime is a design studio founded in London. Nowadays, we've grown and expanded our services, and have become a multinational firm, offering a variety of services and solutions Worldwide.";
  const rawImg = pickImage(data) || images.intime04;
  const imgUrl = getLocalImg(rawImg) || images.intime04;
  const expYears = firstText(
    data?.experience_years,
    data?.red_box_number,
    data?.red_box,
    data?.years,
    data?.stat_value,
  ) || '10+';
  const expLabel = firstText(
    data?.experience_label,
    data?.red_box_text,
    data?.red_box_label,
    data?.years_label,
    data?.stat_label,
  ) || 'Years of Experience';
  const gauges = resolveGauges(data);

  return (
    <section id="about" className="py-24 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

        <div>
          <div className="intime-triple-slash">{eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3 mb-6">{heading}</h2>
          <p className="font-semibold text-[#0B1B3D] mb-4 leading-relaxed">
            {subheading}
          </p>
          <p className="text-gray-500 leading-relaxed mb-10">
            {text}
          </p>

          <div className="flex items-center gap-10">
            {gauges.map((gauge, i) => (
              <div key={`about-gauge-${i}-${gauge.value}-${gauge.label}`} className="flex items-center gap-4">
                <span className="circular-gauge">{gauge.value}</span>
                <span className="text-sm font-semibold text-[#0B1B3D] max-w-[110px]">{gauge.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <img
            key={imgUrl}
            {...imgFallback(imgUrl)}
            src={imgUrl}
            alt={heading}
            className="w-full h-[420px] object-cover intime-shadow"
          />
          <div className="absolute -bottom-6 -left-6 bg-[#C8102E] text-white px-8 py-6 shadow-xl">
            <div className="text-4xl font-bold leading-none mb-1">{expYears}</div>
            <div className="text-[11px] uppercase tracking-widest font-semibold whitespace-pre-line">{expLabel}</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
