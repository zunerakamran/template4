import React, { useState, useEffect } from 'react';
import {
  FaPhoneAlt, FaClock, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram,
  FaSearch, FaShoppingBag, FaBars, FaTimes, FaChevronDown, FaArrowRight,
} from 'react-icons/fa';
import { images } from '../../utils/img';

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'Pages', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#portfolio' },
  { name: 'Blog', href: '#news' },
  { name: 'Elements', href: '#appointment' },
];

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 120);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ===== TOP INFO BAR ===== */}
      <div className="w-full bg-white border-b border-gray-100 relative z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6 flex-wrap">

          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={images.logoDark}
              alt="Intime"
              className="h-11"
            />
          </a>

          {/* Info widgets */}
          <div className="hidden lg:flex items-center gap-9">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#C8102E]"><FaPhoneAlt size={13} /></span>
              <div>
                <p className="text-[11px] text-gray-400 leading-none mb-1">Requesting a Call:</p>
                <a href="tel:210123451" className="font-bold text-[#0B1B3D] text-sm hover:text-[#C8102E]">(210) 123 451</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#C8102E]"><FaClock size={13} /></span>
              <div>
                <p className="text-[11px] text-gray-400 leading-none mb-1">Sunday - Friday:</p>
                <span className="font-bold text-[#0B1B3D] text-sm">9am - 8pm</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#C8102E]"><FaMapMarkerAlt size={13} /></span>
              <div>
                <p className="text-[11px] text-gray-400 leading-none mb-1">122 Albert St, Melbourne</p>
                <span className="font-bold text-[#0B1B3D] text-sm">Australia</span>
              </div>
            </div>
          </div>

          {/* social + CTA */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-2">
              {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E] transition-all text-xs">
                  <Icon size={11} />
                </a>
              ))}
            </div>
            <a href="#appointment" className="btn-intime-red">
              <span>MAKE AN APPOINTMENT</span>
            </a>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-[#0B1B3D] p-2 text-2xl" aria-label="Open menu">
            <FaBars />
          </button>
        </div>
      </div>

      {/* ===== MAIN NAV BAR ===== */}
      <div className={`w-full bg-[#0B1B3D] transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 shadow-xl z-50' : 'relative z-30'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {isSticky && (
            <a href="#hero" className="flex items-center gap-2 py-3 mr-6 flex-shrink-0">
              <img src={images.logoLight} alt="Intime" className="h-8" />
            </a>
          )}

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveNav(item.name)}
                className={`text-[13px] font-bold px-4 py-5 tracking-wide transition-colors relative flex items-center gap-1.5 ${
                  activeNav === item.name ? 'text-[#C8102E]' : 'text-white hover:text-[#C8102E]'
                }`}
              >
                {item.name}
                <FaChevronDown size={8} className="opacity-50" />
                {activeNav === item.name && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C8102E]" />}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-6">
            <button onClick={() => setSearchOpen(true)} className="text-white hover:text-[#C8102E] transition-colors py-5" aria-label="Search">
              <FaSearch size={14} />
            </button>
          </div>
        </div>
      </div>
      {isSticky && <div className="h-[52px]" />}

      {/* ===== MOBILE DRAWER ===== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex justify-end" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-80 max-w-full bg-white h-full shadow-2xl flex flex-col overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#0B1B3D] p-6 flex items-center justify-between">
              <img src={images.logoMobile} alt="Intime" className="h-8" />
              <button onClick={() => setMobileMenuOpen(false)} className="text-white text-xl"><FaTimes /></button>
            </div>

            <nav className="flex flex-col p-6 gap-1 flex-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => { setActiveNav(item.name); setMobileMenuOpen(false); }}
                  className={`text-base font-bold py-3 px-4 border-b border-gray-100 flex items-center justify-between ${activeNav === item.name ? 'text-[#C8102E]' : 'text-[#0B1B3D]'}`}
                >
                  {item.name}
                  <FaArrowRight size={10} className="text-[#C8102E]" />
                </a>
              ))}
            </nav>

            <div className="p-6 border-t border-gray-100">
              <a href="#appointment" onClick={() => setMobileMenuOpen(false)} className="btn-intime-red w-full justify-center">
                <span>MAKE AN APPOINTMENT</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== SEARCH OVERLAY ===== */}
      {searchOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#0B1B3D]/95 flex items-center justify-center p-4">
          <button onClick={() => setSearchOpen(false)} className="absolute top-6 right-8 text-white text-3xl hover:text-[#C8102E]"><FaTimes /></button>
          <div className="w-full max-w-2xl">
            <div className="relative">
              <input type="text" placeholder="Type to search..." autoFocus
                className="w-full py-5 px-6 pr-14 bg-white/10 border border-white/20 text-white text-xl placeholder-white/40 focus:outline-none focus:border-[#C8102E]" />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#C8102E]"><FaSearch size={20} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;