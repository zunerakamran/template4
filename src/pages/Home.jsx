import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import HeroSlider from '../components/Home/HeroSlider';
import WhatWeDo from '../components/Home/WhatWeDo';
import AboutSection from '../components/Home/AboutSection';
import CompanyHistory from '../components/Home/CompanyHistory';
import FeaturedServices from '../components/Home/FeaturedServices';
import AnnualProgression from '../components/Home/AnnualProgression';
import PortfolioSection from '../components/Home/PortfolioSection';
import BranchesAndAppointment from '../components/Home/BranchesAndAppointment';
import CounterStats from '../components/Home/CounterStats';
import TestimonialsCarousel from '../components/Home/TestimonialsCarousel';
import LatestNews from '../components/Home/LatestNews';
import ClientLogos from '../components/Home/ClientLogos';
import CtaBanner from '../components/Home/CtaBanner';
import Footer from '../components/Footer/Footer';
import { publicApi } from '../api/axios';
import CONFIG from '../../config.js';

const parseContent = (contentStr) => {
  if (!contentStr) return null;
  if (typeof contentStr === 'object') return contentStr;
  try {
    return JSON.parse(contentStr);
  } catch {
    return { heading: contentStr };
  }
};

const sectionKey = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const buildSectionsMap = (payload) => {
  const map = {};

  const list = payload?.sections_list;
  if (Array.isArray(list) && list.length) {
    list.forEach((sec) => {
      if (!sec?.name) return;
      const key = sectionKey(sec.name);
      if (map[key] == null) {
        map[key] = parseContent(sec.content);
      }
    });
    return map;
  }

  const keyed = payload?.sections;
  if (keyed && typeof keyed === 'object' && !Array.isArray(keyed)) {
    Object.keys(keyed).forEach((name) => {
      map[sectionKey(name)] = parseContent(keyed[name]);
    });
  }

  return map;
};

const Home = () => {
  const [sectionsMap, setSectionsMap] = useState({});
  const [contentReady, setContentReady] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const targetSection = (searchParams.get('section') || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const heroData = sectionsMap['heroslider'] || sectionsMap['hero'];
  const heroReady = contentReady || Boolean(heroData);
  const whatWeDoData = sectionsMap['whatwedo'] || sectionsMap['featurescarousel'] || sectionsMap['features'];
  const isWhatWeDoPreview = targetSection === 'whatwedo' || targetSection === 'featurescarousel' || targetSection === 'features';
  const aboutData = sectionsMap['aboutsection'] || sectionsMap['about'] || sectionsMap['aboutus'];
  const isAboutPreview = targetSection === 'aboutsection' || targetSection === 'about' || targetSection === 'aboutus' || targetSection.includes('about');

  useEffect(() => {
    // ── Skip API fetch in iframe preview mode ─────────────────────────────────
    // When loaded with ?section=... (inside the dashboard iframe), all content
    // comes exclusively from the dashboard via postMessage.  If we also fetch
    // from the API, the response arrives AFTER the postMessage data and resets
    // sectionsMap back to the live DB values — making the advisor's edits
    // disappear after a few milliseconds.  Skip the fetch to prevent this.
    if (targetSection) return;

    publicApi.get('', {
      params: { advisor_id: CONFIG.ADVISOR_ID ?? 6 },
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then(res => {
        if (res.data) {
          setSectionsMap(buildSectionsMap(res.data));
        }
      })
      .catch(err => {
        console.warn('Backend home page load note:', err.message);
      })
      .finally(() => setContentReady(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dashboard live-preview bridge ──────────────────────────────────────────
  // Listens for postMessage from the dashboard iframe parent.
  // When the advisor edits a field, the dashboard sends:
  //   { type: 'SECTION_PREVIEW', sectionKey: 'aboutsection', content: { heading, ... } }
  // We update sectionsMap so the real component re-renders with the draft data.
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type !== 'SECTION_PREVIEW') return;
      const { sectionKey, content } = event.data;
      if (sectionKey && content && typeof content === 'object') {
        const key = String(sectionKey).toLowerCase().replace(/[^a-z0-9]/g, '');
        setSectionsMap(prev => {
          const next = { ...prev, [sectionKey]: content, [key]: content };
          if (key.includes('about')) {
            const merged = { ...(prev.aboutsection || prev.about || prev.aboutus || {}), ...content };
            next.aboutsection = merged;
            next.about = merged;
            next.aboutus = merged;
          }
          return next;
        });
      }
    };
    window.addEventListener('message', handleMessage);

    // ── Handshake: notify the parent that our listener is live ──────────────
    // The dashboard waits for this signal before sending data, so there is
    // no race condition between the postMessage and listener setup.
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { type: 'SECTION_PREVIEW_READY', sectionKey: targetSection },
        '*'
      );
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Isolated section preview mode for dashboard iframe
  if (targetSection) {
    return (
      <div className="bg-white min-h-screen p-2 font-sans selection:bg-[#C8102E] selection:text-white">
        { (targetSection.includes('hero') || targetSection.includes('slider')) && <HeroSlider data={heroData} ready={heroReady} /> }
        { isWhatWeDoPreview && <WhatWeDo data={whatWeDoData} /> }
        { isAboutPreview && <AboutSection data={aboutData} /> }
        { (targetSection.includes('history') || targetSection.includes('company')) && <CompanyHistory data={sectionsMap['companyhistory'] || sectionsMap['history']} /> }
        { (targetSection.includes('service') || targetSection.includes('featuredservices')) && <FeaturedServices data={sectionsMap['featuredservices'] || sectionsMap['services']} /> }
        { (targetSection.includes('annual') || targetSection.includes('progression')) && <AnnualProgression data={sectionsMap['annualprogression'] || sectionsMap['progression']} /> }
        { targetSection.includes('portfolio') && <PortfolioSection data={sectionsMap['portfoliosection'] || sectionsMap['portfolio']} /> }
        { (targetSection.includes('branch') || targetSection.includes('appointment')) && <BranchesAndAppointment data={sectionsMap['branchesandappointment'] || sectionsMap['branches']} /> }
        { (targetSection.includes('stat') || targetSection.includes('counter')) && <CounterStats data={sectionsMap['counterstats'] || sectionsMap['stats']} /> }
        { (targetSection.includes('testimonial') || targetSection.includes('testimonials')) && <TestimonialsCarousel data={sectionsMap['testimonialscarousel'] || sectionsMap['testimonials']} /> }
        { (targetSection.includes('news') || targetSection.includes('latest')) && <LatestNews data={sectionsMap['latestnews'] || sectionsMap['news']} /> }
        { targetSection.includes('logo') && <ClientLogos data={sectionsMap['clientlogos']} /> }
        { (targetSection.includes('cta') || targetSection.includes('banner')) && <CtaBanner data={sectionsMap['ctabanner'] || sectionsMap['cta']} /> }
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 selection:bg-[#C8102E] selection:text-white">
      <Header data={sectionsMap['header']} />
      <main>
        <HeroSlider data={heroData} ready={heroReady} />
        <WhatWeDo data={whatWeDoData} />
        <AboutSection data={aboutData} />
        <CompanyHistory data={sectionsMap['companyhistory'] || sectionsMap['history']} />
        <FeaturedServices data={sectionsMap['featuredservices'] || sectionsMap['services']} />
        <AnnualProgression data={sectionsMap['annualprogression'] || sectionsMap['progression']} />
        <PortfolioSection data={sectionsMap['portfoliosection'] || sectionsMap['portfolio']} />
        <BranchesAndAppointment data={sectionsMap['branchesandappointment'] || sectionsMap['branches']} />
        <CounterStats data={sectionsMap['counterstats'] || sectionsMap['stats']} />
        <TestimonialsCarousel data={sectionsMap['testimonialscarousel'] || sectionsMap['testimonials']} />
        <LatestNews data={sectionsMap['latestnews'] || sectionsMap['news']} />
        <ClientLogos data={sectionsMap['clientlogos']} />
        <CtaBanner data={sectionsMap['ctabanner'] || sectionsMap['cta']} />
      </main>
      <Footer data={sectionsMap['footer']} />
    </div>
  );
};

export default Home;