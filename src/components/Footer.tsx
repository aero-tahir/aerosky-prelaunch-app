import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Twitter, Linkedin, Send, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../context/CMSContext';


const Footer: React.FC = () => {
  const siteSettings = useSiteSettings();
  return (
    <footer role="contentinfo" className="relative z-0 border-t border-white/5 bg-black/40 backdrop-blur-xl py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-24" aria-label="AeroSky Footer">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Plane size={22} className="text-saffron rotate-[-45deg]" />
              <span className="text-xl font-bold tracking-tighter text-white">AeroSky</span>
            </div>
            <p className="text-sm text-sky-200/60 leading-relaxed mb-4">
              Building India's community-powered airspace intelligence platform.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3.5 mb-4" aria-label="AeroSky Social Media Channels">
              <a
                href="https://x.com/AeroLyticsAI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-200/70 hover:text-amber-400 transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/aerolyticsai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-200/70 hover:text-amber-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://t.me/AeroLyticsAI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-200/70 hover:text-amber-400 transition-colors"
                aria-label="Telegram"
              >
                <Send size={18} />
              </a>
              <a
                href={siteSettings.discordInviteUrl || 'https://discord.gg/aerosky'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-200/70 hover:text-amber-400 transition-colors"
                aria-label="Discord"
              >
                <MessageCircle size={18} />
              </a>
            </div>

            <div className="flex items-center gap-2" aria-label="Indian Flag">
              <div className="w-3 h-3 rounded-sm bg-saffron" />
              <div className="w-3 h-3 rounded-sm bg-white" />
              <div className="w-3 h-3 rounded-sm bg-india-green" />
              <span className="text-xs text-sky-300/50 font-mono ml-1">PROUDLY INDIAN</span>
            </div>
          </div>

          {/* Platform */}
          <nav aria-label="Platform">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Platform</h3>
            <ul className="space-y-1.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'AeroCaptains', to: '/aerocaptains' },
                { label: 'Coverage', to: '/coverage' },
                { label: 'About', to: '/about' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-sky-200/60 hover:text-amber-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Community */}
          <nav aria-label="Community">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Community</h3>
            <ul className="space-y-1.5">
              {[
                { label: 'Insights', to: '/insights' },
                { label: 'Community Hub', to: '/community' },
                { label: 'Hall of Fame', to: '/aerocaptains/hall-of-fame' },
                { label: 'Platform Readiness', to: '/#readiness' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-sky-200/60 hover:text-amber-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal & Support */}
          <nav aria-label="Legal and Support">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Legal & Support</h3>
            <ul className="space-y-1.5">
              {[
                { label: 'Support Directory', to: '/support' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Cookie Policy', to: '/cookie-policy' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-sky-200/60 hover:text-amber-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Educational Use Notice */}
        <div className="border-t border-white/5 pt-6 text-xs text-sky-200/50 leading-relaxed">
          AeroSky is a community-driven flight data research initiative. Airspace intelligence data published on this platform is intended solely for educational, research, and hobbyist purposes. Do not use this data for flight navigation, air traffic control, or any operational aviation safety decisions.
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-sky-200/60">
            {siteSettings.footerCopyright || "© 2026 AeroSky - AeroLytics Intelligence Pvt. Ltd. | Made in India"}
          </p>
          <span className="text-xs text-sky-200/50 font-mono">Pre-Launch • Pune, India</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
