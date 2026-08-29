import React from 'react';
import {
  FaAward,
  FaBalanceScale,
  FaBriefcase,
  FaBuilding,
  FaChartLine,
  FaChartPie,
  FaCoins,
  FaComments,
  FaFileInvoiceDollar,
  FaGlobe,
  FaHandHoldingUsd,
  FaHandshake,
  FaLandmark,
  FaLightbulb,
  FaPercentage,
  FaSeedling,
  FaShieldAlt,
  FaStar,
  FaTasks,
  FaUserTie,
  FaUsers,
} from 'react-icons/fa';

const ICON_MAP = {
  users: FaUsers,
  user: FaUsers,
  star: FaStar,
  'user-tie': FaUserTie,
  usertie: FaUserTie,
  award: FaAward,
  'chart-pie': FaChartPie,
  chartpie: FaChartPie,
  tasks: FaTasks,
  landmark: FaLandmark,
  coins: FaCoins,
  holding: FaHandHoldingUsd,
  'hand-holding-usd': FaHandHoldingUsd,
  seedling: FaSeedling,
  briefcase: FaBriefcase,
  'chart-line': FaChartLine,
  chartline: FaChartLine,
  handshake: FaHandshake,
  building: FaBuilding,
  'shield-alt': FaShieldAlt,
  shield: FaShieldAlt,
  lightbulb: FaLightbulb,
  'file-invoice-dollar': FaFileInvoiceDollar,
  invoice: FaFileInvoiceDollar,
  percentage: FaPercentage,
  globe: FaGlobe,
  comments: FaComments,
  'balance-scale': FaBalanceScale,
  scale: FaBalanceScale,
};

const DEFAULT_STATS = [
  { icon: 'users', value: '2,800+', label: 'Active Clients', sub: 'Empowering businesses globally with passion and proven expertise.' },
  { icon: 'star', value: '1,670+', label: '5-Star Reviews', sub: 'Top customer satisfaction and unmatched quality of service.' },
  { icon: 'user-tie', value: '106+', label: 'Team Members', sub: 'Dedicated specialists and leaders driving continuous innovation.' },
  { icon: 'award', value: '99.8%', label: 'Success Rate', sub: 'Consistently delivering top-tier performance and business growth.' },
];

const firstText = (...vals) => {
  for (const v of vals) {
    if (v == null) continue;
    if (typeof v === 'object') continue;
    if (String(v).trim() !== '') return v;
  }
  return '';
};

const asList = (raw) => {
  if (!raw) return [];
  let value = raw;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return []; }
  }
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') {
    return [0, 1, 2, 3].map((i) => value[i] ?? value[String(i)]).filter((item) => item != null);
  }
  return [];
};

const iconKey = (value) => String(value || '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');

const resolveIcon = (key, fallback) => ICON_MAP[iconKey(key)] || fallback;

const resolveStats = (data) => {
  const list = asList(data?.stats).length ? asList(data?.stats) : asList(data?.items);
  return DEFAULT_STATS.map((fallback, i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const n = i + 1;
    const fallbackIcons = [FaUsers, FaStar, FaUserTie, FaAward];
    return {
      icon: resolveIcon(firstText(data?.[`stat_${n}_icon`], item.icon), fallbackIcons[i]),
      value: firstText(data?.[`stat_${n}_value`], item.value, item.number, fallback.value),
      label: firstText(data?.[`stat_${n}_label`], item.label, item.title, item.heading, fallback.label),
      sub: firstText(data?.[`stat_${n}_sub`], item.sub, item.desc, item.description, item.text, fallback.sub),
    };
  });
};

const CounterStats = ({ data }) => {
  const statsList = resolveStats(data);

  return (
    <section className="relative bg-gradient-to-r from-[#A00C23] via-[#C8102E] to-[#80091B] py-16 sm:py-20 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {statsList.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={`${stat.label}-${index}`}
                className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:bg-white/15 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white mb-5 group-hover:bg-white group-hover:text-[#C8102E] group-hover:scale-110 transition-all duration-300 shadow-md">
                    <IconComponent className="text-2xl" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif group-hover:scale-105 transition-transform duration-300 origin-left">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-white/90 uppercase tracking-wider mt-1.5">
                    {stat.label}
                  </div>
                  {stat.sub && (
                    <p className="text-xs text-white/75 leading-relaxed mt-2.5 font-normal">
                      {stat.sub}
                    </p>
                  )}
                </div>
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
