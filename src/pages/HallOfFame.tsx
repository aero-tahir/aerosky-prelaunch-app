import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Zap, Radio, Clock, Shield, ArrowLeft, Trophy } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';

const HallOfFame: React.FC = () => {
  const placeholders = [
    {
      title: 'Longest Signal Range',
      criteria: 'Validated signal reception range in nautical miles (NM).',
      desc: 'Awarded to the ground station node that achieves the highest validated signal reception range. Requires high-gain directional antennas, low-loss RF cables, and clear elevation horizons.',
      icon: <Award className="text-sky-400" size={24} />
    },
    {
      title: 'Highest Stream Uptime',
      criteria: 'Telemetry stream availability over a continuous 30-day window.',
      desc: 'Honoring nodes demonstrating near-100% streaming reliability and network packet delivery. Requires stable power supplies, UPS backups, and robust ethernet backhaul.',
      icon: <Clock className="text-emerald-400" size={24} />
    },
    {
      title: 'Telemetry Volume Pioneer',
      criteria: 'Cumulative count of unique aircraft transponder signals processed.',
      desc: 'Acknowledging the station processing the highest count of unique aircraft frames and MLAT updates, particularly in high-density airspace corridors.',
      icon: <Radio className="text-amber-400" size={24} />
    },
    {
      title: 'Coverage Expansion Pioneer',
      criteria: 'Close critical low-altitude blind spots in tier-2/3 or remote areas.',
      desc: 'Dedicated to hosts establishing ground stations in underserved, mountainous, or coastal regions, significantly expanding the collective radio horizon.',
      icon: <Shield className="text-rose-400" size={24} />
    },
    {
      title: 'Community Code Contributor',
      criteria: 'Open-source configurations, decoders, or integration scripts.',
      desc: 'Honoring developers who build open-source receiver setups, custom decoder scripts, or dashboard integrations shared with the wider AeroSky community.',
      icon: <Zap className="text-purple-400" size={24} />
    }
  ];

  return (
    <div className="relative pt-20 pb-10 px-4 sm:px-6 md:px-12 lg:px-24">
      <SEO
        title="Founding AeroCaptain Hall of Fame | AeroSky"
        description="Honor roll celebrating the pioneering ground station hosts and telemetry developers mapping Indian skies with AeroSky."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.ai/' },
            { '@type': 'ListItem', position: 2, name: 'AeroCaptains', item: 'https://aerosky.ai/aerocaptains' },
            { '@type': 'ListItem', position: 3, name: 'Hall of Fame', item: 'https://aerosky.ai/aerocaptains/hall-of-fame' }
          ]
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/aerocaptains" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-sky-200/50 hover:text-amber-400 transition-colors uppercase tracking-wider mb-6">
          <ArrowLeft size={12} /> Back to AeroCaptains
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/[0.04] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-4 animate-pulse-glow">
            <Trophy size={12} /> Founding Contributors
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            AeroCaptain <span className="text-saffron">Hall of Fame</span>
          </h1>
          <p className="text-sm sm:text-base text-sky-200/70 leading-relaxed max-w-2xl">
            Honoring the contributors establishing India's airspace intelligence network. Once the pre-launch ground stations go live, active nodes will be registered here based on verified telemetry metrics.
          </p>
          <div className="mt-5 p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/15 text-xs text-amber-400 leading-relaxed font-semibold max-w-2xl flex items-center gap-3">
            <Shield size={16} className="shrink-0 animate-pulse text-amber-400" />
            <span>Registry Registry Registry: Activating immediately upon verification of the first live ground stations.</span>
          </div>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {placeholders.map((p) => (
            <div key={p.title} className="glass rounded-2xl p-6 border border-white/[0.05] hover:border-amber-500/20 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white leading-tight">{p.title}</h2>
                </div>
                <div className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider mb-2">
                  Metric: {p.criteria}
                </div>
                <p className="text-xs text-sky-200/60 leading-relaxed">{p.desc}</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[9px] font-mono text-amber-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Registry Launch Phase
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="glass rounded-2xl p-6 text-center border border-white/[0.05]">
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
