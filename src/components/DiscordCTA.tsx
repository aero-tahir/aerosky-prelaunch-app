import React from 'react';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { useSiteSettings } from '../context/CMSContext';

interface DiscordCTAProps {
  location: string;
  buttonName: string;
  variant?: 'primary' | 'secondary' | 'link';
  className?: string;
  children?: React.ReactNode;
}

const DiscordCTA: React.FC<DiscordCTAProps> = ({
  location,
  buttonName,
  variant = 'primary',
  className = '',
  children
}) => {
  const siteSettings = useSiteSettings();
  const handleDiscordClick = () => {
    trackEvent('discord_join_clicked', {
      location,
      button_name: buttonName,
      page: window.location.pathname
    });
  };

  const discordInviteUrl = siteSettings.discordInviteUrl || 'https://discord.gg/aerosky';

  if (variant === 'primary') {
    return (
      <a
        href={discordInviteUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDiscordClick}
        className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-0.5 ${className}`}
      >
        {children || <>Join Discord Community <ArrowRight size={14} /></>}
      </a>
    );
  }

  if (variant === 'secondary') {
    return (
      <a
        href={discordInviteUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDiscordClick}
        className={`px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center ${className}`}
      >
        {children || 'Join Discord Community'}
      </a>
    );
  }

  return (
    <a
      href={discordInviteUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleDiscordClick}
      className={className}
    >
      {children}
    </a>
  );
};

export default DiscordCTA;
