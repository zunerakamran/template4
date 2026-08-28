import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { getLocalImg, imgFallback, images } from '../../utils/img';

const DEFAULT_TEXT = 'Improve efficiency, provide a better customer experience with modern technology services available around the world. Our skilled staff, combined with decades of experience.';

const DEFAULT_BOXES = [
  {
    image_url: images.intime12,
    heading: 'Business & Strategy',
    text: "If you're looking for car insurance, we will help you to find the coverage that budget friendly.",
    button_text: 'Read more',
    button_url: '#services',
  },
  {
    image_url: images.intime06,
    heading: 'Business Planner',
    text: "If you're looking for car insurance, we will help you to find the coverage that budget friendly.",
    button_text: 'Read more',
    button_url: '#services',
  },
  {
    image_url: images.intime15,
    heading: 'Business Intelligence',
    text: "If you're looking for car insurance, we will help you to find the coverage that budget friendly.",
    button_text: 'Read more',
    button_url: '#services',
  },
];

const resolveBoxes = (data) => {
  const list = Array.isArray(data?.boxes) && data.boxes.length
    ? data.boxes
    : (Array.isArray(data?.items) && data.items.length ? data.items : null);
  if (!list) return DEFAULT_BOXES;
  return DEFAULT_BOXES.map((fallback, i) => ({
    ...fallback,
    ...(list[i] || {}),
  }));
};

const WhatWeDo = ({ data }) => {
  const legacyBodyAsSubheading = Boolean(data?.eyebrow && data?.subheading && !data?.text && !data?.boxes);
  const subheading = legacyBodyAsSubheading
    ? data.eyebrow
    : (data?.subheading || data?.eyebrow || 'WHAT WE DO');
  const heading = data?.heading || 'We are the best agency to improve your deals.';
  const text = legacyBodyAsSubheading
    ? data.subheading
    : (data?.text || DEFAULT_TEXT);
  const boxes = resolveBoxes(data);

  return (
    <section id="what-we-do" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-14">
          <div>
            <div className="intime-triple-slash">{subheading}</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3">{heading}</h2>
          </div>
          <p className="text-gray-500 leading-relaxed">
            {text}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {boxes.map((box, i) => {
            const title = box.heading || box.title || DEFAULT_BOXES[i]?.heading;
            const imgSrc = getLocalImg(box.image_url || box.img || box.image || box.bg || DEFAULT_BOXES[i]?.image_url);
            const body = box.text || box.desc || DEFAULT_BOXES[i]?.text;
            const buttonText = box.button_text || box.read_more || 'Read more';
            const buttonUrl = box.button_url || box.url || box.link || '#services';

            return (
              <div key={`${title}-${i}`} className="group intime-shadow bg-white border border-gray-100">
                <div className="relative h-52 overflow-hidden">
                  <img
                    {...imgFallback(imgSrc)}
                    src={imgSrc}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="pt-8 pb-8 px-6">
                  <h3 className="text-lg font-bold text-[#0B1B3D] mb-3">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{body}</p>
                  <a href={buttonUrl} className="inline-flex items-center gap-2 text-[#C8102E] text-xs font-bold uppercase tracking-wider">
                    {buttonText} <FaArrowRight size={10} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
