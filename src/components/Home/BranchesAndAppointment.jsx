import React, { useState } from 'react';
import { FaArrowRight, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { getLocalImg, imgFallback, images } from '../../utils/img';

const DEFAULT_TEXT = 'We understand the importance of approaching each work integrally and believe in the power of simple and easy communication.';

const DEFAULT_BRANCHES = [
  { name: 'Sydney (Head Office)', address: '1 Epping Road, North Ryde, NSW 2113', phone: '+61 2 9870 7689', email: 'email@example.com' },
  { name: 'Brisbane', address: 'Level 28, 400 George Street, Brisbane, QLD 4000', phone: '+61 2 9870 7689', email: 'email@example.com' },
  { name: 'Hobart', address: '85 Macquarie Finoa Street, Hobart, TAS 7000', phone: '+61 2 9870 7689', email: 'email@example.com' },
  { name: 'Melbourne', address: 'Level 5, 4 Freshwater Place, Southbank, VIC 3006', phone: '+61 2 9870 7689', email: 'email@example.com' },
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

const extractSrc = (value) => {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (typeof value === 'object') {
    return firstText(value.url, value.path, value.relative_url, value.src, value.image_url, value.image, value.img, value.map_image);
  }
  return '';
};

const pickMapImage = (data) => {
  const preview = extractSrc(data?.image_preview) || extractSrc(data?.map_preview);
  if (preview) return preview;
  return extractSrc(data?.map_image) || extractSrc(data?.image_url) || extractSrc(data?.image) || extractSrc(data?.img) || '';
};

const resolveBranches = (data) => {
  const list = asList(data?.items).length
    ? asList(data?.items)
    : (asList(data?.branches).length ? asList(data?.branches) : asList(data?.offices));

  return DEFAULT_BRANCHES.map((fallback, i) => {
    const item = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const n = i + 1;
    return {
      name: firstText(data?.[`branch_${n}_name`], item.name, item.heading, item.title, fallback.name),
      address: firstText(data?.[`branch_${n}_address`], item.address, fallback.address),
      phone: firstText(data?.[`branch_${n}_phone`], item.phone, item.tel, fallback.phone),
      email: firstText(data?.[`branch_${n}_email`], item.email, fallback.email),
    };
  });
};

const BranchesAndAppointment = ({ data }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const legacyLabel = Boolean(data?.eyebrow);
  const subheading = legacyLabel
    ? firstText(data?.eyebrow)
    : (firstText(data?.subheading) || 'GET IN TOUCH');
  const heading = firstText(data?.heading) || 'We are Connected All Time to Help Your Business!';
  const text = legacyLabel
    ? (firstText(data?.text, data?.subheading) || DEFAULT_TEXT)
    : (firstText(data?.text) || DEFAULT_TEXT);
  const formHeading = firstText(data?.form_heading) || 'Book an appionment';
  const buttonText = firstText(data?.button_text) || 'SEND YOUR MESSAGE';
  const branchesLabel = firstText(data?.branches_label) || 'Main Branches:';
  const statValue = firstText(data?.stat_value) || '12+';
  const statLabel = firstText(data?.stat_label) || 'Branches';
  const mapSrc = getLocalImg(pickMapImage(data) || images.mapsPoint) || images.mapsPoint;
  const branches = resolveBranches(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent (wire this up to your backend/email API).');
  };

  return (
    <section id="appointment" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">

          <div>
            {subheading && <div className="intime-triple-slash">{subheading}</div>}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3 mb-5">{heading}</h2>
            {text && <p className="text-gray-500 leading-relaxed mb-10">{text}</p>}
            <div className="relative">
              <img
                {...imgFallback(mapSrc)}
                src={mapSrc}
                alt="Branches map"
                className="w-full opacity-80"
              />
              <div className="absolute top-4 left-4 bg-[#C8102E] text-white px-5 py-4 shadow-xl">
                <div className="text-2xl font-bold leading-none">{statValue}</div>
                <div className="text-[10px] uppercase tracking-wider">{statLabel}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#F9F9F9] p-8 sm:p-10 border border-gray-100">
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-6">{formHeading}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" required placeholder="Full name*"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-[#C8102E] text-sm"
              />
              <input
                type="email" required placeholder="Mail address*"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-[#C8102E] text-sm"
              />
              <textarea
                required rows={5} placeholder="Type your message*"
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-[#C8102E] text-sm resize-none"
              />
              <button type="submit" className="btn-intime-red w-full justify-center">
                <span>{buttonText}</span>
                <FaArrowRight size={11} />
              </button>
            </form>
          </div>
        </div>

        <div>
          {branchesLabel && <h4 className="text-sm font-bold uppercase tracking-wider text-[#0B1B3D] mb-6">{branchesLabel}</h4>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((b) => (
              <div key={b.name} className="p-6 border border-gray-100 intime-shadow">
                <h5 className="font-bold text-[#0B1B3D] mb-3">{b.name}</h5>
                {b.address && (
                  <p className="text-xs text-gray-500 leading-relaxed flex items-start gap-2 mb-2">
                    <FaMapMarkerAlt className="text-[#C8102E] mt-0.5 flex-shrink-0" size={11} /> {b.address}
                  </p>
                )}
                {b.phone && (
                  <p className="text-xs text-gray-500 flex items-center gap-2 mb-2">
                    <FaPhoneAlt className="text-[#C8102E] flex-shrink-0" size={10} /> {b.phone}
                  </p>
                )}
                {b.email && (
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <FaEnvelope className="text-[#C8102E] flex-shrink-0" size={10} /> {b.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BranchesAndAppointment;
