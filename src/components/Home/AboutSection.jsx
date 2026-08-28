import React from 'react';
import { imgFallback, images } from '../../utils/img';

const AboutSection = ({ data }) => {
  const eyebrow = data?.eyebrow || 'ABOUT US';
  const heading = data?.heading || 'Why will you choose our?';
  const subheading = data?.subheading || 'Our agency can only be as strong as our people & because of this, our team have designed game changing products.';
  const text = data?.text || "Intime is a design studio founded in London. Nowadays, we've grown and expanded our services, and have become a multinational firm, offering a variety of services and solutions Worldwide.";
  const imgUrl = data?.image_url || images.intime04;
  const expYears = data?.experience_years || '10+';

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
            <div className="flex items-center gap-4">
              <span className="circular-gauge">50%</span>
              <span className="text-sm font-semibold text-[#0B1B3D] max-w-[110px]">Business strategy growth</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="circular-gauge">75%</span>
              <span className="text-sm font-semibold text-[#0B1B3D] max-w-[110px]">Finance valuable ideas</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            {...imgFallback(imgUrl)}
            src={imgUrl}
            alt={heading}
            className="w-full h-[420px] object-cover intime-shadow"
          />
          <div className="absolute -bottom-6 -left-6 bg-[#C8102E] text-white px-8 py-6 shadow-xl">
            <div className="text-4xl font-bold leading-none mb-1">{expYears}</div>
            <div className="text-[11px] uppercase tracking-widest font-semibold">Years of<br />Experience</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;