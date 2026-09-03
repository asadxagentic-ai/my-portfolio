import React, { useState, useEffect } from 'react';
import { About } from './components/About';
import { LiquidNavbar } from './components/LiquidNavbar';
import { FlipText } from './components/FlipText';
import { TechnicalExpertise } from './components/TechnicalExpertise';
import { Projects } from './components/Projects';
import { CustomCursor } from './components/CustomCursor';
import { DragonCursor } from './components/DragonCursor';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { motion } from 'motion/react';
import { HeroImage } from './components/HeroImage';
import { BrandLoader } from './components/BrandLoader';
import { DragonProvider } from './components/DragonContext';
import {
  SectionTeleprinter,
  ScrollDepthIndicator,
} from './components/ScrollAnimations';
import { ScrollSystemProvider, useScrollSystem } from './components/ScrollSystem';
import { DataProvider } from './context/DataContext';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotFound } from './components/NotFound';
import { AllProjects } from './components/AllProjects';

export default function App() {
  return (
    <DataProvider>
      <DragonProvider>
        <ScrollSystemProvider>
          <AppRouter />
        </ScrollSystemProvider>
      </DragonProvider>
    </DataProvider>
  );
}

function AppRouter() {
  const [currentPath, setCurrentPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [currentHash, setCurrentHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      setCurrentPath(window.location.pathname);
      setCurrentHash(window.location.hash);

      const savedAuth = sessionStorage.getItem('asad_admin_authenticated') === 'true';
      setIsAdminAuth(savedAuth);
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const isAdminPath = currentPath === '/admin' || currentHash === '#admin';
  const isAllProjectsPath = currentPath === '/projects' || currentHash === '#all-projects' || currentHash === '#projects-all';
  const isHomePath = currentPath === '/' || currentPath === '' || currentPath === '/index.html';

  if (isAdminPath) {
    if (!isAdminAuth) {
      return <AdminLogin onLoginSuccess={() => setIsAdminAuth(true)} />;
    }
    return (
      <AdminDashboard
        onLogout={() => {
          sessionStorage.removeItem('asad_admin_authenticated');
          setIsAdminAuth(false);
          window.location.hash = '';
        }}
      />
    );
  }

  if (isAllProjectsPath) {
    return <AllProjects />;
  }

  if (isHomePath) {
    return <MainAppContent />;
  }

  return <NotFound />;
}

function MainAppContent() {
  const { scrollTo } = useScrollSystem();
  return (
    <div className="font-sans selection:bg-[#f05a28] selection:text-white overflow-x-hidden bg-[#f05a28] text-white">
      {/* Dedicated Viewport-Centered Cinematic Brand Intro Loader */}
      <BrandLoader />

      {/* Global Scroll Animation Layer */}
      <SectionTeleprinter />
      <ScrollDepthIndicator />

      <CustomCursor />
      <DragonCursor />
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Vertical Lines */}
          <div className="absolute top-0 bottom-0 left-[5%] w-px bg-white/20"></div>
          <div className="absolute top-0 bottom-0 left-[34%] w-px bg-white/20"></div>
          <div className="absolute top-0 bottom-0 left-[67%] w-px bg-white/20"></div>
          <div className="absolute top-0 bottom-0 right-[5%] w-px bg-white/20"></div>

          {/* Horizontal Lines */}
          <div className="absolute left-0 right-0 top-[10%] h-px bg-white/20"></div>
          <div className="absolute left-0 right-0 top-[38%] h-px bg-white/20"></div>
          <div className="absolute left-0 right-0 top-[68%] h-px bg-white/20"></div>
          
          {/* Plus signs at intersections */}
          <Cross x="5%" y="10%" />
          <Cross x="34%" y="10%" />
          <Cross x="67%" y="10%" />
          <Cross x="95%" y="10%" />

          <Cross x="5%" y="38%" />
          <Cross x="34%" y="38%" />
          <Cross x="67%" y="38%" />
          <Cross x="95%" y="38%" />

          <Cross x="5%" y="68%" />
          <Cross x="34%" y="68%" />
          <Cross x="67%" y="68%" />
          <Cross x="95%" y="68%" />
        </div>

        {/* STEP 3 — Faded Background Text (Plays with Portrait Reveal at 3.6s) */}
        <div className="absolute inset-0 z-[1] pointer-events-none flex flex-col pt-[14vh] px-[5%]">
          <h1 className="text-[11vw] sm:text-[13vw] md:text-[14vw] font-black leading-[0.8] tracking-tighter uppercase w-full -ml-1 sm:-ml-2 opacity-10">
            <FlipText duration={1.2} delay={3.6}>ASADULLAH</FlipText>
          </h1>
        </div>

        {/* STEP 2 — Portrait Layer (Enters after logo lands at 3.6s) */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 3.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 -translate-x-1/2 bottom-[-5%] h-[60vh] sm:h-[78vh] md:h-[95vh] w-auto pointer-events-auto z-[2] flex justify-center items-end"
        >
          {/* Warm Orange Glow */}
          <div className="absolute inset-0 bg-[#ff804d] blur-[100px] opacity-40 rounded-full scale-75 transform-gpu translate-y-10"></div>
          
          {/* Hero Portrait Image */}
          <HeroImage 
            originalSrc="/portrait.png"
            altText="Asadullah Portfolio Portrait"
            className="relative h-full aspect-[3/4] md:aspect-[4/5] drop-shadow-2xl"
          />
        </motion.div>

        {/* STEP 1 — Liquid Glass Navigation */}
        <LiquidNavbar />

        {/* Main Content (Foreground) */}
        <main className="relative z-[3] flex-1 flex flex-col justify-between pt-[4vh] pb-[6vh] px-[5%] pointer-events-none">
          <div className="w-full">
            {/* Invisible spacer to maintain layout matching the background h1 */}
            <div className="text-[11vw] sm:text-[13vw] md:text-[14vw] font-black leading-[0.8] tracking-tighter uppercase w-full -ml-1 sm:-ml-2 opacity-0 pointer-events-none select-none">
              ASADULLAH
            </div>
            
            <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 mt-24 sm:mt-32 md:mt-[44vh] lg:mt-32 xl:mt-36 2xl:mt-40">
              {/* STEP 4 — Left Subheadline (Positioned upward on Laptop/PC) */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 4.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 sm:mt-8 md:mt-0 max-w-full sm:max-w-xs md:max-w-sm lg:max-w-xs xl:max-w-sm ml-1 pointer-events-auto leading-relaxed tracking-[0.01em]"
              >
                <div className="uppercase font-['Space_Grotesk'] text-[13px] xs:text-[15px] sm:text-[16px] md:text-[17px] text-white leading-snug">
                  <span className="font-semibold inline">
                    BUILDING NEXT-GENERATION{' '}
                  </span>
                  <span className="font-bold whitespace-nowrap inline">
                    AI AUTOMATION
                  </span>
                </div>
                <p className="font-['Inter'] font-normal text-[12px] xs:text-[14px] sm:text-[15px] text-white/90 mt-1 leading-relaxed">
                  <i>that streamlines workflows, boosts productivity, and scales with your business</i>
                </p>
              </motion.div>

              {/* STEP 4.5 — Right Subheadline (Positioned near shoulder on iPad & Tablet) */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 5.0, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:block max-w-[280px] sm:max-w-xs md:max-w-sm mr-1 text-left pointer-events-auto leading-[1.35] tracking-[0.02em]"
              >
                <div>
                  <div className="font-['Space_Grotesk'] font-bold text-[14px] sm:text-[16px] md:text-[17px] text-white uppercase">
                    AI That Works
                  </div>
                  <div className="font-['Space_Grotesk'] font-semibold text-[14px] sm:text-[16px] md:text-[17px] text-white uppercase">
                    AUTOMATION that scales
                  </div>
                  <p className="font-['Space_Grotesk'] font-bold text-[14px] sm:text-[16px] md:text-[17px] text-white uppercase">
                    SYSTEMS built for impact
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-auto w-full pointer-events-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-0 relative z-10">
            {/* STEP 5 — Large ASADULLAH Typography & Role Tag (Rises at 5.5s) */}
            <motion.div
              initial={{ opacity: 0, y: 140 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 5.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-xs font-mono font-bold mb-1.5 sm:mb-3 ml-1 tracking-[0.2em] uppercase text-white/90 flex items-center gap-2.5">
                <span>©2026</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="text-white/90 tracking-[0.25em] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-md">
                  AI ENGINEER
                </span>
              </div>
              <h2 className="text-[9vw] sm:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase w-full -ml-1 sm:-ml-2">
                ASADULLAH
              </h2>
            </motion.div>
            
            {/* STEP 6 — Let's Talk Contact Card / Button (Appears last at 6.3s) */}
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 6.3, ease: [0.16, 1, 0.3, 1] }}
              id="hero-lets-talk-btn"
              role="button"
              tabIndex={0}
              onClick={() => scrollTo('contact')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrollTo('contact');
                }
              }}
              className="flex bg-[#111] rounded-xl p-2 sm:p-2.5 gap-3 sm:gap-3.5 items-stretch border border-white/10 text-white w-full sm:w-[260px] max-w-[280px] pointer-events-auto cursor-pointer group/talk hover:border-white/20 hover:bg-[#151515] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 shadow-2xl mb-2 mr-2 relative z-10 focus:outline-none focus:ring-2 focus:ring-[#f05a28]"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                <img 
                  src="/portrait.png" 
                  alt="Asadullah" 
                  className="w-full h-full object-cover group-hover/talk:scale-110 transition-transform duration-500"
                  decoding="async"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop";
                  }}
                />
              </div>
              
              <div className="flex flex-col flex-grow justify-between py-0.5">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] sm:text-[11px] text-white/70 font-medium">Let's Talk</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover/talk:text-white/80 group-hover/talk:rotate-180 transition-all duration-500">
                    <path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7" />
                  </svg>
                </div>
                
                <div className="flex justify-between items-end mt-1">
                  <div>
                    <h4 className="font-bold text-sm sm:text-[15px] leading-tight mb-0.5">Asadullah</h4>
                    <p className="text-[9px] sm:text-[10px] text-[#f05a28] font-mono font-bold tracking-wider uppercase">AI Engineer</p>
                  </div>
                  
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded flex items-center justify-center text-black group-hover/talk:-translate-y-0.5 group-hover/talk:translate-x-0.5 transition-transform duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </section>

      {/* About Section */}
      <About />

      {/* Technical Expertise — Cinematic 3D Section */}
      <TechnicalExpertise />

      {/* Projects Section */}
      <Projects />

      {/* Contact Section */}
      <Contact />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

function Cross({ x, y }: { x: string; y: string }) {
  return (
    <div 
      className="absolute w-4 h-4 flex items-center justify-center text-white/50 text-[10px] font-light pointer-events-none select-none"
      style={{ left: `calc(${x} - 8px)`, top: `calc(${y} - 8px)` }}
    >
      +
    </div>
  );
}
