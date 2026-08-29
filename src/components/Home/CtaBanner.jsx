import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const firstText = (...vals) => {
  for (const v of vals) {
    if (v == null) continue;
    if (typeof v === 'object') continue;
    if (String(v).trim() !== '') return v;
  }
  return '';
};

const CtaBanner = ({ data }) => {
  const heading = firstText(data?.heading, data?.title, 'Looking for the Best Business Consulting?');
  const subheading = firstText(data?.subheading, data?.text, data?.desc, data?.description, 'As a web crawler expert, we will help to organize.');
  const btnText = firstText(data?.button_text, data?.btn_text, data?.button, 'GET A QUOTE');
  const btnUrl = firstText(data?.button_url, data?.btn_url, data?.url, data?.link, '#appointment');

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
