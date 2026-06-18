import React from 'react';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { trackEvent } from '../utils/analytics';

const INDIA_ORANGE = '#FF9933';

const POSTS = [
  {
    title: 'Why Flights Circle Mumbai During Monsoon',
    excerpt: 'Understanding holding patterns, weather diversions, and how ADS-B data reveals monsoon impact on Indian aviation.',
    category: 'Aviation Science',
    readTime: '5 min',
    date: 'Coming Soon',
    slug: 'mumbai-monsoon-flights'
  },
  {
    title: 'What is ADS-B? A Beginner\'s Guide',
    excerpt: 'Automatic Dependent Surveillance-Broadcast explained. Learn how aircraft broadcast their position and why it matters.',
    category: 'Technology',
    readTime: '4 min',
    date: 'Coming Soon',
    slug: 'what-is-adsb-guide'
  },
  {
    title: 'How MLAT Works: Multilateration Explained',
    excerpt: 'When ADS-B isn\'t enough. Learn how multiple receivers triangulate aircraft positions using time-difference-of-arrival.',
    category: 'Technology',
    readTime: '6 min',
    date: 'Coming Soon',
    slug: 'how-mlat-multilateration-works'
  },
  {
    title: 'Indian Airport Congestion: A Data Story',
    excerpt: 'Analyzing delay patterns at DEL, BOM, and BLR using community-sourced ADS-B data and DGCA statistics.',
    category: 'Analysis',
    readTime: '7 min',
    date: 'Coming Soon',
    slug: 'indian-airport-congestion-data'
  },
  {
    title: 'Behind AeroSky: Building India\'s Aviation Network',
    excerpt: 'The story of why we started AeroSky and India\'s need for sovereign, community-powered airspace intelligence.',
    category: 'Company',
    readTime: '5 min',
    date: 'Coming Soon',
    slug: 'behind-aerosky-indian-network'
  },
  {
    title: 'Setting Up Your First ADS-B Receiver',
    excerpt: 'A step-by-step guide to building your own aircraft tracking station with a Raspberry Pi and RTL-SDR.',
    category: 'Tutorial',
    readTime: '8 min',
    date: 'Coming Soon',
    slug: 'setup-adsb-receiver-guide'
  },
];

const Blog: React.FC = () => {
  const handleArticleClick = (title: string, category: string) => {
    trackEvent('blog_article_viewed', {
      articleTitle: title,
      articleCategory: category
    });
  };

  return (
    <div className="relative pt-16">
      <SEO
        title="Aviation Intelligence Blog | AeroSky"
        description="Deep dives into aviation technology, sovereign airspace data analysis, holding patterns, and DIY ground receiver guides in India."
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.in/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://aerosky.in/blog' }
          ]
        }}
      />
      
      {/* Generate dynamic Article schemas for search engines */}
      {POSTS.map(p => (
        <Schema
          key={p.slug}
          type="Article"
          data={{
            headline: p.title,
            description: p.excerpt,
            datePublished: '2026-06-18',
            author: {
              '@type': 'Organization',
              name: 'AeroSky'
            },
            publisher: {
              '@type': 'Organization',
              name: 'AeroSky',
              logo: {
                '@type': 'ImageObject',
                url: 'https://aerosky.in/assets/logo.png'
              }
            },
            mainEntityOfPage: `https://aerosky.in/blog/${p.slug}`
          }}
        />
      ))}

      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider uppercase mb-6 animate-pulse-glow" style={{ background: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)', color: INDIA_ORANGE }}>
            <BookOpen size={14} /> AeroSky Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Aviation Insights &{' '}
            <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Intelligence</span>
          </h1>
          <p className="text-lg text-sky-200/70 max-w-2xl mx-auto">
            Deep dives into aviation technology, Indian airspace analysis, and community stories.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4 sm:px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POSTS.map((post) => (
              <article
                key={post.title}
                onClick={() => handleArticleClick(post.title, post.category)}
                className="glass rounded-2xl overflow-hidden group hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
              >
                {/* Placeholder visual */}
                <div className="h-36 bg-gradient-to-br from-saffron/10 to-gold/5 relative flex items-end p-4">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider bg-sky-950/60 backdrop-blur-sm px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-sky-200/50 leading-relaxed flex-1 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-amber-400">
                      <Clock size={12} />
                      {post.readTime}
                    </div>
                    <span className="text-[10px] font-mono text-amber-500/60 uppercase">{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-sky-200/50 mb-4">More articles coming with our beta launch.</p>
            <a
              href="#newsletter"
              onClick={() => trackEvent('newsletter_signup_started', { page: '/blog', trigger: 'blog_subscribe_link' })}
              className="inline-flex items-center gap-2 text-sm font-medium text-saffron hover:text-gold transition-colors"
            >
              Subscribe for updates <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
