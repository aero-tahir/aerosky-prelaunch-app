import React from 'react';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

const POSTS = [
  {
    title: 'Why Flights Circle Mumbai During Monsoon',
    excerpt: 'Understanding holding patterns, weather diversions, and how ADS-B data reveals monsoon impact on Indian aviation.',
    category: 'Aviation Science',
    readTime: '5 min',
    date: 'Coming Soon',
  },
  {
    title: 'What is ADS-B? A Beginner\'s Guide',
    excerpt: 'Automatic Dependent Surveillance-Broadcast explained. Learn how aircraft broadcast their position and why it matters.',
    category: 'Technology',
    readTime: '4 min',
    date: 'Coming Soon',
  },
  {
    title: 'How MLAT Works: Multilateration Explained',
    excerpt: 'When ADS-B isn\'t enough. Learn how multiple receivers triangulate aircraft positions using time-difference-of-arrival.',
    category: 'Technology',
    readTime: '6 min',
    date: 'Coming Soon',
  },
  {
    title: 'Indian Airport Congestion: A Data Story',
    excerpt: 'Analyzing delay patterns at DEL, BOM, and BLR using community-sourced ADS-B data and DGCA statistics.',
    category: 'Analysis',
    readTime: '7 min',
    date: 'Coming Soon',
  },
  {
    title: 'Behind AeroSky: Building India\'s Aviation Network',
    excerpt: 'The story of why we started AeroSky and India\'s need for sovereign, community-powered airspace intelligence.',
    category: 'Company',
    readTime: '5 min',
    date: 'Coming Soon',
  },
  {
    title: 'Setting Up Your First ADS-B Receiver',
    excerpt: 'A step-by-step guide to building your own aircraft tracking station with a Raspberry Pi and RTL-SDR.',
    category: 'Tutorial',
    readTime: '8 min',
    date: 'Coming Soon',
  },
];

const Blog: React.FC = () => {
  return (
    <div className="relative pt-16">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.05] text-xs font-mono font-bold text-amber-400 tracking-wider uppercase mb-6">
            <BookOpen size={14} /> AeroSky Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Aviation Insights &{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Intelligence</span>
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
              <article key={post.title} className="glass rounded-2xl overflow-hidden group hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                {/* Placeholder visual */}
                <div className="h-36 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 relative flex items-end p-4">
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
                    <div className="flex items-center gap-2 text-[11px] text-sky-400">
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
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
              Subscribe for updates <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
