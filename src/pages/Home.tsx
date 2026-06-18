import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Globe, Radio, Shield, Flag, Database, Lock, Radar, Plane,
  BarChart3, Users, Zap, ArrowRight, MapPin, CheckCircle2,
  CloudLightning, Eye, Fingerprint, IndianRupee, Map as MapIcon, ChevronRight, BookOpen, Send, Mail, Antenna, Award, Target, Clock, HelpCircle, ChevronDown
} from 'lucide-react';
import MapBackground from '../components/MapBackground';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import DiscordCTA from '../components/DiscordCTA';
import { trackEvent } from '../utils/analytics';
import { getLaunchMetrics, addNewsletterSubscription, LaunchMetrics } from '../utils/db';
import { sanitizeInput, validateEmail, isBotSubmission, isRateLimited } from '../utils/security';
import { useSiteSettings } from '../context/CMSContext';
import { getArticles, getUpcomingEvents, getFAQs, formatImageUrl } from '../services/strapi';
import { StrapiArticle, StrapiEvent, StrapiFAQ } from '../types/strapi';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
   Order of sections:
   1. HeroSection
   2. MissionSection ("Why AeroSky Exists")
   3. AeroCaptainProgramSection ("Become an AeroCaptain")
   4. CommunityJourneySection ("Your Journey in the AeroSky Community")
   5. CommunitySection ("Join India's Aviation Data Community")
   6. CoveragePreviewSection ("Building India's Coverage Network")
   7. RoadmapSection ("Building India's Aviation Intelligence Network")
   8. AboutSection ("Built for Indian Skies")
   9. NewsletterSection ("India Airspace Report")
 ═══════════════════════════════════════════════════════════════ */
const Home: React.FC = () => {
  const [metrics, setMetrics] = useState<LaunchMetrics>({
    foundingCaptains: 31,
    citiesRegistered: 14,
    statesRepresented: 8,
    newsletterSubscribers: 57,
    communityMembers: 142
  });

  const [articles, setArticles] = useState<StrapiArticle[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<StrapiEvent | null>(null);
  const [faqs, setFaqs] = useState<StrapiFAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getLaunchMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load home metrics:', err);
      }
    }

    async function loadCmsContent() {
      try {
        const [articlesList, eventsList, faqsList] = await Promise.all([
          getArticles(),
          getUpcomingEvents(),
          getFAQs()
        ]);
        setArticles(articlesList.slice(0, 3));
        setUpcomingEvent(eventsList[0] || null);
        setFaqs(faqsList.filter(f => f.active === true).slice(0, 5));
      } catch (e) {
        console.error('[Home CMS] Failed to resolve homepage data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
    loadCmsContent();
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden">
      <SEO />
      <Schema
        type="Organization"
        data={{
          name: 'AeroSky',
          url: 'https://aerosky.in',
          logo: 'https://aerosky.in/assets/logo.png',
          sameAs: [
            'https://github.com/AeroLytics',
            'https://discord.gg/aerosky'
          ]
        }}
      />
      <HeroSection metrics={metrics} />
      <MissionSection />
      <AeroCaptainProgramSection />
      <CommunityJourneySection />
      <CommunitySection upcomingEvent={upcomingEvent} />
      <LatestArticlesSection articles={articles} loading={loading} />
      <CoveragePreviewSection />
      <RoadmapSection />
      <FAQSection faqs={faqs} loading={loading} />
      <AboutSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;

/* ═══════════════════════════════════════════════════════════════
   SECTION 1: HERO
 ═══════════════════════════════════════════════════════════════ */
interface HeroSectionProps {
  metrics: LaunchMetrics;
}

function HeroSection({ metrics }: HeroSectionProps) {
  const siteSettings = useSiteSettings();

  const titleText = siteSettings.heroTitle || "India's Own|Airspace|Intelligence";
  const subtitleText = siteSettings.heroSubtitle || "Help build India's independent aviation intelligence network. Join our founding community to host ground receiver nodes, decode transponder feeds, and map Indian airspace together.";
  const bannerText = siteSettings.announcementBanner || "SOVEREIGN DATA • INDEPENDENT INDIAN AIRSPACE NETWORK";
  
  const cta1Link = siteSettings.primaryCtaLink || "/aerocaptains";
  const cta1Text = siteSettings.primaryCtaText || "Become a Founding AeroCaptain";
  const cta2Link = siteSettings.secondaryCtaLink || "#community";
  const cta2Text = siteSettings.secondaryCtaText || "Join the Founding Community";

  return (
    <section className="relative h-screen w-full overflow-hidden" aria-label="AeroSky Hero">
      {/* Background: Static Map */}
      <div className="absolute inset-0 z-0">
        <MapBackground className="w-full h-full" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#020617] via-[#020617]/95 via-40% to-transparent" />
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]" style={{
          background: `linear-gradient(135deg, ${INDIA_ORANGE}00 30%, ${INDIA_ORANGE} 50%, transparent 55%, ${INDIA_GREEN} 60%, ${INDIA_GREEN}00 75%)`
        }} />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#020617]/70 via-transparent to-[#020617]" />
      </div>

      {/* Pre-launch badge */}
      <div className="absolute top-24 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-sky-200/80 uppercase tracking-widest">
          {siteSettings.announcementBanner || "Pre-Launch Community Open"}
        </span>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-20 pt-20 pb-4">
        <div className="w-full max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-mono font-bold tracking-[0.15em] mb-4 animate-slide-up"
            style={{ background: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)', color: INDIA_ORANGE }}
          >
            <Shield size={12} className="animate-pulse" />
            {bannerText}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tighter mb-4 animate-slide-up delay-100">
            {titleText.includes('|') ? (
              <>
                <span style={{ color: INDIA_ORANGE }}>{titleText.split('|')[0]}</span><br />
                <span className="text-white">{titleText.split('|')[1]}</span>{' '}
                <span style={{ color: INDIA_GREEN }}>{titleText.split('|')[2] || ''}</span>
              </>
            ) : (
              <span className="text-white">{titleText}</span>
            )}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-sky-200/70 mb-6 max-w-lg leading-relaxed animate-slide-up delay-200">
            {subtitleText}
          </p>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mb-6 animate-slide-up delay-250">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/10 transition-colors">
              <div className="text-[9px] font-mono text-sky-200/40 uppercase tracking-widest">Founding AeroCaptain Program</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">Applications Open</span>
              </div>
            </div>
            
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/10 transition-colors">
              <div className="text-[9px] font-mono text-sky-200/40 uppercase tracking-widest">Community</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase">Join Our Discord</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/10 transition-colors">
              <div className="text-[9px] font-mono text-sky-200/40 uppercase tracking-widest">India Airspace Report</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">Subscribe for Updates</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/10 transition-colors">
              <div className="text-[9px] font-mono text-sky-200/40 uppercase tracking-widest">Platform</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-sky-400 uppercase">Pre-Launch</span>
              </div>
            </div>
          </div>

          {/* Social Proof Real Badges */}
          <div className="grid grid-cols-2 gap-2 max-w-lg mb-8 animate-slide-up delay-300">
            {[
              'Founding AeroCaptain Program Open',
              'Community Applications Open',
              'Beta Applications Open',
              'Coverage Vision Established'
            ].map((text) => (
              <div key={text} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/20 transition-all">
                <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-medium text-sky-100/80">{text}</span>
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg animate-slide-up delay-400">
            {cta1Link.startsWith('http') ? (
              <a
                href={cta1Link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('hero_become_aerocaptain_clicked', { page: '/' })}
                className="flex-1 text-black text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(255,153,51,0.2)] hover:shadow-[0_0_40px_rgba(255,153,51,0.35)] hover:-translate-y-1"
                style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
              >
                <Radio size={16} className="animate-pulse" /> {cta1Text}
              </a>
            ) : (
              <Link
                to={cta1Link}
                onClick={() => trackEvent('hero_become_aerocaptain_clicked', { page: '/' })}
                className="flex-1 text-black text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(255,153,51,0.2)] hover:shadow-[0_0_40px_rgba(255,153,51,0.35)] hover:-translate-y-1"
                style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
              >
                <Radio size={16} className="animate-pulse" /> {cta1Text}
              </Link>
            )}

            {cta2Link.startsWith('http') ? (
              <a
                href={cta2Link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('hero_join_community_clicked', { page: '/' })}
                className="flex-1 px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-bold text-white transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Users size={16} /> {cta2Text}
              </a>
            ) : (
              <a
                href={cta2Link}
                onClick={() => trackEvent('hero_join_community_clicked', { page: '/' })}
                className="flex-1 px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-bold text-white transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Users size={16} /> {cta2Text}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 animate-bounce opacity-30">
        <ChevronRight size={12} className="text-gray-500 rotate-90" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: MISSION ("Why AeroSky Exists")
 ═══════════════════════════════════════════════════════════════ */
function MissionSection() {
  const cards = [
    {
      icon: <Radar size={22} />,
      title: 'ADS-B Coverage Expansion',
      desc: 'Deploying community-hosted ground stations to map low-altitude skies and cover general aviation blind spots across India.'
    },
    {
      icon: <BarChart3 size={22} />,
      title: 'Aviation Intelligence',
      desc: 'Sourcing, decoding, and calculating precision flight stats, route logic, and airport operational delays on Indian servers.'
    },
    {
      icon: <Users size={22} />,
      title: 'Community Contribution',
      desc: 'Connecting pilots, spotters, hardware engineers, and SDR hobbyists to collaborate on an open Indian flight ecosystem.'
    },
    {
      icon: <BookOpen size={22} />,
      title: 'Aviation Education',
      desc: 'Sharing structural guides on radio signals, RF technology, and setup walkthroughs to encourage hardware literacy.'
    },
    {
      icon: <Globe size={22} />,
      title: 'Open Innovation',
      desc: 'Enabling local developers to integrate sovereign airspace datasets into tools, analysis projects, and services.'
    }
  ];

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
            <Flag size={12} style={{ color: INDIA_ORANGE }} /> Core Pillars
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Why AeroSky Exists
          </h2>
          <p className="text-sky-200/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            India's aviation intelligence ecosystem relies heavily on foreign platforms. AeroSky is building an independent, community-powered network focused on Indian skies, aviation transparency and contributor-driven coverage.
          </p>
        </header>

        {/* Feature Cards Grid (3 on top, 2 centered below or 3+2 layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.slice(0, 3).map((c) => (
            <div key={c.title} className="glass rounded-2xl p-6 border border-white/[0.04] hover:border-amber-500/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">{c.icon}</div>
              <h3 className="text-base font-bold text-white mb-2">{c.title}</h3>
              <p className="text-xs text-sky-200/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:w-[67%] lg:mx-auto">
            {cards.slice(3).map((c) => (
              <div key={c.title} className="glass rounded-2xl p-6 border border-white/[0.04] hover:border-amber-500/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">{c.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{c.title}</h3>
                <p className="text-xs text-sky-200/60 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: AEROCAPTAIN PROGRAM
 ═══════════════════════════════════════════════════════════════ */
function AeroCaptainProgramSection() {
  const benefits = [
    'Founding AeroCaptain Badge',
    'Early Platform Access',
    'Community Recognition',
    'Coverage Leaderboards',
    'Direct Product Feedback Access',
    'Future Contributor Rewards'
  ];

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-white/[0.06] hover:border-amber-500/15 transition-all duration-500">
          <div className="absolute -right-10 -bottom-10 opacity-[0.05] pointer-events-none">
            <Antenna size={250} style={{ color: INDIA_ORANGE }} />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4" style={{ borderColor: 'rgba(255,153,51,0.2)', background: 'rgba(255,153,51,0.04)' }}>
                <Radio size={12} className="text-amber-400 animate-pulse" /> Ground Station Hosting
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">Become an AeroCaptain</h2>
              <p className="text-sm text-sky-200/70 mb-4 leading-relaxed">
                Help build India's independent ADS-B network from the ground up.
              </p>
              <p className="text-xs text-sky-200/60 mb-6 leading-relaxed">
                AeroCaptains are contributors who host ADS-B ground stations and help expand India's independent airspace intelligence network. By receiving aircraft transponder signals and streaming them to our platform, you directly strengthen aviation transparency.
              </p>
              <Link
                to="/aerocaptains"
                onClick={() => trackEvent('hero_become_aerocaptain_clicked', { page: '/' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:-translate-y-0.5 cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
              >
                Apply to Become an AeroCaptain <ArrowRight size={14} />
              </Link>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-sky-200/40 uppercase tracking-widest mb-4">Program Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                    <span className="text-xs font-medium text-sky-100/90">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4: COMMUNITY JOURNEY
 ═══════════════════════════════════════════════════════════════ */
function CommunityJourneySection() {
  const journeys = [
    {
      level: 'Level 1',
      title: 'AeroCadet',
      desc: 'Aviation enthusiasts, students and supporters.'
    },
    {
      level: 'Level 2',
      title: 'AeroCaptain',
      desc: 'Active ADS-B ground station contributors.'
    },
    {
      level: 'Level 3',
      title: 'AeroCommander',
      desc: 'High-impact AeroCaptains helping expand coverage.'
    },
    {
      level: 'Level 4',
      title: 'AeroMarshal',
      desc: 'Elite contributors supporting the growth of India\'s aviation intelligence network.'
    }
  ];

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
            <Award size={12} style={{ color: INDIA_ORANGE }} /> Progression
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Your Journey in the AeroSky Community
          </h2>
          <p className="text-sky-200/60 text-xs sm:text-sm max-w-xl mx-auto">
            From learning hardware basics to supporting regional coverage, grow your contribution tier.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {journeys.map((j) => (
            <div key={j.title} className="glass rounded-xl p-5 border border-white/[0.04] relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
              <div className="absolute top-0 right-0 px-2 py-0.5 text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 rounded-bl-lg">
                {j.level}
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{j.title}</h3>
              <p className="text-xs text-sky-200/60 leading-relaxed">{j.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: COMMUNITY SECTION
 ═══════════════════════════════════════════════════════════════ */
interface CommunitySectionProps {
  upcomingEvent: StrapiEvent | null;
}

function CommunitySection({ upcomingEvent }: CommunitySectionProps) {
  const topics = [
    'ADS-B & Ground Stations',
    'Hardware & SDR Setup',
    'Aviation Analytics',
    'Aircraft Spotting',
    'Student Pilots',
    'Airport Operations',
    'Aviation Technology'
  ];

  return (
    <section id="community" className="relative z-10 py-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-6 sm:p-10 border border-white/[0.06] bg-gradient-to-br from-sky-950/40 via-sky-950/10 to-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-400/20 bg-indigo-500/[0.04] text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase mb-4">
                <Users size={12} /> Live Forum
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Join India's Aviation Data Community</h2>
              <p className="text-sm text-sky-200/70 mb-6 leading-relaxed">
                A place for aviation enthusiasts, AeroCaptains, aircraft spotters, SDR hobbyists, student pilots and aviation professionals. Connect and share airspace telemetry, spotting pictures, and receiver builds.
              </p>

              {/* Reusable Trackable Discord CTA */}
              <DiscordCTA
                location="home_community_section"
                buttonName="Join Discord Community"
                variant="primary"
                className="mb-6"
              />

              {/* Event teaser */}
              {upcomingEvent && (
                <div className="p-4 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 animate-fade-in">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Upcoming: {upcomingEvent.title}
                  </div>
                  <div className="text-xs text-sky-200/80 mb-2">
                    {upcomingEvent.description}
                  </div>
                  {upcomingEvent.registrationUrl && (
                    <a
                      href={upcomingEvent.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('community_event_registered', { page: '/', kickoff: upcomingEvent.title })}
                      className="text-[10px] font-mono font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest flex items-center gap-1"
                    >
                      Register for Event <ChevronRight size={10} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-5 border border-white/[0.04]">
              <h3 className="text-xs font-mono font-bold text-sky-200/40 uppercase tracking-widest mb-3">Active Discussion Channels</h3>
              <div className="flex flex-col gap-2">
                {topics.map((t) => (
                  <div key={t} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors border border-white/[0.03]">
                    <span className="text-xs font-medium text-sky-100/90 flex items-center gap-2">
                      <span className="text-amber-500">#</span> {t}
                    </span>
                    <ChevronRight size={10} className="text-sky-200/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6: COVERAGE PREVIEW
 ═══════════════════════════════════════════════════════════════ */
function CoveragePreviewSection() {
  const statuses = [
    'Coverage Vision Established',
    'New Cities Being Added',
    'Community Driven Growth',
    'Founding AeroCaptains Joining'
  ];

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
            <Radar size={12} style={{ color: INDIA_ORANGE }} /> Network Vision
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Building India's Coverage Network
          </h2>
          <p className="text-sky-200/70 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            AeroCaptains help build ADS-B coverage across India, creating a stronger and more transparent aviation intelligence network.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Map Preview */}
          <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-sky-950/20 backdrop-blur-md relative" style={{ height: '350px' }}>
            <MapBackground className="w-full h-full absolute inset-0 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-sky-200/70 uppercase">Visualizing Airspace Gaps</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold text-sky-200/40 uppercase tracking-widest mb-4">Platform Growth Parameters</h3>
            <div className="flex flex-col gap-3">
              {statuses.map((s) => (
                <div key={s} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-amber-500/10 transition-colors">
                  <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-sm font-semibold text-white">{s}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                to="/coverage"
                onClick={() => trackEvent('coverage_page_viewed', { from: 'home_preview' })}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider"
              >
                Explore Coverage Vision <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7: ROADMAP
 ═══════════════════════════════════════════════════════════════ */
function RoadmapSection() {
  const phases = [
    { stage: 'Current Stage', title: 'Community Formation', desc: 'Establishing founding forums, welcoming first AeroCaptains, and conducting airspace coverage assessments.' },
    { stage: 'Next Stage', title: 'AeroCaptain Network', desc: 'Shipping receiver kits to founding members, expanding receiver setups into major aviation corridors and tier-2 cities.' },
    { stage: 'Future Stage', title: 'Live Flight Intelligence Platform', desc: 'Deploying our secure web application, featuring interactive live maps, meteorological overlays, and aviation analytical APIs.' }
  ];

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
            <Target size={12} style={{ color: INDIA_ORANGE }} /> Development Path
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Building India's Aviation Intelligence Network
          </h2>
          <p className="text-sky-200/70 text-xs sm:text-sm max-w-xl mx-auto">
            Our systematic phase timeline to achieve national airspace coverage and deploy analytical APIs.
          </p>
        </header>

        {/* Timeline representation */}
        <div className="relative border-l border-white/[0.05] ml-4 md:ml-10 space-y-6">
          {phases.map((p, index) => (
            <div key={p.title} className="relative pl-6 sm:pl-10 group">
              {/* Dot */}
              <div className={`absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-[#020617] flex items-center justify-center transition-all ${index === 0 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-sky-800'}`} />
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-500/80 uppercase">{p.stage}</span>
                  {index === 0 && <span className="px-1.5 py-0.5 text-[7px] font-mono font-bold bg-amber-500/10 text-amber-400 rounded uppercase">Active</span>}
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{p.title}</h3>
                <p className="text-xs text-sky-200/60 leading-relaxed max-w-xl">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 8: ABOUT SECTION
 ═══════════════════════════════════════════════════════════════ */
function AboutSection() {
  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-3xl p-8 sm:p-10 border border-white/[0.05] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[10px] font-mono font-bold tracking-widest text-sky-200/60 uppercase mb-4">
              <Globe size={12} style={{ color: INDIA_GREEN }} /> Sovereignty
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-3">Built for Indian Skies</h2>
            <p className="text-sm text-sky-200/70 leading-relaxed max-w-2xl mx-auto mb-6">
              AeroSky is creating a community-powered aviation intelligence platform designed specifically for India's rapidly growing aviation ecosystem. Built by aviation enthusiasts, engineers and contributors who believe aviation intelligence should be transparent, accessible and community driven.
            </p>
            <div className="flex gap-2 justify-center" aria-label="Indian Flag Colors">
              <div className="w-4 h-1 rounded-sm" style={{ background: INDIA_ORANGE }} />
              <div className="w-4 h-1 rounded-sm bg-white" />
              <div className="w-4 h-1 rounded-sm" style={{ background: INDIA_GREEN }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 9: NEWSLETTER SECTION ("India Airspace Report")
 ═══════════════════════════════════════════════════════════════ */
function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const handleInputFocus = () => {
    if (!started) {
      setStarted(true);
      trackEvent('newsletter_signup_started', { page: '/' });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Spam Protection: Honeypot Check
    if (isBotSubmission(honeypot)) {
      console.log('[Security] Honeypot triggered. Silently ignoring submission.');
      setSubscribed(true);
      return;
    }

    // Input Sanitization and Validation
    const cleanEmail = sanitizeInput(email);
    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Rate Limiting Check
    if (isRateLimited('newsletter_signup', 10)) {
      setError('Too many attempts. Please wait 10 seconds before trying again.');
      return;
    }

    const referralCode = localStorage.getItem('aerosky_ref') || '';
    
    // DB Lead Capture
    const success = await addNewsletterSubscription({
      email: cleanEmail,
      source_page: 'Home',
      referral_code: referralCode
    });

    if (success) {
      trackEvent('newsletter_signup_completed', {
        email: cleanEmail,
        sourcePage: 'Home',
        referralCode: referralCode
      });
      setSubscribed(true);
    } else {
      setError('You are already registered or an error occurred. Please try again.');
    }
  };

  return (
    <section id="newsletter" className="relative z-10 py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-black/10">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/10 bg-amber-500/[0.03] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-4">
          <Mail size={12} /> Monthly Intelligence
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">India Airspace Report</h2>
        <p className="text-xs sm:text-sm text-sky-200/60 max-w-md mx-auto mb-4 leading-relaxed">
          Receive monthly updates on AeroSky's progress, aviation insights, community milestones and upcoming launches.
        </p>

        {/* Newsletter Agenda Bullets */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-lg mx-auto animate-slide-up">
          {[
            'Community growth logs',
            'ADS-B receiver updates',
            'AeroCaptain spotlights',
            'Sovereign airspace insights'
          ].map((agenda) => (
            <span key={agenda} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.01] border border-white/[0.04] text-[10px] text-sky-200/60 font-mono">
              <CheckCircle2 size={10} className="text-amber-500" /> {agenda}
            </span>
          ))}
        </div>

        {subscribed ? (
          <div className="glass rounded-xl p-6 border border-emerald-500/20 bg-emerald-500/[0.02] animate-fade-in max-w-md mx-auto">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Subscribed Successfully!</h3>
            <p className="text-xs text-sky-200/50">You will receive the next India Airspace Report in your inbox.</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              {/* Invisible Honeypot Field */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autocomplete="off"
              />

              <input
                type="email"
                required
                aria-label="Email address for monthly report"
                placeholder="Enter your email address"
                value={email}
                onFocus={handleInputFocus}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm text-white placeholder-sky-400/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              />
              <button type="submit" className="px-6 py-3 rounded-xl text-black font-bold text-xs sm:text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:-translate-y-0.5 cursor-pointer" style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}>
                Subscribe
              </button>
            </form>
            {error && (
              <p className="text-rose-400 text-xs font-mono mt-2 text-left sm:text-center animate-pulse">{error}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 10: LATEST ARTICLES SECTION
 ═══════════════════════════════════════════════════════════════ */
interface LatestArticlesSectionProps {
  articles: StrapiArticle[];
  loading: boolean;
}

function LatestArticlesSection({ articles, loading }: LatestArticlesSectionProps) {
  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-white/5 rounded mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="h-48 bg-white/5 rounded-2xl" />
            <div className="h-48 bg-white/5 rounded-2xl" />
            <div className="h-48 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-black/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
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
                    <span className="flex items-center gap-1 text-[9px] font-mono text-sky-200/40">
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
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest"
          >
            Explore Academy Hub <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Simple helper to calculate reading time inside LatestArticlesSection
function calculateReadingTime(text: string): string {
  if (!text) return '1 min';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 11: HOMEPAGE FAQ SECTION
 ═══════════════════════════════════════════════════════════════ */
interface FAQSectionProps {
  faqs: StrapiFAQ[];
  loading: boolean;
}

function FAQSection({ faqs, loading }: FAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-3xl mx-auto animate-pulse space-y-3">
        <div className="h-6 w-32 bg-white/5 rounded mx-auto mb-6" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-white/5 rounded-xl" />
        ))}
      </section>
    );
  }

  if (faqs.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-6">
          <HelpCircle size={14} className="text-amber-400" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="rounded-xl border border-white/[0.04] bg-white/[0.01] overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                aria-expanded={openIdx === i}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown size={14} className={`text-amber-400 shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <p className="px-4 pb-4 text-sm text-sky-200/60 leading-relaxed pt-2 border-t border-white/5">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

