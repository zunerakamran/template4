import React from 'react';
import { FaArrowRight, FaChartPie, FaTasks, FaLandmark, FaCoins, FaHandHoldingUsd, FaSeedling } from 'react-icons/fa';

const services = [
  { icon: FaChartPie, title: 'Strategy & Planning', slug: 'strategy-planning' },
  { icon: FaTasks, title: 'Program Manager', slug: 'program-manager' },
  { icon: FaLandmark, title: 'Tax Management', slug: 'tax-management' },
  { icon: FaCoins, title: 'Investment Policy', slug: 'investment-policy' },
  { icon: FaHandHoldingUsd, title: 'Financial Advices', slug: 'financial-advices' },
  { icon: FaSeedling, title: 'Business Growth Plan', slug: 'business-growth-plan' },
];

const DESC = 'Collaborate Consulting exists to find the place where being seeming disparate interests meet.';

const FeaturedServices = () => (
  <section id="services" className="py-24 bg-[#F9F9F9]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="intime-triple-slash justify-center">FEATURED SERVICES</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3 mb-4">We help to get Solutions!</h2>
        <p className="text-gray-500">
          Provide users with appropriate view and access permissions to requests, problems, changes, contracts, assets, solutions
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s) => (
          <div key={s.slug} className="group bg-white intime-shadow border border-gray-100 p-8">
            <span className="hexagon-badge mb-6"><s.icon size={22} /></span>
            <h3 className="text-lg font-bold text-[#0B1B3D] mb-3">{s.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{DESC}</p>
            <a href={`#service-${s.slug}`} className="inline-flex items-center gap-2 text-[#C8102E] text-xs font-bold uppercase tracking-wider">
              Read more <FaArrowRight size={10} />
            </a>
          </div>
        ))}
      </div>

      <div className="text-center mt-14">
        <button className="btn-intime-outline">LOAD MORE</button>
      </div>
    </div>
  </section>
);

export default FeaturedServices;