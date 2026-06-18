import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TowerControl, Radio, Radar, Signal, ArrowRight, Cpu, Zap, Globe, ChevronDown, HelpCircle, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';
import { getLaunchMetrics, LaunchMetrics } from '../utils/db';
import { getFAQs } from '../services/strapi';
import { StrapiFAQ } from '../types/strapi';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';
const OLA_API_KEY = import.meta.env.VITE_OLA_MAP_API_KEY || '';
const OLA_STYLE_URL = `https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json`;

/* Active ground stations (blue) */
const ACTIVE_AIRPORTS = [
  { name: 'DEL', lat: 28.556, lng: 77.100 },
  { name: 'BOM', lat: 19.089, lng: 72.865 },
  { name: 'BLR', lat: 13.198, lng: 77.706 },
  { name: 'PNQ', lat: 18.582, lng: 73.919 },
  { name: 'SSE', lat: 17.625, lng: 75.934 }, // Solapur
  { name: 'GBI', lat: 17.520, lng: 76.820 }, // Gulbarga
];

/* Needed ground stations (red) - major Indian airports without coverage */
const NEEDED_AIRPORTS = [
  { name: 'HYD', lat: 17.231, lng: 78.429 },
  { name: 'MAA', lat: 12.994, lng: 80.170 },
  { name: 'CCU', lat: 22.654, lng: 88.446 },
  { name: 'AMD', lat: 23.077, lng: 72.634 },
  { name: 'COK', lat: 10.152, lng: 76.401 },
  { name: 'JAI', lat: 26.824, lng: 75.812 },
  { name: 'LKO', lat: 26.760, lng: 80.889 },
  { name: 'GOI', lat: 15.380, lng: 73.831 },
  { name: 'GAU', lat: 26.106, lng: 91.585 },
  { name: 'PAT', lat: 25.591, lng: 85.087 },
  { name: 'SXR', lat: 33.987, lng: 74.774 },
  { name: 'IXC', lat: 30.673, lng: 76.788 },
  { name: 'NAG', lat: 21.092, lng: 79.047 },
  { name: 'VNS', lat: 25.452, lng: 82.859 },
  { name: 'TRV', lat: 8.482, lng: 76.920 },
  { name: 'IXB', lat: 26.681, lng: 88.328 },
  { name: 'BBI', lat: 20.244, lng: 85.817 },
  { name: 'IDR', lat: 22.721, lng: 75.801 },
  { name: 'RPR', lat: 21.180, lng: 81.738 },
  { name: 'IXR', lat: 23.314, lng: 85.321 },
  { name: 'VTZ', lat: 17.721, lng: 83.224 },
  { name: 'IXM', lat: 9.834, lng: 78.093 },
  { name: 'CJB', lat: 11.030, lng: 77.043 },
  { name: 'CCJ', lat: 11.136, lng: 75.955 },
  { name: 'IXE', lat: 12.961, lng: 74.890 },
  { name: 'STV', lat: 21.114, lng: 72.741 },
  { name: 'RAJ', lat: 22.309, lng: 70.779 },
  { name: 'BHO', lat: 23.287, lng: 77.337 },
  { name: 'DEP', lat: 24.432, lng: 87.232 },
  { name: 'IMF', lat: 24.760, lng: 93.896 },
  { name: 'DIB', lat: 27.483, lng: 95.016 },
  { name: 'JRH', lat: 26.731, lng: 94.175 },
  { name: 'IXA', lat: 23.886, lng: 91.240 },
  { name: 'AJL', lat: 23.746, lng: 92.619 },
  { name: 'DMU', lat: 25.883, lng: 93.771 },
  { name: 'IXS', lat: 24.912, lng: 92.978 },
  { name: 'PYB', lat: 12.274, lng: 76.624 },
  { name: 'HBX', lat: 15.361, lng: 75.084 },
  { name: 'BEK', lat: 25.240, lng: 86.971 },
  { name: 'DED', lat: 30.189, lng: 78.180 },
  { name: 'KUU', lat: 31.876, lng: 77.154 },
  { name: 'DHM', lat: 32.165, lng: 76.263 },
  { name: 'IXL', lat: 34.135, lng: 77.546 },
  { name: 'ATQ', lat: 31.706, lng: 74.797 },
  { name: 'JLR', lat: 23.177, lng: 80.052 },
  { name: 'GWL', lat: 26.293, lng: 78.227 },
  { name: 'KLH', lat: 18.218, lng: 77.917 },
  { name: 'TIR', lat: 13.632, lng: 79.543 },
  { name: 'RJA', lat: 17.110, lng: 81.818 },
  { name: 'CDP', lat: 10.936, lng: 79.253 },
];

const Coverage: React.FC = () => {
  const [metrics, setMetrics] = useState<LaunchMetrics>({
    foundingCaptains: 31,
    citiesRegistered: 14,
    statesRepresented: 8,
    newsletterSubscribers: 57,
    communityMembers: 142
  });

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getLaunchMetrics();
        setMetrics(data);
      } catch (e) {
        console.error('Failed to load coverage metrics:', e);
      }
    }
    loadMetrics();
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
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.in/' },
            { '@type': 'ListItem', position: 2, name: 'Coverage', item: 'https://aerosky.in/coverage' }
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
      <CoverageMap />
      <StatusStrip />
      <GapSection />
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
    'Founding AeroCaptains Joining'
  ];

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
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
            <span className="text-white">Our Sovereign</span><br />
            <span style={{ color: INDIA_ORANGE }}>Coverage Vision</span>
          </h1>

          <p className="text-sm sm:text-base text-sky-200/70 max-w-xl mb-6 leading-relaxed">
            Our goal is to build India's independent, community-powered aviation data network. We are mapping critical target zones to place our first ground stations and eliminate airspace tracking blind spots.
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
              className="px-6 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:-translate-y-0.5 text-center cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
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
function CoverageMap() {
  return (
    <section id="map" className="py-8 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Target Airspace Coverage Vision</h2>
          <p className="text-xs text-sky-200/50 font-mono uppercase tracking-wider">Proposed Founding AeroCaptain Nodes & Target Regions Map</p>
        </div>

        {/* Map */}
        <div className="rounded-2xl border border-white/[0.04] overflow-hidden" style={{ height: '480px' }}>
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
            {/* Primary Targets - Orange TowerControl */}
            {ACTIVE_AIRPORTS.map((airport) => (
              <Marker key={airport.name} longitude={airport.lng} latitude={airport.lat} anchor="center">
                <div className="relative flex items-center justify-center group">
                  <div className="absolute w-6 h-6 rounded-full border border-amber-400/30 animate-signal-ring" />
                  <div className="relative w-5 h-5 rounded-full bg-amber-500 border border-white/80 shadow-[0_0_8px_rgba(245,158,11,0.6)] flex items-center justify-center">
                    <TowerControl size={10} color="#ffffff" />
                  </div>
                  <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[7px] font-mono font-bold text-amber-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{airport.name}</span>
                </div>
              </Marker>
            ))}

            {/* Secondary Targets - Light Amber TowerControl */}
            {NEEDED_AIRPORTS.map((airport) => (
              <Marker key={airport.name} longitude={airport.lng} latitude={airport.lat} anchor="center">
                <div className="relative flex items-center justify-center group">
                  <div className="relative w-4 h-4 rounded-full bg-amber-500/40 border border-amber-300/20 flex items-center justify-center">
                    <TowerControl size={8} color="#fef3c7" />
                  </div>
                  <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[7px] font-mono font-bold text-amber-400/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{airport.name}</span>
                </div>
              </Marker>
            ))}
          </Map>
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

/* ═══════════════════════════════════════════
   STATUS STRIP
═══════════════════════════════════════════ */
function StatusStrip() {
  return (
    <section className="py-6 px-4 sm:px-6 md:px-12 lg:px-24">
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
    <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Why India Needs More ADS-B Coverage</h2>
          <p className="text-sm text-sky-200/70 max-w-2xl mx-auto leading-relaxed mb-4">
            Most commercial flight tracking services rely on foreign-hosted servers. Crucially, vast segments of Indian airspace, especially low-altitude zones in tier-2/3 cities, mountainous border terrains, and coastal pathways, remain completely unmonitored. 
          </p>
          <p className="text-xs text-sky-200/50 max-w-2xl mx-auto leading-relaxed">
            By hosting low-power ground station receivers locally, Founding AeroCaptains capture raw 1090 MHz transponder broadcasts directly from the sky, feeding sovereign data back to Indian servers and closing critical regional blind spots.
          </p>
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
    <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
          Your City Needs an AeroCaptain
        </h2>
        <p className="text-sm text-sky-200/60 max-w-lg mx-auto mb-6">
          If you live near any Indian airport or flight corridor, you can help feed sovereign data. AeroSky provides setup support and receiver kits to qualified applicants.
        </p>
        <Link
          to="/aerocaptains"
          onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'coverage_cta' })}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_25px_rgba(255,153,51,0.3)] hover:-translate-y-0.5"
          style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
        >
          Become a Founding AeroCaptain <ArrowRight size={16} />
        </Link>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[
            { icon: <Cpu size={12} />, text: 'Free Hardware Kits to Selected Hosts' },
            { icon: <Zap size={12} />, text: 'DIY Raspberry Pi setups fully supported' },
            { icon: <Radio size={12} />, text: 'Founding AeroCaptain badge' },
            { icon: <MapPin size={12} />, text: 'Fuzzed location coordinates for privacy' },
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
    <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-6">
          <HelpCircle size={14} className="text-amber-400" />
          <h2 className="text-base font-bold text-white">Coverage FAQ</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={faq.id || i} className="rounded-xl border border-white/[0.04] bg-white/[0.01] overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} aria-expanded={openIdx === i} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.01] transition-colors">
                <span className="text-sm font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown size={14} className={`text-amber-400 shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && <p className="px-4 pb-4 text-sm text-sky-200/60 leading-relaxed pt-2 border-t border-white/5">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
