import React from 'react';
import {
  FaArrowRight,
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
  FaTasks,
  FaUsers,
} from 'react-icons/fa';

const ICON_MAP = {
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
  users: FaUsers,
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

const DEFAULT_TEXT = 'Provide users with appropriate view and access permissions to requests, problems, changes, contracts, assets, solutions';

const DEFAULT_BOXES = [
  { icon: 'chart-pie', heading: 'Strategy & Planning', text: 'Collaborate Consulting exists to find the place where being seeming disparate interests meet.', button_text: 'Read more', button_url: '#service-strategy-planning' },
  { icon: 'tasks', heading: 'Program Manager', text: 'Collaborate Consulting exists to find the place where being seeming disparate interests meet.', button_text: 'Read more', button_url: '#service-program-manager' },
  { icon: 'landmark', heading: 'Tax Management', text: 'Collaborate Consulting exists to find the place where being seeming disparate interests meet.', button_text: 'Read more', button_url: '#service-tax-management' },
  { icon: 'coins', heading: 'Investment Policy', text: 'Collaborate Consulting exists to find the place where being seeming disparate interests meet.', button_text: 'Read more', button_url: '#service-investment-policy' },
  { icon: 'holding', heading: 'Financial Advices', text: 'Collaborate Consulting exists to find the place where being seeming disparate interests meet.', button_text: 'Read more', button_url: '#service-financial-advices' },
  { icon: 'seedling', heading: 'Business Growth Plan', text: 'Collaborate Consulting exists to find the place where being seeming disparate interests meet.', button_text: 'Read more', button_url: '#service-business-growth-plan' },
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
    return [0, 1, 2, 3, 4, 5].map((i) => value[i] ?? value[String(i)]).filter((item) => item != null);
  }
  return [];
};

const iconKey = (value) => String(value || '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');

const resolveIcon = (key) => ICON_MAP[iconKey(key)] || FaChartPie;

const resolveBoxes = (data) => {
  const list = asList(data?.boxes).length ? asList(data?.boxes) : asList(data?.items);
  return DEFAULT_BOXES.map((fallback, i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const heading = firstText(item.heading, item.title, fallback.heading);
    return {
      icon: firstText(item.icon, fallback.icon),
      heading,
      text: firstText(item.text, item.desc, item.description, fallback.text),
      button_text: firstText(item.button_text, item.read_more, fallback.button_text),
      button_url: firstText(item.button_url, item.url, item.link, item.slug ? `#service-${item.slug}` : '', fallback.button_url),
    };
  });
};

const FeaturedServices = ({ data }) => {
  const subheading = firstText(data?.subheading) || 'FEATURED SERVICES';
  const heading = firstText(data?.heading) || 'We help to get Solutions!';
  const text = firstText(data?.text) || DEFAULT_TEXT;
  const boxes = resolveBoxes(data);

  return (
    <section id="services" className="py-24 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="intime-triple-slash justify-center">{subheading}</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3 mb-4">{heading}</h2>
          {text && <p className="text-gray-500">{text}</p>}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {boxes.map((box, i) => {
            const Icon = resolveIcon(box.icon);
            return (
              <div key={`${box.heading}-${i}`} className="group bg-white intime-shadow border border-gray-100 p-8">
                <span className="hexagon-badge mb-6"><Icon size={22} /></span>
                <h3 className="text-lg font-bold text-[#0B1B3D] mb-3">{box.heading}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{box.text}</p>
                <a href={box.button_url || '#services'} className="inline-flex items-center gap-2 text-[#C8102E] text-xs font-bold uppercase tracking-wider">
                  {box.button_text || 'Read more'} <FaArrowRight size={10} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
