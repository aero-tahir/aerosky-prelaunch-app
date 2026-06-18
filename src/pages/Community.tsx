import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, Send, Instagram, Linkedin, Github,
  Users, Radio, Plane, Code, ArrowRight, Award, Globe, CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import DiscordCTA from '../components/DiscordCTA';
import { trackEvent } from '../utils/analytics';
import { registerCommunityKickoff } from '../utils/db';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

const SOCIALS = [
  { name: 'Discord', desc: 'Real-time discussions, hardware advice, and community chat.', members: 'Applications Open', color: 'from-indigo-500 to-purple-500' },
  { icon: <Send size={28} />, name: 'Telegram', desc: 'Quick updates, announcements, and airspace news.', members: 'Beta Open', color: 'from-blue-500 to-cyan-500', link: '#' },
  { icon: <Instagram size={28} />, name: 'Instagram', desc: 'Aviation photography, aircraft spotting, and milestones.', members: 'Founding Phase', color: 'from-pink-500 to-rose-500', link: '#' },
  { icon: <Linkedin size={28} />, name: 'LinkedIn', desc: 'Professional airspace network updates and project announcements.', members: 'AeroLytics', color: 'from-blue-600 to-blue-500', link: '#' },
  { icon: <Github size={28} />, name: 'GitHub', desc: 'Open source decoder tools, receiver firmware, and documentation.', members: 'Open Source', color: 'from-gray-500 to-gray-600', link: '#' },
];

const DISCORD_CHANNELS = [
  { icon: <Radio size={14} />, label: '#announcements' },
  { icon: <Users size={14} />, label: '#introductions' },
  { icon: <Award size={14} />, label: '#aerocaptains' },
  { icon: <Code size={14} />, label: '#adsb-hardware' },
  { icon: <Plane size={14} />, label: '#coverage-discussion' },
  { icon: <Globe size={14} />, label: '#aviation-news' },
  { icon: <Users size={14} />, label: '#community-help' }
];

const Community: React.FC = () => {
  const [registered, setRegistered] = useState(false);

  const handleRegisterEvent = () => {
    trackEvent('community_event_registered', {
      page: '/community',
      eventName: 'AeroSky Community Kickoff'
    });
    registerCommunityKickoff();
    setRegistered(true);
  };

  return (
    <div className="relative pt-16">
      <SEO
        title="Indian Aviation Data Community | AeroSky"
        description="Connect with aircraft spotters, pilots, developers, and SDR receiver hosts in India's sovereign aviation network."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.in/' },
            { '@type': 'ListItem', position: 2, name: 'Community', item: 'https://aerosky.in/community' }
          ]
        }}
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 lg:px-24 text-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.05] text-xs font-mono font-bold text-amber-400 tracking-wider uppercase mb-6 animate-pulse-glow">
            <Users size={14} /> Community Hub
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1] mb-6">
            <span className="text-white">India's Aviation</span><br />
            <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Data Community</span>
          </h1>
          <p className="text-base sm:text-lg text-sky-200/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect with pilots, spotters, SDR engineers, and flight-tracking enthusiasts building India's independent airspace grid.
          </p>

          {/* Topics List */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {DISCORD_CHANNELS.map((t) => (
              <div key={t.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-xs font-mono font-semibold text-amber-400 hover:border-amber-500/20 transition-all cursor-default">
                {t.icon}
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Cards */}
      <section className="section-compact">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOCIALS.map((s) => {
              if (s.name === 'Discord') {
                return (
                  <DiscordCTA
                    key={s.name}
                    location="community_page_grid"
                    buttonName="Discord Card"
                    variant="link"
                    className="glass rounded-2xl p-6 group hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <MessageCircle size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{s.name}</h3>
                    <p className="text-sm text-sky-200/50 leading-relaxed flex-1 mb-4">{s.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-400/70">{s.members}</span>
                      <ArrowRight size={14} className="text-sky-400 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </DiscordCTA>
                );
              }

              return (
                <a
                  key={s.name}
                  href={s.link}
                  className="glass rounded-2xl p-6 group hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{s.name}</h3>
                  <p className="text-sm text-sky-200/50 leading-relaxed flex-1 mb-4">{s.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400/70">{s.members}</span>
                    <ArrowRight size={14} className="text-sky-400 group-hover:text-amber-400 transition-colors" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contributor Journey (Hierarchy) */}
      <section className="section-std">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Your Journey in the AeroSky Community</h2>
          <p className="text-sky-200/60 mb-10 text-sm">Recognizing our contributors as they build coverage and feed telemetry.</p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { level: 'Level 1', role: 'AeroCadet', desc: 'Enthusiasts, spotters and supporters.' },
              { level: 'Level 2', role: 'AeroCaptain', desc: 'Active ground station hosts.' },
              { level: 'Level 3', role: 'AeroCommander', desc: 'High-impact regional hosts.' },
              { level: 'Level 4', role: 'AeroMarshal', desc: 'Elite network architects.' },
            ].map((c) => (
              <div key={c.role} className="glass rounded-xl p-5 border border-white/[0.04] relative">
                <div className="text-[9px] font-mono text-amber-400 bg-amber-500/10 rounded px-1.5 py-0.5 inline-block mb-2">{c.level}</div>
                <h3 className="text-sm font-bold text-white mb-1">{c.role}</h3>
                <p className="text-[11px] text-sky-200/50 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Event */}
      <section className="section-std bg-white/[0.01] border-y border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/[0.04] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-4 animate-pulse-glow">
            <Users size={12} /> Upcoming Community Event
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Pre-Launch Technical Briefing</h2>
          <p className="text-sm text-sky-200/70 max-w-xl mx-auto mb-6 leading-relaxed">
            Join the engineering team to discuss SDR receiver architecture, kit distribution guidelines, and live telemetry integrations.
          </p>

          <div className="glass rounded-2xl p-5 border border-white/[0.05] max-w-lg mx-auto mb-6 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-mono text-sky-200/40 uppercase tracking-widest mb-1">Date & Time</div>
              <div className="text-sm font-semibold text-white">July 25, 2026 | 19:00 IST</div>
              <div className="text-xs text-sky-200/50 mt-0.5">Hosted via Discord Voice</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-sky-200/40 uppercase tracking-widest mb-1">Kickoff Agenda</div>
              <ul className="text-xs text-sky-200/60 space-y-1.5 list-disc list-inside">
                <li>AeroSky network vision</li>
                <li>RTL-SDR receiver setup walkthrough</li>
                <li>Ground station kit distribution criteria</li>
                <li>Q&A with the engineering team</li>
              </ul>
            </div>
            <div className="col-span-1 sm:col-span-2 border-t border-white/5 pt-3 flex items-center justify-between">
              <span className="text-[10px] font-mono text-sky-200/40 uppercase">Community Milestones</span>
              <Link to="/launch" className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                View Pre-Launch Tracker <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          {registered ? (
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider animate-pulse">
              <CheckCircle2 size={14} /> Registered for Briefing!
            </div>
          ) : (
            <button
              onClick={handleRegisterEvent}
              className="px-6 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:-translate-y-0.5 cursor-pointer bg-gradient-to-br from-saffron to-gold"
            >
              Register for Briefing
            </button>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-std !pb-24">
        <div className="max-w-3xl mx-auto text-center glass rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Contribute?</h2>
          <p className="text-sky-200/60 mb-6 text-sm">
            Whether you host an antenna receiver node, write SDR integrations, or help map regional flights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/aerocaptains"
              onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'community_cta' })}
              className="px-6 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:-translate-y-0.5 flex items-center justify-center bg-gradient-to-br from-saffron to-gold"
            >
              Become an AeroCaptain
            </Link>
            <DiscordCTA
              location="community_page_footer"
              buttonName="Discord Footer Button"
              variant="secondary"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
