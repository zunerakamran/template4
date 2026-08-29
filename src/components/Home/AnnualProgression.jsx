import React from 'react';
import {
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

const DEFAULT_TEXT = 'We love what we do and we do it with passion. We value the experimentation, the reformation of the message, and the smart incentives.';

const DEFAULT_BARS = [
  { label: 'Business growth', year: '2018', pct: 70 },
  { label: 'Investment growth', year: '2019', pct: 80 },
  { label: 'Financial growth', year: '2020', pct: 90 },
];

const DEFAULT_HIGHLIGHTS = [
  { icon: 'shield-alt', heading: 'Risk Free', text: 'We offer risk free business for tension free life.' },
  { icon: 'chart-line', heading: 'Business Growth', text: 'We ensure the business growth without conditions.' },
];

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

const firstText = (...vals) => {
  for (const v of vals) {
    if (v == null) continue;
    if (typeof v === 'object') continue;
    if (String(v).trim() !== '') return v;
  }
  return '';
};

const asList = (raw, max = 3) => {
  if (!raw) return [];
  let value = raw;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return []; }
  }
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') {
    return Array.from({ length: max }, (_, i) => value[i] ?? value[String(i)]).filter((item) => item != null);
  }
  return [];
};

const parsePct = (value, fallback) => {
  const n = parseInt(String(value ?? '').replace(/[^0-9]/g, ''), 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(100, Math.max(0, n));
};

const iconKey = (value) => String(value || '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');

const resolveIcon = (key) => ICON_MAP[iconKey(key)] || FaShieldAlt;

const resolveBars = (data) => {
  const list = asList(data?.bars, 3).length ? asList(data?.bars, 3) : asList(data?.progress, 3);
  return DEFAULT_BARS.map((fallback, i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const n = i + 1;
    return {
      label: firstText(data?.[`bar_${n}_label`], item.label, item.heading, item.title, fallback.label),
      year: firstText(data?.[`bar_${n}_year`], item.year, fallback.year),
      pct: parsePct(firstText(data?.[`bar_${n}_pct`], data?.[`bar_${n}_percent`], item.pct, item.percent, item.value, item.percentage), fallback.pct),
    };
  });
};

const resolveHighlights = (data) => {
  const list = asList(data?.highlights, 2).length ? asList(data?.highlights, 2) : asList(data?.features, 2);
  return DEFAULT_HIGHLIGHTS.map((fallback, i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const n = i + 1;
    return {
      icon: firstText(data?.[`highlight_${n}_icon`], item.icon, fallback.icon),
      heading: firstText(data?.[`highlight_${n}_heading`], item.heading, item.title, fallback.heading),
      text: firstText(data?.[`highlight_${n}_text`], item.text, item.desc, item.description, fallback.text),
    };
  });
};

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

const AnnualProgression = ({ data }) => {
  const legacyBodyAsText = Boolean(data?.eyebrow && data?.subheading && !data?.text);
  const subheading = legacyBodyAsText
    ? firstText(data?.eyebrow)
    : (firstText(data?.subheading, data?.eyebrow) || 'ANNUAL PROGRESSION');
  const heading = firstText(data?.heading) || 'Our Business Growth is Really Incredible!';
  const text = legacyBodyAsText
    ? firstText(data?.subheading)
    : (firstText(data?.text) || DEFAULT_TEXT);
  const bars = resolveBars(data);
  const highlights = resolveHighlights(data);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

        <div>
          {subheading && <div className="intime-triple-slash">{subheading}</div>}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3 mb-5">{heading}</h2>
          {text && <p className="text-gray-500 leading-relaxed mb-10">{text}</p>}

          <div className="space-y-6 mb-10">
            {bars.map((b) => (
              <div key={`${b.label}-${b.year}`}>
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
            {highlights.map((item) => {
              const Icon = resolveIcon(item.icon);
              return (
                <div key={item.heading} className="flex items-start gap-3">
                  <span className="text-[#C8102E] mt-1"><Icon size={22} /></span>
                  <div>
                    <h4 className="font-bold text-[#0B1B3D] mb-1">{item.heading}</h4>
                    <p className="text-xs text-gray-500">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center"><HexGrid /></div>
      </div>
    </section>
  );
};

export default AnnualProgression;
