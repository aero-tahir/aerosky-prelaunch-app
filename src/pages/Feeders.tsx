import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio, Cpu, Antenna, Wifi, Shield, BarChart3, Zap,
  Radar, ArrowRight, CheckCircle2, Plane, Flag, Users, Target, Globe,
  Eye, HelpCircle, ChevronDown, Award, Signal
} from 'lucide-react';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

const Feeders: React.FC = () => (
  <div className="relative pt-16">
    <FeederHero />
    <CoreInfo />
    <BenefitsAndDashboard />
    <Founding500AndCoverage />
    <FAQAndCTA />
  </div>
);

export default Feeders;

/* ═══════════════════════════════════════════
   HERO (compact)
═══════════════════════════════════════════ */
function FeederHero() {
  return (
    <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden px-4 sm:px-6">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `radial-gradient(circle, rgba(255,153,51,0.4) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider uppercase mb-5" style={{ background: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)', color: INDIA_ORANGE }}>
          <Antenna size={14} /> Founding Feeder Program
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
          <span className="text-white">Become an AeroSky Feeder.</span><br />
          <span style={{ color: INDIA_ORANGE }}>Help Build India's Airspace Network.</span>
        </h1>
        <p className="text-sm sm:text-base text-sky-200/60 max-w-2xl mx-auto mb-3 leading-relaxed">
          Host a small ADS-B receiver at your home, office, or rooftop and contribute real-time aircraft telemetry to a community-powered aviation intelligence network designed for India.
        </p>
        <p className="text-xs text-sky-200/50 max-w-lg mx-auto mb-6">
          Early contributors receive Founding Feeder status, leaderboard access, premium features, and future hardware rewards.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#apply" className="px-7 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_30px_rgba(255,153,51,0.3)] hover:-translate-y-0.5" style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}>
            Apply for Hosting Ground Station
          </a>
          <a href="#hardware" className="px-7 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all hover:-translate-y-0.5">
            Explore Hardware
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CORE INFO: Vision + What is a Feeder + How It Works + Hardware
   (Combined into one dense section)
═══════════════════════════════════════════ */
function CoreInfo() {
  return (
    <section className="py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Vision Cards */}
        <div>
          <SectionLabel icon={<Flag size={12} style={{ color: INDIA_ORANGE }} />} text="Our Vision" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">A Community-Powered <span style={{ color: INDIA_GREEN }}>Airspace Intelligence Network</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Globe size={22} />, title: 'Nationwide Coverage', desc: 'Dense ADS-B coverage across metros, tier-2 cities, coastal regions, and underserved airspace.' },
              { icon: <Users size={22} />, title: 'Community Powered', desc: 'Powered by aviation enthusiasts, engineers, students, spotters, and contributors across India.' },
              { icon: <Shield size={22} />, title: 'Sovereign Infrastructure', desc: 'Indian-hosted, community-driven telemetry and transparent aviation intelligence.' },
            ].map((c) => (
              <div key={c.title} className="glass rounded-xl p-5 hover:border-amber-500/15 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">{c.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1">{c.title}</h3>
                <p className="text-xs text-sky-200/60 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What is a Feeder + How It Works (side by side on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* What is a Feeder */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">What is an AeroSky Feeder?</h3>
            <p className="text-sm text-sky-200/60 leading-relaxed mb-3">
              A community-operated ADS-B receiving station. Aircraft broadcast telemetry (position, altitude, speed, heading, identity) and your feeder captures and streams it to AeroSky.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {['Position', 'Altitude', 'Speed', 'Heading', 'Identity'].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">{t}</span>
              ))}
            </div>
            <p className="text-xs text-sky-200/50 italic">No RF experience required. Deploy in under 30 minutes with off-the-shelf hardware.</p>
          </div>

          {/* How It Works */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">How It Works</h3>
            <div className="space-y-3">
              {[
                { n: '01', title: 'Aircraft broadcasts on 1090 MHz', icon: <Plane size={14} /> },
                { n: '02', title: 'Your antenna receives signals', icon: <Antenna size={14} /> },
                { n: '03', title: 'Pi + SDR decodes telemetry', icon: <Cpu size={14} /> },
                { n: '04', title: 'Data powers AeroSky network', icon: <Wifi size={14} /> },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-amber-400/50 font-bold w-5">{s.n}</span>
                  <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">{s.icon}</div>
                  <span className="text-sm text-sky-200/60">{s.title}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-sky-200/50 mt-3">More feeders = more accurate and reliable network.</p>
          </div>
        </div>

        {/* Hardware (compact) */}
        <div id="hardware">
          <SectionLabel icon={<Cpu size={12} className="text-amber-400" />} text="Hardware" />
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-5">Simple Hardware. Powerful Contribution.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Cpu size={24} />, name: 'Raspberry Pi', desc: 'Runs edge software' },
              { icon: <Radio size={24} />, name: 'RTL-SDR', desc: 'Captures 1090 MHz' },
              { icon: <Antenna size={24} />, name: 'Antenna', desc: 'Improves range' },
              { icon: <Wifi size={24} />, name: 'Internet', desc: 'Streams telemetry' },
            ].map((hw) => (
              <div key={hw.name} className="glass rounded-xl p-4 text-center hover:border-amber-500/15 transition-all">
                <div className="w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mx-auto mb-2">{hw.icon}</div>
                <h4 className="text-xs font-bold text-white">{hw.name}</h4>
                <p className="text-[10px] text-sky-200/50">{hw.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['Outdoor mast', 'LNA + filter', 'GPS module', 'Weatherproof case'].map((u) => (
              <span key={u} className="text-[10px] px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.06] text-sky-200/50">+ {u}</span>
            ))}
          </div>
          <p className="text-xs text-sky-200/60 text-center mt-4">AeroSky provides Feeder Kits to qualified feeders. Kits are also available for self-setup if you're willing to install independently.</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   BENEFITS + DASHBOARD PREVIEW (combined)
═══════════════════════════════════════════ */
function BenefitsAndDashboard() {
  const benefits = [
    { icon: <Award size={18} />, title: 'Founding Badge', desc: 'Permanent recognition on your profile' },
    { icon: <BarChart3 size={18} />, title: 'Advanced Dashboard', desc: 'Coverage, signal, uptime, MLAT stats' },
    { icon: <Zap size={18} />, title: 'Early Access', desc: 'Beta features, APIs, analytics' },
    { icon: <Target size={18} />, title: 'Leaderboards', desc: 'Regional and national rankings' },
    { icon: <Radar size={18} />, title: 'Coverage Analytics', desc: 'Visualize your real-world impact' },
    { icon: <Shield size={18} />, title: 'Rewards Program', desc: 'Earn rewards for uptime, community engagement, and get premium event invites' },
  ];

  const dashFeatures = ['Station health monitoring', 'Coverage heatmaps', 'Aircraft tracking stats', 'Signal quality metrics', 'Uptime history', 'MLAT participation', 'AI optimization tips'];

  return (
    <section className="py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Benefits */}
        <div>
          <SectionLabel icon={<Zap size={12} style={{ color: INDIA_ORANGE }} />} text="Feeder Benefits" />
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-5">Why Join the Network?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="glass rounded-xl p-4 hover:border-amber-500/15 transition-all">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">{b.icon}</div>
                <h4 className="text-xs font-bold text-white mb-0.5">{b.title}</h4>
                <p className="text-[10px] text-sky-200/60 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview (compact) */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} style={{ color: INDIA_ORANGE }} />
            <h3 className="text-base font-bold text-white">Contributor Dashboard Preview</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {dashFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2 p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 size={10} className="text-amber-400 shrink-0" />
                <span className="text-[11px] text-sky-200/60">{f}</span>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-amber-500/[0.05] border border-amber-500/20">
            <p className="text-xs text-amber-400/80 italic">"Your feeder detected reduced signal quality. Antenna repositioning may improve west-sector coverage."</p>
            <span className="text-[9px] text-sky-200/40 mt-1 block">Example AI Insight</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOUNDING 500 + COVERAGE IMPACT (combined)
═══════════════════════════════════════════ */
function Founding500AndCoverage() {
  const perks = ['Permanent Founder badge', 'Lifetime recognition', 'Early platform access', 'Priority feature testing', 'Leaderboard visibility', 'Future reward eligibility'];

  return (
    <section className="py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Founding 500 */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} style={{ color: INDIA_ORANGE }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: INDIA_ORANGE }}>Founding 500 Program</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Be One of the First 500 Feeders</h3>
          <p className="text-sm text-sky-200/60 mb-4">The first verified feeders join the Founding 500 and help shape India's airspace intelligence.</p>
          <div className="flex flex-wrap gap-2">
            {perks.map((p) => (
              <span key={p} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/[0.06] text-[11px] text-sky-200/60">
                <CheckCircle2 size={10} className="text-amber-400" />{p}
              </span>
            ))}
          </div>
        </div>

        {/* Coverage Impact */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Radar size={16} style={{ color: INDIA_GREEN }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: INDIA_GREEN }}>Coverage Impact</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Every Feeder Expands Visibility</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
            {['Tracking coverage', 'MLAT accuracy', 'Low-altitude visibility', 'Airport awareness', 'Redundancy', 'Airspace transparency'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-sky-200/60"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" />{item}</div>
            ))}
          </div>
          <p className="text-xs text-sky-200/50 mt-4">Priority: airports, coastal corridors, tier-2/3 cities, mountain regions, high-density corridors.</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FAQ + FINAL CTA (combined)
═══════════════════════════════════════════ */
function FAQAndCTA() {
  const faqs = [
    { q: 'Do I need aviation experience?', a: 'No. Anyone comfortable with basic hardware setup can become a feeder.' },
    { q: 'Is feeding legal?', a: 'ADS-B broadcasts are publicly transmitted aircraft signals intended for surveillance and situational awareness.' },
    { q: 'How much bandwidth does it use?', a: 'Typical feeder usage is low and works on standard broadband connections.' },
    { q: 'Can I run a feeder indoors?', a: 'Yes, but outdoor antenna placement significantly improves coverage.' },
    { q: 'Will AeroSky provide hardware?', a: 'Yes. AeroSky will provide an AeroSky Feeder Kit to qualified feeders based on internal assessment. Kits can also be shared with feeders who are willing to self-install and set up the station.' },
    { q: 'Is my location public?', a: 'No. Feeder locations are privacy protected and fuzzed for security.' },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="apply" className="py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* FAQ */}
        <div>
          <SectionLabel icon={<HelpCircle size={12} className="text-amber-400" />} text="FAQ" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="text-xs font-bold text-white pr-3">{faq.q}</span>
                  <ChevronDown size={14} className={`text-amber-400 shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                </button>
                {openIdx === i && <p className="px-4 pb-4 text-xs text-sky-200/60 leading-relaxed">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="glass rounded-2xl p-8 text-center">
          <Signal size={28} className="text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Help Build the Future of Indian Airspace Intelligence</h2>
          <p className="text-sm text-sky-200/60 mb-5 max-w-lg mx-auto">
            Join the AeroSky Feeder Network and contribute to a transparent, community-powered platform designed for India.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <a href="#feeder-form" className="px-7 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)]" style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}>
              Apply for Hosting Ground Station
            </a>
            <Link to="/community" className="px-7 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all">
              Join the Community
            </Link>
          </div>
          <p className="text-[10px] text-sky-200/40 italic">Every signal matters. Every feeder strengthens the network.</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SHARED COMPONENT
═══════════════════════════════════════════ */
function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex justify-center mb-3">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase">
        {icon} {text}
      </div>
    </div>
  );
}
