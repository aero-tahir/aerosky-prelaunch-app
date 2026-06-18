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
      title: 'Reserved for Longest Range',
      desc: 'This space will honor the ground station node that achieves the highest validated signal reception range in nautical miles.',
      icon: <Award className="text-sky-400/40" size={24} />
    },
    {
      title: 'Reserved for Highest Uptime',
      desc: 'Dedicated to the ground station demonstrating continuous telemetry streaming and node availability over a 30-day window.',
      icon: <Clock className="text-emerald-400/40" size={24} />
    },
    {
      title: 'Reserved for Most Aircraft Tracked',
      desc: 'Acknowledging the node that processes the highest cumulative count of unique aircraft transponder signals.',
      icon: <Radio className="text-amber-500/40" size={24} />
    },
    {
      title: 'Reserved for Community Contributor',
      desc: 'Honoring developers and organizers who write open-source receiver configurations, scripts, or support community hardware setups.',
      icon: <Zap className="text-purple-400/40" size={24} />
    },
    {
      title: 'Reserved for Coverage Expansion',
      desc: 'Dedicated to hosts who establish stations in key underserved regions, helping to close critical low-altitude blind spots.',
      icon: <Shield className="text-rose-400/40" size={24} />
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
            AeroCaptain <span className="text-saffron">Hall of Fame</span>
          </h1>
          <p className="text-sm sm:text-base text-sky-200/60 leading-relaxed max-w-2xl">
            Honoring the contributors establishing airspace coverage. Once ground stations go live, active nodes will be listed here with verified metrics for range, throughput, and system uptime.
          </p>
          <div className="mt-5 p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/15 text-xs text-amber-400/90 leading-relaxed font-semibold max-w-2xl flex items-center gap-3">
            <Shield size={16} className="shrink-0 animate-pulse text-amber-400" />
            <span>The Hall of Fame registry will activate immediately upon verification of the first live ground stations.</span>
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
          <Shield size={24} className="text-saffron mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Want to see your station here?</h3>
          <p className="text-xs text-sky-200/60 max-w-sm mx-auto mb-5 leading-relaxed">
            Apply to become a founding AeroCaptain, set up your receiver node, and maintain active streams to qualify for the Hall of Fame listings.
          </p>
          <Link
            to="/aerocaptains#apply"
            onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'hall_of_fame_cta' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black font-bold text-xs sm:text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] cursor-pointer bg-gradient-to-br from-saffron to-gold"
          >
            Apply for Ground Station Node
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HallOfFame;
