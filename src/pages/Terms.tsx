import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { getPage } from '../services/strapi';
import { StrapiPage } from '../types/strapi';
import Markdown from '../components/Markdown';

const Terms: React.FC = () => {
  const [page, setPage] = useState<StrapiPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      try {
        const data = await getPage('terms');
        setPage(data);
      } catch (err) {
        console.error('Failed to load terms page:', err);
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
        <div className="h-64 bg-white/5 rounded-3xl" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="relative pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 text-center">
        <SEO title="Terms of Service | AeroSky" description="AeroSky Terms of Service" />
        <div className="text-sky-200/50 text-sm">Terms of Service is currently unavailable.</div>
      </div>
    );
  }

  return (
    <div className="relative pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <SEO
        title={page.seoTitle || `${page.title} | AeroSky`}
        description={page.seoDescription || "AeroSky Terms of Service"}
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

      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/[0.04] text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-4">
            <FileText size={12} /> Legal Guidelines
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            {page.title}
          </h1>
        </header>

        <div className="glass rounded-3xl p-6 sm:p-10 border border-white/[0.05]">
          <Markdown content={page.content} />
        </div>
      </div>
    </div>
  );
};

export default Terms;
