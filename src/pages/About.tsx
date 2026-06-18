import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, Shield, Users, Radar, Zap, Target,
  ArrowRight, Radio
} from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

const About: React.FC = () => {
  return (
    <div className="relative pt-16">
      <SEO
        title="Built For Indian Skies | AeroSky"
        description="Learn why AeroSky is building sovereign airspace data infrastructure, processed locally and powered by aviation enthusiasts across India."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.in/' },
            { '@type': 'ListItem', position: 2, name: 'About', item: 'https://aerosky.in/about' }
          ]
        }}
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider uppercase mb-6 animate-pulse-glow" style={{ background: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)', color: INDIA_ORANGE }}>
            <Globe size={14} /> About AeroSky
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1] mb-6">
            <span className="text-white">Built for Indian Skies</span><br />
            <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Independent Airspace Network</span>
          </h1>
          <p className="text-base sm:text-lg text-sky-200/70 max-w-2xl mx-auto leading-relaxed">
            Building sovereign, community-powered airspace intelligence for the world's fastest-growing domestic aviation market.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12 border border-white/[0.05]">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-sky-200/70 text-sm sm:text-base leading-relaxed mb-4">
              AeroSky exists to democratize airspace intelligence in India. We believe that understanding the skies above us shouldn't rely on expensive proprietary software systems or foreign data pipelines.
            </p>
            <p className="text-sky-200/70 text-sm sm:text-base leading-relaxed mb-4">
              By building a community-powered network of ADS-B ground stations across India, we are creating comprehensive, real-time airspace visibility that is owned by the community, processed on local infrastructure, and accessible to everyone.
            </p>
            <p className="text-sky-200/70 text-sm sm:text-base leading-relaxed">
              India represents one of the largest domestic aviation growth corridors globally, yet lacks independent airspace data infrastructure. AeroSky is filling this gap, one ground station at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Why AeroSky Exists</h2>
            <p className="text-sky-200/60 text-sm">Our core principles and the gaps we fill in Indian aviation data.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Shield size={24} />, title: 'Data Sovereignty', desc: 'Indian flight statistics and logs should remain on domestic soil, processed by Indian servers.' },
              { icon: <Users size={24} />, title: 'Community Ownership', desc: 'No single corporation should control airspace visibility. The community builds, hosts, and feeds the network.' },
              { icon: <Globe size={24} />, title: 'Universal Access', desc: 'Democratizing airspace data for aviation enthusiasts, academic researchers, and local developers alike.' },
              { icon: <Radar size={24} />, title: 'Low-Altitude Coverage', desc: 'Shoring up coverage holes in remote or mountainous terrains that lack standard ground receivers today.' },
              { icon: <Zap size={24} />, title: 'Real-Time Telemetry', desc: 'Streaming sub-second transponder updates, not delayed data feeds, for accurate regional awareness.' },
              { icon: <Target size={24} />, title: 'India-First Innovation', desc: 'Optimized for Indian airports, airlines, flight safety regulations, and local timezone metrics.' },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-6 hover:border-amber-500/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-sky-200/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12 border border-white/[0.05]">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Community-Powered Philosophy</h2>
            <div className="space-y-4 text-sky-200/70 text-sm sm:text-base leading-relaxed">
              <p>
                AeroSky is built on a simple belief: the best aviation networks are community-driven. Every AeroCaptain hosting a receiver node, every developer contributing to decoders, and every spotter sharing telemetry helps strengthen the network for everyone.
              </p>
              <p>
                We build <em>with</em> and <em>for</em> the community. Ground station hosts receive permanent profile recognition, early beta features, and technical dashboard support. The community is our foundation, not just a data source.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Actions */}
      <section className="py-16 px-4 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Join the Mission</h2>
          <p className="text-sky-200/60 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Help map Indian skies. Host a receiver node as an AeroCaptain or subscribe to our monthly airspace analytics reports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/aerocaptains"
              onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'about_cta' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
            >
              <Radio size={16} /> Become an AeroCaptain
            </Link>
            <a
              href="/#newsletter"
              onClick={() => trackEvent('newsletter_signup_started', { page: '/about', trigger: 'about_founding_cta' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-bold text-sm transition-all hover:-translate-y-0.5"
            >
              Join Founding Members <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
