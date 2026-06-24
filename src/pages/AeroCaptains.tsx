import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio, Cpu, Antenna, Wifi, Shield, BarChart3, Zap,
  Radar, ArrowRight, CheckCircle2, Plane, Users, Target,
  HelpCircle, ChevronDown, Award, Signal, MapPin, Star
} from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';
import { submitAeroCaptainApplication, getAeroCaptainsDirectory } from '../utils/db';
import { sanitizeInput, validateEmail, isBotSubmission, isRateLimited } from '../utils/security';
import { getFAQs } from '../services/strapi';
import { StrapiFAQ } from '../types/strapi';
import { BadgeCard } from '../components/BadgeCard';
import { ShareOverlay } from '../components/ShareOverlay';

const AeroCaptains: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [assignedNumber, setAssignedNumber] = useState('');
  const [assignedSlug, setAssignedSlug] = useState('');
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [startedTracking, setStartedTracking] = useState(false);

  const [directory, setDirectory] = useState<{ num: string; state: string; status: string }[]>([]);
  const [faqs, setFaqs] = useState<StrapiFAQ[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    placement: '',
    internet: '',
    hardware: [] as string[],
    motivation: ''
  });

  useEffect(() => {
    async function loadDirectory() {
      try {
        const data = await getAeroCaptainsDirectory();
        setDirectory(data.slice(-8));
      } catch (err) {
        console.error('Failed to load captains directory:', err);
      }
    }
    async function loadFAQs() {
      try {
        const data = await getFAQs();
        const filtered = data.filter(faq => {
          const q = faq.question.toLowerCase();
          const a = faq.answer.toLowerCase();
          return (
            q.includes('experience') || q.includes('legal') || q.includes('bandwidth') ||
            q.includes('antenna') || q.includes('kits') || q.includes('privacy') ||
            a.includes('experience') || a.includes('legal') || a.includes('bandwidth') ||
            a.includes('antenna') || a.includes('kits') || a.includes('privacy')
          );
        });
        setFaqs(filtered);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      }
    }
    loadDirectory();
    loadFAQs();
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

    if (isBotSubmission(honeypot)) {
      setAssignedNumber('AC999');
      setSubmitted(true);
      return;
    }

    const cleanName = sanitizeInput(formData.name);
    const cleanEmail = sanitizeInput(formData.email);
    const cleanCityRaw = sanitizeInput(formData.city);
    const cleanPlacement = sanitizeInput(formData.placement);
    const cleanInternet = sanitizeInput(formData.internet);
    const cleanMotivation = sanitizeInput(formData.motivation);

    if (!cleanName || !cleanEmail || !cleanCityRaw || !cleanPlacement || !cleanInternet) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (isRateLimited('aerocaptain_apply', 15)) {
      setError('Too many attempts. Please wait 15 seconds.');
      return;
    }

    const parts = cleanCityRaw.split(',').map(s => s.trim());
    const city = parts[0] || 'Pune';
    const state = parts[1] || 'Maharashtra';
    const country = parts[2] || 'India';
    const referralCode = localStorage.getItem('aerosky_ref') || '';

    try {
      const result = await submitAeroCaptainApplication({
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
      setAssignedNumber(result.code);
      setAssignedSlug(result.slug);

      // Store in session storage for frictionless instant access
      if (result.slug) {
        sessionStorage.setItem(`verified_member_email_${result.slug}`, cleanEmail);
      }
      if (result.code) {
        sessionStorage.setItem(`verified_member_email_${result.code}`, cleanEmail);
      }

      trackEvent('aerocaptain_application_submitted', { foundingNumber: result.code, city, state, referralCode });
      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  /* ─── Input style shared ─── */
  const getInputCls = (isInvalid: boolean) =>
    `w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border text-sm text-white placeholder-sky-400/30 focus:outline-none transition-all ${
      isInvalid
        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
        : 'border-white/[0.10] focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30'
    }`;
  const labelCls = "block text-xs font-bold text-sky-200/60 uppercase tracking-widest mb-1";

  return (
    <div className="relative pt-16">
      <SEO
        title="Become an AeroCaptain | AeroSky"
        description="Apply to host an independent ADS-B ground station receiver and join India's founding airspace intelligence network."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.ai/' },
            { '@type': 'ListItem', position: 2, name: 'Become an AeroCaptain', item: 'https://aerosky.ai/aerocaptains' }
          ]
        }}
      />

      {/* ═══════════════════════════════════════════════════════
          HERO — Two-column: Left headline · Right floating form
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-20 py-10">

        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: `radial-gradient(circle, rgba(255,153,51,0.5) 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
          <div className="absolute -left-40 top-1/3 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-sky-500/[0.02] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">

          {/* ── LEFT: Hero copy ── */}
          <div className="animate-fade-in-up">

            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-saffron/30 bg-saffron/[0.07] text-saffron text-[10px] font-mono font-bold tracking-widest uppercase mb-5 animate-pulse-glow">
              <Antenna size={12} /> Founding Program · Applications Open
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-bold tracking-tight leading-[1.04] mb-5">
              <span className="text-white">Become a<br />Founding</span>{' '}
              <span className="bg-gradient-to-r from-saffron via-amber-400 to-gold bg-clip-text text-transparent">AeroCaptain.</span>
              <br />
              <span className="text-sky-200/80 text-3xl sm:text-4xl lg:text-[2.5rem] font-semibold">Host a Ground Station<br />for India.</span>
            </h1>

            <p className="text-sm sm:text-base text-sky-200/60 max-w-lg leading-relaxed mb-6">
              Place a compact ADS-B receiver on your rooftop and stream live airspace telemetry into India's sovereign aviation intelligence grid. No RF experience needed.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-3 mb-7">
              {[
                { icon: <Star size={12} />, text: 'Founding Badge' },
                { icon: <Zap size={12} />, text: 'Platinum Subscription' },
                { icon: <Shield size={12} />, text: 'No Experience Needed' },
                { icon: <MapPin size={12} />, text: 'Setup in 30 Minutes' },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-200/70 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1">
                  <span className="text-amber-400">{t.icon}</span>{t.text}
                </div>
              ))}
            </div>

            {/* Founding directory strip */}
            {directory.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] font-mono text-sky-200/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Users size={10} className="text-amber-400" /> {directory.length} Founding nodes registered
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {directory.map((node, i) => (
                    <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.04] text-[9px]">
                      <span className="font-mono font-bold text-amber-400">{node.num}</span>
                      <span className="text-sky-200/50">{node.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-xs font-bold text-sky-200/60 hover:text-amber-400 transition-colors uppercase tracking-wider"
              >
                How It Works <ArrowRight size={12} />
              </a>
              <span className="text-white/15">|</span>
              <Link
                to="/aerocaptains/hall-of-fame"
                onClick={() => trackEvent('hero_become_aerocaptain_clicked', { from: 'hero_cta', action: 'hall_of_fame' })}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400/70 hover:text-amber-300 transition-colors uppercase tracking-wider"
              >
                <Award size={12} /> Hall of Fame
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Floating Application Form ── */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            {submitted ? (
              /* ── SUCCESS STATE ── */
              <div className="relative rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.06] to-black/40 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(16,185,129,0.08)] flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <CheckCircle2 size={28} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
                <p className="text-xs text-sky-200/60 max-w-xs mb-5 leading-relaxed">
                  Our team will review your coordinates and reach out regarding onboarding and hardware recommendations.
                </p>

                <BadgeCard role="captain" memberNumber={assignedNumber} name={formData.name} memberSlug={assignedSlug} />

                <div className="w-full mt-5 text-left space-y-2.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-[10px] font-mono font-bold text-sky-200/70 uppercase tracking-widest mb-2">Next Steps</div>
                  {[
                    { done: true, label: 'Badge Provisioned', sub: `Serial #${assignedNumber}` },
                    { done: false, label: 'Verification Pending', sub: 'Team assessing your coverage coordinates' },
                  ].map((step) => (
                    <div key={step.label} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.done ? 'bg-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20 animate-pulse'}`}>
                        {step.done ? <CheckCircle2 size={10} className="text-emerald-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{step.label}</div>
                        <div className="text-[9px] text-sky-200/50">{step.sub}</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                    <div>
                      <div className="text-xs font-bold text-white">Join Discord</div>
                      <div className="text-[9px] text-sky-200/70">~30 seconds</div>
                    </div>
                    <a href="https://discord.gg/aerosky" target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-[10px] font-bold text-white transition-colors">Join</a>
                  </div>
                </div>

                {/* Referral upgrade */}
                <div className="w-full mt-4 p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/15 text-left space-y-2">
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">Milestone Upgrade</div>
                  <p className="text-[10px] text-sky-200/60 leading-normal">
                    Invite 3 engineers → unlock <strong className="text-amber-400">Free Business API</strong> (raw telemetry stream access).
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[9px] text-sky-200/70">Your dashboard:</span>
                    <Link to={`/member/${assignedSlug || assignedNumber}`} className="text-[9px] font-mono font-bold text-sky-400 hover:text-sky-300 flex items-center gap-0.5">
                      aerosky.ai/member/{assignedSlug || assignedNumber} <ArrowRight size={8} />
                    </Link>
                  </div>
                </div>

                <ShareOverlay role="captain" memberNumber={assignedNumber} className="mt-5 w-full" memberSlug={assignedSlug} />

                <div className="mt-5 flex justify-center gap-4 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Link to="/" className="text-amber-400 hover:text-amber-300">← Home</Link>
                  <span className="text-white/15">|</span>
                  <a href="https://discord.gg/aerosky" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-sky-200">Discord</a>
                </div>
              </div>
            ) : (
              /* ── APPLICATION FORM ── */
              <div id="apply" className="scroll-mt-24 relative rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl shadow-[0_8px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden">
                {/* Glow border accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron/50 to-transparent" />

                <div className="p-6 sm:p-7">
                  {/* Form header */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">Founding Application</span>
                    </div>
                    <h2 className="text-lg font-bold text-white leading-tight">Reserve your AeroCaptain node.</h2>
                    <p className="text-[11px] text-sky-200/50 mt-0.5">Takes 60 seconds. Be part of India's airspace intelligence movement.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Honeypot */}
                    <input type="text" name="phone_number" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="ac-name" className={labelCls}>Full Name *</label>
                        <input id="ac-name" required type="text" placeholder="Your name" value={formData.name}
                          autoComplete="name"
                          aria-describedby={error ? "ac-error" : undefined}
                          onFocus={handleInputFocus} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                          className={getInputCls(!!error && !formData.name)} />
                      </div>
                      <div>
                        <label htmlFor="ac-email" className={labelCls}>Email *</label>
                        <input id="ac-email" required type="email" placeholder="you@email.com" value={formData.email}
                          autoComplete="email"
                          aria-describedby={error ? "ac-error" : undefined}
                          onFocus={handleInputFocus} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                          className={getInputCls(!!error && (!formData.email || error.includes('email')))} />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="ac-city" className={labelCls}>City, State *</label>
                      <input id="ac-city" required type="text" placeholder="e.g. Pune, Maharashtra" value={formData.city}
                        autoComplete="address-level2"
                        aria-describedby={error ? "ac-error" : undefined}
                        onFocus={handleInputFocus} onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                        className={getInputCls(!!error && !formData.city)} />
                    </div>

                    {/* Placement + Internet */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <label htmlFor="ac-placement" className={labelCls}>Antenna Placement *</label>
                        <select id="ac-placement" required value={formData.placement}
                          aria-describedby={error ? "ac-error" : undefined}
                          onChange={(e) => setFormData(p => ({ ...p, placement: e.target.value }))}
                          className={getInputCls(!!error && !formData.placement) + ' appearance-none cursor-pointer'}>
                          <option value="" className="bg-[#0c1222]">Select</option>
                          <option value="rooftop" className="bg-[#0c1222]">Rooftop / Mast</option>
                          <option value="balcony" className="bg-[#0c1222]">Balcony / Window</option>
                          <option value="indoor" className="bg-[#0c1222]">Indoor</option>
                          <option value="none" className="bg-[#0c1222]">Unsure</option>
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-[2.3rem] w-4 h-4 text-sky-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      <div className="relative">
                        <label htmlFor="ac-internet" className={labelCls}>Internet Type *</label>
                        <select id="ac-internet" required value={formData.internet}
                          aria-describedby={error ? "ac-error" : undefined}
                          onChange={(e) => setFormData(p => ({ ...p, internet: e.target.value }))}
                          className={getInputCls(!!error && !formData.internet) + ' appearance-none cursor-pointer'}>
                          <option value="" className="bg-[#0c1222]">Select</option>
                          <option value="fiber" className="bg-[#0c1222]">Fiber / Broadband</option>
                          <option value="cellular" className="bg-[#0c1222]">4G / 5G</option>
                          <option value="other" className="bg-[#0c1222]">Other</option>
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-[2.3rem] w-4 h-4 text-sky-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    {/* Hardware checkboxes */}
                    <div>
                      <label className={labelCls}>Hardware you own</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { val: 'has_pi', label: 'Raspberry Pi / SBC' },
                          { val: 'has_sdr', label: 'RTL-SDR' },
                          { val: 'need_kit', label: 'Need AeroSky Kit' },
                        ].map((hw) => (
                          <label key={hw.val} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] cursor-pointer hover:border-amber-500/30 transition-all text-[11px] text-sky-200/70 select-none">
                            <input type="checkbox" value={hw.val} checked={formData.hardware.includes(hw.val)} onChange={handleCheckboxChange}
                              className="w-3 h-3 rounded border-white/20 bg-white/[0.04] text-amber-500 focus:ring-amber-500/20" />
                            {hw.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Motivation */}
                    <div>
                      <label htmlFor="ac-motivation" className={labelCls}>Why do you want to join? (optional)</label>
                      <textarea
                        id="ac-motivation"
                        rows={2}
                        placeholder="Tell us about your interest in aviation or airspace intelligence..."
                        value={formData.motivation}
                        onChange={(e) => setFormData(p => ({ ...p, motivation: e.target.value }))}
                        className={inputCls + ' resize-none'}
                      />
                    </div>

                    {/* CTA */}
                    <button type="submit"
                      className="w-full py-3.5 rounded-2xl text-black font-bold text-sm transition-all duration-200 hover:shadow-[0_0_30px_rgba(255,153,51,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer bg-gradient-to-br from-saffron via-amber-400 to-gold mt-1">
                      Reserve My AeroCaptain Node →
                    </button>

                    {error && <p id="ac-error" className="text-rose-400 text-xs font-mono text-center">{error}</p>}

                    {/* Social proof micro-footer */}
                    <div className="flex items-center justify-center gap-4 pt-1 border-t border-white/[0.05]">
                      <span className="text-xs text-sky-200/50 font-mono">🇮🇳 Your data stays in India</span>
                      <span className="text-white/10">·</span>
                      <span className="text-xs text-sky-200/50 font-mono">Free to apply</span>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ═══════════════ SECTION 2 — HOW IT WORKS + HARDWARE ═══════════════ */}
      <section id="how-it-works" className="scroll-mt-20 section-compact border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-2">
              <Radio size={12} className="text-saffron" /> Ground Station Setup
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              From your rooftop to <span className="text-saffron">India's airspace grid</span> — in 30 minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass rounded-2xl p-6 border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-4">
                <Signal size={16} className="text-saffron shrink-0" />
                <h3 className="text-sm font-bold text-white">How It Works</h3>
              </div>
              <div className="space-y-3.5">
                {[
                  { n: '01', title: 'Aircraft broadcasts telemetry on 1090 MHz', icon: <Plane size={14} /> },
                  { n: '02', title: 'Your outdoor antenna receives the signal', icon: <Antenna size={14} /> },
                  { n: '03', title: 'Raspberry Pi & RTL-SDR decode the data stream', icon: <Cpu size={14} /> },
                  { n: '04', title: "Telemetry feeds into India's sovereign airspace network", icon: <Wifi size={14} /> },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-amber-400/50 font-bold w-5 shrink-0">{s.n}</span>
                    <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">{s.icon}</div>
                    <span className="text-sm text-sky-200/70">{s.title}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-sky-200/70 mt-4 italic border-t border-white/5 pt-3">
                Every new receiver closes low-altitude blind spots across Indian airspace.
              </p>
            </div>

            <div id="hardware" className="scroll-mt-20 glass rounded-2xl p-6 border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={16} className="text-amber-400 shrink-0" />
                <h3 className="text-sm font-bold text-white">Hardware You Need</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { icon: <Cpu size={20} />, name: 'Raspberry Pi / SBC', desc: 'Runs dump1090-fa decoder' },
                  { icon: <Radio size={20} />, name: 'RTL-SDR Receiver', desc: 'USB SDR tuned to 1090 MHz' },
                  { icon: <Antenna size={20} />, name: '1090 MHz Antenna', desc: 'Omni-directional outdoor' },
                  { icon: <Wifi size={20} />, name: 'Internet Connection', desc: 'Fiber / 4G / 5G supported' },
                ].map((hw) => (
                  <div key={hw.name} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">{hw.icon}</div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">{hw.name}</div>
                      <div className="text-[10px] text-sky-200/50 mt-0.5">{hw.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {['LNA + SAW filters', 'SMA coax cables', 'Waterproof enclosure', 'Rooftop mast'].map((u) => (
                  <span key={u} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-sky-200/50">+ {u}</span>
                ))}
              </div>
              <p className="text-xs text-sky-200/50 leading-relaxed border-t border-white/5 pt-3">
                AeroSky provides custom kits to qualified hosts in key regions. DIY RTL-SDR + Pi setups fully supported.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 3 — BENEFITS ═══════════════ */}
      <section className="section-compact bg-black/10 border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/10 bg-amber-500/[0.03] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-2">
              <Zap size={12} /> Founding Member Rewards
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">What you get as a Founding AeroCaptain</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: <Award size={16} />, title: 'Founding AeroCaptain Badge', desc: 'Permanent digital token on your profile and the Hall of Fame' },
              { icon: <BarChart3 size={16} />, title: 'Advanced Analytics Dashboard', desc: 'Real-time telemetry, range polar plots, uptime and MLAT stats' },
              { icon: <Zap size={16} />, title: 'Platinum Subscription', desc: 'Complimentary lifetime Platinum tier for active station hosts' },
              { icon: <Target size={16} />, title: 'Coverage Leaderboards', desc: 'Compete on signal range, message count, and station uptime' },
              { icon: <Radar size={16} />, title: 'Early Platform Access', desc: 'Beta builds and direct feedback channel to the engineering team' },
              { icon: <Shield size={16} />, title: 'Future Contributor Rewards', desc: 'Hardware kits, contributor programs, and advanced token systems' },
            ].map((b) => (
              <div key={b.title} className="flex items-start gap-3 p-3.5 rounded-xl glass border border-white/[0.04] hover:border-amber-500/15 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-amber-500/20 transition-colors">{b.icon}</div>
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">{b.title}</div>
                  <div className="text-[10px] text-sky-200/55 leading-relaxed">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 4 — FAQ (conditional) ═══════════════ */}
      {faqs.length > 0 && (
        <section className="section-compact border-t border-white/[0.03]">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase">
                <HelpCircle size={12} className="text-amber-400" /> Common Questions
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-5">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {faqs.map((faq, i) => (
                <div key={faq.id || i} className="glass rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} aria-expanded={openFaqIndex === i}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.01] transition-colors">
                    <span className="text-xs font-bold text-white pr-3">{faq.question}</span>
                    <ChevronDown size={14} className={`text-amber-400 shrink-0 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaqIndex === i && (
                    <p className="px-4 pb-4 text-xs text-sky-200/60 leading-relaxed border-t border-white/5 pt-2">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AeroCaptains;
