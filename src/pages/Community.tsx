import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, Send, Instagram, Linkedin, Github,
  Users, Radio, Plane, Code, ArrowRight
} from 'lucide-react';

const SOCIALS = [
  { icon: <MessageCircle size={28} />, name: 'Discord', desc: 'Real-time discussions, flight alerts, and community chat.', members: '500+', color: 'from-indigo-500 to-purple-500', link: '#' },
  { icon: <Send size={28} />, name: 'Telegram', desc: 'Quick updates, announcements, and aviation news.', members: '1,200+', color: 'from-blue-500 to-cyan-500', link: '#' },
  { icon: <Instagram size={28} />, name: 'Instagram', desc: 'Aviation photography, spotting content, and behind-the-scenes.', members: '3,000+', color: 'from-pink-500 to-rose-500', link: '#' },
  { icon: <Linkedin size={28} />, name: 'LinkedIn', desc: 'Professional aviation network and industry insights.', members: '800+', color: 'from-blue-600 to-blue-500', link: '#' },
  { icon: <Github size={28} />, name: 'GitHub', desc: 'Open source tools, receiver software, and contributions.', members: '200+', color: 'from-gray-500 to-gray-600', link: '#' },
];

const PERSONAS = [
  { icon: <Plane size={20} />, label: 'Aviation Enthusiasts' },
  { icon: <Radio size={20} />, label: 'SDR Hobbyists' },
  { icon: <Users size={20} />, label: 'Plane Spotters' },
  { icon: <Code size={20} />, label: 'Developers' },
];

const Community: React.FC = () => {
  return (
    <div className="relative pt-16">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.05] text-xs font-mono font-bold text-amber-400 tracking-wider uppercase mb-6">
            <Users size={14} /> Community
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.9] mb-6">
            <span className="text-white">India's Aviation</span><br />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Community Hub</span>
          </h1>
          <p className="text-lg text-sky-200/70 max-w-2xl mx-auto mb-8">
            For aviation enthusiasts, spotters, SDR hobbyists, pilots, and developers.
            Connect, contribute, and shape India's airspace intelligence together.
          </p>

          {/* Personas */}
          <div className="flex flex-wrap justify-center gap-3">
            {PERSONAS.map((p) => (
              <div key={p.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-sky-200">
                <span className="text-amber-400">{p.icon}</span>
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Cards */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOCIALS.map((s) => (
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
                  <span className="text-xs font-mono text-amber-400/70">{s.members} members</span>
                  <ArrowRight size={14} className="text-sky-400 group-hover:text-amber-400 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contributor Highlights */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Contributor Highlights</h2>
          <p className="text-sky-200/60 mb-10">Recognizing the people who make AeroSky possible.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { role: 'Top Feeder', location: 'Mumbai', stat: '2.4M messages/day' },
              { role: 'Community Lead', location: 'Bengaluru', stat: 'Discord moderator' },
              { role: 'Open Source', location: 'Delhi', stat: '12 PRs merged' },
            ].map((c) => (
              <div key={c.role} className="glass rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                  <Users size={20} className="text-amber-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">{c.role}</h3>
                <p className="text-xs text-sky-200/50 mb-2">{c.location}</p>
                <span className="text-[11px] font-mono text-amber-400/70">{c.stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center glass rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Contribute?</h2>
          <p className="text-sky-200/60 mb-6">
            Whether you host a receiver, write code, or share knowledge. There's a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/feeders"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
            >
              Apply for Hosting Ground Station
            </Link>
            <a
              href="#"
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-bold text-sm transition-all"
            >
              Join Discord
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
