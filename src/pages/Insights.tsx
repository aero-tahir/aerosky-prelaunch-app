import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen, Clock, ArrowRight, Rss, Shield, Landmark, Radio, Award,
  GraduationCap, FileText, ArrowLeft, Twitter, Linkedin, MessageSquare, Copy, Check
} from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';
import { getArticles, getArticle, formatImageUrl } from '../services/strapi';
import { StrapiArticle } from '../types/strapi';
import { Markdown } from '../components/Markdown';

const INDIA_ORANGE = '#FF9933';

const CATEGORIES = [
  { icon: <GraduationCap size={20} />, name: 'Aviation Tutorials', slug: 'tutorials' },
  { icon: <Landmark size={20} />, name: 'Airport Intelligence', slug: 'airport-intelligence' },
  { icon: <FileText size={20} />, name: 'India Airspace Reports', slug: 'reports' },
  { icon: <Radio size={20} />, name: 'AeroCaptain Log', slug: 'aerocaptains' },
  { icon: <Rss size={20} />, name: 'Community & Spotting', slug: 'community' },
  { icon: <Award size={20} />, name: 'Aviation Science', slug: 'aviation' }
];

// Simple helper to calculate reading time
function calculateReadingTime(text: string): string {
  if (!text) return '1 min';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

const Insights: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [articles, setArticles] = useState<StrapiArticle[]>([]);
  const [activeArticle, setActiveArticle] = useState<StrapiArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const list = await getArticles();
        setArticles(list);

        if (slug) {
          const detail = await getArticle(slug);
          setActiveArticle(detail);
        } else {
          setActiveArticle(null);
        }
      } catch (err) {
        console.error('[Insights] Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleCategoryClick = (category: string) => {
    trackEvent('insights_category_explored', { categoryName: category });
  };

  const handleArticleClick = (title: string, category: string) => {
    trackEvent('insights_article_viewed', { articleTitle: title, articleCategory: category });
  };

  const handleShareClick = (platform: string) => {
    trackEvent('insights_share_clicked', { platform, articleTitle: activeArticle?.title });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    handleShareClick('copy_link');
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine prev/next navigation pointers
  const getPrevNext = () => {
    if (!activeArticle || articles.length === 0) return { prev: null, next: null };
    const currentIndex = articles.findIndex(a => a.slug === activeArticle.slug);
    if (currentIndex === -1) return { prev: null, next: null };
    return {
      prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
      next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null
    };
  };

  const { prev, next } = getPrevNext();

  // Loading Skeletons
  if (loading) {
    return (
      <div className="relative pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-48 bg-white/5 rounded-lg mx-auto" />
          <div className="h-6 w-96 bg-white/5 rounded-lg mx-auto" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="h-64 bg-white/5 rounded-3xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="h-48 bg-white/5 rounded-2xl" />
                <div className="h-48 bg-white/5 rounded-2xl" />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-4">
              <div className="h-8 w-24 bg-white/5 rounded" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 bg-white/5 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 1. Single Article Reader View
  if (slug && activeArticle) {
    const readTime = calculateReadingTime(activeArticle.content);
    const dateFormatted = activeArticle.publishedDate
      ? new Date(activeArticle.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'Recently';

    return (
      <div className="relative pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24">
        <SEO
          title={`${activeArticle.seoTitle || activeArticle.title} | AeroSky Insights`}
          description={activeArticle.seoDescription || activeArticle.excerpt}
          ogUrl={`https://aerosky.in/insights/${activeArticle.slug}`}
          ogImage={formatImageUrl(activeArticle.featuredImage) || undefined}
        />
        <Schema
          type="Article"
          data={{
            headline: activeArticle.title,
            description: activeArticle.excerpt || '',
            datePublished: activeArticle.publishedDate || new Date().toISOString(),
            author: { '@type': 'Organization', name: 'AeroSky' },
            publisher: {
              '@type': 'Organization',
              name: 'AeroSky',
              logo: { '@type': 'ImageObject', url: 'https://aerosky.in/assets/logo.png' }
            },
            mainEntityOfPage: `https://aerosky.in/insights/${activeArticle.slug}`
          }}
        />

        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-sky-200/50 hover:text-amber-400 transition-colors uppercase tracking-wider mb-8"
          >
            <ArrowLeft size={12} /> Back to Insights Hub
          </Link>

          {/* Article Header */}
          <header className="mb-8 border-b border-white/5 pb-6">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded mb-4 inline-block">
              Insight
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
              {activeArticle.title}
            </h1>
            <div className="flex items-center justify-between text-xs font-mono text-sky-200/40">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Clock size={12} /> {readTime}</span>
                <span>•</span>
                <span>{dateFormatted}</span>
              </div>

              {/* Share Controls */}
              <div className="flex items-center gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activeArticle.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleShareClick('twitter')}
                  className="hover:text-amber-400 transition-colors p-1"
                  title="Share on X"
                >
                  <Twitter size={14} />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleShareClick('linkedin')}
                  className="hover:text-amber-400 transition-colors p-1"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={14} />
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(activeArticle.title + ' ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleShareClick('whatsapp')}
                  className="hover:text-amber-400 transition-colors p-1"
                  title="Share on WhatsApp"
                >
                  <MessageSquare size={14} />
                </a>
                <button
                  onClick={handleCopyLink}
                  className="hover:text-amber-400 transition-colors p-1 relative"
                  title="Copy Article Link"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </header>

          {/* Article Banner image */}
          {activeArticle.featuredImage && (
            <div className="w-full h-48 sm:h-72 rounded-3xl overflow-hidden mb-8 border border-white/5 relative bg-white/[0.01]">
              <img
                src={formatImageUrl(activeArticle.featuredImage) || ''}
                alt={activeArticle.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Render Rich Text Content */}
          <article className="glass rounded-3xl p-6 sm:p-10 border border-white/[0.04]">
            <Markdown content={activeArticle.content} />
          </article>

          {/* Next/Prev Navigation */}
          {(prev || next) && (
            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              {prev ? (
                <Link
                  to={`/insights/${prev.slug}`}
                  className="glass p-4 rounded-2xl border border-white/5 hover:border-amber-500/25 transition-all text-left flex flex-col justify-between group"
                >
                  <span className="text-[10px] font-mono text-sky-200/30 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <ArrowLeft size={10} /> Previous
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  to={`/insights/${next.slug}`}
                  className="glass p-4 rounded-2xl border border-white/5 hover:border-amber-500/25 transition-all text-right flex flex-col justify-between items-end group"
                >
                  <span className="text-[10px] font-mono text-sky-200/30 uppercase tracking-widest mb-2 flex items-center gap-1">
                    Next <ArrowRight size={10} />
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Hub Directory View
  const featuredArticle = articles.find(a => a.featured === true) || articles[0];
  const regularArticles = featuredArticle
    ? articles.filter(a => a.id !== featuredArticle.id)
    : articles;

  // Empty state handling
  const isEmpty = articles.length === 0;

  return (
    <div className="relative pt-16">
      <SEO
        title="AeroSky Insights & Academy | Aviation Intelligence"
        description="Sovereign airspace tutorials, flight tracking decoder hardware reports, and operations analytics."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.in/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://aerosky.in/insights' }
          ]
        }}
      />

      {/* Hero Header */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-saffron/30 bg-saffron/[0.08] text-saffron text-xs font-mono font-bold tracking-wider uppercase mb-6 animate-pulse-glow"
          >
            <BookOpen size={14} /> AeroSky Insights & Academy
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Insights &{' '}
            <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Academy</span>
          </h1>
          <p className="text-sm sm:text-base text-sky-200/70 max-w-2xl mx-auto leading-relaxed">
            Sovereign aviation reports, RF decoder tutorials, and receiver hardware setup walkthroughs for Indian skies.
          </p>
        </div>
      </section>

      {/* Main Grid Layout */}
      <section className="section-std !py-8 !pb-24 max-w-6xl mx-auto">
        {isEmpty ? (
          <div className="text-center py-20 glass rounded-3xl border border-white/5">
            <BookOpen className="mx-auto text-sky-200/20 mb-4 animate-pulse" size={48} />
            <h3 className="text-lg font-bold text-white mb-2">No Insights Published Yet</h3>
            <p className="text-xs text-sky-200/50 max-w-xs mx-auto">
              Our pre-launch aviation guides are being initialized in Strapi. Please run the seeder script or check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column: Pinned Featured Card + Grid List */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Featured Pinned Post Card */}
              {featuredArticle && (
                <div className="space-y-4">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-200/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Pinned Feature
                  </h2>
                  <article className="glass rounded-3xl overflow-hidden border border-white/[0.05] hover:border-amber-500/20 transition-all duration-300 group flex flex-col md:flex-row h-auto md:h-64">
                    {featuredArticle.featuredImage && (
                      <div className="w-full md:w-2/5 h-48 md:h-full shrink-0 relative bg-white/[0.01]">
                        <img
                          src={formatImageUrl(featuredArticle.featuredImage) || ''}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded mb-3 inline-block">
                          Featured
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors leading-snug">
                          {featuredArticle.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-sky-200/50 leading-relaxed mb-4 line-clamp-3">
                          {featuredArticle.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="flex items-center gap-1 text-[10px] font-mono text-sky-200/40">
                          <Clock size={11} /> {calculateReadingTime(featuredArticle.content)}
                        </span>
                        <Link
                          to={`/insights/${featuredArticle.slug}`}
                          onClick={() => handleArticleClick(featuredArticle.title, 'Featured')}
                          className="text-[10px] font-mono font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest flex items-center gap-1"
                        >
                          Read Feature <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Grid List for remaining posts */}
              {regularArticles.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-200/40 flex items-center gap-1.5">
                    <FileText size={12} className="text-amber-500" /> Latest Insights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {regularArticles.map((post) => (
                      <article
                        key={post.slug}
                        className="glass rounded-2xl overflow-hidden border border-white/[0.04] hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                      >
                        {post.featuredImage && (
                          <div className="w-full h-36 relative overflow-hidden bg-white/[0.01]">
                            <img
                              src={formatImageUrl(post.featuredImage) || ''}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-xs text-sky-200/50 leading-relaxed mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="border-t border-white/5 pt-3 flex items-center justify-between mt-auto">
                            <span className="flex items-center gap-1 text-[10px] font-mono text-sky-200/40">
                              <Clock size={11} /> {calculateReadingTime(post.content)}
                            </span>
                            <Link
                              to={`/insights/${post.slug}`}
                              onClick={() => handleArticleClick(post.title, 'Latest')}
                              className="text-[10px] font-mono font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest flex items-center gap-1"
                            >
                              Read Article <ArrowRight size={10} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Decorative category syllabus sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-amber-500" /> Hub Syllabus
              </h2>
              <div className="flex flex-col gap-2.5">
                {CATEGORIES.map((c) => (
                  <div
                    key={c.name}
                    onClick={() => handleCategoryClick(c.name)}
                    className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-amber-500/15 transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="text-sky-200/40 group-hover:text-amber-400 transition-colors shrink-0">
                      {c.icon}
                    </div>
                    <span className="text-xs font-semibold text-sky-100/90 group-hover:text-white transition-colors">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Insights;
