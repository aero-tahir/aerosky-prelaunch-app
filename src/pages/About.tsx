import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, Shield, Users, Radar, Zap, Target,
  ArrowRight, Radio
} from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="relative pt-16">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.05] text-xs font-mono font-bold text-amber-400 tracking-wider uppercase mb-6">
            <Globe size={14} /> About AeroSky
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.9] mb-6">
            <span className="text-white">India's Airspace</span><br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Intelligence Network</span>
          </h1>
          <p className="text-lg text-sky-200/70 max-w-2xl mx-auto">
            Building sovereign, community-powered aviation intelligence for the world's fastest-growing aviation market.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-sky-200/70 text-base leading-relaxed mb-4">
              AeroSky exists to democratize airspace intelligence in India. We believe that understanding the skies above us
              shouldn't require expensive proprietary systems or foreign data dependencies.
            </p>
            <p className="text-sky-200/70 text-base leading-relaxed mb-4">
              By building a community-powered network of ADS-B receivers across India, we're creating comprehensive,
              real-time airspace visibility that's owned by the community, processed on Indian infrastructure,
              and accessible to everyone. From aviation enthusiasts to enterprise stakeholders.
            </p>
            <p className="text-sky-200/70 text-base leading-relaxed">
              India is the world's third-largest domestic aviation market, yet lacks indigenous airspace intelligence infrastructure.
              AeroSky is changing that, one ground station at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Why AeroSky */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Why AeroSky Exists</h2>
            <p className="text-sky-200/60">The gaps we're filling in Indian aviation intelligence.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Shield size={24} />, title: 'Data Sovereignty', desc: 'Indian aviation data should stay on Indian soil, processed by Indian infrastructure.' },
              { icon: <Users size={24} />, title: 'Community Ownership', desc: 'No single corporation should control airspace visibility. The community builds and owns the network.' },
              { icon: <Globe size={24} />, title: 'Universal Access', desc: 'Aviation intelligence for everyone: enthusiasts, researchers, developers, and enterprises alike.' },
              { icon: <Radar size={24} />, title: 'Coverage Gaps', desc: 'Large parts of Indian airspace lack ground-level ADS-B coverage. We\'re fixing that.' },
              { icon: <Zap size={24} />, title: 'Real-Time Intelligence', desc: 'Sub-second updates, not delayed feeds. True real-time awareness of Indian skies.' },
              { icon: <Target size={24} />, title: 'India-First Design', desc: 'Built for Indian airports, Indian airlines, Indian regulations, and Indian users.' },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-6 hover:border-amber-500/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-sky-200/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Community-Powered Philosophy</h2>
            <div className="space-y-4 text-sky-200/70 text-base leading-relaxed">
              <p>
                AeroSky is built on a simple belief: the best intelligence networks are community-powered.
                Every feeder who hosts a receiver, every developer who contributes code, every enthusiast who shares knowledge
                they all strengthen the network for everyone.
              </p>
              <p>
                We don't just collect data from the community we build <em>for</em> the community.
                Feeders get recognition, early access, and premium features. Contributors shape the platform's direction.
                The community isn't just a data source. It's the foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Future Vision</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { value: '500+', label: 'Ground Stations' },
              { value: '98%', label: 'Airspace Coverage' },
              { value: '50K+', label: 'Community Members' },
            ].map((v) => (
              <div key={v.label} className="glass rounded-xl p-6">
                <div className="text-3xl font-bold font-mono text-amber-400 mb-1">{v.value}</div>
                <div className="text-xs text-sky-200/50 uppercase tracking-wider">{v.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sky-200/60 text-base max-w-2xl mx-auto mb-8">
            We're building toward comprehensive Indian airspace coverage. From metro cities to tier-2 towns,
            from commercial aviation to general aviation. A truly national intelligence network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/feeders"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
            >
              <Radio size={16} /> Join as Feeder
            </Link>
            <a
              href="/#waitlist"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-bold text-sm transition-all"
            >
              Signup Waitlist Waitlist <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
