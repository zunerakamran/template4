import React from 'react';

const logos = ['slack', 'Google', 'envato', 'Sketch', 'Figma'];

const ClientLogos = () => (
  <section className="py-14 bg-[#F9F9F9] border-t border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-14">
      {logos.map((l) => (
        <span key={l} className="client-logo-item text-2xl font-bold text-gray-400 grayscale hover:grayscale-0 transition-all cursor-pointer">
          {l}
        </span>
      ))}
    </div>
  </section>
);

export default ClientLogos;