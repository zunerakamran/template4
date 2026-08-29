export const sectionKey = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const CANONICAL_KEYS = {
  herosection: 'heroslider',
  hero: 'heroslider',
  features: 'whatwedo',
  featurescarousel: 'whatwedo',
  about: 'aboutsection',
  aboutus: 'aboutsection',
  history: 'companyhistory',
  services: 'featuredservices',
  annual: 'annualprogression',
  progression: 'annualprogression',
  portfolio: 'portfoliosection',
  branches: 'branchesandappointment',
  branch: 'branchesandappointment',
  appointment: 'branchesandappointment',
  stats: 'counterstats',
  stat: 'counterstats',
  testimonials: 'testimonialscarousel',
  testimonial: 'testimonialscarousel',
  news: 'latestnews',
  logos: 'clientlogos',
  logo: 'clientlogos',
  cta: 'ctabanner',
  banner: 'ctabanner',
};

export const canonicalSectionKey = (nameOrKey) => {
  const key = sectionKey(nameOrKey);
  return CANONICAL_KEYS[key] || key;
};

export const VISIBILITY_ALIASES = {
  heroslider: ['heroslider', 'hero', 'herosection'],
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

export const applyVisibilityAliases = (visibility) => {
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
