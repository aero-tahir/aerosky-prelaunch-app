import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Radio } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';
import { getPage } from '../services/strapi';
import { StrapiPage } from '../types/strapi';
import Markdown from '../components/Markdown';

const INDIA_ORANGE = '#FF9933';

const About: React.FC = () => {
  const [page, setPage] = useState<StrapiPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      try {
        const data = await getPage('about');
        setPage(data);
      } catch (err) {
        console.error('Failed to load about page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, []);

  if (loading) {
    return (
      <div className="relative pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded mx-auto" />
        <div className="h-64 bg-white/5 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="relative pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 text-center">
        <SEO title="About Us | AeroSky" description="AeroSky airspace intelligence network" />
        <div className="text-sky-200/50 text-sm">About page is currently unavailable.</div>
      </div>
    );
  }

  return (
    <div className="relative pt-16">
      <SEO
        title={page.seoTitle || `${page.title} | AeroSky`}
        description={page.seoDescription || "AeroSky sovereign airspace intelligence network"}
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.in/' },
            { '@type': 'ListItem', position: 2, name: page.title, item: `https://aerosky.in/${page.slug}` }
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
            <span className="text-white">{page.title}</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-4 px-4 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12 border border-white/[0.05]">
            <Markdown content={page.content} />
            
            {/* Action buttons at the bottom of dynamic about content */}
            <div className="border-t border-white/5 pt-8 mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </section>
    </div>
  );
};

export default About;
