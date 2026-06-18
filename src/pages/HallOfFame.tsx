import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Zap, Radio, Clock, Shield, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';

const INDIA_ORANGE = '#FF9933';

const HallOfFame: React.FC = () => {
  const placeholders = [
    {
      title: 'Reserved for First AeroCaptain',
      desc: 'This space will honor the first ground station receiver to successfully connect and feed live data to our sovereign network.',
      icon: <Radio className="text-amber-500/40" size={24} />
    },
    {
      title: 'Reserved for First Longest Uptime',
      desc: 'Dedicated to the ground station demonstrating extreme continuous availability and connection reliability over 30 days.',
      icon: <Clock className="text-emerald-400/40" size={24} />
    },
    {
      title: 'Reserved for First Coverage Champion',
      desc: 'Acknowledging the node that achieves the highest validated signal range in nautical miles across Indian airspace.',
      icon: <Award className="text-sky-400/40" size={24} />
    },
    {
      title: 'Reserved for Community Champion',
      desc: 'Honoring developers and organizers contributing open-source receiver tools or leading regional hardware groups.',
      icon: <Zap className="text-purple-400/40" size={24} />
    }
  ];

  return (
    <div className="relative pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <SEO
        title="Founding AeroCaptain Hall of Fame | AeroSky"
        description="Honor roll celebrating the pioneering ground station hosts and telemetry developers mapping Indian skies with AeroSky."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.in/' },
            { '@type': 'ListItem', position: 2, name: 'AeroCaptains', item: 'https://aerosky.in/aerocaptains' },
            { '@type': 'ListItem', position: 3, name: 'Hall of Fame', item: 'https://aerosky.in/aerocaptains/hall-of-fame' }
          ]
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/aerocaptains" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-sky-200/50 hover:text-amber-400 transition-colors uppercase tracking-wider mb-6">
          <ArrowLeft size={12} /> Back to AeroCaptains
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/[0.04] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-4 animate-pulse-glow">
            <Award size={12} /> Recognition Core
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            AeroCaptain <span style={{ color: INDIA_ORANGE }}>Hall of Fame</span>
          </h1>
          <p className="text-sm sm:text-base text-sky-200/60 leading-relaxed max-w-2xl">
            Celebrating the future founding ground station hosts and contributors who will map Indian skies. Once stations go live, nodes will earn badges for range, uptime, and community support.
          </p>
          <div className="mt-5 p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/15 text-xs text-amber-400/90 leading-relaxed font-semibold max-w-2xl flex items-center gap-3">
            <Shield size={16} className="shrink-0 animate-pulse text-amber-400" />
            <span>The Hall of Fame will recognize our Founding AeroCaptains once the first verified ground stations become operational.</span>
          </div>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {placeholders.map((p) => (
            <div key={p.title} className="glass rounded-2xl p-6 border border-dashed border-white/10 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.01] border border-white/5 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white/50">{p.title}</h2>
                </div>
                <p className="text-xs text-sky-200/40 leading-relaxed">{p.desc}</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[9px] font-mono text-amber-500/40 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/20" /> Awaiting Activation
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="glass rounded-2xl p-8 text-center border border-white/[0.05]">
          <Shield size={24} style={{ color: INDIA_ORANGE }} className="mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Want to see your station here?</h3>
          <p className="text-xs text-sky-200/60 max-w-sm mx-auto mb-5 leading-relaxed">
            Apply to become a founding AeroCaptain, set up your receiver node, and maintain active streams to qualify for the Hall of Fame listings.
          </p>
          <Link
            to="/aerocaptains#apply"
            onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'hall_of_fame_cta' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black font-bold text-xs sm:text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
          >
            Apply for Ground Station Node
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HallOfFame;
