import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaArrowRight } from 'react-icons/fa';
import { images } from '../../utils/img';

const gallery = [
  images.gallery1, images.gallery2, images.gallery3,
  images.gallery4, images.gallery5, images.gallery6,
];

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[#0B1B3D] text-white pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">

          {/* Col 1: Logo + about */}
          <div>
            <a href="#hero" className="inline-block mb-6">
              <img
                src={images.logoLight}
                alt="Intime"
                className="h-10"
              />
            </a>
            <p className="text-gray-400 text-[13px] leading-relaxed mb-6">
              We work with a passion of taking challenges and creating new ones in advertising sector.
            </p>
            <a href="#about" className="btn-intime-red py-3 px-5 text-[11px]">
              <span>ABOUT US</span>
            </a>
          </div>

          {/* Col 2: Newsletter */}
          <div>
            <h4 className="footer-col-title">Newsletter</h4>
            <p className="text-gray-400 text-[13px] leading-relaxed mb-5">
              Subscribe our newsletter to get our latest update & news
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert(`Subscribed: ${email}`); }} className="flex mb-6">
              <input
                type="email" required placeholder="Your email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 px-4 py-3 bg-white/5 border border-white/15 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C8102E]"
              />
              <button type="submit" className="bg-[#C8102E] px-4 flex items-center justify-center hover:bg-[#A00C23] transition-colors">
                <FaArrowRight size={12} />
              </button>
            </form>
            <div className="flex items-center gap-3">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 border border-white/20 flex items-center justify-center text-gray-400 hover:bg-[#C8102E] hover:border-[#C8102E] hover:text-white transition-all text-xs">
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Official info */}
          <div>
            <h4 className="footer-col-title">Official info:</h4>
            <div className="flex items-start gap-3 mb-3 text-[13px] text-gray-400">
              <FaMapMarkerAlt className="text-[#C8102E] mt-1 flex-shrink-0" size={13} />
              <span>30 Commercial Road<br />Fratton, Australia</span>
            </div>
            <div className="flex items-center gap-3 mb-6 text-[13px] text-gray-400">
              <FaPhoneAlt className="text-[#C8102E] flex-shrink-0" size={12} />
              <span>1-888-452-1505</span>
            </div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Open Hours:</h5>
            <p className="text-[13px] text-gray-400 leading-relaxed">Mon – Sat: 8 am – 5 pm,<br />Sunday: CLOSED</p>
          </div>

          {/* Col 4: Gallery */}
          <div>
            <h4 className="footer-col-title">Gallery</h4>
            <div className="gallery-grid">
              {gallery.map((src, idx) => (
                <div key={idx} className="gallery-grid-item">
                  <img src={src} alt={`Gallery ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-[12px] text-gray-500">
          <p>© {new Date().getFullYear()} intime – Business & Consulting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;