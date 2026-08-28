import React from 'react';
import { FaUser, FaFolder, FaArrowRight } from 'react-icons/fa';
import { imgFallback, images } from '../../utils/img';

const posts = [
  { date: '10', month: 'Nov, 20', author: 'John Doe', cat: 'Consulting', title: 'We would love to share a similar experience', img: images.intime03 },
  { date: '06', month: 'Nov, 20', author: 'John Doe', cat: 'HR Consulting', title: 'We glad to discuss your organisation situation.', img: images.intime02 },
  { date: '20', month: 'Oct, 20', author: 'John Doe', cat: 'Consulting', title: 'In this context our main approach was to build.', img: images.intime05 },
];

const EXCERPT = 'The theory was first published in 2008 a press released under the name of Cliff Arnall, who at the time was a tutor at the…';

const LatestNews = () => (
  <section id="news" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="intime-triple-slash justify-center">OUR LATEST NEWS</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1B3D] mt-3">Learn about our latest news from blog.</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((p) => (
          <article key={p.title} className="intime-shadow border border-gray-100 group">
            <div className="relative h-52 overflow-hidden">
              <img {...imgFallback(p.img)} src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-[#C8102E] text-white text-center px-3 py-2 leading-none">
                <div className="text-lg font-bold">{p.date}</div>
                <div className="text-[10px]">{p.month}</div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-3">
                <span className="flex items-center gap-1.5"><FaUser size={9} /> {p.author}</span>
                <span className="flex items-center gap-1.5"><FaFolder size={9} /> {p.cat}</span>
              </div>
              <h3 className="text-base font-bold text-[#0B1B3D] mb-3 leading-snug">{p.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{EXCERPT}</p>
              <a href="#news" className="inline-flex items-center gap-2 text-[#C8102E] text-xs font-bold uppercase tracking-wider">
                Read more <FaArrowRight size={10} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default LatestNews;