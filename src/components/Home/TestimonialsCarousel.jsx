import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from 'react-icons/fa';
import { imgFallback, images } from '../../utils/img';

const testimonials = [
  { quote: 'Working with several word press themes and templates the last years, I only can say this is the best in every level. I use it for my company and the reviews that I have already are all excellent.', name: 'Alina Lora', role: 'Former Manager, Intime', img: images.testimonial01 },
  { quote: 'This is one of the BEST THEMES I have ever worked with. The extra bells and whistles added to it are amazing. Elementor features add extra flavor. The customer support is very responsive.', name: 'Rohan Jho', role: 'Former Manager, Intime', img: images.testimonial02 },
  { quote: 'Great theme, one of the best I have worked with in a while. Full featured and great support for the minor issues I had which were really my not being skilled/experienced enough.', name: 'Donald Frew', role: 'Former Manager, Intime', img: images.testimonial03 },
];

const TestimonialsCarousel = () => {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const next = () => setI((i + 1) % testimonials.length);
  const prev = () => setI((i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="intime-triple-slash">CLIENT'S TESTIMONIALS</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3 mb-6">We are Very Happy to Get Our Client's Reviews.</h2>
          <p className="text-sm font-bold text-[#C8102E] uppercase tracking-wider mb-4">Clients Reviews:</p>

          <div className="relative">
            <FaQuoteRight className="text-[#C8102E]/20 absolute -top-2 right-0" size={40} />
            <blockquote className="testimonial-quote-border text-gray-600 italic leading-relaxed">"{t.quote}"</blockquote>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <img {...imgFallback(t.img)} src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h4 className="font-bold text-[#0B1B3D]">{t.name}</h4>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button onClick={prev} className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-[#C8102E] hover:border-[#C8102E] hover:text-white transition-colors">
              <FaChevronLeft size={12} />
            </button>
            <button onClick={next} className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-[#C8102E] hover:border-[#C8102E] hover:text-white transition-colors">
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <img
            src={images.intime17}
            alt="Client"
            className="w-full h-[480px] object-cover intime-shadow"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;