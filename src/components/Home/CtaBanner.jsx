import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const CtaBanner = ({ data }) => {
  const heading = data?.heading || 'Looking for the Best Business Consulting?';
  const subheading = data?.subheading || 'As a web crawler expert, we will help to organize.';
  const btnText = data?.button_text || 'GET A QUOTE';
  const btnUrl = data?.button_url || '#appointment';

  return (
    <section className="bg-[#0B1B3D] py-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{heading}</h3>
          <p className="text-gray-400">{subheading}</p>
        </div>
        <a href={btnUrl} className="btn-intime-red flex-shrink-0">
          <span>{btnText}</span>
          <FaArrowRight size={11} />
        </a>
      </div>
    </section>
  );
};

export default CtaBanner;