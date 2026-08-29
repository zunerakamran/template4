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

const VISIBILITY_ALIASES = {
  heroslider: ['heroslider', 'hero'],
  whatwedo: ['whatwedo', 'featurescarousel', 'features'],
  aboutsection: ['aboutsection', 'about', 'aboutus'],
  companyhistory: ['companyhistory', 'history', 'ourcompanyhistory'],
  featuredservices: ['featuredservices', 'services'],
  annualprogression: ['annualprogression', 'progression', 'annual'],
  portfoliosection: ['portfoliosection', 'portfolio'],
  branchesandappointment: ['branchesandappointment', 'branches', 'appointment'],
  counterstats: ['counterstats', 'stats'],
  testimonialscarousel: ['testimonialscarousel', 'testimonials'],
  latestnews: ['latestnews', 'news'],
  clientlogos: ['clientlogos'],
  ctabanner: ['ctabanner', 'cta'],
};

const applyVisibilityAliases = (visibility) => {
  Object.values(VISIBILITY_ALIASES).forEach((aliases) => {
    const defined = aliases.find((alias) => Object.prototype.hasOwnProperty.call(visibility, alias));
    if (defined === undefined) return;
    const state = visibility[defined];
    aliases.forEach((alias) => {
      visibility[alias] = state;
    });
  });
  return visibility;
};

const buildSectionsPayload = (payload) => {
  const map = {};
  const visibility = {};

  const list = payload?.sections_list;
  if (Array.isArray(list) && list.length) {
    list.forEach((sec) => {
      if (!sec?.name) return;
      const key = sectionKey(sec.section_key || sec.name);
      const visible = sec.is_visible !== false && sec.is_visible !== 0 && sec.is_visible !== '0';
      visibility[key] = visible;
      if (!visible) return;
      if (map[key] == null) {
        map[key] = parseContent(sec.content);
      }
    });
    return { map, visibility: applyVisibilityAliases(visibility) };
  }

  const keyed = payload?.sections;
  if (keyed && typeof keyed === 'object' && !Array.isArray(keyed)) {
    Object.keys(keyed).forEach((name) => {
      const key = sectionKey(name);
      visibility[key] = true;
      map[key] = parseContent(keyed[name]);
    });
    return { map, visibility: applyVisibilityAliases(visibility) };
  }

  return { map, visibility };
};

const isVisibleSection = (visibility, keys) => {
  const list = Array.isArray(keys) ? keys : [keys];
  const hasVisibilityData = visibility && Object.keys(visibility).length > 0;
  if (!hasVisibilityData) return true;

  const explicit = list.filter((key) => Object.prototype.hasOwnProperty.call(visibility, key));
  if (explicit.length) {
    return explicit.some((key) => visibility[key] !== false);
  }

  return false;
};

const Home = () => {
  const [sectionsMap, setSectionsMap] = useState({});
  const [sectionVisibility, setSectionVisibility] = useState({});
  const [contentReady, setContentReady] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const targetSection = (searchParams.get('section') || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const heroData = sectionsMap['heroslider'] || sectionsMap['hero'];
  const heroReady = contentReady || Boolean(heroData);
  const whatWeDoData = sectionsMap['whatwedo'] || sectionsMap['featurescarousel'] || sectionsMap['features'];
  const isWhatWeDoPreview = targetSection === 'whatwedo' || targetSection === 'featurescarousel' || targetSection === 'features';
  const aboutData = sectionsMap['aboutsection'] || sectionsMap['about'] || sectionsMap['aboutus'];
  const isAboutPreview = targetSection === 'aboutsection' || targetSection === 'about' || targetSection === 'aboutus' || targetSection.includes('about');
  const companyHistoryData = sectionsMap['companyhistory'] || sectionsMap['history'] || sectionsMap['ourcompanyhistory'];
  const isHistoryPreview = targetSection === 'companyhistory' || targetSection === 'history' || targetSection.includes('history') || targetSection.includes('companyhistory');
  const featuredServicesData = sectionsMap['featuredservices'] || sectionsMap['services'];
  const isFeaturedServicesPreview = targetSection === 'featuredservices' || targetSection === 'services' || targetSection.includes('featuredservices');
  const annualProgressionData = sectionsMap['annualprogression'] || sectionsMap['progression'] || sectionsMap['annual'];
  const isAnnualProgressionPreview = targetSection === 'annualprogression' || targetSection === 'progression' || targetSection.includes('annual');
  const portfolioData = sectionsMap['portfoliosection'] || sectionsMap['portfolio'];
  const isPortfolioPreview = targetSection === 'portfoliosection' || targetSection === 'portfolio' || targetSection.includes('portfolio');
  const branchesData = sectionsMap['branchesandappointment'] || sectionsMap['branches'] || sectionsMap['appointment'];
  const isBranchesPreview = targetSection === 'branchesandappointment' || targetSection.includes('branch') || targetSection.includes('appointment');
  const counterStatsData = sectionsMap['counterstats'] || sectionsMap['stats'];
  const isCounterStatsPreview = targetSection === 'counterstats' || targetSection === 'stats' || targetSection.includes('counter') || targetSection.includes('stat');
  const testimonialsData = sectionsMap['testimonialscarousel'] || sectionsMap['testimonials'];
  const isTestimonialsPreview = targetSection === 'testimonialscarousel' || targetSection === 'testimonials' || targetSection.includes('testimonial');
  const latestNewsData = sectionsMap['latestnews'] || sectionsMap['news'];
  const isLatestNewsPreview = targetSection === 'latestnews' || targetSection === 'news' || targetSection.includes('latestnews');
  const clientLogosData = sectionsMap['clientlogos'];
  const isClientLogosPreview = targetSection === 'clientlogos' || targetSection.includes('clientlogo');
  const ctaBannerData = sectionsMap['ctabanner'] || sectionsMap['cta'];
  const isCtaBannerPreview = targetSection === 'ctabanner' || targetSection === 'cta' || targetSection.includes('ctabanner');

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
          const { map, visibility } = buildSectionsPayload(res.data);
          setSectionsMap(map);
          setSectionVisibility(visibility);
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
          if (key.includes('history') || key === 'companyhistory') {
            const merged = { ...(prev.companyhistory || prev.history || prev.ourcompanyhistory || {}), ...content };
            next.companyhistory = merged;
            next.history = merged;
            next.ourcompanyhistory = merged;
          }
          if (key.includes('featuredservices') || key === 'services') {
            const merged = { ...(prev.featuredservices || prev.services || {}), ...content };
            next.featuredservices = merged;
            next.services = merged;
          }
          if (key.includes('annual') || key === 'progression' || key === 'annualprogression') {
            const merged = { ...(prev.annualprogression || prev.progression || prev.annual || {}), ...content };
            next.annualprogression = merged;
            next.progression = merged;
            next.annual = merged;
          }
          if (key.includes('portfolio')) {
            const merged = { ...(prev.portfoliosection || prev.portfolio || {}), ...content };
            next.portfoliosection = merged;
            next.portfolio = merged;
          }
          if (key.includes('branch') || key.includes('appointment')) {
            const merged = { ...(prev.branchesandappointment || prev.branches || prev.appointment || {}), ...content };
            next.branchesandappointment = merged;
            next.branches = merged;
            next.appointment = merged;
          }
          if (key.includes('counter') || key === 'stats' || key === 'counterstats') {
            const merged = { ...(prev.counterstats || prev.stats || {}), ...content };
            next.counterstats = merged;
            next.stats = merged;
          }
          if (key.includes('testimonial')) {
            const merged = { ...(prev.testimonialscarousel || prev.testimonials || {}), ...content };
            next.testimonialscarousel = merged;
            next.testimonials = merged;
          }
          if (key.includes('latestnews') || key === 'news' || (key.includes('latest') && key.includes('news'))) {
            const merged = { ...(prev.latestnews || prev.news || {}), ...content };
            next.latestnews = merged;
            next.news = merged;
          }
          if (key.includes('clientlogo') || key === 'clientlogos') {
            const merged = { ...(prev.clientlogos || {}), ...content };
            next.clientlogos = merged;
          }
          if (key.includes('ctabanner') || key === 'cta' || (key.includes('cta') && key.includes('banner'))) {
            const merged = { ...(prev.ctabanner || prev.cta || {}), ...content };
            next.ctabanner = merged;
            next.cta = merged;
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
        { isHistoryPreview && <CompanyHistory data={companyHistoryData} /> }
        { isFeaturedServicesPreview && <FeaturedServices data={featuredServicesData} /> }
        { isAnnualProgressionPreview && <AnnualProgression data={annualProgressionData} /> }
        { isPortfolioPreview && <PortfolioSection data={portfolioData} /> }
        { isBranchesPreview && <BranchesAndAppointment data={branchesData} /> }
        { isCounterStatsPreview && <CounterStats data={counterStatsData} /> }
        { isTestimonialsPreview && <TestimonialsCarousel data={testimonialsData} /> }
        { isLatestNewsPreview && <LatestNews data={latestNewsData} /> }
        { isClientLogosPreview && <ClientLogos data={clientLogosData} /> }
        { isCtaBannerPreview && <CtaBanner data={ctaBannerData} /> }
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 selection:bg-[#C8102E] selection:text-white">
      <Header data={sectionsMap['header']} />
      <main>
        {!contentReady ? (
          <div className="min-h-[320px] flex items-center justify-center text-gray-400 text-sm">
            Loading site content…
          </div>
        ) : (
          <>
            {isVisibleSection(sectionVisibility, ['heroslider', 'hero']) && (
              <HeroSlider data={heroData} ready />
            )}
            {isVisibleSection(sectionVisibility, ['whatwedo', 'featurescarousel', 'features']) && (
              <WhatWeDo data={whatWeDoData} />
            )}
            {isVisibleSection(sectionVisibility, ['aboutsection', 'about', 'aboutus']) && (
              <AboutSection data={aboutData} />
            )}
            {isVisibleSection(sectionVisibility, ['companyhistory', 'history', 'ourcompanyhistory']) && (
              <CompanyHistory data={companyHistoryData} />
            )}
            {isVisibleSection(sectionVisibility, ['featuredservices', 'services']) && (
              <FeaturedServices data={featuredServicesData} />
            )}
            {isVisibleSection(sectionVisibility, ['annualprogression', 'progression', 'annual']) && (
              <AnnualProgression data={annualProgressionData} />
            )}
            {isVisibleSection(sectionVisibility, ['portfoliosection', 'portfolio']) && (
              <PortfolioSection data={portfolioData} />
            )}
            {isVisibleSection(sectionVisibility, ['branchesandappointment', 'branches', 'appointment']) && (
              <BranchesAndAppointment data={branchesData} />
            )}
            {isVisibleSection(sectionVisibility, ['counterstats', 'stats']) && (
              <CounterStats data={counterStatsData} />
            )}
            {isVisibleSection(sectionVisibility, ['testimonialscarousel', 'testimonials']) && (
              <TestimonialsCarousel data={testimonialsData} />
            )}
            {isVisibleSection(sectionVisibility, ['latestnews', 'news']) && (
              <LatestNews data={latestNewsData} />
            )}
            {isVisibleSection(sectionVisibility, ['clientlogos']) && (
              <ClientLogos data={clientLogosData} />
            )}
            {isVisibleSection(sectionVisibility, ['ctabanner', 'cta']) && (
              <CtaBanner data={ctaBannerData} />
            )}
          </>
        )}
      </main>
      <Footer data={sectionsMap['footer']} />
    </div>
  );
};

export default Home;