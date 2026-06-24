import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen, Clock, ArrowRight, Rss, Shield, Landmark, Radio, Award,
  GraduationCap, FileText, ArrowLeft, Twitter, Linkedin, MessageSquare, Copy, Check, Search, Calendar
} from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';
import { getArticles, getArticle, formatImageUrl } from '../services/strapi';
import { StrapiArticle } from '../types/strapi';
import { Markdown } from '../components/Markdown';

const CATEGORIES = [
  { icon: <GraduationCap size={16} />, name: 'Aviation Tutorials', slug: 'tutorials' },
  { icon: <Landmark size={16} />, name: 'Airport Intelligence', slug: 'airport-intelligence' },
  { icon: <FileText size={16} />, name: 'India Airspace Reports', slug: 'reports' },
  { icon: <Radio size={16} />, name: 'AeroCaptain Log', slug: 'aerocaptains' },
  { icon: <Rss size={16} />, name: 'Community & Spotting', slug: 'community' },
  { icon: <Award size={16} />, name: 'Aviation Science', slug: 'aviation' }
];

function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // strip links
    .replace(/[*_~`#\-+>|]/g, ' ')            // strip markdown formatting
    .replace(/\s+/g, ' ')                     // collapse spaces
    .trim();
}

// Simple helper to calculate reading time
function calculateReadingTime(text: string): string {
  if (!text) return '1 min';
  const cleanText = stripMarkdown(text);
  const words = cleanText.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

const Insights: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [articles, setArticles] = useState<StrapiArticle[]>([]);
  const [activeArticle, setActiveArticle] = useState<StrapiArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headings, setHeadings] = useState<{ text: string; id: string }[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState('');

  // Dynamically extract categories from articles to align filters with CMS slugs,
  // but map them to our designed brand icons where possible
  const dynamicCategories = React.useMemo(() => {
    const catsMap = new Map();
    articles.forEach(art => {
      if (art.category && art.category.slug && art.category.name) {
        catsMap.set(art.category.slug, art.category.name);
      }
    });
    return Array.from(catsMap.entries()).map(([slug, name]) => {
      const match = CATEGORIES.find(c => c.slug === slug);
      return {
        name,
        slug,
        icon: match ? match.icon : <FileText size={16} />
      };
    });
  }, [articles]);

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

  // Table of Contents dynamic parser
  useEffect(() => {
    if (activeArticle && activeArticle.content) {
      const lines = activeArticle.content.split('\n');
      const foundHeadings: { text: string; id: string }[] = [];
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
        setActiveHeadingId(foundHeadings[0].id);
      }
    } else {
      setHeadings([]);
    }
  }, [activeArticle]);

  // Detail view scroll spy and progress bar
  useEffect(() => {
    if (!slug || !activeArticle) return;

    const handleScroll = () => {
      // 1. Reading Progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // 2. Scrollspy active header
      if (headings.length === 0) return;
      const scrollPosition = window.scrollY + 140;
      let currentId = headings[0].id;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentId = heading.id;
        } else if (el) {
          break;
        }
      }
      setActiveHeadingId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug, activeArticle, headings]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveHeadingId(id);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    const newCat = selectedCategory === categorySlug ? 'all' : categorySlug;
    setSelectedCategory(newCat);
    trackEvent('insights_category_explored', { categorySlug: newCat });
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

  const getArticleCategoryInfo = (post: StrapiArticle) => {
    if (post.category && post.category.slug) {
      return CATEGORIES.find(c => c.slug === post.category.slug) || null;
    }
    return null;
  };

  // Filter logic
  const filteredArticles = articles.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      (post.category && post.category.slug === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Featured Article is chosen from list only when no search/category filter is active
  const isDefaultView = searchQuery === '' && selectedCategory === 'all';
  const featuredArticle = isDefaultView
    ? articles.find((a) => a.featured === true) || articles[0]
    : null;

  const displayedListArticles = featuredArticle
    ? filteredArticles.filter((a) => a.id !== featuredArticle.id)
    : filteredArticles;

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

  // Related articles (matching same category, excluding active)
  const getRelatedArticles = () => {
    if (!activeArticle) return [];
    let related = articles.filter(
      a => a.id !== activeArticle.id &&
      activeArticle.category &&
      a.category &&
      a.category.slug === activeArticle.category.slug
    );
    if (related.length === 0) {
      // fallback to any other articles
      related = articles.filter(a => a.id !== activeArticle.id);
    }
    return related.slice(0, 2);
  };

  const related = getRelatedArticles();

  // Loading Skeletons
  if (loading) {
    return (
      <div className="relative pt-32 pb-24 px-4 sm:px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
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

    const activeCatInfo = getArticleCategoryInfo(activeArticle);

    return (
      <div className="relative pt-28 pb-20 overflow-hidden min-h-screen">
        {/* Reading Progress Line */}
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-saffron to-gold z-50 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Background Radial Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-saffron/[0.015] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-sky-500/[0.01] rounded-full blur-[100px]" />
        </div>

        <SEO
          title={`${activeArticle.seoTitle || activeArticle.title} | AeroSky Insights`}
          description={activeArticle.seoDescription || activeArticle.excerpt}
          ogUrl={`https://aerosky.ai/insights/${activeArticle.slug}`}
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
              logo: { '@type': 'ImageObject', url: 'https://aerosky.ai/assets/logo.png' }
            },
            mainEntityOfPage: `https://aerosky.ai/insights/${activeArticle.slug}`
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          {/* Back Link */}
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-sky-200/50 hover:text-saffron transition-colors uppercase tracking-wider mb-8"
          >
            <ArrowLeft size={12} /> Back to Insights Hub
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
            {/* Left Column (Sticky Sidebar) */}
            <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-28 hidden lg:block">
              {/* Active Header TOC */}
              {headings.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-200/70">
                    Syllabus Section
                  </h3>
                  <nav className="flex flex-col gap-2 border-l border-white/5 pl-3">
                    {headings.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => scrollToSection(h.id)}
                        className={`text-left text-xs font-medium transition-all py-0.5 leading-snug cursor-pointer ${
                          activeHeadingId === h.id
                            ? 'text-saffron translate-x-1 font-semibold'
                            : 'text-sky-200/50 hover:text-sky-200'
                        }`}
                      >
                        {h.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Float Share widgets */}
              <div className="space-y-3 border-t border-white/5 pt-6">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-200/70 mb-2">
                  Share Log Entry
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sky-200/70">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activeArticle.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleShareClick('twitter')}
                    className="hover:text-saffron transition-colors p-2 bg-white/[0.02] border border-white/5 rounded-xl hover:scale-105"
                    title="Share on X"
                  >
                    <Twitter size={14} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleShareClick('linkedin')}
                    className="hover:text-saffron transition-colors p-2 bg-white/[0.02] border border-white/5 rounded-xl hover:scale-105"
                    title="Share on LinkedIn"
                  >
                    <Linkedin size={14} />
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(activeArticle.title + ' ' + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleShareClick('whatsapp')}
                    className="hover:text-saffron transition-colors p-2 bg-white/[0.02] border border-white/5 rounded-xl hover:scale-105"
                    title="Share on WhatsApp"
                  >
                    <MessageSquare size={14} />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="hover:text-saffron transition-colors p-2 bg-white/[0.02] border border-white/5 rounded-xl hover:scale-105 relative cursor-pointer"
                    title="Copy Article Link"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </aside>

            {/* Right Column (Article content) */}
            <main className="lg:col-span-3 space-y-10">
              {/* Article Header info */}
              <header className="space-y-4">
                <div className="flex items-center gap-2">
                  {activeCatInfo ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-saffron/10 text-[9px] font-mono font-bold text-saffron uppercase tracking-widest">
                      {activeCatInfo.icon} {activeCatInfo.name}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                      Insight
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-sky-200/30">|</span>
                  <span className="text-[10px] font-mono text-sky-200/70 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={11} /> {readTime} read
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] font-sans">
                  {activeArticle.title}
                </h1>
                <div className="flex items-center gap-2.5 text-xs font-mono text-sky-200/70 border-b border-white/5 pb-6">
                  <Calendar size={12} />
                  <span>Published {dateFormatted}</span>
                </div>
              </header>

              {/* Featured Banner Image */}
              {activeArticle.featuredImage && (
                <div className="w-full h-56 sm:h-80 rounded-3xl overflow-hidden border border-white/[0.05] relative bg-white/[0.01]">
                  <img
                    src={formatImageUrl(activeArticle.featuredImage) || ''}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 to-transparent" />
                </div>
              )}

              {/* Main Content Box */}
              <article className="glass rounded-3xl p-6 sm:p-10 border border-white/[0.05] bg-sky-950/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <Markdown content={activeArticle.content} />
              </article>

              {/* Mobile Share Controls */}
              <div className="lg:hidden border-t border-white/5 pt-6 flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-200/70">
                  Share Log Entry
                </span>
                <div className="flex items-center gap-3 text-sky-200/70">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activeArticle.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-saffron p-2.5 bg-white/[0.02] border border-white/5 rounded-xl"
                  >
                    <Twitter size={14} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-saffron p-2.5 bg-white/[0.02] border border-white/5 rounded-xl"
                  >
                    <Linkedin size={14} />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="hover:text-saffron p-2.5 bg-white/[0.02] border border-white/5 rounded-xl relative cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Navigation prev/next */}
              {(prev || next) && (
                <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-5">
                  {prev ? (
                    <Link
                      to={`/insights/${prev.slug}`}
                      className="glass p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-saffron/20 transition-all text-left flex flex-col justify-between group"
                    >
                      <span className="text-[9px] font-mono text-sky-200/30 uppercase tracking-widest mb-2 flex items-center gap-1 font-bold">
                        <ArrowLeft size={10} /> Previous Entry
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-saffron transition-colors line-clamp-2 leading-snug">
                        {prev.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {next ? (
                    <Link
                      to={`/insights/${next.slug}`}
                      className="glass p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-saffron/20 transition-all text-right flex flex-col justify-between items-end group"
                    >
                      <span className="text-[9px] font-mono text-sky-200/30 uppercase tracking-widest mb-2 flex items-center gap-1 font-bold">
                        Next Entry <ArrowRight size={10} />
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-saffron transition-colors line-clamp-2 leading-snug">
                        {next.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              )}

              {/* Related / Next Up Section */}
              {related.length > 0 && (
                <div className="pt-10 border-t border-white/5 space-y-5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-200/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron" /> Related Reading Logs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {related.map((post) => {
                      const postCat = getArticleCategoryInfo(post);
                      return (
                        <article
                          key={post.slug}
                          className="glass rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-saffron/20 transition-all duration-300 p-5 group flex flex-col justify-between"
                        >
                          <div>
                            {postCat && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-saffron/5 text-[9px] font-mono font-bold text-saffron uppercase tracking-wide mb-3 w-fit">
                                {postCat.name}
                              </span>
                            )}
                            <h4 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-saffron transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-xs text-sky-200/70 line-clamp-2 leading-relaxed mb-4">
                              {post.excerpt}
                            </p>
                          </div>
                          <Link
                            to={`/insights/${post.slug}`}
                            className="text-[10px] font-mono font-bold text-saffron hover:text-gold uppercase tracking-wider flex items-center gap-1 w-fit mt-auto"
                          >
                            Read Log <ArrowRight size={10} />
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }

  // 2. Hub Directory View
  const isEmpty = articles.length === 0;

  return (
    <div className="relative pt-16 min-h-screen overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-saffron/[0.015] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[400px] bg-sky-500/[0.015] rounded-full blur-[100px]" />
      </div>

      <SEO
        title="AeroSky Insights & Academy | Aviation Intelligence"
        description="Independent airspace tutorials, flight tracking decoder hardware reports, and operations analytics."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.ai/' },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://aerosky.ai/insights' }
          ]
        }}
      />

      {/* Hero Header */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 text-center z-10">
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
          <p className="text-sm sm:text-base text-sky-200/70 max-w-2xl mx-auto leading-relaxed mb-8">
            Independent aviation reports, RF decoder tutorials, and receiver hardware setup walkthroughs for Indian skies.
          </p>

          {/* Search bar */}
          {!isEmpty && (
            <div className="max-w-md mx-auto relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-saffron/20 to-gold/20 rounded-2xl blur opacity-30 group-focus-within:opacity-70 transition-opacity" />
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search articles and tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-sky-950/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-white placeholder-sky-200/40 focus:outline-none focus:border-saffron/50 transition-all font-sans"
                />
                <Search className="absolute left-4 text-sky-200/70 group-focus-within:text-saffron transition-colors" size={16} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Grid Layout */}
      <section className="section-std !py-4 !pb-24 max-w-6xl mx-auto relative z-10">
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
              
              {/* Featured Pinned Post Card (Hidden when search or category filter is active) */}
              {featuredArticle && (
                <div className="space-y-4">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-200/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Pinned Feature
                  </h2>
                  <article className="glass rounded-3xl overflow-hidden border border-white/[0.05] hover:border-saffron/20 transition-all duration-300 group flex flex-col md:flex-row h-auto md:h-64">
                    {featuredArticle.featuredImage && (
                      <div className="w-full md:w-2/5 h-48 md:h-full shrink-0 relative bg-white/[0.01]">
                        <img
                          src={formatImageUrl(featuredArticle.featuredImage) || ''}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[9px] font-mono font-bold text-saffron uppercase tracking-wider bg-saffron/10 px-2.5 py-0.5 rounded">
                            Featured
                          </span>
                          {getArticleCategoryInfo(featuredArticle) && (
                            <span className="text-[9px] font-mono font-bold text-sky-200/50 uppercase tracking-wider bg-white/5 px-2.5 py-0.5 rounded">
                              {getArticleCategoryInfo(featuredArticle)?.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-saffron transition-colors leading-snug">
                          {featuredArticle.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-sky-200/50 leading-relaxed mb-4 line-clamp-3">
                          {featuredArticle.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="flex items-center gap-1 text-[10px] font-mono text-sky-200/70">
                          <Clock size={11} /> {calculateReadingTime(featuredArticle.content)}
                        </span>
                        <Link
                          to={`/insights/${featuredArticle.slug}`}
                          onClick={() => handleArticleClick(featuredArticle.title, 'Featured')}
                          className="text-[10px] font-mono font-bold text-saffron hover:text-gold uppercase tracking-widest flex items-center gap-1"
                        >
                          Read Feature <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Grid List for remaining posts */}
              <div className="space-y-4 pt-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-200/70 flex items-center gap-1.5">
                  <FileText size={12} className="text-saffron" />{' '}
                  {isDefaultView ? 'Latest Insights' : `Search Results (${filteredArticles.length})`}
                </h2>
                
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-12 glass rounded-2xl border border-white/5 bg-white/[0.01]">
                    <p className="text-xs text-sky-200/70 font-mono">No entries found matching filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {displayedListArticles.map((post) => {
                      const catInfo = getArticleCategoryInfo(post);
                      return (
                        <article
                          key={post.slug}
                          className="glass rounded-2xl overflow-hidden border border-white/[0.04] hover:border-saffron/20 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group shadow-sm"
                        >
                          {post.featuredImage && (
                            <div className="w-full h-40 relative overflow-hidden bg-white/[0.01]">
                              <img
                                src={formatImageUrl(post.featuredImage) || ''}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                              {catInfo && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-saffron/5 border border-saffron/10 text-[9px] font-mono font-bold text-saffron uppercase tracking-widest mb-3 w-fit">
                                  {catInfo.icon} {catInfo.name}
                                </span>
                              )}
                              <h3 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-saffron transition-colors leading-snug font-sans">
                                {post.title}
                              </h3>
                              <p className="text-xs text-sky-200/50 leading-relaxed mb-4 line-clamp-3">
                                {post.excerpt}
                              </p>
                            </div>

                            <div className="border-t border-white/5 pt-3 flex items-center justify-between mt-auto">
                              <span className="flex items-center gap-1 text-[10px] font-mono text-sky-200/70">
                                <Clock size={11} /> {calculateReadingTime(post.content)}
                              </span>
                              <Link
                                to={`/insights/${post.slug}`}
                                onClick={() => handleArticleClick(post.title, 'Latest')}
                                className="text-[10px] font-mono font-bold text-saffron hover:text-gold uppercase tracking-widest flex items-center gap-1"
                              >
                                Read Article <ArrowRight size={10} />
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Dynamic category syllabus sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award size={18} className="text-saffron" /> Hub Syllabus
              </h2>
              <div className="flex flex-col gap-2.5">
                <div
                  onClick={() => setSelectedCategory('all')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group ${
                    selectedCategory === 'all'
                      ? 'bg-saffron/10 border-saffron/30 text-white'
                      : 'bg-white/[0.01] border-white/[0.04] text-sky-200/60 hover:border-saffron/15 hover:text-white'
                  }`}
                >
                  <BookOpen size={16} className={selectedCategory === 'all' ? 'text-saffron' : ''} />
                  <span className="text-xs font-semibold">All Categories</span>
                </div>
                {dynamicCategories.map((c) => {
                  const isSelected = selectedCategory === c.slug;
                  return (
                    <div
                      key={c.name}
                      onClick={() => handleCategoryClick(c.slug)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group ${
                        isSelected
                          ? 'bg-saffron/10 border-saffron/30 text-white'
                          : 'bg-white/[0.01] border-white/[0.04] text-sky-200/60 hover:border-saffron/15 hover:text-white'
                      }`}
                    >
                      <div className={`transition-colors shrink-0 ${isSelected ? 'text-saffron' : 'text-sky-200/70 group-hover:text-saffron'}`}>
                        {c.icon}
                      </div>
                      <span className="text-xs font-semibold">
                        {c.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Insights;
