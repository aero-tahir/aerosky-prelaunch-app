import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio, Cpu, Antenna, Wifi, Shield, BarChart3, Zap,
  Radar, ArrowRight, CheckCircle2, Plane, Flag, Users, Target, Globe,
  HelpCircle, ChevronDown, Award, Signal, MapPin, Eye
} from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';
import { submitAeroCaptainApplication, getAeroCaptainsDirectory } from '../utils/db';
import { sanitizeInput, validateEmail, isBotSubmission, isRateLimited } from '../utils/security';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

const AeroCaptains: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [assignedNumber, setAssignedNumber] = useState('');
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [startedTracking, setStartedTracking] = useState(false);
  
  const [directory, setDirectory] = useState<{ num: string; state: string; status: string }[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    coordinates: '',
    placement: '',
    internet: '',
    hardware: [] as string[],
    motivation: ''
  });

  useEffect(() => {
    async function loadDirectory() {
      try {
        const data = await getAeroCaptainsDirectory();
        // Take the latest 10 reserved positions for preview
        setDirectory(data.slice(-10));
      } catch (err) {
        console.error('Failed to load captains directory:', err);
      }
    }
    loadDirectory();
  }, [submitted]);

  const handleInputFocus = () => {
    if (!startedTracking) {
      setStartedTracking(true);
      trackEvent('aerocaptain_application_started', { page: '/aerocaptains' });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({ ...prev, hardware: [...prev.hardware, value] }));
    } else {
      setFormData(prev => ({ ...prev, hardware: prev.hardware.filter(h => h !== value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Spam Protection: Honeypot check
    if (isBotSubmission(honeypot)) {
      console.log('[Security] Honeypot field filled. Silently ignoring.');
      setAssignedNumber('AC999');
      setSubmitted(true);
      return;
    }

    // Input sanitization
    const cleanName = sanitizeInput(formData.name);
    const cleanEmail = sanitizeInput(formData.email);
    const cleanCityRaw = sanitizeInput(formData.city);
    const cleanPlacement = sanitizeInput(formData.placement);
    const cleanInternet = sanitizeInput(formData.internet);
    const cleanMotivation = sanitizeInput(formData.motivation);

    if (!cleanName || !cleanEmail || !cleanCityRaw || !cleanPlacement || !cleanInternet) {
      setError('Please fill in all required fields marked with *');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Client-side rate-limiting check
    if (isRateLimited('aerocaptain_apply', 15)) {
      setError('Too many attempts. Please wait 15 seconds before submitting again.');
      return;
    }

    // Parse City and State (input format: "Pune, Maharashtra")
    const parts = cleanCityRaw.split(',').map(s => s.trim());
    const city = parts[0] || 'Pune';
    const state = parts[1] || 'Maharashtra';
    const country = parts[2] || 'India';

    const referralCode = localStorage.getItem('aerosky_ref') || '';

    try {
      const code = await submitAeroCaptainApplication({
        name: cleanName,
        email: cleanEmail,
        city,
        state,
        country,
        internet_type: cleanInternet,
        rooftop_available: cleanPlacement === 'rooftop',
        existing_hardware: formData.hardware,
        referral_code: referralCode
      });

      setAssignedNumber(code);
      trackEvent('aerocaptain_application_submitted', {
        foundingNumber: code,
        city,
        state,
        referralCode
      });
      setSubmitted(true);
    } catch (err) {
      setError('An error occurred during submission. Please try again.');
    }
  };

  return (
    <div className="relative pt-16">
      <SEO
        title="Become an AeroCaptain | AeroSky"
        description="Apply to host an independent ground station receiver and join the founding AeroCaptain program."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.in/' },
            { '@type': 'ListItem', position: 2, name: 'Become an AeroCaptain', item: 'https://aerosky.in/aerocaptains' }
          ]
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden px-4 sm:px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `radial-gradient(circle, rgba(255,153,51,0.4) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider uppercase mb-5 animate-pulse-glow" style={{ background: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)', color: INDIA_ORANGE }}>
            <Antenna size={14} /> Founding AeroCaptain Program Open
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
            <span className="text-white">Become an AeroSky AeroCaptain.</span><br />
            <span style={{ color: INDIA_ORANGE }}>Help Build India's Airspace Network.</span>
          </h1>
          <p className="text-sm sm:text-base text-sky-200/60 max-w-2xl mx-auto mb-3 leading-relaxed">
            Become one of the first AeroCaptains helping build India's independent aviation intelligence network. Host a small, low-power receiver node and feed real-time airspace telemetry.
          </p>
          <p className="text-xs text-sky-200/50 max-w-lg mx-auto mb-6">
            Early contributors receive Founding AeroCaptain status, leaderboard recognition, premium platform features, and future hardware rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="#apply"
              onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'hero_cta', action: 'scroll_to_apply' })}
              className="px-7 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_30px_rgba(255,153,51,0.3)] hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
            >
              Apply to Become an AeroCaptain
            </a>
            <a
              href="#hardware"
              className="px-7 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all hover:-translate-y-0.5"
            >
              Explore Hardware
            </a>
            <Link
              to="/aerocaptains/hall-of-fame"
              onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'hero_cta', action: 'go_to_hall_of_fame' })}
              className="px-7 py-3 rounded-xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <Award size={14} /> Hall of Fame
            </Link>
          </div>
        </div>
      </section>

      {/* Core Info */}
      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24 space-y-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Vision */}
          <div>
            <div className="flex justify-center mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase">
                <Flag size={12} style={{ color: INDIA_ORANGE }} /> Our Vision
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">A Community-Powered <span style={{ color: INDIA_GREEN }}>Airspace Intelligence Network</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Globe size={22} />, title: 'Coverage Vision', desc: 'Expanding ADS-B coverage across metros, tier-2 cities, coastal regions, and underserved airspace to close low-altitude tracking gaps.' },
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

          {/* What is an AeroCaptain + How It Works */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* What is an AeroCaptain */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">What is an AeroSky AeroCaptain?</h3>
              <p className="text-sm text-sky-200/60 leading-relaxed mb-3">
                AeroCaptains are the foundation of our network. By hosting a small, low-power ADS-B receiver, they pick up high-frequency signals broadcasted by aircraft transponders (speed, altitude, squawk, position) and securely stream this telemetry back to the AeroSky central server.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {['Telemetry Feed', 'Rooftop Antenna', 'Low Power', '1090 MHz', 'Sovereign Data'].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">{t}</span>
                ))}
              </div>
              <p className="text-xs text-sky-200/50 italic">No radio frequency experience required. Setup and deployment can be completed in under 30 minutes.</p>
            </div>

            {/* How It Works */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">How It Works</h3>
              <div className="space-y-3">
                {[
                  { n: '01', title: 'Aircraft broadcasts telemetry on 1090 MHz', icon: <Plane size={14} /> },
                  { n: '02', title: 'Your outdoor antenna receives the signal', icon: <Antenna size={14} /> },
                  { n: '03', title: 'Raspberry Pi & RTL-SDR decode the data stream', icon: <Cpu size={14} /> },
                  { n: '04', title: 'Telemetry feeds directly into India\'s airspace network', icon: <Wifi size={14} /> },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-amber-400/50 font-bold w-5">{s.n}</span>
                    <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">{s.icon}</div>
                    <span className="text-sm text-sky-200/60">{s.title}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-sky-200/50 mt-3">Every new receiver increases redundancy and lowers low-altitude blind spots.</p>
            </div>
          </div>

          {/* Hardware */}
          <div id="hardware" className="pt-4">
            <div className="flex justify-center mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase">
                <Cpu size={12} className="text-amber-400" /> Hardware Configuration
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-5">Simple Hardware. National Coverage.</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Cpu size={24} />, name: 'Raspberry Pi / Orange Pi', desc: 'Computes and processes telemetry logs' },
                { icon: <Radio size={24} />, name: 'RTL-SDR USB Dongle', desc: 'Tuned specifically to 1090 MHz' },
                { icon: <Antenna size={24} />, name: 'Omni-Directional Antenna', desc: 'Captures signals up to 250 miles' },
                { icon: <Wifi size={24} />, name: 'Ethernet / WiFi Connection', desc: 'Streams data to Indian servers' },
              ].map((hw) => (
                <div key={hw.name} className="glass rounded-xl p-4 text-center hover:border-amber-500/15 transition-all">
                  <div className="w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mx-auto mb-2">{hw.icon}</div>
                  <h4 className="text-xs font-bold text-white">{hw.name}</h4>
                  <p className="text-[10px] text-sky-200/50 mt-1">{hw.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['LNA + SAW filters', 'SMA coax cables', 'Waterproof enclosure', 'Rooftop mounting mast'].map((u) => (
                <span key={u} className="text-[10px] px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.06] text-sky-200/50">+ {u}</span>
              ))}
            </div>
            <p className="text-xs text-sky-200/60 text-center mt-4 max-w-xl mx-auto">
              AeroSky provides custom receiver kits to qualified hosting applicants in key coverage regions. We also fully support DIY users using their own pre-existing RTL-SDR and Raspberry Pi configurations.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <div className="flex justify-center mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase">
                <Zap size={12} style={{ color: INDIA_ORANGE }} /> Program Rewards
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-5">AeroCaptain Benefits</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: <Award size={18} />, title: 'Founding AeroCaptain Badge', desc: 'Permanent digital token displayed on your profile and the AeroCaptain Hall of Fame' },
                { icon: <BarChart3 size={18} />, title: 'Advanced Dashboard', desc: 'Real-time telemetry, range polar plots, uptime charts, and MLAT contribution stats' },
                { icon: <Zap size={18} />, title: 'Early Platform Access', desc: 'Complimentary premium access to live flight visibility features and analytics tools' },
                { icon: <Target size={18} />, title: 'Coverage Leaderboards', desc: 'Compete on signal range, message count, and station uptime metrics' },
                { icon: <Radar size={18} />, title: 'Direct Product Feedback', desc: 'Direct channel to engineering team to suggest enhancements and test new builds' },
                { icon: <Shield size={18} />, title: 'Future Contributor Rewards', desc: 'Access to future community programs, token systems, and advanced hardware kits' },
              ].map((b) => (
                <div key={b.title} className="glass rounded-xl p-4 hover:border-amber-500/15 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">{b.icon}</div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{b.title}</h4>
                  <p className="text-[10px] text-sky-200/60 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dash preview */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={16} style={{ color: INDIA_ORANGE }} className="shrink-0" />
              <h3 className="text-base font-bold text-white">Contributor Analytics Dashboard</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {['Signal quality indicators', 'Coverage polar graphs', 'Daily messages count', 'MLAT tracking share', 'Receiver temperature logs', 'Uptime percentage tracking'].map((f) => (
                <div key={f} className="flex items-center gap-2 p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 size={10} className="text-amber-400 shrink-0" />
                  <span className="text-[11px] text-sky-200/60">{f}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-amber-500/[0.05] border border-amber-500/20">
              <p className="text-xs text-amber-400/80 italic">"Founding AeroCaptain dashboard analytics will be deployed to all active hosts as we enter our Phase 2 beta."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Hierarchy */}
      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase">
              <Award size={12} className="text-amber-400" /> Progression System
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">Your Journey in the AeroSky Community</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { level: 'Level 1', title: 'AeroCadet', desc: 'Aviation enthusiasts, students and supporters learning the basics.' },
              { level: 'Level 2', title: 'AeroCaptain', desc: 'Active ADS-B ground station contributors hosting receivers.' },
              { level: 'Level 3', title: 'AeroCommander', desc: 'High-impact AeroCaptains helping expand regional coverage networks.' },
              { level: 'Level 4', title: 'AeroMarshal', desc: 'Elite contributors supporting the growth of India\'s aviation intelligence network.' },
            ].map((journey) => (
              <div key={journey.title} className="glass rounded-xl p-5 border border-white/[0.04] relative overflow-hidden group hover:border-amber-500/20 transition-all">
                <div className="absolute top-0 right-0 px-2.5 py-1 text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 rounded-bl-lg">
                  {journey.level}
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{journey.title}</h3>
                <p className="text-xs text-sky-200/60 leading-relaxed">{journey.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Directory */}
      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase">
              <Users size={12} className="text-amber-400" /> Active Directory
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-3">Founding AeroCaptain Directory</h2>
          <p className="text-xs text-sky-200/60 text-center mb-6 max-w-sm mx-auto">
            Anonymized log of confirmed pre-launch nodes and verified local station registrations.
          </p>

          {directory.length === 0 ? (
            <div className="p-6 rounded-xl border border-white/[0.04] bg-white/[0.01] text-center max-w-md mx-auto">
              <p className="text-xs text-sky-200/50">The Founding Directory is currently empty. Be one of the first to apply and reserve your station's position.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {directory.map((node, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] text-center hover:border-amber-500/10 transition-colors">
                  <div className="text-xs font-mono font-bold text-amber-400">{node.num}</div>
                  <div className="text-[10px] text-sky-200/60 mt-0.5">{node.state}</div>
                  <div className={`text-[8px] font-mono mt-1.5 uppercase tracking-wider ${node.status === 'Reserved' ? 'text-emerald-400/80' : 'text-amber-400/80'}`}>
                    {node.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase">
              <HelpCircle size={12} className="text-amber-400" /> FAQ
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { q: 'Do I need aviation experience?', a: 'No. Anyone comfortable with basic hardware connections and having internet access can set up a station.' },
              { q: 'Is hosting a ground station legal in India?', a: 'Yes. Aircraft telemetry is broadcasted publicly on unencrypted frequencies. Receiving public signal streams for situational and scientific analysis is common globally.' },
              { q: 'How much internet bandwidth does it consume?', a: 'The data transmission is very lightweight, using less than 1-2 GB of bandwidth per month.' },
              { q: 'Where should I place the antenna?', a: 'Rooftops or outdoor poles with a clear, unobstructed line of sight to the horizon provide the maximum tracking range.' },
              { q: 'Will AeroSky provide hardware receiver kits?', a: 'Yes. AeroSky evaluates locations and provides free hardware kits to selected hosts in critical coverage zones. We also assist self-funded DIY setups.' },
              { q: 'How is my privacy protected?', a: 'To maintain host security, the exact coordinates of your receiver are fuzzed on public maps.' },
            ].map((faq, i) => {
              const [open, setOpen] = useState(false);
              return (
                <div key={i} className="glass rounded-xl overflow-hidden">
                  <button onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center justify-between p-4 text-left border-b border-transparent">
                    <span className="text-xs font-bold text-white pr-3">{faq.q}</span>
                    <ChevronDown size={14} className={`text-amber-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && <p className="px-4 pb-4 text-xs text-sky-200/60 leading-relaxed border-t border-white/5 pt-2">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-12 px-4 sm:px-6 md:px-12 lg:px-24 bg-black/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">AeroCaptain Application Form</h2>
            <p className="text-sm text-sky-200/60">
              Apply to join the Founding Program and help host an independent ADS-B ground station in India.
            </p>
          </div>

          {submitted ? (
            <div className="glass rounded-2xl p-8 text-center border-t-2 border-emerald-500 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Application Received!</h3>
              <div className="inline-block px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-400 mb-4 uppercase tracking-wider">
                Registration Queue: Founding AeroCaptain #{assignedNumber.replace('AC', '')} (Pending verification)
              </div>
              <p className="text-sm text-sky-200/60 max-w-md mx-auto">
                Thank you for applying to become a founding AeroCaptain. We will review your location coordinates and reach out within 7-10 business days regarding kit availability or setup instructions.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link to="/" className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider">
                  Back to Home
                </Link>
                <span className="text-white/20">|</span>
                <Link to="/community" className="text-xs font-mono font-bold text-sky-300 hover:text-sky-200 uppercase tracking-wider">
                  Join Discord
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
              {/* Invisible Honeypot field for bot mitigation */}
              <input
                type="text"
                name="phone_number"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autocomplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ac-name" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    id="ac-name"
                    required
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onFocus={handleInputFocus}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-sky-400/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="ac-email" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input
                    id="ac-email"
                    required
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onFocus={handleInputFocus}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-sky-400/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ac-city" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">City / Location *</label>
                  <input
                    id="ac-city"
                    required
                    type="text"
                    placeholder="e.g. Pune, Maharashtra"
                    value={formData.city}
                    onFocus={handleInputFocus}
                    onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-sky-400/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="ac-coords" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">Approx Coordinates (Optional)</label>
                  <input
                    id="ac-coords"
                    type="text"
                    placeholder="e.g. 18.5204, 73.8567"
                    value={formData.coordinates}
                    onChange={(e) => setFormData(p => ({ ...p, coordinates: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-sky-400/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ac-placement" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">Antenna Placement *</label>
                  <select
                    id="ac-placement"
                    required
                    value={formData.placement}
                    onChange={(e) => setFormData(p => ({ ...p, placement: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none text-sky-100"
                  >
                    <option value="" className="bg-[#0c1222]">Select placement</option>
                    <option value="rooftop" className="bg-[#0c1222]">Outdoor Rooftop / Mast (Best)</option>
                    <option value="balcony" className="bg-[#0c1222]">Balcony / High Floor</option>
                    <option value="indoor" className="bg-[#0c1222]">Window / Indoor Setup</option>
                    <option value="none" className="bg-[#0c1222]">None / Unsure</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ac-internet" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">Internet Connectivity *</label>
                  <select
                    id="ac-internet"
                    required
                    value={formData.internet}
                    onChange={(e) => setFormData(p => ({ ...p, internet: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none text-sky-100"
                  >
                    <option value="" className="bg-[#0c1222]">Select internet type</option>
                    <option value="fiber" className="bg-[#0c1222]">Fiber / Broadband (Uncapped)</option>
                    <option value="cellular" className="bg-[#0c1222]">4G / 5G Router</option>
                    <option value="other" className="bg-[#0c1222]">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-2">Hardware Status</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { val: 'has_pi', label: 'I own a Raspberry Pi / SBC' },
                    { val: 'has_sdr', label: 'I own an RTL-SDR receiver' },
                    { val: 'need_kit', label: 'I need an AeroSky AeroCaptain Kit' }
                  ].map((hw) => (
                    <label key={hw.val} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:border-amber-500/30 transition-colors text-xs text-sky-200/80">
                      <input
                        type="checkbox"
                        value={hw.val}
                        checked={formData.hardware.includes(hw.val)}
                        onChange={handleCheckboxChange}
                        className="w-3.5 h-3.5 rounded border-white/20 bg-white/[0.04] text-amber-500 focus:ring-amber-500/20"
                      />
                      {hw.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="ac-motivation" className="block text-xs font-bold text-sky-200/80 uppercase tracking-wider mb-1.5">Why would you like to host a ground station? (Optional)</label>
                <textarea
                  id="ac-motivation"
                  rows={3}
                  placeholder="Share details about your location, elevation, or interest in aviation."
                  value={formData.motivation}
                  onChange={(e) => setFormData(p => ({ ...p, motivation: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-sky-400/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>

              <button type="submit" className="w-full py-3.5 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] cursor-pointer" style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}>
                Apply to Become an AeroCaptain
              </button>

              {error && (
                <p className="text-rose-400 text-xs font-mono text-center animate-pulse">{error}</p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default AeroCaptains;
