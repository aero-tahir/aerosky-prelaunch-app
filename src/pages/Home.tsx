import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Globe, Radio,
  Shield, Flag, Database, Lock, Radar, Plane, TowerControl,
  BarChart3, Users, Zap, ArrowRight, MapPin, CheckCircle2,
  CloudLightning, Eye, Fingerprint, IndianRupee, Map as MapIcon, ChevronRight
} from 'lucide-react';
import MapBackground from '../components/MapBackground';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

/* ─── Animated Counter ─── */
const useCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
};

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════ */
const Home: React.FC = () => (
  <div className="relative w-full overflow-x-hidden">
    <HeroSection />
    <VisionPillars />
    <MarketOpportunity />
    <AirportsPreview />
    <PlannedCapabilities />
    <FeederCTA />
    <WaitlistSection />
  </div>
);

export default Home;


/* ═══════════════════════════════════════════════════════════════
   SECTION 1: HERO
═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const citiesCounter = useCounter(25, 2000);
  const feedersCounter = useCounter(100, 1500);
  const waitlistCounter = useCounter(2500, 1800);
  const coverageCounter = useCounter(98, 1200);

  return (
    <section className="relative h-screen w-full overflow-hidden" aria-label="AeroSky: India's Sovereign Airspace Intelligence">
      {/* Background: Static Map */}
      <div className="absolute inset-0 z-0">
        <MapBackground className="w-full h-full" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#020617] via-[#020617]/90 via-40% to-transparent" />
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]" style={{
          background: `linear-gradient(135deg, ${INDIA_ORANGE}00 30%, ${INDIA_ORANGE} 50%, transparent 55%, ${INDIA_GREEN} 60%, ${INDIA_GREEN}00 75%)`
        }} />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#020617]/70 via-transparent to-[#020617]" />
      </div>

      {/* Pre-launch badge */}
      <div className="absolute top-20 right-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest">
          Pre-Launch • Coming Soon
        </span>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-20 pt-20 pb-4">
        <div className="w-full max-w-xl">

          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-bold tracking-[0.15em] mb-3 animate-slide-up"
            style={{ background: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)', color: INDIA_ORANGE }}
          >
            <Shield size={12} className="animate-pulse" />
            SOVEREIGN DATA • MADE IN INDIA • LAUNCHING SOON
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1] tracking-tighter mb-4 animate-slide-up delay-100">
            <span style={{ color: INDIA_ORANGE }}>India's Own</span><br />
            <span className="text-white">Airspace</span>{' '}
            <span style={{ color: INDIA_GREEN }}>Intelligence</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-sky-200/60 mb-2 max-w-lg leading-relaxed animate-slide-up delay-200">
            We're building India's first community-powered aviation intelligence platform.
            Sovereign flight visibility across Indian skies, powered by a growing network of ground stations.
          </p>

          {/* Vision Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 animate-slide-up delay-200">
            <TrustBadge icon={<Fingerprint size={11} />} color={INDIA_GREEN} text="Privacy-First" />
            <span className="hidden sm:inline text-sky-500/30 text-[8px]">●</span>
            <TrustBadge icon={<Activity size={11} />} color="#60A5FA" text="Community-Powered" />
            <span className="hidden sm:inline text-sky-500/30 text-[8px]">●</span>
            <TrustBadge icon={<Zap size={11} />} color={INDIA_ORANGE} text="India-First" />
          </div>

          {/* Projection Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden backdrop-blur-md animate-slide-up delay-400 shadow-xl border border-white/[0.06] bg-white/[0.02]">
            <div ref={citiesCounter.ref}>
              <StatBlock icon={<MapPin size={14} />} label="Target Cities" value={`${citiesCounter.count}+`} accentColor={INDIA_ORANGE} />
            </div>
            <div ref={feedersCounter.ref}>
              <StatBlock icon={<Radio size={14} />} label="Founding Feeders" value={`${feedersCounter.count}+`} accentColor="#FFFFFF" />
            </div>
            <div ref={waitlistCounter.ref}>
              <StatBlock icon={<Users size={14} />} label="Beta Waitlist" value={`${waitlistCounter.count.toLocaleString()}+`} accentColor={INDIA_GREEN} />
            </div>
            <div ref={coverageCounter.ref}>
              <StatBlock icon={<Radar size={14} />} label="Coverage Goal" value={`${coverageCounter.count}%`} accentColor="#60A5FA" />
            </div>
          </div>

          {/* CTA Row */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3 animate-slide-up delay-500">
            <a href="#waitlist" className="flex-1 text-black text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(255,153,51,0.2)] hover:shadow-[0_0_40px_rgba(255,153,51,0.35)] hover:-translate-y-1" style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}>
              <MapIcon size={18} /> Signup Waitlist
            </a>
            <Link to="/feeders" className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-bold text-white transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm">
              <Radio size={16} /> Apply for Hosting Ground Station
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 animate-bounce opacity-30">
        <ChevronRight size={12} className="text-gray-500 rotate-90" />
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 2: VISION PILLARS
═══════════════════════════════════════════════════════════════ */
function VisionPillars() {
  return (
    <section className="relative z-10 py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
      <article className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
            <Flag size={12} style={{ color: INDIA_ORANGE }} /> Our Vision
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
            Built in India. <span style={{ color: INDIA_ORANGE }}>For India.</span>
          </h2>
          <p className="text-sky-200/50 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We're building an indigenous airspace intelligence platform where Indian aviation data
            stays on Indian soil, processed by Indian infrastructure, governed by Indian laws.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          <PillarCard icon={<Lock size={28} />} title="Data Sovereignty by Design" description="All flight data will be processed and stored exclusively in Indian data centers. Zero foreign cloud dependency. That's our commitment." accentColor={INDIA_ORANGE} stats={[{ label: 'Hosting', value: 'India-Only' }, { label: 'Compliance', value: 'DPDPA' }]} />
          <PillarCard icon={<Shield size={28} />} title="Regulatory Alignment" description="Being designed for DGCA regulations and MoCA directives from day one. ICAO standards with Indian regulatory frameworks." accentColor="#FFFFFF" stats={[{ label: 'Standards', value: 'ICAO/DGCA' }, { label: 'Framework', value: 'India-First' }]} />
          <PillarCard icon={<Zap size={28} />} title="Indigenous Tech Stack" description="From ADS-B receiver firmware to analytics, our entire stack is being conceived, developed, and maintained by Indian engineers." accentColor={INDIA_GREEN} stats={[{ label: 'Team', value: '100% Indian' }, { label: 'R&D', value: 'Bengaluru' }]} />
        </div>
      </article>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: MARKET OPPORTUNITY
═══════════════════════════════════════════════════════════════ */
function MarketOpportunity() {
  return (
    <section className="relative z-10 py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
            <BarChart3 size={12} className="text-blue-400" /> The Opportunity
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
            Indian Aviation is <span style={{ color: INDIA_ORANGE }}>Booming</span>
          </h2>
          <p className="text-sky-200/50 text-sm sm:text-lg max-w-2xl mx-auto">
            The world's third-largest and fastest-growing domestic aviation market, yet it lacks indigenous airspace intelligence.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          <BigStat value="7,000+" label="Daily Domestic Flights" icon={<Plane size={20} />} color={INDIA_ORANGE} />
          <BigStat value="118" label="DGCA-Listed Airports" icon={<TowerControl size={20} />} color="#FFFFFF" />
          <BigStat value="14+" label="Indian Airlines" icon={<Globe size={20} />} color="#60A5FA" />
          <BigStat value="3.28L Km²" label="Indian Airspace" icon={<Radar size={20} />} color={INDIA_GREEN} />
        </div>

        {/* Airlines */}
        <div className="mt-10 border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm">
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: INDIA_GREEN }} />
            <span className="text-[11px] font-mono font-bold text-sky-200/50 uppercase tracking-widest">Airlines We Plan to Cover</span>
          </div>
          <div className="p-5 flex flex-wrap gap-3 justify-center">
            {['Air India', 'IndiGo', 'SpiceJet', 'Akasa Air', 'Air India Express', 'Alliance Air', 'Star Air', 'Fly91', 'IndiGo Cargo', 'Blue Dart Aviation', 'Pawan Hans'].map((airline) => (
              <span key={airline} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-sm text-sky-200/70 font-medium cursor-default">{airline}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 4: AIRPORTS PREVIEW
═══════════════════════════════════════════════════════════════ */
function AirportsPreview() {
  const airports = [
    { code: 'DEL', name: 'Indira Gandhi Intl', city: 'New Delhi', icao: 'VIDP' },
    { code: 'BOM', name: 'CSM International', city: 'Mumbai', icao: 'VABB' },
    { code: 'BLR', name: 'Kempegowda Intl', city: 'Bengaluru', icao: 'VOBL' },
    { code: 'MAA', name: 'Chennai Intl', city: 'Chennai', icao: 'VOMM' },
    { code: 'CCU', name: 'Netaji Subhas', city: 'Kolkata', icao: 'VECC' },
    { code: 'HYD', name: 'Rajiv Gandhi Intl', city: 'Hyderabad', icao: 'VOHS' },
    { code: 'GOI', name: 'Manohar Intl', city: 'Goa', icao: 'VOGO' },
    { code: 'COK', name: 'Cochin Intl', city: 'Kochi', icao: 'VOCI' },
    { code: 'AMD', name: 'Sardar Vallabhbhai', city: 'Ahmedabad', icao: 'VAAH' },
    { code: 'JAI', name: 'Jaipur Intl', city: 'Jaipur', icao: 'VIJP' },
  ];

  return (
    <section className="relative z-10 py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
            <MapPin size={12} style={{ color: INDIA_GREEN }} /> Target Airports
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
            India's Busiest <span style={{ color: INDIA_GREEN }}>Airports</span>
          </h2>
          <p className="text-sky-200/50 text-sm sm:text-lg max-w-2xl mx-auto">
            We're building coverage for India's major airports. Live visibility, weather, and flight intelligence coming in beta.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {airports.map((airport) => (
            <div key={airport.code} className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all duration-300 hover:shadow-lg hover:bg-white/[0.04] hover:-translate-y-1 text-left">
              <div className="text-xl font-mono font-bold text-white mb-0.5 group-hover:text-amber-400 transition-colors">{airport.code}</div>
              <div className="text-[10px] text-sky-300/50 font-mono mb-1.5">{airport.icao}</div>
              <div className="text-sm text-sky-200/70 font-medium mb-0.5">{airport.name}</div>
              <div className="text-xs text-sky-200/40">{airport.city}</div>
              <div className="mt-2 pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono text-amber-400/60 uppercase">Coming in Beta</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: PLANNED CAPABILITIES
═══════════════════════════════════════════════════════════════ */
function PlannedCapabilities() {
  return (
    <section className="relative z-10 py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
            <Eye size={12} style={{ color: INDIA_ORANGE }} /> What We're Building
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
            Intelligence. <span style={{ color: INDIA_ORANGE }}>Reimagined.</span>
          </h2>
          <p className="text-sky-200/50 text-sm sm:text-lg max-w-2xl mx-auto">
            Precision tracking technology being built for civil aviation transparency, from Indian soil.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <FeatureCard icon={<Radar size={24} />} title="Real-Time ADS-B Visibility" desc="Sub-second position updates from a growing network of indigenous ADS-B receivers across India." accent={INDIA_ORANGE} />
          <FeatureCard icon={<CloudLightning size={24} />} title="Indian METAR & Weather" desc="Live weather feeds integrated with runway-level conditions for operational Indian airports." accent="#60A5FA" />
          <FeatureCard icon={<BarChart3 size={24} />} title="Delay Analytics" desc="OTP metrics aligned with DGCA reporting standards. Compare airlines across Indian routes." accent={INDIA_GREEN} />
          <FeatureCard icon={<Lock size={24} />} title="Squawk & Alert Intelligence" desc="Awareness of squawk codes (7500, 7600, 7700) with notifications for emergencies in Indian airspace." accent="#EF4444" />
          <FeatureCard icon={<Database size={24} />} title="Sovereign Aviation API" desc="RESTful APIs designed to serve Indian aviation data from Indian servers. DPDPA-compliant by design." accent="#A855F7" />
          <FeatureCard icon={<IndianRupee size={24} />} title="INR-First Pricing" desc="No USD markups. Transparent pricing in Indian Rupees with GST-compliant invoicing." accent="#FACC15" />
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 6: FEEDER CTA
═══════════════════════════════════════════════════════════════ */
function FeederCTA() {
  return (
    <section className="relative z-10 py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/20 text-[11px] font-mono font-bold tracking-widest uppercase mb-5" style={{ color: INDIA_ORANGE }}>
          <Flag size={12} /> Be Part of Something Big
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
          <span style={{ color: INDIA_ORANGE }}>India's Airspace.</span><br />
          <span className="text-white">India's Data.</span><br />
          <span style={{ color: INDIA_GREEN }}>India's Platform.</span>
        </h2>

        <p className="text-sky-200/50 text-sm sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Help us build India's community-driven aviation intelligence network.
          Host a ground station, join the beta, shape the future of Indian aviation data.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#waitlist" className="px-8 py-4 rounded-xl text-black font-bold text-base transition-all hover:-translate-y-1 shadow-[0_0_40px_rgba(255,153,51,0.2)] hover:shadow-[0_0_60px_rgba(255,153,51,0.3)] flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}>
            <MapIcon size={20} /> Signup Waitlist
          </a>
          <Link to="/feeders" className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-base transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
            <Radio size={20} /> Host a Ground Station
          </Link>
        </div>

        <div className="mt-12 flex justify-center" aria-hidden="true">
          <div className="w-32 h-1 rounded-full flex overflow-hidden">
            <div className="flex-1" style={{ background: INDIA_ORANGE }} />
            <div className="flex-1 bg-white" />
            <div className="flex-1" style={{ background: INDIA_GREEN }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7: WAITLIST FORM
═══════════════════════════════════════════════════════════════ */
function WaitlistSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="waitlist" className="relative z-10 py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
            Signup Waitlist
          </h2>
          <p className="text-sky-200/50 text-sm sm:text-base">
            Be among the first to experience India's airspace intelligence platform.
          </p>
        </div>

        {submitted ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
            <p className="text-sm text-sky-200/60">We'll reach out when your beta access is ready.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wl-name" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">Name</label>
                <input id="wl-name" name="name" type="text" required placeholder="Your name" className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-sky-400/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20" />
              </div>
              <div>
                <label htmlFor="wl-email" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">Email</label>
                <input id="wl-email" name="email" type="email" required placeholder="you@email.com" className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-sky-400/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wl-city" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">City</label>
                <input id="wl-city" name="city" type="text" placeholder="Your city" className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-sky-400/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20" />
              </div>
              <div>
                <label htmlFor="wl-type" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">I am a...</label>
                <select id="wl-type" name="userType" className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none">
                  <option value="" className="bg-[#0c1222]">Select type</option>
                  <option value="enthusiast" className="bg-[#0c1222]">Enthusiast</option>
                  <option value="traveler" className="bg-[#0c1222]">Traveler</option>
                  <option value="spotter" className="bg-[#0c1222]">Spotter</option>
                  <option value="pilot" className="bg-[#0c1222]">Pilot</option>
                  <option value="developer" className="bg-[#0c1222]">Developer</option>
                  <option value="feeder" className="bg-[#0c1222]">Feeder</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-2">Interested in</label>
              <div className="flex flex-wrap gap-2">
                {['Flight Tracking', 'Airport Intelligence', 'APIs', 'AI Insights', 'Feeder Program'].map((interest) => (
                  <label key={interest} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:border-amber-500/30 transition-colors text-sm text-sky-200/70">
                    <input type="checkbox" name="interests" value={interest} className="w-3.5 h-3.5 rounded border-white/20 bg-white/[0.04] text-amber-500 focus:ring-amber-500/20" />
                    {interest}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)]" style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}>
              Request Early Access
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

const TrustBadge = ({ icon, color, text }: { icon: React.ReactNode; color: string; text: string }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-200/70 uppercase tracking-wider">
    <span style={{ color }}>{icon}</span> {text}
  </span>
);

const StatBlock = ({ icon, label, value, accentColor }: {
  icon: React.ReactNode; label: string; value: string; accentColor: string;
}) => (
  <div className="bg-black/30 p-3 hover:bg-white/[0.03] transition-all duration-300 group cursor-default backdrop-blur-sm border-r border-white/[0.04] last:border-0 relative">
    <div className="flex items-center gap-1.5 mb-1">
      <span style={{ color: accentColor }}>{icon}</span>
      <span className="text-[9px] font-bold uppercase tracking-wider text-sky-200/40 group-hover:text-white transition-colors">{label}</span>
    </div>
    <div className="text-xl md:text-2xl font-mono font-bold text-white">{value}</div>
  </div>
);

const PillarCard = ({ icon, title, description, accentColor, stats }: {
  icon: React.ReactNode; title: string; description: string; accentColor: string;
  stats: { label: string; value: string }[];
}) => (
  <article className="group relative p-6 rounded-2xl glass hover:border-amber-500/15 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
    <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: accentColor }} />
    <div className="mb-3" style={{ color: accentColor }}>{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sky-200/50 text-sm leading-relaxed mb-4">{description}</p>
    <div className="flex gap-3">
      {stats.map((s) => (
        <div key={s.label} className="flex-1 bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]">
          <div className="text-[10px] font-mono text-sky-200/40 uppercase tracking-wider">{s.label}</div>
          <div className="font-bold text-white text-sm mt-0.5">{s.value}</div>
        </div>
      ))}
    </div>
  </article>
);

const BigStat = ({ value, label, icon, color }: {
  value: string; label: string; icon: React.ReactNode; color: string;
}) => (
  <div className="text-center p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:shadow-md hover:bg-white/[0.04]">
    <div className="mb-2 flex justify-center" style={{ color }}>{icon}</div>
    <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-white mb-1">{value}</div>
    <div className="text-[10px] sm:text-xs text-sky-200/40 uppercase tracking-wider font-medium">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc, accent }: {
  icon: React.ReactNode; title: string; desc: string; accent: string;
}) => (
  <article className="group relative p-5 rounded-xl glass hover:border-amber-500/15 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="mb-3 p-2.5 rounded-lg inline-flex" style={{ background: `${accent}12`, color: accent }}>{icon}</div>
    <h3 className="text-base font-bold text-white mb-1.5">{title}</h3>
    <p className="text-sky-200/50 text-sm leading-relaxed">{desc}</p>
  </article>
);
