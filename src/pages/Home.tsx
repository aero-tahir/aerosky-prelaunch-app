import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio, Shield, Users, Zap, ArrowRight, CheckCircle2,
  ChevronRight, BookOpen, Award, Target, Clock, HelpCircle,
  ChevronDown, Radar, BarChart3, Flag, Globe, Antenna
} from 'lucide-react';
import MapBackground from '../components/MapBackground';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import DiscordCTA from '../components/DiscordCTA';
import { trackEvent } from '../utils/analytics';
import { getLaunchMetrics, addAeroCadet, LaunchMetrics } from '../utils/db';
import { sanitizeInput, validateEmail, isBotSubmission, isRateLimited } from '../utils/security';
import { useSiteSettings } from '../context/CMSContext';
import { getArticles, getUpcomingEvents, getFAQs, formatImageUrl } from '../services/strapi';
import { StrapiArticle, StrapiEvent, StrapiFAQ } from '../types/strapi';
import { BadgeCard } from '../components/BadgeCard';
import { ShareOverlay } from '../components/ShareOverlay';


/* ═══════════════════════════════════════════════════════════════
   HOME PAGE — 7-section conversion-first architecture
   1. HeroSection
   2. CommunityPathwaysSection  ← signup cards immediately after hero
   3. AeroCaptainProgramSection ← merged with WhyAeroCaptain + tier strip
   4. CommunitySection
   5. CoverageRoadmapSection    ← merged Coverage + Roadmap
   6. LatestArticlesSection     (conditional — only if CMS has articles)
   7. FAQSection                (conditional — only if CMS has FAQs)
   ═══════════════════════════════════════════════════════════════ */
const Home: React.FC = () => {
  const [metrics, setMetrics] = useState<LaunchMetrics>({
    foundingCaptains: 0,
    citiesRegistered: 0,
    statesRepresented: 0,
    newsletterSubscribers: 0,
    communityMembers: 0
  });

  const [articles, setArticles] = useState<StrapiArticle[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<StrapiEvent | null>(null);
  const [faqs, setFaqs] = useState<StrapiFAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load launch metrics
        const m = await getLaunchMetrics();
        setMetrics(m);

        // Load CMS data
        const [articlesData, eventsData, faqsData] = await Promise.all([
          getArticles(),
          getUpcomingEvents(),
          getFAQs()
        ]);

        setArticles(articlesData || []);
        
        // Find next upcoming event
        if (eventsData && eventsData.length > 0) {
          const sorted = eventsData
            .filter(e => e.active !== false && new Date(e.eventDate) > new Date())
            .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
          setUpcomingEvent(sorted[0] || null);
        }

        setFaqs(faqsData || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="relative bg-[#020617] overflow-hidden">
      <SEO
        title="AeroSky — India's Airspace Intelligence Network | Community-Powered Flight Tracking"
        description="Get early access to India's independent airspace intelligence network. Join as an AeroCadet or apply to host a ground station as an AeroCaptain."
      />
      <Schema
        type="Organization"
        data={{
          name: 'AeroSky',
          url: 'https://aerosky.ai',
          logo: 'https://aerosky.ai/assets/logo.png',
          sameAs: [
            'https://github.com/AeroLytics',
            'https://discord.gg/aerosky'
          ]
        }}
      />
      <HeroSection metrics={metrics} />
      <CommunityPathwaysSection metrics={metrics} />
      <AeroCaptainProgramSection />
      <CommunitySection upcomingEvent={upcomingEvent} />
      <CoverageRoadmapSection metrics={metrics} />
      <LatestArticlesSection articles={articles} loading={loading} />
      <FAQSection faqs={faqs} loading={loading} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SECTION 1: HERO SECTION
 ═══════════════════════════════════════════════════════════════ */
interface HeroSectionProps {
  metrics: LaunchMetrics;
}

function HeroSection({ metrics }: HeroSectionProps) {
  const siteSettings = useSiteSettings();

  const titleText = siteSettings.heroTitle || "Community-Powered|Airspace|Intelligence";
  const subtitleText = siteSettings.heroSubtitle || "Get early access to India's next airspace intelligence platform. Join the founding community as an AeroCadet to access delay analytics or host a receiver node as an AeroCaptain to help expand regional coverage.";
  const bannerText = siteSettings.announcementBanner || "COMMUNITY-POWERED AIRSPACE INTELLIGENCE FOR INDIA";

  const cta1Link = siteSettings.primaryCtaLink || "/aerocaptains#apply";
  const cta1Text = siteSettings.primaryCtaText || "Become an AeroCaptain";
  const cta2Link = "#pathways";
  const cta2Text = "Join as an AeroCadet";

  return (
    <section className="relative h-auto md:h-screen w-full overflow-hidden" aria-label="AeroSky Hero">
      {/* Background: Static Map */}
      <div className="absolute inset-0 z-0">
        <MapBackground className="hidden md:block w-full h-full" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#020617] via-[#020617]/95 via-40% to-transparent" />
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]" style={{
          background: `linear-gradient(135deg, rgba(255, 153, 51, 0) 30%, var(--color-saffron) 50%, transparent 55%, var(--color-india-green) 60%, rgba(19, 136, 8, 0) 75%)`
        }} />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#020617]/70 via-transparent to-[#020617]" />
      </div>

      {/* Airspace Grid Onboarding badge (top-right, on the map) - hidden on mobile */}
      <div className="hidden md:flex absolute top-24 right-4 z-20 items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-sky-200/80 uppercase tracking-widest">
          Airspace Grid Onboarding
        </span>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-20 pt-24 pb-6 md:h-full md:flex md:flex-col md:justify-center md:pt-20 md:pb-4">
        <div className="w-full max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-saffron/30 bg-saffron/[0.08] text-saffron text-[11px] font-mono font-bold tracking-[0.15em] mb-4 animate-slide-up"
            style={{ animationDelay: '50ms' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
            {bannerText}
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-5 animate-slide-up delay-150 select-none">
            {titleText.split('|').map((part, index) => {
              if (index === 0) {
                return (
                  <span key={index} className="block text-india-green bg-gradient-to-r from-emerald-400 to-india-green bg-clip-text text-transparent">
                    {part}
                  </span>
                );
              }
              if (index === 1) {
                return (
                  <span key={index} className="block text-white">
                    {part}
                  </span>
                );
              }
              if (index === 2) {
                return (
                  <span key={index} className="block text-saffron bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">
                    {part}
                  </span>
                );
              }
              return (
                <span key={index} className="block text-white">
                  {part}
                </span>
              );
            })}
          </h1>

          <p className="text-xs sm:text-sm text-sky-200/60 leading-relaxed max-w-lg mb-6 animate-slide-up delay-200">
            {subtitleText}
          </p>

          {/* 4 Status Pills */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mb-8 animate-slide-up delay-300">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 transition-colors">
              <div className="text-[11px] font-mono text-sky-200/50 uppercase tracking-wider">AeroCaptain Program</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Applications Open</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-saffron/20 transition-colors">
              <div className="text-[11px] font-mono text-sky-200/50 uppercase tracking-wider">India Airspace Network</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                <span className="text-xs font-mono font-bold text-saffron uppercase">Community-Powered</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/20 transition-colors">
              <div className="text-[11px] font-mono text-sky-200/50 uppercase tracking-wider">AeroSky Community</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Discord Active</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-sky-500/20 transition-colors">
              <div className="text-[11px] font-mono text-sky-200/50 uppercase tracking-wider">Platform Status</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-sky-400 uppercase">Early Access</span>
              </div>
            </div>
          </div>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg animate-slide-up delay-400">
            <Link
              to={cta1Link}
              onClick={() => trackEvent('hero_become_aerocaptain_clicked', { page: '/' })}
              className="flex-1 px-5 py-3.5 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-br from-saffron to-gold"
            >
              <Radio size={16} className="animate-pulse" /> {cta1Text}
            </Link>
            <a
              href={cta2Link}
              onClick={() => trackEvent('hero_join_community_clicked', { page: '/' })}
              className="flex-1 px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-bold text-white transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Users size={16} /> {cta2Text}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint - hidden on mobile */}
      <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-0.5 animate-bounce opacity-30">
        <ChevronRight size={12} className="text-gray-500 rotate-90" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: COMMUNITY PATHWAYS — Signup cards
 ═══════════════════════════════════════════════════════════════ */
interface CommunityPathwaysSectionProps {
  metrics: LaunchMetrics;
}

function CommunityPathwaysSection({ metrics }: CommunityPathwaysSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [assignedCadetNum, setAssignedCadetNum] = useState('');
  const [assignedCadetSlug, setAssignedCadetSlug] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!showModal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showModal]);

  const cadetCount = metrics.newsletterSubscribers;
  const captainCount = metrics.foundingCaptains;

  const cadetRemaining = Math.max(500 - cadetCount, 0);
  const captainRemaining = Math.max(500 - captainCount, 0);
  const cadetProgress = Math.min(Math.round((cadetCount / 500) * 100), 100);
  const captainProgress = Math.min(Math.round((captainCount / 500) * 100), 100);

  const getInputCls = (isInvalid: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-sky-400/30 focus:outline-none focus:ring-1 focus:ring-sky-500/20 transition-colors ${
      isInvalid
        ? 'border-rose-500/50 focus:border-rose-500'
        : 'border-white/[0.08] focus:border-sky-500/50'
    }`;

  const handleCadetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (isBotSubmission(honeypot)) {
      setAssignedCadetNum('CAD999');
      setRegistered(true);
      setSubmitting(false);
      return;
    }

    const cleanName = sanitizeInput(userName);
    const cleanEmail = sanitizeInput(userEmail);

    if (!cleanName || !cleanEmail) {
      setError('Please fill in all fields.');
      setSubmitting(false);
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }

    if (isRateLimited('cadet_signup', 10)) {
      setError('Too many attempts. Please wait 10 seconds.');
      setSubmitting(false);
      return;
    }

    const referrer = localStorage.getItem('aerosky_ref') || '';

    try {
      const result = await addAeroCadet({
        name: cleanName,
        email: cleanEmail,
        invited_by: referrer,
        source_page: 'Home'
      });
      setAssignedCadetNum(result.code);
      setAssignedCadetSlug(result.slug);
      
      // Store in session storage for frictionless instant access
      if (result.slug) {
        sessionStorage.setItem(`verified_member_email_${result.slug}`, cleanEmail);
      }
      if (result.code) {
        sessionStorage.setItem(`verified_member_email_${result.code}`, cleanEmail);
      }

      setRegistered(true);
      trackEvent('aerocadet_registered', { cadetNumber: result.code, referrer });
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (registered) {
      setRegistered(false);
      setUserName('');
      setUserEmail('');
      setAssignedCadetNum('');
    }
  };

  const cadetBenefits = [
    'Early Platform Access',
    'Beta Invitations',
    'India Airspace Report',
    'Community Events',
    'Discord Community',
    'Product Updates'
  ];

  const captainBenefits = [
    'Dedicated onboarding',
    'Hardware guidance',
    'Recognition & Badge',
    'Coverage contribution',
    'Future rewards',
    'Platinum Platform Subscription'
  ];

  return (
    <section id="pathways" className="scroll-mt-20 relative z-10 section-std bg-gradient-to-b from-[#020617] via-black/30 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/10 bg-amber-500/[0.03] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-3">
            <Award size={12} /> Founding Membership
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Join the Founding Cohort
          </h2>
          <p className="text-sky-200/60 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Two paths. One mission. Choose your role in building India's independent airspace intelligence network.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Pathway 1: AeroCadet */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-sky-500/10 hover:border-sky-500/25 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-sky-950/20 via-transparent to-transparent">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/25 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                  Founding AeroCadet
                </span>
                <span className="text-[10px] font-mono text-sky-200/70">Tier 1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Early Platform Access</h3>
              <p className="text-xs text-sky-200/60 leading-relaxed mb-5">
                For aviation enthusiasts, student pilots, engineers, and passengers interested in delay analytics and early product updates.
              </p>

              {/* Scarcity Ticker */}
              <div className="mb-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-sky-200/50 font-medium">Founding seats claimed</span>
                  <span className="font-mono font-bold text-sky-400">{cadetCount} / 500</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full bg-sky-400 transition-all duration-1000" style={{ width: `${cadetProgress}%` }} />
                </div>
                <p className="text-[10px] font-mono text-amber-400 font-bold mt-2">
                  {cadetRemaining > 0 ? `Only ${cadetRemaining} founding seats remain.` : 'Cohort fully booked!'}
                </p>
              </div>

              <h4 className="text-[10px] font-mono font-bold text-sky-200/70 uppercase tracking-widest mb-3">Membership Benefits</h4>
              <ul className="space-y-2 mb-6">
                {cadetBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-sky-100/80">
                    <CheckCircle2 size={12} className="text-sky-400 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { setShowModal(true); trackEvent('cadet_signup_started', { trigger: 'pathways_section' }); }}
              className="w-full py-3.5 rounded-xl border border-sky-400/20 bg-sky-400/10 hover:bg-sky-400/20 text-sky-400 font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.01] cursor-pointer"
            >
              Join as an AeroCadet
            </button>
          </div>

          {/* Pathway 2: AeroCaptain */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-orange-500/10 hover:border-orange-500/25 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-orange-950/20 via-transparent to-transparent">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400/25 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider">
                  Founding AeroCaptain
                </span>
                <span className="text-[10px] font-mono text-orange-200/40 font-bold uppercase">Hardware Tier</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Host a Ground Station</h3>
              <p className="text-xs text-sky-200/60 leading-relaxed mb-5">
                For contributors interested in hosting low-power ground station receivers to feed raw ADS-B signals to our platform.
              </p>

              {/* Scarcity Ticker */}
              <div className="mb-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-orange-200/50 font-medium">Applications received</span>
                  <span className="font-mono font-bold text-orange-400">{captainCount} / 500</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full bg-orange-400 transition-all duration-1000" style={{ width: `${captainProgress}%` }} />
                </div>
                <p className="text-[10px] font-mono text-amber-400 font-bold mt-2">
                  {captainRemaining > 0 ? `Only ${captainRemaining} applications remaining.` : 'All slots filled!'}
                </p>
              </div>

              <h4 className="text-[10px] font-mono font-bold text-orange-200/40 uppercase tracking-widest mb-3">Host Benefits</h4>
              <ul className="space-y-2 mb-6">
                {captainBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-sky-100/80">
                    <CheckCircle2 size={12} className="text-orange-400 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/aerocaptains#apply"
              onClick={() => trackEvent('captain_signup_started', { trigger: 'pathways_section' })}
              className="w-full py-3.5 rounded-xl text-black font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-[1.01] bg-gradient-to-br from-saffron to-gold shadow-[0_0_20px_rgba(255,153,51,0.2)] hover:shadow-[0_0_35px_rgba(255,153,51,0.35)]"
            >
              Become an AeroCaptain
            </Link>
          </div>
        </div>
      </div>

      {/* AeroCadet Signup Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
          onKeyDown={(e) => { if (e.key === 'Escape') handleCloseModal(); }}
          role="presentation"
        >
          <div
            className="relative w-full max-w-lg overflow-hidden glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cadet-modal-title"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 id="cadet-modal-title" className="text-lg font-bold text-white">
                {registered ? 'Welcome to the Community' : 'Join as Founding AeroCadet'}
              </h3>
              <button
                onClick={handleCloseModal}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {registered ? (
              <div className="text-center py-4 flex flex-col items-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                  <CheckCircle2 size={24} className="text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Welcome to the AeroSky Community</h4>
                <p className="text-xs text-sky-200/60 max-w-sm mb-6 leading-relaxed">
                  Thank you for joining AeroSky as a Founding AeroCadet. You'll receive early product updates, invitations to beta programs, community events, and the India Airspace Report as the platform evolves.
                </p>

                <BadgeCard role="cadet" memberNumber={assignedCadetNum} name={userName} memberSlug={assignedCadetSlug} />

                <div className="w-full max-w-sm mt-6 text-left space-y-3.5 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
                  <h5 className="text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest mb-1.5">Your Onboarding Checklist</h5>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">Claimed Founding Badge</div>
                      <div className="text-[11px] text-sky-200/50">Your serial is #CAD{assignedCadetNum.replace('CAD', '')}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">Welcome Email Sent</div>
                      <div className="text-[11px] text-sky-200/50">Invitations and monthly airspace reports active.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 border-t border-white/5 pt-3.5 mt-3">
                    <div className="w-4.5 h-4.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                      <div className="w-1 h-1 rounded-full bg-amber-400" />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">Next Step: Join Discord</div>
                        <div className="text-[11px] text-sky-200/70">Estimated Time: 30 seconds</div>
                      </div>
                      <a
                        href="https://discord.gg/aerosky"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-indigo-500 hover:bg-indigo-600 text-[11px] font-mono font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Join
                      </a>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-sm mt-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] text-left space-y-4">
                  <div>
                    <h5 className="text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest mb-2">Milestone Upgrade Program</h5>
                    <p className="text-xs text-sky-200/60 leading-normal">
                      Invite 3 friends using your referral link to unlock a Free Silver Subscription Upgrade (₹1,499/yr) including historical flight data, 3D tracking, and custom alerts.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[11px] text-sky-200/50 uppercase tracking-wider leading-none">Members Invited</div>
                      <div className="text-base font-mono font-bold text-white mt-1">0 / 3</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-sky-200/50 uppercase tracking-wider leading-none">Reward Status</div>
                      <div className="text-xs font-bold text-amber-400 mt-1">Locked (0/3)</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-sky-200/70">Private Dashboard:</span>
                    <Link to={`/member/${assignedCadetSlug || assignedCadetNum}`} className="text-[11px] font-mono font-bold text-sky-400 hover:text-sky-300 flex items-center gap-0.5">
                      aerosky.ai/member/{assignedCadetSlug || assignedCadetNum} <ArrowRight size={8} />
                    </Link>
                  </div>
                </div>

                <ShareOverlay role="cadet" memberNumber={assignedCadetNum} className="mt-6" memberSlug={assignedCadetSlug} />
              </div>
            ) : (
              <form onSubmit={handleCadetSubmit} className="space-y-4">
                <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <div className="space-y-1">
                  <label htmlFor="cadet-name" className="block text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest">Full Name</label>
                  <input
                    id="cadet-name"
                    required
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    autoComplete="name"
                    aria-describedby={error ? "cadet-error" : undefined}
                    onChange={(e) => setUserName(e.target.value)}
                    className={getInputCls(!!error && !userName)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="cadet-email" className="block text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest">Email Address</label>
                  <input
                    id="cadet-email"
                    required
                    type="email"
                    placeholder="name@domain.com"
                    value={userEmail}
                    autoComplete="email"
                    aria-describedby={error ? "cadet-error" : undefined}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className={getInputCls(!!error && (!userEmail || error.includes('email')))}
                  />
                </div>

                <p className="text-xs text-sky-200/60 leading-relaxed pt-2">
                  By joining, you agree to receive platform updates, monthly intelligence newsletters, and beta notifications. We prioritize data sovereignty and will never share your personal information.
                </p>

                {error && <p id="cadet-error" className="text-rose-400 text-xs font-mono animate-pulse">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 mt-4 rounded-xl text-black font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer bg-gradient-to-br from-sky-400 to-sky-500 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                >
                  {submitting ? 'Registering...' : 'Claim My Founding Badge'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: AEROCAPTAIN PROGRAM
 ═══════════════════════════════════════════════════════════════ */
function AeroCaptainProgramSection() {
  const reasons = [
    {
      icon: <Radar size={20} />,
      title: "Pioneer India's Network",
      desc: "Be among the first to host an independent ground station receiver, mapping regional coverage and general aviation gaps."
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Contribute to Aviation Research",
      desc: "Provide high-fidelity flight data to help local researchers, spotters, and developers optimize routes and airport operations."
    },
    {
      icon: <Award size={20} />,
      title: "Earn Recognition & Rewards",
      desc: "Receive permanent Hall of Fame status, active range badges, and priority eligibility for future hardware distributions."
    }
  ];

  const tiers = [
    { title: 'AeroCadet', level: 'L1', desc: 'Enthusiasts & supporters', color: 'sky' },
    { title: 'AeroCaptain', level: 'L2', desc: 'Ground station hosts', color: 'amber' },
    { title: 'AeroCommander', level: 'L3', desc: 'High-impact contributors', color: 'orange' },
    { title: 'AeroMarshal', level: 'L4', desc: 'Elite network builders', color: 'rose' },
  ];

  return (
    <section className="relative z-10 section-std">
      <div className="max-w-6xl mx-auto">
        {/* Main card */}
        <div className="glass rounded-3xl p-7 sm:p-10 relative overflow-hidden border border-white/[0.06] hover:border-amber-500/15 transition-all duration-500 mb-6">
          <div className="absolute -right-10 -bottom-10 opacity-[0.04] pointer-events-none">
            <Antenna size={220} className="text-saffron" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-saffron/20 bg-saffron/[0.04] text-saffron text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                <Radio size={12} className="text-amber-400 animate-pulse" /> Ground Station Hosting
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">Become an AeroCaptain</h2>
              <p className="text-sm text-sky-200/70 mb-4 leading-relaxed">
                AeroCaptains are the backbone of our network — contributors who host compact ADS-B ground stations, capture live aircraft transponder signals, and stream flight telemetry to our independent Indian platform.
              </p>
              <p className="text-xs text-sky-200/50 mb-6 leading-relaxed">
                By covering local airspace blind spots, AeroCaptains help build India's first community-powered, sovereignty-first aviation intelligence grid.
              </p>
              <Link
                to="/aerocaptains#apply"
                onClick={() => trackEvent('hero_become_aerocaptain_clicked', { page: '/' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:-translate-y-0.5 cursor-pointer bg-gradient-to-br from-saffron to-gold"
              >
                Apply to Become an AeroCaptain <ArrowRight size={14} />
              </Link>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest mb-4">Why Host a Station?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reasons.map((r) => (
                  <div key={r.title} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-amber-500/15 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">{r.icon}</div>
                    <div>
                      <div className="text-xs font-bold text-white mb-1">{r.title}</div>
                      <div className="text-[10px] text-sky-200/50 leading-relaxed">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Community Tier Strip */}
        <div>
          <div className="text-center mb-5">
            <span className="text-[10px] font-mono font-bold text-sky-200/70 uppercase tracking-widest">Community Progression Tiers</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tiers.map((t, i) => (
              <div
                key={t.title}
                className={`relative glass rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-0.5 ${i === 1 ? 'border-amber-500/25 bg-amber-500/[0.03]' : 'border-white/[0.04]'}`}
              >
                <div className="absolute top-3 right-3 text-[8px] font-mono font-bold bg-white/5 px-1.5 py-0.5 rounded text-sky-200/70">{t.level}</div>
                <div className={`text-sm font-bold mb-1 ${i === 1 ? 'text-amber-400' : 'text-white'}`}>{t.title}</div>
                <div className="text-[10px] text-sky-200/50">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4: COMMUNITY SECTION
 ═══════════════════════════════════════════════════════════════ */
interface CommunitySectionProps {
  upcomingEvent: StrapiEvent | null;
}

function CommunitySection({ upcomingEvent }: CommunitySectionProps) {
  const categories = [
    'Aircraft Spotting',
    'Student Pilots',
    'Airport Operations'
  ];

  return (
    <section id="community" className="scroll-mt-20 relative z-10 section-std bg-black/10">
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-6 sm:p-10 border border-white/[0.06] bg-gradient-to-br from-sky-950/40 via-sky-950/10 to-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/[0.03] text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase mb-4">
                <Users size={12} /> Flight Enthusiast Network
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">Join India's Aviation Community</h2>
              <p className="text-xs sm:text-sm text-sky-200/70 leading-relaxed mb-6">
                A place for aviation enthusiasts, AeroCaptains, aircraft spotters, SDR hobbyists, student pilots and aviation professionals. Connect and share airspace telemetry, spotting pictures, and receiver builds.
              </p>

              <DiscordCTA location="home_community_section" buttonName="Join Discord Community" variant="primary" className="mb-6" />

              {upcomingEvent && (
                <div className="p-4 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 animate-fade-in">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Upcoming: {upcomingEvent.title}
                  </div>
                  <div className="text-xs text-sky-200/80 mb-2">{upcomingEvent.description}</div>
                  {upcomingEvent.registrationUrl && (
                    <a
                      href={upcomingEvent.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider"
                    >
                      Register for Kickoff <ArrowRight size={10} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2">
                {categories.map((c) => (
                  <div key={c} className="glass rounded-xl p-3.5 border border-white/[0.03] text-center">
                    <div className="text-[10px] font-mono font-bold text-sky-200/60 uppercase tracking-wider">{c}</div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-2xl border border-white/[0.04] bg-black/40">
                <div className="text-[10px] font-mono font-bold text-sky-200/70 uppercase tracking-widest mb-3">Live Network Feed</div>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-sky-200/50">#general-chat</span>
                    <span className="text-sky-200/30">Active discussion on SDR setups</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-sky-200/50">#receiver-builds</span>
                    <span className="text-sky-200/30">Share raw antenna diagrams</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-sky-200/50">#airport-spotting</span>
                    <span className="text-sky-200/30">Live photos from regional hubs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: COVERAGE + ROADMAP (Merged)
 ═══════════════════════════════════════════════════════════════ */
interface CoverageRoadmapSectionProps {
  metrics: LaunchMetrics;
}

function CoverageRoadmapSection({ metrics }: CoverageRoadmapSectionProps) {
  const phases = [
    { stage: 'Phase 1', title: 'Community Growth', desc: 'Welcoming founding AeroCaptains and hosting technical briefings.', active: true },
    { stage: 'Phase 2', title: 'Coverage Expansion', desc: 'Distributing ADS-B kits to hosts in critical flight corridors.' },
    { stage: 'Phase 3', title: 'Platform Launch', desc: 'Deploying the live map to visualize aircraft transponder streams.' },
    { stage: 'Phase 4', title: 'Airspace Intelligence', desc: 'Historical route analysis, arrival analytics, and weather overlays.' },
    { stage: 'Phase 5', title: 'Developer Ecosystem', desc: 'Open-source telemetry decoders and low-latency API access.' },
  ];

  return (
    <section className="relative z-10 section-std">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
            <Target size={12} className="text-saffron" /> Network Vision & Roadmap
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Building India's Coverage Network
          </h2>
          <p className="text-sky-200/60 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            AeroCaptains host ground stations to expand coverage, enabling high-fidelity airspace intelligence for regional airports and corridors.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map preview */}
          <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-sky-950/20 backdrop-blur-md relative" style={{ height: '360px' }}>
            <MapBackground className="w-full h-full absolute inset-0 z-0" longitude={78} latitude={22} zoom={3.6} />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-sky-200/70 uppercase">Visualizing Airspace Gaps</span>
              </div>
              <Link
                to="/coverage"
                onClick={() => trackEvent('coverage_page_viewed', { from: 'home_preview' })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/60 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider transition-colors"
              >
                Explore <ArrowRight size={9} />
              </Link>
            </div>
          </div>

          {/* Phase timeline */}
          <div className="relative border-l border-white/[0.05] ml-4 md:ml-10 space-y-6">
            {phases.map((p, index) => (
              <div key={p.title} className="relative pl-6 sm:pl-10 group">
                {/* Dot */}
                <div
                  className={`absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-[#020617] flex items-center justify-center transition-all ${
                    p.active
                      ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : 'bg-sky-900 border-white/10'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-500/80 uppercase">{p.stage}</span>
                    {p.active && (
                      <span className="px-1.5 py-0.5 text-[7px] font-mono font-bold bg-amber-500/10 text-amber-400 rounded uppercase animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-sky-200/50 leading-relaxed max-w-xl">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Readiness & Network Health Tracker */}
        <div id="readiness" className="scroll-mt-20 mt-12 glass rounded-3xl p-6 border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-6">
            <Target size={16} className="text-saffron animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Network Health & Platform Readiness</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { id: 'captains', label: 'AeroCaptains', current: metrics.foundingCaptains, target: 500, unit: 'Nodes' },
              { id: 'cities', label: 'Cities', current: metrics.citiesRegistered, target: 20, unit: 'Cities' },
              { id: 'states', label: 'States', current: metrics.statesRepresented, target: 15, unit: 'States' },
              { id: 'subscribers', label: 'Subscribers', current: metrics.newsletterSubscribers, target: 100, unit: 'Subscribers' },
              { id: 'community', label: 'Community', current: metrics.communityMembers, target: 200, unit: 'Members' }
            ].map((m) => {
              const progress = Math.min(Math.round((m.current / m.target) * 100), 100);
              return (
                <div key={m.id} className={`space-y-2 ${m.id === 'community' ? 'col-span-2 md:col-span-1' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-sky-200/70 uppercase tracking-wide">{m.label}</span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{progress}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden p-[0.5px] border border-white/[0.02]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-saffron to-gold"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-sky-200/50 font-mono">
                    {m.current} / {m.target} {m.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6: LATEST ARTICLES SECTION (Academy Publications)
 ═══════════════════════════════════════════════════════════════ */
interface LatestArticlesSectionProps {
  articles: StrapiArticle[];
  loading: boolean;
}

function LatestArticlesSection({ articles, loading }: LatestArticlesSectionProps) {
  if (loading) {
    return (
      <section className="section-std bg-black/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 animate-pulse">
            <div className="h-6 w-36 bg-white/5 rounded-full mx-auto mb-3" />
            <div className="h-8 w-48 bg-white/5 rounded-lg mx-auto mb-2" />
            <div className="h-4 w-72 bg-white/5 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden border border-white/[0.04] p-5 flex flex-col justify-between min-h-[220px] animate-pulse">
                <div>
                  <div className="w-full h-32 bg-white/5 rounded-xl mb-4" />
                  <div className="h-5 bg-white/5 rounded-md w-3/4 mb-2.5" />
                  <div className="h-3 bg-white/5 rounded w-full mb-1.5" />
                  <div className="h-3 bg-white/5 rounded w-5/6" />
                </div>
                <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center">
                  <div className="h-3 w-10 bg-white/5 rounded" />
                  <div className="h-3 w-16 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="section-std bg-black/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/10 bg-amber-500/[0.03] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-3">
            <BookOpen size={12} /> Academy Publications
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Latest Insights</h2>
          <p className="text-xs sm:text-sm text-sky-200/60 max-w-md mx-auto">
            RF guides, receiver configuration tutorials and operational telemetry analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {articles.map((post) => {
            const readTime = calculateReadingTime(post.content);
            return (
              <article
                key={post.slug}
                className="glass rounded-2xl overflow-hidden border border-white/[0.04] hover:border-amber-500/15 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between group"
              >
                {post.featuredImage && (
                  <div className="w-full h-32 relative overflow-hidden bg-white/[0.01]">
                    <img
                      src={formatImageUrl(post.featuredImage) || ''}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[11px] text-sky-200/50 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[9px] font-mono text-sky-200/70">
                      <Clock size={10} /> {readTime}
                    </span>
                    <Link
                      to={`/insights/${post.slug}`}
                      className="text-[9px] font-mono font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest flex items-center gap-1"
                    >
                      Read Guide <ArrowRight size={8} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/insights" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest">
            Explore Academy Hub <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function calculateReadingTime(text: string): string {
  if (!text) return '1 min';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7: FAQ (conditional — only if CMS has data)
 ═══════════════════════════════════════════════════════════════ */
interface FAQSectionProps {
  faqs: StrapiFAQ[];
  loading: boolean;
}

function FAQSection({ faqs, loading }: FAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (loading) {
    return (
      <section className="section-std bg-black/10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 justify-center mb-8 animate-pulse">
            <div className="w-4 h-4 bg-white/5 rounded-full" />
            <div className="h-6 w-56 bg-white/5 rounded-lg" />
          </div>
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 flex justify-between items-center animate-pulse">
                <div className="h-4 bg-white/5 rounded w-2/3" />
                <div className="w-4 h-4 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (faqs.length === 0) return null;

  return (
    <section className="section-std bg-black/10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-8">
          <HelpCircle size={14} className="text-amber-400" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2.5">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={faq.id} className="rounded-xl border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-300 hover:border-white/10">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.question}</span>
                  <ChevronDown size={14} className={`text-amber-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100 border-t border-white/5 p-4 bg-white/[0.005]' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-xs sm:text-sm text-sky-200/60 leading-relaxed pt-1">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Home;
