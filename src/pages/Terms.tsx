import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Info, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { getPage } from '../services/strapi';
import { StrapiPage } from '../types/strapi';
import Markdown from '../components/Markdown';

interface HeadingItem {
  text: string;
  id: string;
}

const Terms: React.FC = () => {
  const [page, setPage] = useState<StrapiPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    async function loadPage() {
      try {
        const data = await getPage('terms');
        setPage(data);
        
        if (data && data.content) {
          // Parse ## headings
          const lines = data.content.split('\n');
          const foundHeadings: HeadingItem[] = [];
          lines.forEach(line => {
            if (line.startsWith('## ')) {
              const text = line.replace('## ', '').trim();
              const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');
              const id = cleanText
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
              foundHeadings.push({ text, id });
            }
          });
          setHeadings(foundHeadings);
          if (foundHeadings.length > 0) {
            setActiveId(foundHeadings[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load terms page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, []);

  // Scrollspy effect
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Offset for navbar and headers
      
      let currentId = headings[0].id;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentId = heading.id;
        } else if (el) {
          break; // Headings are sorted by offsetTop, so we can stop
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100; // offset for nav
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (loading) {
    return (
      <div className="relative pt-32 pb-24 px-4 sm:px-6 md:px-12 lg:px-24 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 animate-pulse">
        <div className="lg:col-span-1 space-y-6">
          <div className="h-6 w-32 bg-white/5 rounded" />
          <div className="h-10 w-48 bg-white/5 rounded" />
          <div className="h-32 bg-white/5 rounded-2xl" />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="h-96 bg-white/5 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="relative pt-32 pb-24 px-4 sm:px-6 md:px-12 lg:px-24 text-center">
        <SEO title="Terms of Service | AeroSky" description="AeroSky Terms of Service" />
        <div className="text-sky-200/50 text-sm">Terms of Service is currently unavailable.</div>
      </div>
    );
  }

  const TAKEAWAYS = [
    { text: "Community Collaboration: Help build a reliable airspace tracking network." },
    { text: "Fair Use API: Access data fairly without DDoS or scraping abuse." },
    { text: "Hardware Ownership: AeroCaptains own their receiver kits (except project-sponsored hardware)." },
    { text: "Safety Compliance: Ground stations must comply with local RF and electrical regulations." }
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-20 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-sky-500/[0.015] rounded-full blur-[100px]" />
      </div>

      <SEO
        title={page.seoTitle || `${page.title} | AeroSky`}
        description={page.seoDescription || "AeroSky Terms of Service"}
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
        {/* Breadcrumb / Category Row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/[0.04] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
            <FileText size={12} /> Legal Guidelines
          </span>
          <span className="text-[10px] font-mono text-sky-200/30 uppercase tracking-widest">
            Document ID: ASK-POL-TERM
          </span>
          <span className="text-[10px] font-mono text-sky-200/30">|</span>
          <span className="text-[10px] font-mono text-sky-200/30 uppercase tracking-widest">
            v1.2
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* Left Column - Sticky Sidebar */}
          <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                {page.title}
              </h1>
              <div className="flex items-center gap-2 text-xs font-mono text-sky-200/70">
                <Calendar size={12} />
                <span>Effective: June 2026</span>
              </div>
            </div>

            {/* Dynamic TOC */}
            {headings.length > 0 && (
              <div className="space-y-3 hidden lg:block">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-200/70">
                  On this page
                </h3>
                <nav className="flex flex-col gap-2 border-l border-white/5 pl-3">
                  {headings.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => scrollToSection(h.id)}
                      className={`text-left text-xs font-medium transition-all py-0.5 leading-snug cursor-pointer ${
                        activeId === h.id
                          ? 'text-amber-400 translate-x-1 font-semibold'
                          : 'text-sky-200/50 hover:text-sky-200'
                      }`}
                    >
                      {h.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="glass p-5 rounded-2xl border border-white/[0.05] bg-white/[0.01]">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                <Info size={14} className="text-amber-400" /> Key Takeaways
              </h3>
              <ul className="space-y-3 text-[11px] text-sky-200/60 leading-relaxed font-sans">
                {TAKEAWAYS.map((t, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <CheckCircle2 size={12} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>{t.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Column - Main Content */}
          <main className="lg:col-span-3">
            <div className="glass rounded-3xl p-6 sm:p-10 border border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.2)] bg-sky-950/20 backdrop-blur-md">
              <Markdown content={page.content} />
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs font-mono text-sky-200/30">
                AeroLytics Legal & compliance services. All rights reserved.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Terms;
