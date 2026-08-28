import React, { useState, useEffect } from 'react';
import { FaPlay, FaArrowRight } from 'react-icons/fa';
import { getLocalImg, imgFallback, images } from '../../utils/img';

const DEFAULT_SLIDES = [
  {
    id: 1,
    bg: images.bgSlider1 || images.intime08,
    eyebrow: 'FINANCIAL CENTRE & WEALTH MANAGEMENT',
    heading: 'Prosper in this volatile market funding.',
    subheading: 'Customized financial planning, investment strategies, and fiduciary advice for leaders and families.',
    title: ['Prosper in this', 'volatile market', 'funding.'],
  },
  {
    id: 2,
    bg: images.bgSlider2 || images.intime12,
    eyebrow: 'STRATEGIC GROWTH & ADVISORY',
    heading: 'We do the best thing for market funding.',
    subheading: 'Comprehensive solutions tailored to accelerate your financial goals and wealth stability.',
    title: ['We do the best', 'thing for market', 'funding.'],
  },
  {
    id: 3,
    bg: images.bgSlider3 || images.intime15,
    eyebrow: 'TRUSTED FIDUCIARY ADVISORY',
    heading: 'We have to do business for your satisfaction.',
    subheading: 'Dedicated experts navigating market complexity to protect and grow your assets.',
    title: ['We have to do', 'business for your', 'Satisfiction.'],
  },
];

const resolveSlides = (data) => {
  if (Array.isArray(data?.slides) && data.slides.length > 0) {
    return data.slides;
  }
  if (data && (data.heading || data.eyebrow || data.subheading || data.image_url || data.bg)) {
    return [{
      id: 1,
      bg: data.bg || data.image_url,
      eyebrow: data.eyebrow,
      heading: data.heading,
      subheading: data.subheading,
      text: data.text,
      button_text: data.button_text,
      button_url: data.button_url,
      youtube_url: data.youtube_url,
    }];
  }
  return DEFAULT_SLIDES;
};

const HeroSlider = ({ data, ready = false }) => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const hasApiData = Boolean(
    (Array.isArray(data?.slides) && data.slides.length > 0) ||
    data?.heading || data?.eyebrow || data?.subheading || data?.image_url || data?.bg
  );
  const waiting = !ready && !hasApiData;
  const slides = waiting ? [] : resolveSlides(data);

  const goTo = (idx) => {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 250);
  };

  useEffect(() => {
    if (slides.length === 0) return undefined;
    const t = setInterval(() => goTo((current + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [current, slides.length]);

  if (waiting) {
    return (
      <section
        id="hero"
        className="relative w-full overflow-hidden bg-[#0B1B3D]"
        style={{ minHeight: '680px' }}
        aria-busy="true"
      />
    );
  }

  const slide = slides[current];
  const activeBg = slide?.bg || slide?.image_url || images.intime08;
  const bgUrl = getLocalImg(activeBg);
  const eyebrow = slide?.eyebrow || 'FINANCIAL CENTRE & WEALTH MANAGEMENT';
  const heading = slide?.heading;
  const subheading = slide?.subheading || 'Customized financial planning, investment strategies, and fiduciary advice for leaders and families.';
  const text = slide?.text || '';
  const buttonText = slide?.button_text || 'GET IN TOUCH';
  const buttonUrl = slide?.button_url || '#appointment';
  const youtubeUrl = slide?.youtube_url || 'https://www.youtube.com/watch?v=SF4aHwxHtZ0';
  
  const activeTitleLines = heading ? [heading] : (slide?.title || ['Default Title']);

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#0B1B3D]" style={{ minHeight: '680px' }}>
      <img
        {...imgFallback(bgUrl)}
        src={bgUrl}
        alt="Intime"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: fading ? 0 : 1 }}
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.92) 40%, rgba(255,255,255,0.35) 65%, rgba(11,27,61,0.15) 100%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 flex items-center" style={{ minHeight: '680px' }}>
        <div className="max-w-2xl py-24" style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease' }}>
          <div className="intime-triple-slash mb-5">{eyebrow}</div>

          <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-[#0B1B3D] leading-tight mb-6 tracking-tight">
            {activeTitleLines.map((line, i) => <span key={i}>{line}<br /></span>)}
          </h1>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-10 max-w-md">{subheading}</p>

          {text && (
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-10 max-w-md">{text}</p>
          )}

          <div className="flex items-center gap-6 flex-wrap">
            <a href={buttonUrl} className="btn-intime-red text-sm">
              <span>{buttonText}</span>
              <FaArrowRight size={12} />
            </a>
            <a href={youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 group">
              <span className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-[#C8102E] group-hover:bg-[#C8102E] group-hover:text-white transition-all">
                <FaPlay size={14} className="ml-1" />
              </span>
              <span className="text-[#0B1B3D] font-bold text-xs tracking-wider uppercase group-hover:text-[#C8102E] transition-colors">SEE OUR ACTIVITY</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right-side vertical numbered slide nav (matches demo) */}
      <div className="hidden md:flex flex-col absolute right-0 top-1/2 -translate-y-1/2 z-20">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => goTo(idx)}
            className={`w-14 h-14 flex items-center justify-center font-bold text-sm border-b border-white/10 transition-colors ${
              current === idx ? 'bg-[#C8102E] text-white' : 'bg-[#0B1B3D]/70 text-white/60 hover:bg-[#C8102E]/70'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;