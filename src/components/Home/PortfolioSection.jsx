import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { imgFallback, images } from '../../utils/img';

const projects = [
  { title: 'Market Expansion', cat: 'Business Strategy', img: images.intime12 },
  { title: 'Business Growth', cat: 'Investment', img: images.intime11 },
  { title: 'Tax Management', cat: 'Tax Consulting', img: images.intime08 },
  { title: 'Investment Policy', cat: 'Business Strategy', img: images.intime10 },
  { title: 'Manage Investment', cat: 'Investment', img: images.intime04 },
  { title: 'Financial Advices', cat: 'Tax Consulting', img: images.intime01 },
];

const PortfolioSection = () => {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const visible = projects.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="portfolio" className="py-24 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="intime-triple-slash justify-center">COMPLETED PROJECTS</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3">You can check our projects as inspirations.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {visible.map((p) => (
            <div key={p.title} className="group relative h-[420px] overflow-hidden intime-shadow">
              <img {...imgFallback(p.img)} src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/90 via-[#0B1B3D]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <a href="#portfolio" className="text-[#C8102E] text-xs font-bold uppercase tracking-wider">{p.cat}</a>
                <h3 className="text-white text-xl font-bold mt-1 mb-3">{p.title}</h3>
                <a href="#portfolio" className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more <FaArrowRight size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: Math.ceil(projects.length / perPage) }).map((_, idx) => (
            <button key={idx} onClick={() => setPage(idx)}
              className={`h-2.5 rounded-full transition-all ${page === idx ? 'w-6 bg-[#C8102E]' : 'w-2.5 bg-gray-300'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;