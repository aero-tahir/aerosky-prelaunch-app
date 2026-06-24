import React, { useEffect, useState } from 'react';
import { HelpCircle, Search, Radio, Code, Globe, MessageSquare, ChevronDown, ChevronUp, Check, Copy, Mail, Shield, FileText } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { getPage, getFAQs } from '../services/strapi';
import { StrapiPage, StrapiFAQ } from '../types/strapi';
import { useSiteSettings } from '../context/CMSContext';

const DIRECTORY_CHANNELS = [
  {
    dept: "Support & AeroCaptains",
    email: "support@aerosky.ai",
    icon: <Radio className="text-saffron shrink-0" size={20} />,
    details: "Hardware configurations, RTL-SDR setups, receiver kit deliveries, and connection logs."
  },
  {
    dept: "Press & Media",
    email: "press@aerosky.ai",
    icon: <FileText className="text-gold shrink-0" size={20} />,
    details: "Airspace data requests, media publications, and pre-launch report citations."
  },
  {
    dept: "Partnerships",
    email: "partners@aerosky.ai",
    icon: <Globe className="text-emerald-400 shrink-0" size={20} />,
    details: "Academic research collaborations, commercial airspace analytics, and local database integrations."
  },
  {
    dept: "Security (VDP)",
    email: "security@aerosky.ai",
    icon: <Shield className="text-rose-400 shrink-0" size={20} />,
    details: "Report transponder decode issues, network vulnerabilities, or data leakage reports."
  },
  {
    dept: "General Administrative",
    email: "contact@aerosky.ai",
    icon: <Mail className="text-sky-400 shrink-0" size={20} />,
    details: "General inquiries, corporate details, parent organization (AeroLytics) correspondence."
  }
];

const Support: React.FC = () => {
  const [page, setPage] = useState<StrapiPage | null>(null);
  const [faqs, setFaqs] = useState<StrapiFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const siteSettings = useSiteSettings();

  useEffect(() => {
    async function loadData() {
      try {
        const [pageData, faqsData] = await Promise.all([
          getPage('support'),
          getFAQs()
        ]);
        setPage(pageData);
        setFaqs(faqsData || []);
      } catch (err) {
        console.error('Failed to load support page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredFaqs = faqs.filter(
    faq =>
      faq.active !== false &&
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleFaq = (id: number) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="relative pt-24 pb-14 px-4 sm:px-6 md:px-12 lg:px-24 max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-white/5 rounded mx-auto" />
        <div className="h-6 w-96 bg-white/5 rounded mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-44 bg-white/5 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-white/5 rounded-3xl" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="relative pt-24 pb-14 px-4 sm:px-6 md:px-12 lg:px-24 text-center">
        <SEO title="Support & Contact Channels | AeroSky" description="AeroSky Support" />
        <div className="text-sky-200/50 text-sm">Support page is currently unavailable.</div>
      </div>
    );
  }

  const CONTACT_CARDS = [
    {
      icon: <Radio className="text-saffron" size={28} />,
      title: "SDR & AeroCaptains",
      desc: "For ground station hardware setups, receiver deliveries, antenna tuning, and telemetry feeds.",
      actionText: "Host Ground Station",
      actionLink: "/aerocaptains",
      isMail: false
    },
    {
      icon: <Code className="text-gold" size={28} />,
      title: "Developer APIs",
      desc: "Access unencrypted airspace telemetry JSON feeds, custom decoders, and documentation support.",
      actionText: "API Discord Chat",
      actionLink: siteSettings.discordInviteUrl || "https://discord.gg/aerosky",
      isMail: false
    },
    {
      icon: <Globe className="text-emerald-400" size={28} />,
      title: "B2B & Partnerships",
      desc: "For airport data integration, safety boards, research programs, or commercial logistics intelligence.",
      actionText: "Email Partners",
      actionLink: "mailto:partners@aerosky.ai",
      isMail: true
    },
    {
      icon: <MessageSquare className="text-sky-400" size={28} />,
      title: "Community Desk",
      desc: "Discuss general aviation news, aircraft spotting photography, and RF setups with other operators.",
      actionText: "Join Discussion",
      actionLink: siteSettings.discordInviteUrl || "https://discord.gg/aerosky",
      isMail: false
    }
  ];

  return (
    <div className="relative min-h-screen pt-20 pb-12 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[400px] bg-sky-500/[0.015] rounded-full blur-[100px]" />
      </div>

      <SEO
        title={page.seoTitle || `${page.title} | AeroSky`}
        description={page.seoDescription || "AeroSky Support Channels"}
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.ai/' },
            { '@type': 'ListItem', position: 2, name: page.title, item: `https://aerosky.ai/${page.slug}` }
          ]
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        {/* Support Header & Search */}
        <section className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/[0.04] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-4">
            <HelpCircle size={12} /> Contact & Help Directory
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            How can we <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">help you</span>?
          </h1>
          <p className="text-sm sm:text-base text-sky-200/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Troubleshoot ground station hardware, access airspace data APIs, or connect with operational planners.
          </p>

          {/* FAQ Live Search */}
          <div className="max-w-lg mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-saffron/20 to-gold/20 rounded-2xl blur opacity-30 group-focus-within:opacity-70 transition-opacity" />
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-sky-950/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-white placeholder-sky-200/40 focus:outline-none focus:border-saffron/50 transition-all font-sans"
              />
              <Search className="absolute left-4 text-sky-200/70 group-focus-within:text-saffron transition-colors" size={18} />
            </div>
          </div>
        </section>

        {/* Support Channels Grid */}
        <section className="mb-10 relative z-10">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-200/70 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron" /> Primary Portals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACT_CARDS.map((card, idx) => (
              <div
                key={idx}
                className="glass p-6 rounded-2xl border border-white/[0.04] bg-sky-950/[0.15] hover:border-saffron/25 hover:shadow-[0_0_30px_rgba(255,153,51,0.05)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="mb-4 p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-sans group-hover:text-saffron transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-sky-200/50 leading-relaxed font-sans mb-6">
                    {card.desc}
                  </p>
                </div>
                {card.isMail ? (
                  <a
                    href={card.actionLink}
                    className="w-full text-center py-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 text-xs font-semibold text-sky-100 hover:text-white transition-all font-sans cursor-pointer"
                  >
                    {card.actionText}
                  </a>
                ) : (
                  <a
                    href={card.actionLink}
                    className="w-full text-center py-2.5 rounded-xl bg-white/[0.03] hover:bg-saffron/10 border border-white/5 hover:border-saffron/20 text-xs font-semibold text-sky-100 hover:text-saffron transition-all font-sans cursor-pointer"
                  >
                    {card.actionText}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Official Contact Directory Dashboard */}
        <section className="relative z-10 max-w-4xl mx-auto mb-10">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-200/70 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron" /> Official Contact Directory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DIRECTORY_CHANNELS.map((item, idx) => (
              <div
                key={idx}
                className="glass p-5 rounded-2xl border border-white/[0.04] bg-sky-950/10 hover:border-saffron/20 transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-xl group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
                      {item.dept}
                    </h3>
                    <p className="text-xs text-sky-200/50 leading-relaxed font-sans mb-3">
                      {item.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.02]">
                  <a
                    href={`mailto:${item.email}`}
                    className="text-xs font-mono font-bold text-saffron hover:text-gold hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Mail size={12} /> {item.email}
                  </a>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(item.email);
                        setCopiedEmail(item.email);
                        setTimeout(() => setCopiedEmail(null), 2000);
                      } catch (err) {
                        console.warn('[Support] Clipboard copy failed:', err);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-sky-200/30 hover:text-white transition-colors cursor-pointer"
                    title="Copy Email Address"
                  >
                    {copiedEmail === item.email ? (
                      <Check size={14} className="text-emerald-400 font-bold" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-xs text-sky-200/70 font-sans">
            For institutional queries or official business correspondence, please email{" "}
            <a href="mailto:contact@aerosky.ai" className="text-saffron hover:text-gold hover:underline font-mono font-bold">
              contact@aerosky.ai
            </a>
            .
          </div>
        </section>

        {/* FAQs Accordion Section */}
        {faqs.length > 0 && (
          <section className="mb-10 relative z-10">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-200/70 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" /> Frequently Asked Questions
            </h2>
            
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-10 glass rounded-2xl border border-white/5 bg-white/[0.01]">
                <p className="text-xs text-sky-200/70 font-mono">No matching FAQs found for "{searchQuery}".</p>
              </div>
            ) : (
              <div className="space-y-3 max-w-4xl mx-auto">
                {filteredFaqs.map((faq) => {
                  const isOpen = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="glass rounded-xl border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-300 hover:border-white/10"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center gap-4 text-white hover:text-saffron transition-colors cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm font-semibold tracking-tight leading-snug">
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-saffron' : 'text-sky-200/35'
                          }`}
                        />
                      </button>
                      
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isOpen
                            ? 'max-h-96 opacity-100 border-t border-white/[0.02] px-6 pb-5 pt-4 bg-white/[0.005]'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-xs sm:text-sm text-sky-200/70 leading-relaxed font-sans">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Support;
