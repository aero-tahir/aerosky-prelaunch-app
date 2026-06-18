import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Radio, MapPin, Mail, Award, ArrowRight, Shield, Activity, Globe } from 'lucide-react';
import { getLaunchMetrics, LaunchMetrics } from '../utils/db';
import SEO from '../components/SEO';
import Schema from '../components/Schema';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

const Launch: React.FC = () => {
  const [metrics, setMetrics] = useState<LaunchMetrics>({
    foundingCaptains: 31,
    citiesRegistered: 14,
    statesRepresented: 8,
    newsletterSubscribers: 57,
    communityMembers: 142
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getLaunchMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load launch metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  // Milestones configuration
  const milestones = [
    {
      id: 'captains',
      icon: <Radio className="text-amber-400" size={18} />,
      label: 'Founding AeroCaptains',
      current: metrics.foundingCaptains,
      target: 50,
      unit: 'Captains',
      desc: 'Active ground station hosts streaming aircraft signals.'
    },
    {
      id: 'cities',
      icon: <MapPin className="text-sky-400" size={18} />,
      label: 'Cities Registered',
      current: metrics.citiesRegistered,
      target: 20,
      unit: 'Cities',
      desc: 'Unique urban clusters registering coverage interest.'
    },
    {
      id: 'states',
      icon: <Globe className="text-emerald-400" size={18} />,
      label: 'States Represented',
      current: metrics.statesRepresented,
      target: 15,
      unit: 'States',
      desc: 'Indian states with active contributor applications.'
    },
    {
      id: 'subscribers',
      icon: <Mail className="text-purple-400" size={18} />,
      label: 'Airspace Report Subscribers',
      current: metrics.newsletterSubscribers,
      target: 100,
      unit: 'Subscribers',
      desc: 'Enthusiasts receiving monthly airspace intelligence data.'
    },
    {
      id: 'community',
      icon: <Users className="text-pink-400" size={18} />,
      label: 'Community Members',
      current: metrics.communityMembers,
      target: 200,
      unit: 'Members',
      desc: 'AeroCadets joining our Discord forums and kickoff events.'
    }
  ];

  return (
    <div className="relative pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <SEO
        title="Launch Progress Tracker | AeroSky"
        description="Monitor real-time AeroSky pre-launch metrics and progress toward national airspace coverage milestones."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.in/' },
            { '@type': 'ListItem', position: 2, name: 'Launch Tracker', item: 'https://aerosky.in/launch' }
          ]
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/[0.04] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-4 animate-pulse-glow">
            <Activity size={12} className="animate-pulse" /> Launch Readiness
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            Sovereign Skies <span style={{ color: INDIA_ORANGE }}>Launch Tracker</span>
          </h1>
          <p className="text-sm sm:text-base text-sky-200/60 leading-relaxed max-w-xl mx-auto">
            Live progress logs from India's community-powered aviation network. Watch our coverage density grow in real-time as we prepare for official platform release.
          </p>
        </header>

        {/* Dynamic Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {[
            { val: metrics.foundingCaptains, label: 'AeroCaptains', color: 'text-amber-400' },
            { val: metrics.citiesRegistered, label: 'Cities', color: 'text-sky-400' },
            { val: metrics.statesRepresented, label: 'States', color: 'text-emerald-400' },
            { val: metrics.newsletterSubscribers, label: 'Newsletter', color: 'text-purple-400' },
            { val: metrics.communityMembers, label: 'Members', color: 'text-pink-400' }
          ].map((item, index) => (
            <div
              key={index}
              className="glass rounded-xl p-4 border border-white/[0.03] text-center hover:border-white/10 transition-colors"
            >
              {loading ? (
                <div className="h-8 w-12 bg-white/5 animate-pulse rounded mx-auto mb-1" />
              ) : (
                <div className={`text-xl sm:text-3xl font-mono font-bold ${item.color}`}>{item.val}</div>
              )}
              <div className="text-[9px] font-mono text-sky-200/40 uppercase tracking-widest mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Milestones Progress Section */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} style={{ color: INDIA_ORANGE }} />
            <h2 className="text-base font-bold text-white">Active Launch Milestones</h2>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {milestones.map((m) => {
              const progress = Math.min(Math.round((m.current / m.target) * 100), 100);
              return (
                <div
                  key={m.id}
                  className="glass rounded-2xl p-6 border border-white/[0.04] hover:border-amber-500/10 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                        {m.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white leading-none mb-1">{m.label}</h3>
                        <p className="text-[11px] text-sky-200/50">{m.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-white">
                        {m.current} / {m.target} {m.unit}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold ml-2">
                        {progress}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden p-[1px] border border-white/[0.02]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sovereignty footer bar */}
        <div className="glass rounded-2xl p-6 border border-white/[0.05] text-center">
          <Shield size={20} style={{ color: INDIA_ORANGE }} className="mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white mb-1.5">Launch Program Accountability</h3>
          <p className="text-xs text-sky-200/60 max-w-md mx-auto leading-relaxed mb-4">
            AeroSky metrics feed directly from our sovereign database records. We represent only active verified nodes and genuine community signups, maintaining complete data transparency.
          </p>
          <div className="flex gap-2 justify-center mb-4" aria-label="Indian Flag Colors">
            <div className="w-4 h-1 rounded-sm" style={{ background: INDIA_ORANGE }} />
            <div className="w-4 h-1 rounded-sm bg-white" />
            <div className="w-4 h-1 rounded-sm" style={{ background: INDIA_GREEN }} />
          </div>
          <Link
            to="/aerocaptains"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider transition-colors"
          >
            Become a part of the statistics <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Launch;
