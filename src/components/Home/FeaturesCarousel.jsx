import React, { useState } from 'react';
import { FaArrowRight, FaBriefcase, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { imgFallback, images } from '../../utils/img';

const features = [
  { icon: FaBriefcase, title: 'Business & Strategy', img: images.intime12 },
  { icon: FaChartLine, title: 'Business Planner', img: images.intime06 },
  { icon: FaLightbulb, title: 'Business Intelligence', img: images.intime15 },
];

const DESC = "If you're looking for car insurance, we will help you to find the coverage that budget friendly.";

const FeaturesCarousel = ({ data }) => {
  const [active, setActive] = useState(0);

  const eyebrow = data?.eyebrow || 'FEATURES';
  const heading = data?.heading || 'We are the best agency to improve your deals.';
  const subheading = data?.subheading || 'Improve efficiency, provide a better customer experience with modern technology services available around the world. Our skilled staff, combined with decades of experience.';

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-14">
          <div>
            <div className="intime-triple-slash">{eyebrow}</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3">{heading}</h2>
          </div>
          <p className="text-gray-500 leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={f.title} className="group intime-shadow bg-white border border-gray-100">
              <div className="relative h-52 overflow-hidden">
                <img {...imgFallback(f.img)} src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="card-icon-badge absolute -bottom-6 left-6 w-14 h-14 rounded-full bg-[#C8102E] text-white flex items-center justify-center text-lg shadow-lg">
                  <f.icon size={18} />
                </span>
              </div>
              <div className="pt-10 pb-8 px-6">
                <h3 className="text-lg font-bold text-[#0B1B3D] mb-3">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{DESC}</p>
                <a href="#services" className="inline-flex items-center gap-2 text-[#C8102E] text-xs font-bold uppercase tracking-wider">
                  Read more <FaArrowRight size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default FeaturesCarousel;