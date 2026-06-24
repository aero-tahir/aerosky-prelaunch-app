import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TowerControl, Radio, Radar, Signal, ArrowRight, Cpu, Zap, Globe, ChevronDown, HelpCircle, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';
import { getLaunchMetrics, LaunchMetrics, getAirports, AirportTarget } from '../utils/db';
import { getFAQs } from '../services/strapi';
import { StrapiFAQ } from '../types/strapi';

const OLA_API_KEY = import.meta.env.VITE_OLA_MAP_API_KEY || '';
const OLA_STYLE_URL = `https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json`;


const Coverage: React.FC = () => {
  const [metrics, setMetrics] = useState<LaunchMetrics>({
    foundingCaptains: 0,
    citiesRegistered: 0,
    statesRepresented: 0,
    newsletterSubscribers: 0,
    communityMembers: 0
  });

  const [activeAirports, setActiveAirports] = useState<AirportTarget[]>([]);
  const [neededAirports, setNeededAirports] = useState<AirportTarget[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLaunchMetrics();
        setMetrics(data);
      } catch (e) {
        console.error('Failed to load coverage metrics:', e);
      }

      try {
        const airportsData = await getAirports();
        setActiveAirports(airportsData.active);
        setNeededAirports(airportsData.needed);
      } catch (e) {
        console.error('Failed to load airports data:', e);
      }
    }
    loadData();
  }, []);

  return (
    <div className="relative pt-16">
      <SEO
        title="ADS-B Coverage Vision | AeroSky"
        description="Learn about our airspace coverage vision, target ground station locations, and how to help close radar blind spots in India."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.ai/' },
            { '@type': 'ListItem', position: 2, name: 'Coverage', item: 'https://aerosky.ai/coverage' }
          ]
        }}
      />
      <Schema
        type="FAQPage"
        data={{
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is ADS-B coverage?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'ADS-B coverage is the line-of-sight range where ground stations can capture signals broadcasted by aircraft transponders. Dense regional setups allow seamless tracking.'
              }
            },
            {
              '@type': 'Question',
              name: 'How can I help expand the network?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'You can apply to host an AeroSky receiver ground station. We provide hardware kits to qualified nodes, or you can feed data using your own DIY receiver.'
              }
            },
            {
              '@type': 'Question',
              name: 'Which airports need coverage most?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Chennai, Kolkata, Hyderabad, Ahmedabad, Jaipur, Kochi, Goa, Lucknow, and over 100 other locations currently represent critical coverage gaps.'
              }
            },
            {
              '@type': 'Question',
              name: 'Do I need to live right next to an airport?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. ADS-B signals travel line-of-sight up to 200+ miles. Even Simple setups 50km away from airports can capture cruising aircraft telemetry.'
              }
            }
          ]
        }}
      />

      <HeroSection />
      <CoverageMap activeAirports={activeAirports} neededAirports={neededAirports} />
      <StatusStrip />
      <GapSection />
      <HowCoverageWorksSection />
      <AeroCaptainCTA />
      <FAQSection />
    </div>
  );
};

export default Coverage;

/* ═══════════════════════════════════════════
   HERO
═══════════════════════════════════════════ */
function HeroSection() {
  const statuses = [
    'Coverage Vision Established',
    'Targeting Underserved Corridors',
    'Community Driven Network',
    'AeroCaptain Applications Open'
  ];

  return (
    <section className="relative py-10 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,153,51,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,153,51,0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-sky-200/60 uppercase tracking-[0.2em]">ADS-B Coverage • India</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
            <span className="text-white">Airspace Coverage</span><br />
            <span className="text-saffron">Vision Grid</span>
          </h1>

          <p className="text-sm sm:text-base text-sky-200/70 max-w-xl mb-6 leading-relaxed">
            We are mapping target zones across major domestic corridors and tier-2 hubs. Our objective is to deploy fifty founding receiver nodes, eliminating low-altitude blind spots.
          </p>

          {/* Status Indicators list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {statuses.map((s) => (
              <div key={s} className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/10 transition-colors">
                <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-white">{s}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/aerocaptains"
              onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'coverage_hero' })}
              className="px-6 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:-translate-y-0.5 text-center cursor-pointer bg-gradient-to-br from-saffron to-gold"
            >
              Become a Founding AeroCaptain
            </Link>
            <a href="#map" className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-bold text-sm transition-all text-center">
              View Vision Map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   INTEREST MAP: Ola Maps with React GL
═══════════════════════════════════════════ */
function CoverageMap({ activeAirports, neededAirports }: { activeAirports: AirportTarget[], neededAirports: AirportTarget[] }) {
  const [hoveredAirport, setHoveredAirport] = useState<AirportTarget | null>(null);

  return (
    <section id="map" className="section-compact">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1 font-sans">Target Airspace Coverage Vision</h2>
          <p className="text-xs text-sky-200/50 font-mono uppercase tracking-wider">Proposed Founding AeroCaptain Nodes & Target Regions Map</p>
        </div>

        {/* Map */}
        <div className="rounded-2xl border border-white/[0.04] overflow-hidden relative bg-sky-950/[0.03]" style={{ height: '480px' }}>
          {!OLA_API_KEY ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-sm z-10">
              <AlertTriangle className="text-amber-500 mb-3 animate-pulse" size={40} />
              <h3 className="text-lg font-bold text-white mb-2 font-sans">Airspace Map Offline</h3>
              <p className="text-xs text-sky-200/60 max-w-md leading-relaxed mb-4 font-sans">
                The airspace telemetry mapping server is currently offline or the OLA Maps API key is unconfigured. 
                Please configure the <code className="text-amber-400 font-mono">VITE_OLA_MAP_API_KEY</code> environment variable to activate the live visualizer.
              </p>
              <div className="text-[10px] font-mono text-sky-200/30 uppercase tracking-widest">
                AeroSky Independent Telemetry Network
              </div>
            </div>
          ) : (
            <Map
              initialViewState={{ longitude: 79, latitude: 22, zoom: 3.5 }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={OLA_STYLE_URL}
              interactive={false}
              attributionControl={false}
              transformRequest={(url: string) => {
                if (url.includes('olamaps.io')) {
                  const sep = url.includes('?') ? '&' : '?';
                  return { url: `${url}${sep}api_key=${OLA_API_KEY}` };
                }
                return { url };
              }}
            >
              {activeAirports.map((airport) => (
                <Marker key={airport.name} longitude={airport.lng} latitude={airport.lat} anchor="center">
                  <div 
                    className="relative flex items-center justify-center group cursor-pointer"
                    onMouseEnter={() => setHoveredAirport(airport)}
                    onMouseLeave={() => setHoveredAirport(null)}
                  >
                    {/* Concentric Coverage Range Rings */}
                    <div className="absolute w-24 h-24 rounded-full bg-saffron/[0.03] border border-saffron/10 pointer-events-none" />
                    <div className="absolute w-48 h-48 rounded-full bg-saffron/[0.01] border border-saffron/[0.04] pointer-events-none" />
                    
                    <div className="absolute w-6 h-6 rounded-full border border-amber-400/30 animate-signal-ring" />
                    <div className="relative w-5 h-5 rounded-full bg-amber-500 border border-white/80 shadow-[0_0_8px_rgba(245,158,11,0.6)] flex items-center justify-center">
                      <TowerControl size={10} color="#ffffff" />
                    </div>
                  </div>
                </Marker>
              ))}

              {neededAirports.map((airport) => (
                <Marker key={airport.name} longitude={airport.lng} latitude={airport.lat} anchor="center">
                  <div 
                    className="relative flex items-center justify-center group cursor-pointer"
                    onMouseEnter={() => setHoveredAirport(airport)}
                    onMouseLeave={() => setHoveredAirport(null)}
                  >
                    {/* Potential/Desired Coverage Range Ring (Dashed) */}
                    <div className="absolute w-20 h-20 rounded-full border border-dashed border-amber-500/10 pointer-events-none" />
                    
                    <div className="relative w-4 h-4 rounded-full bg-amber-500/40 border border-amber-300/20 flex items-center justify-center">
                      <TowerControl size={8} color="#fef3c7" />
                    </div>
                  </div>
                </Marker>
              ))}
            </Map>
          )}

          {/* Premium Tooltip overlay */}
          {hoveredAirport && (
            <div className="absolute bottom-4 left-4 z-20 glass p-4 rounded-xl border border-white/10 shadow-xl max-w-xs animate-fade-in pointer-events-none bg-sky-950/80 backdrop-blur-md">
              <div className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider mb-1">
                {hoveredAirport.status === 'active' ? '★ Primary Target Zone' : '☆ Secondary Target Zone'}
              </div>
              <div className="text-sm font-bold text-white mb-0.5 font-sans">
                Airport: {hoveredAirport.name}
              </div>
              <div className="text-[10px] text-sky-200/60 leading-normal font-sans">
                {hoveredAirport.status === 'active' 
                  ? 'Active ground station telemetry streaming target. High priority sector.'
                  : 'Proposed ground station node. Seeking AeroCaptains to close coverage gap.'}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 border border-white/80 flex items-center justify-center"><TowerControl size={8} color="#fff" /></div>
            <span className="text-[10px] text-sky-200/60 font-mono">Primary Airspace Target Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500/40 border border-amber-300/20 flex items-center justify-center"><TowerControl size={8} color="#fef3c7" /></div>
            <span className="text-[10px] text-sky-200/60 font-mono">Secondary Airspace Target Zone</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusStrip() {
  return (
    <section className="section-compact">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Primary Targets */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">Primary Target Areas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Delhi (DEL)', 'Mumbai (BOM)', 'Bengaluru (BLR)', 'Pune (PNQ)', 'Chennai (MAA)', 'Kolkata (CCU)', 'Hyderabad (HYD)'].map((city) => (
                <span key={city} className="text-xs text-white font-medium px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">{city}</span>
              ))}
            </div>
          </div>

          {/* Underserved */}
          <div className="p-4 rounded-xl border border-amber-500/10 bg-white/[0.01]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-400/50" />
              <span className="text-[10px] font-mono font-bold text-sky-200/50 uppercase tracking-wider">Underserved Regional Airspace</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Solapur', 'Gulbarga', 'Nashik', 'Ahmedabad', 'Kochi', 'Jaipur', 'Lucknow', 'and 30+ regional hubs...'].map((city) => (
                <span key={city} className="text-xs text-sky-200/60 font-medium">{city}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   COVERAGE GAPS - Why we need more AeroCaptains
═══════════════════════════════════════════ */
function GapSection() {
  return (
    <section className="section-compact">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Addressing India's Coverage Gaps</h2>
          <p className="text-sm text-sky-200/70 max-w-2xl mx-auto leading-relaxed mb-3">
            Most tracking networks operate remote servers beyond Indian borders. Crucially, low-altitude airspace in tier-2/3 cities, coastal airways, and remote border corridors contain significant tracking blind spots.
          </p>
          <p className="text-xs text-sky-200/60 max-w-2xl mx-auto leading-relaxed mb-4">
            By hosting local ground stations, contributors capture raw 1090 MHz transponder broadcasts directly from overhead aircraft. This telemetry feeds domestic databases, building a highly redundant and independent mapping infrastructure.
          </p>

          {/* Aviation & Educational Disclaimer card */}
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] text-left flex items-start gap-3">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <div>
              <div className="text-xs font-bold text-white mb-0.5">Educational Use & Non-Navigational Notice</div>
              <div className="text-[11px] text-sky-200/50 leading-normal">
                AeroSky is an independent community project. Telemetry displays and flight vectors are processed for academic, hobbyist, and testing purposes. This utility is not certified for air traffic management, flight routing, or safety-critical navigation operations.
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: <Radar size={20} />, title: 'Eliminate Blind Spots', desc: 'Dense local ground stations help cover low-altitude airspace below standard radar beams.' },
            { icon: <Signal size={20} />, title: 'Improve MLAT Accuracy', desc: 'Overlapping receivers enable multilateration calculations to track aircraft without full ADS-B transponders.' },
            { icon: <Globe size={20} />, title: 'Airport Surface Movement', desc: 'Reactors placed close to runways provide approach monitoring and surface taxi tracking.' },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-amber-500/15 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">{item.icon}</div>
              <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-sky-200/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   AEROCAPTAIN CTA
═══════════════════════════════════════════ */
function AeroCaptainCTA() {
  return (
    <section className="section-compact">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
          Your City Needs an AeroCaptain
        </h2>
        <p className="text-sm text-sky-200/60 max-w-lg mx-auto mb-6">
          If you live near any Indian airport or flight corridor, you can help stream real-time flight telemetry. AeroSky provides setup support and receiver kits to qualified applicants.
        </p>
        <Link
          to="/aerocaptains"
          onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'coverage_cta' })}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_25px_rgba(255,153,51,0.3)] hover:-translate-y-0.5 bg-gradient-to-br from-saffron to-gold"
        >
          Become a Founding AeroCaptain <ArrowRight size={16} />
        </Link>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[
            { icon: <Cpu size={12} />, text: 'Free Hardware Kits to Selected Hosts' },
            { icon: <Zap size={12} />, text: 'DIY Raspberry Pi setups fully supported' },
            { icon: <Radio size={12} />, text: 'Founding AeroCaptain badge' },
            { icon: <MapPin size={12} />, text: 'Fuzzed public coordinates for host privacy' },
          ].map((t) => (
            <span key={t.text} className="flex items-center gap-1.5 text-[10px] font-mono text-sky-200/50 uppercase tracking-wider">
              <span className="text-amber-400">{t.icon}</span> {t.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   HOW COVERAGE WORKS
 ═══════════════════════════════════════════ */
function HowCoverageWorksSection() {
  const parameters = [
    { title: "Line of Sight", desc: "ADS-B signals operate at 1090 MHz, which is a high-frequency band requiring an unobstructed visual line of sight between the aircraft and the ground station antenna." },
    { title: "Terrain Profiles", desc: "Mountains, buildings, and local hills block signals. Ground stations at higher elevations or in flat plains capture streams from much further away." },
    { title: "Antenna Elevation", desc: "Placing your antenna on a rooftop or mounting mast significantly increases the radio horizon, extending target range up to 250 miles." },
    { title: "Aircraft Altitude", desc: "Cruising commercial airliners at 35,000 feet transmit signals that carry much further than low-altitude flights." },
    { title: "Receiver Sensitivity", desc: "Using high-quality RTL-SDR dongles equipped with Low Noise Amplifiers (LNA) and bandpass filters filters out local RF noise, improving packet yields." }
  ];

  return (
    <section className="section-compact bg-black/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-3">
            <Signal size={12} className="text-amber-500" /> Radio Science
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">How Airspace Coverage Works</h2>
          <p className="text-xs sm:text-sm text-sky-200/60 max-w-xl mx-auto">
            ADS-B signal propagation is governed by physics. Understanding these five parameters helps optimize ground station positioning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {parameters.slice(0, 3).map((item) => (
            <div key={item.title} className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-amber-500/15 transition-all">
              <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-sky-200/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:w-[67%] lg:mx-auto">
            {parameters.slice(3).map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-amber-500/15 transition-all">
                <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-sky-200/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FAQ
 ═══════════════════════════════════════════ */
function FAQSection() {
  const [faqs, setFaqs] = useState<StrapiFAQ[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    async function loadFAQs() {
      try {
        const data = await getFAQs();
        const filtered = data.filter(faq => {
          const q = faq.question.toLowerCase();
          const a = faq.answer.toLowerCase();
          return (
            q.includes('coverage') || q.includes('expand') || q.includes('airport') || q.includes('live right next') ||
            a.includes('coverage') || a.includes('expand') || a.includes('airport') || a.includes('live right next')
          );
        });
        setFaqs(filtered);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      }
    }
    loadFAQs();
  }, []);

  return (
    <section className="section-compact">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-6">
          <HelpCircle size={14} className="text-amber-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">Coverage FAQ</h2>
        </div>
        <div className="space-y-2.5">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={faq.id || i} className="rounded-xl border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-300 hover:border-white/10">
                <button 
                  onClick={() => setOpenIdx(isOpen ? null : i)} 
                  aria-expanded={isOpen} 
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.question}</span>
                  <ChevronDown size={14} className={`text-amber-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100 border-t border-white/5 p-4 bg-white/[0.005]' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-xs sm:text-sm text-sky-200/60 leading-relaxed pt-1">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
