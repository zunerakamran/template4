import React from 'react';
import { FaUsers, FaStar, FaUserTie, FaAward } from 'react-icons/fa';

const defaultStats = [
  { 
    icon: FaUsers, 
    value: '2,800+', 
    label: 'Active Clients', 
    sub: 'Empowering businesses globally with passion and proven expertise.' 
  },
  { 
    icon: FaStar, 
    value: '1,670+', 
    label: '5-Star Reviews', 
    sub: 'Top customer satisfaction and unmatched quality of service.' 
  },
  { 
    icon: FaUserTie, 
    value: '106+', 
    label: 'Team Members', 
    sub: 'Dedicated specialists and leaders driving continuous innovation.' 
  },
  { 
    icon: FaAward, 
    value: '99.8%', 
    label: 'Success Rate', 
    sub: 'Consistently delivering top-tier performance and business growth.' 
  },
];

const CounterStats = ({ data }) => {
  const statsList = data?.stats && Array.isArray(data.stats) && data.stats.length > 0
    ? data.stats.map((s, idx) => ({
        icon: [FaUsers, FaStar, FaUserTie, FaAward][idx % 4],
        value: s.value || s.number || '100+',
        label: s.label || s.title || 'Metric',
        sub: s.sub || s.desc || 'Quality assurance & performance',
      }))
    : defaultStats;

  return (
    <section className="relative bg-gradient-to-r from-[#A00C23] via-[#C8102E] to-[#80091B] py-16 sm:py-20 overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {statsList.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.label + index} 
                className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:bg-white/15 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white mb-5 group-hover:bg-white group-hover:text-[#C8102E] group-hover:scale-110 transition-all duration-300 shadow-md">
                    <IconComponent className="text-2xl" />
                  </div>

                  {/* Stat Number */}
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif group-hover:scale-105 transition-transform duration-300 origin-left">
                    {stat.value}
                  </div>

                  {/* Stat Label */}
                  <div className="text-sm font-bold text-white/90 uppercase tracking-wider mt-1.5">
                    {stat.label}
                  </div>

                  {/* Subtext */}
                  <p className="text-xs text-white/75 leading-relaxed mt-2.5 font-normal">
                    {stat.sub}
                  </p>
                </div>

                {/* Bottom Accent Bar */}
                <div className="w-10 h-1 bg-white/30 rounded-full group-hover:w-20 group-hover:bg-white transition-all duration-300 mt-6" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CounterStats;