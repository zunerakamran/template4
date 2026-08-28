import React from 'react';
import { FaShieldAlt, FaChartLine } from 'react-icons/fa';

const bars = [
  { label: 'Business growth', year: '2018', pct: 70 },
  { label: 'Investment growth', year: '2019', pct: 80 },
  { label: 'Financial growth', year: '2020', pct: 90 },
];

const HexGrid = () => {
  const rows = [4, 3, 4, 3];
  return (
    <div className="flex flex-col items-center gap-[-6px]">
      {rows.map((count, r) => (
        <div key={r} className="flex" style={{ marginTop: r === 0 ? 0 : -18 }}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="w-24 h-28 mx-[2px]"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                background: (r + i) % 3 === 0 ? '#0B1B3D' : (r + i) % 3 === 1 ? '#C8102E' : 'rgba(200,16,46,0.5)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const AnnualProgression = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

      <div>
        <div className="intime-triple-slash">ANNUAL PROGRESSION</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3 mb-5">Our Business Growth is Really Incredible!</h2>
        <p className="text-gray-500 leading-relaxed mb-10">
          We love what we do and we do it with passion. We value the experimentation, the reformation of the message, and the smart incentives.
        </p>

        <div className="space-y-6 mb-10">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-sm font-semibold text-[#0B1B3D] mb-2">
                <span>{b.label} <b>({b.year})</b></span>
                <span>{b.pct}%</span>
              </div>
              <div className="intime-progress-track">
                <div className="intime-progress-fill" style={{ width: `${b.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-start gap-3">
            <span className="text-[#C8102E] mt-1"><FaShieldAlt size={22} /></span>
            <div>
              <h4 className="font-bold text-[#0B1B3D] mb-1">Risk Free</h4>
              <p className="text-xs text-gray-500">We offer risk free business for tension free life.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#C8102E] mt-1"><FaChartLine size={22} /></span>
            <div>
              <h4 className="font-bold text-[#0B1B3D] mb-1">Business Growth</h4>
              <p className="text-xs text-gray-500">We ensure the business growth without conditions.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center"><HexGrid /></div>
    </div>
  </section>
);

export default AnnualProgression;