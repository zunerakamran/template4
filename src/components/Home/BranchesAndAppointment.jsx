import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { imgFallback, images } from '../../utils/img';

const branches = [
  { name: 'Sydney (Head Office)', address: '1 Epping Road, North Ryde, NSW 2113', phone: '+61 2 9870 7689', email: 'email@example.com' },
  { name: 'Brisbane', address: 'Level 28, 400 George Street, Brisbane, QLD 4000', phone: '+61 2 9870 7689', email: 'email@example.com' },
  { name: 'Hobart', address: '85 Macquarie Finoa Street, Hobart, TAS 7000', phone: '+61 2 9870 7689', email: 'email@example.com' },
  { name: 'Melbourne', address: 'Level 5, 4 Freshwater Place, Southbank, VIC 3006', phone: '+61 2 9870 7689', email: 'email@example.com' },
];

const BranchesAndAppointment = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent (wire this up to your backend/email API).');
  };

  return (
    <section id="appointment" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">

          {/* Left: heading + map */}
          <div>
            <div className="intime-triple-slash">GET IN TOUCH</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3 mb-5">We are Connected All Time to Help Your Business!</h2>
            <p className="text-gray-500 leading-relaxed mb-10">
              We understand the importance of approaching each work integrally and believe in the power of simple and easy communication.
            </p>
            <div className="relative">
              <img
                src={images.mapsPoint}
                alt="Branches map"
                className="w-full opacity-80"
              />
              <div className="absolute top-4 left-4 bg-[#C8102E] text-white px-5 py-4 shadow-xl">
                <div className="text-2xl font-bold leading-none">12+</div>
                <div className="text-[10px] uppercase tracking-wider">Branches</div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-[#F9F9F9] p-8 sm:p-10 border border-gray-100">
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-6">Book an appionment</h3>
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
                <span>SEND YOUR MESSAGE</span>
                <FaArrowRight size={11} />
              </button>
            </form>
          </div>
        </div>

        {/* Branch cards */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0B1B3D] mb-6">Main Branches:</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((b) => (
              <div key={b.name} className="p-6 border border-gray-100 intime-shadow">
                <h5 className="font-bold text-[#0B1B3D] mb-3">{b.name}</h5>
                <p className="text-xs text-gray-500 leading-relaxed flex items-start gap-2 mb-2">
                  <FaMapMarkerAlt className="text-[#C8102E] mt-0.5 flex-shrink-0" size={11} /> {b.address}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-2 mb-2">
                  <FaPhoneAlt className="text-[#C8102E] flex-shrink-0" size={10} /> {b.phone}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <FaEnvelope className="text-[#C8102E] flex-shrink-0" size={10} /> {b.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BranchesAndAppointment;