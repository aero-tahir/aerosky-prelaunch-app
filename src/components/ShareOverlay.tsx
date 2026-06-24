import React, { useState } from 'react';
import { Linkedin, Facebook, Send, MessageCircle, Copy, Check, Share2 } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface ShareOverlayProps {
  role: 'cadet' | 'captain';
  memberNumber: string;
  className?: string;
  memberSlug?: string;
}

export const ShareOverlay: React.FC<ShareOverlayProps> = ({ role, memberNumber, className = '', memberSlug }) => {
  const [copied, setCopied] = useState(false);
  const isCadet = role === 'cadet';
  const displayNum = memberNumber.replace('CAD', '').replace('AC', '');
  const formattedId = isCadet ? `#CAD${displayNum}` : `#AC${displayNum}`;
  const inviteUrl = `https://aerosky.ai/?ref=${memberSlug || (isCadet ? 'CAD' : 'AC') + displayNum}`;

  const messageText = isCadet
    ? `Proud to join India's sovereign airspace intelligence network as Founding AeroCadet ${formattedId}. Supporting the vision for a self-reliant aviation tracking grid. Join the network!`
    : `I've applied to become a Founding AeroCaptain (${formattedId}) to host a receiver and help build India's first sovereign airspace intelligence network. Proudly supporting Make in India aviation infrastructure. Apply to host a station:`;

  const hashtags = 'AeroSky,MakeInIndia,AeroCaptain,Aviation,India';

  // Share Handlers
  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(messageText + ' ' + inviteUrl)}&hashtags=${hashtags}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText + ' ' + inviteUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(messageText)}`
  };

  const handleShareClick = (platform: string) => {
    trackEvent('social_share_clicked', { platform, role, memberNumber });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    trackEvent('referral_link_copied', { trigger: 'share_overlay', role, memberNumber });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full max-w-sm ${className}`}>
      <div className="text-center mb-4">
        <h4 className="text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Share2 size={11} /> Share Your Achievement
        </h4>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {/* X / Twitter */}
        <a
          href={shareLinks.x}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShareClick('x')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-sky-500/20 transition-all text-sky-200 hover:text-white"
        >
          {/* Custom X SVG logo */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase">X</span>
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShareClick('linkedin')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-sky-500/20 transition-all text-sky-200 hover:text-white"
        >
          <Linkedin size={16} className="text-[#0a66c2]" />
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase">LinkedIn</span>
        </a>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShareClick('whatsapp')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-sky-500/20 transition-all text-sky-200 hover:text-white"
        >
          <MessageCircle size={16} className="text-[#25d366]" />
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase">WhatsApp</span>
        </a>

        {/* Telegram */}
        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShareClick('telegram')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-sky-500/20 transition-all text-sky-200 hover:text-white"
        >
          <Send size={16} className="text-[#0088cc]" />
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Telegram</span>
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShareClick('facebook')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-sky-500/20 transition-all text-sky-200 hover:text-white"
        >
          <Facebook size={16} className="text-[#1877f2]" />
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Facebook</span>
        </a>

        {/* Copy Invite Link */}
        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-orange-500/20 transition-all text-sky-200 hover:text-white cursor-pointer"
        >
          {copied ? (
            <Check size={16} className="text-emerald-400 animate-pulse" />
          ) : (
            <Copy size={16} className="text-amber-400" />
          )}
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase">{copied ? 'Copied' : 'Link'}</span>
        </button>
      </div>
    </div>
  );
};
