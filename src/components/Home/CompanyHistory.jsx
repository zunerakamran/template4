import React, { useState } from 'react';
import { imgFallback, images } from '../../utils/img';

const historyData = [
  { year: '2010', step: '01', title: 'Started Business', desc: "We partner with you to enable your technology so you focus on your organization's mission, leveraging our top-tier talent.", img: images.intime06, highlight: 'Company Founded' },
  { year: '2012', step: '02', title: 'Resilience & Expansion', desc: 'A dedicated People Ops leader committed to the growth and continuous development of leaders across operations.', img: images.intime07, highlight: '10+ Key Partners' },
  { year: '2016', step: '03', title: 'Crisis & Opportunity', desc: 'Our support works around the clock to ensure your business operations are secure, resilient, and monitored safely.', img: images.intime09, highlight: '24/7 Support Launched' },
  { year: '2017', step: '04', title: '50+ Branches Milestone', desc: 'We cross industries and provide services to almost every business either as a co-managed or supplemental asset.', img: images.intime01, highlight: '50+ Nationwide Branches' },
  { year: '2019', step: '05', title: '100+ Global Branches', desc: 'Providing consulting expertise on vendor technology, IT budget strategy, and multi-cloud enterprise security.', img: images.intime04, highlight: 'Global Market Entry' },
  { year: '2021', step: '06', title: 'Industry Excellence Award', desc: 'Our team is held to the highest level of accountability to ensure exceptional satisfaction and proven results.', img: images.intime10, highlight: 'Top Enterprise Award' },
];

const CompanyHistory = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const eyebrow = data?.eyebrow || 'OUR JOURNEY';
  const heading = data?.heading || 'Our Company History';
  const subheading = data?.subheading || 'A decade of growth, innovation, and unwavering commitment to client success.';

  const activeItem = historyData[activeIndex];

  return (
    <section className="py-20 bg-slate-50/70 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto flex flex-col items-center">
          {eyebrow && <div className="intime-triple-slash justify-center">{eyebrow}</div>}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] tracking-tight mt-1 text-center">{heading}</h2>
          {subheading && <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed text-center">{subheading}</p>}
        </div>

        {/* Interactive Timeline Navigation Track */}
        <div className="relative mb-14 px-4">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-200 -translate-y-1/2 rounded-full hidden md:block z-0" />
          <div 
            className="absolute top-1/2 left-8 h-1 bg-[#C8102E] -translate-y-1/2 rounded-full hidden md:block transition-all duration-500 z-0"
            style={{ width: `${(activeIndex / (historyData.length - 1)) * 85}%` }}
          />

          {/* Stepper Buttons */}
          <div className="relative z-10 flex flex-wrap md:flex-nowrap justify-between gap-4 md:gap-0">
            {historyData.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.year}
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
                  <span 
                    className={`mt-2 text-xs font-semibold tracking-wider transition-colors duration-300 ${
                      isActive ? 'text-[#C8102E] font-bold' : 'text-gray-500 group-hover:text-[#0B1B3D]'
                    }`}
                  >
                    Step {item.step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Active Milestone Showcase Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mb-16 transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#C8102E]/10 text-[#C8102E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {activeItem.year} Milestone
                </span>
                <span className="text-gray-400 text-xs font-medium">• {activeItem.highlight}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1B3D] mb-4">
                {activeItem.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                {activeItem.desc}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : historyData.length - 1))}
                  className="px-4 py-2 border border-gray-200 hover:border-[#0B1B3D] rounded-lg text-xs font-bold text-[#0B1B3D] hover:bg-[#0B1B3D] hover:text-white transition-all"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev < historyData.length - 1 ? prev + 1 : 0))}
                  className="px-5 py-2 bg-[#C8102E] hover:bg-[#A00C23] text-white rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  Next Milestone →
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden bg-slate-900">
              <img
                {...imgFallback(activeItem.img)}
                src={activeItem.img}
                alt={activeItem.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/20 lg:to-transparent" />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg">
                <p className="text-xs font-bold text-[#0B1B3D]">Year {activeItem.year}</p>
                <p className="text-[10px] text-gray-500">{activeItem.title}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Overview Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyData.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <div
                key={item.year}
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
                <h4 className="text-base font-bold text-[#0B1B3D] mb-2">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CompanyHistory;