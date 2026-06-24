import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Radio, Plane, Award, Copy, Check, Users, ArrowRight, ArrowLeft, Shield, Globe, Gift } from 'lucide-react';
import SEO from '../components/SEO';
import Schema from '../components/Schema';
import { BadgeCard } from '../components/BadgeCard';
import { ShareOverlay } from '../components/ShareOverlay';
import { trackEvent } from '../utils/analytics';
import { getMemberBySlugOrId } from '../utils/db';

export const MemberDashboard: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<{
    name: string;
    email: string;
    role: 'cadet' | 'captain';
    serial: string;
    referralCount: number;
    joinedDate: string;
    status: string;
    slug?: string;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [gateError, setGateError] = useState('');


  useEffect(() => {
    async function lookupMember() {
      setLoading(true);
      if (!memberId) {
        setLoading(false);
        return;
      }

      try {
        const found = await getMemberBySlugOrId(memberId);
        setMember(found);
        
        // Check if already verified in session
        if (found) {
          const sessionEmail = sessionStorage.getItem(`verified_member_email_${memberId}`);
          if (sessionEmail && sessionEmail.toLowerCase() === found.email.toLowerCase()) {
            setIsEmailVerified(true);
          }
        }

      } catch (err) {
        console.error('Error looking up member:', err);
        setMember(null);
      } finally {
        setLoading(false);
        trackEvent('member_dashboard_viewed', { memberId });
      }
    }

    lookupMember();
  }, [memberId]);

  const inviteLink = member ? `https://aerosky.ai/?ref=${member.slug || member.serial}` : 'https://aerosky.ai';

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    trackEvent('referral_link_copied', { trigger: 'member_dashboard', memberId });
    setTimeout(() => setCopied(false), 2000);
  };

  
  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    
    if (emailInput.trim().toLowerCase() === member.email.toLowerCase()) {
      sessionStorage.setItem(`verified_member_email_${memberId}`, member.email);
      setIsEmailVerified(true);
      setGateError('');
      trackEvent('member_dashboard_unlocked', { memberId });
    } else {
      setGateError('Incorrect email address for this Founding ID.');
      trackEvent('member_dashboard_unlock_failed', { memberId });
    }
  };

if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs font-mono text-amber-500/60 uppercase tracking-widest">Loading Dashboard</span>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
        <div className="glass rounded-3xl p-8 max-w-md text-center border border-white/10">
          <h2 className="text-xl font-bold text-white mb-2">Member Not Found</h2>
          <p className="text-xs text-sky-200/60 mb-6">
            The founding membership identifier provided is invalid or does not exist. Join the cohort to claim your badge.
          </p>
          <Link to="/#pathways" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-saffron to-gold text-black font-bold text-xs uppercase tracking-wider">
            Join AeroSky Cohort
          </Link>
        </div>
      </div>
    );
  }

  const isCadet = member.role === 'cadet';

  if (!isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
        <SEO
          title="Verification Required | AeroSky"
          description="AeroSky founding membership verification."
          noindex={true}
        />
        <div className="glass rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative overflow-hidden bg-sky-955/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron to-gold" />
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 mb-3">
              <Shield size={20} className="animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 font-sans">Verification Required</h2>
            <p className="text-xs text-sky-200/60 leading-relaxed font-sans">
              Founding Dashboard access is restricted. Enter the email address associated with this membership ID to unlock.
            </p>
          </div>

          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label htmlFor="gate-email" className="block text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest mb-1.5">
                Registered Email Address
              </label>
              <input
                id="gate-email"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-sky-950/40 border border-white/10 rounded-xl py-3 px-4 text-xs sm:text-sm text-white placeholder-sky-200/30 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
              />
            </div>

            {gateError && (
              <p className="text-xs font-mono text-rose-400 animate-pulse">{gateError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-black font-bold text-xs sm:text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] bg-gradient-to-br from-saffron to-gold cursor-pointer uppercase tracking-wider font-sans"
            >
              Verify & Unlock
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <Link to="/" className="text-[10px] font-mono font-bold text-sky-200/50 hover:text-white uppercase tracking-wider flex items-center justify-center gap-1">
              <ArrowLeft size={10} /> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-[#020617] min-h-screen">
      <SEO
        title={`Member ${member.serial} | AeroSky`}
        description={`Founder profile for AeroSky pre-launch member ${member.serial}.`}
        noindex={true}
      />
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aerosky.ai/' },
            { '@type': 'ListItem', position: 2, name: `Member ${member.serial}`, item: `https://aerosky.ai/member/${member.slug || member.serial}` }
          ]
        }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Badge visualizer */}
          <div className="flex flex-col items-center">
            <BadgeCard role={member.role} memberNumber={member.serial} name={member.name} memberSlug={member.slug} />
          </div>

          {/* Right: Dashboard details */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.03] text-[9px] font-mono font-bold tracking-widest text-amber-400 uppercase mb-4">
                <Award size={11} /> Founding Member Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 font-sans">
                Welcome, {member.name}
              </h1>
              <p className="text-xs text-sky-200/60 leading-relaxed font-sans">
                You are registered in the founding AeroSky pre-launch cohort. Thank you for supporting the expansion of airspace intelligence.
              </p>
            </div>

            {/* Community Impact statistics card */}
            <div className="glass rounded-2xl p-5 border border-white/[0.04] bg-sky-950/10">
              <h3 className="text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest mb-3">
                Community Impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-sky-200/50 uppercase tracking-wider font-mono">Members Invited</div>
                  <div className="text-2xl font-mono font-bold text-white mt-1">{member.referralCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-sky-200/50 uppercase tracking-wider font-mono">Community Since</div>
                  <div className="text-2xl font-mono font-bold text-white mt-1">{member.joinedDate}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span className="text-[10px] font-mono text-sky-200/50 capitalize">Status: {member.status}</span>
              </div>
            </div>

            {/* Referral Milestone Rewards Widget */}
            <div className="glass rounded-2xl p-5 border border-white/[0.04] space-y-4 bg-sky-950/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest flex items-center gap-1.5">
                  <Gift size={12} className="text-amber-400" /> Referral Milestone Rewards
                </h3>
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  {member.referralCount} / 3 Joined
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                  style={{ width: `${Math.min((member.referralCount / 3) * 100, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-sky-200/70">
                <span>0 Referrals</span>
                <span>3 Referrals (Milestone)</span>
              </div>

              {/* Reward description */}
              <div className="pt-2.5 border-t border-white/5 space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5 ${
                    member.referralCount >= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {member.referralCount >= 3 ? '✓' : '!'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-none font-sans">
                      {isCadet ? 'Free Silver Subscription Upgrade' : 'Free Upgrade to Business API'}
                    </div>
                    <div className="text-[9px] text-sky-200/50 mt-1 leading-normal font-sans">
                      {isCadet 
                        ? 'Invite 3 friends to get premium historical data, 3D tracking, and custom alerts free for 1 year.' 
                        : 'Invite 3 friends to unlock raw telemetry streams, higher API limits, and commercial integration.'}
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-white/5 text-center">
                  {member.referralCount >= 3 ? (
                    <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wider">
                      ★ Reward Unlocked! Active at pre-launch checkout.
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-400/80">
                      Invite {Math.max(3 - member.referralCount, 0)} more friends using your link to claim reward.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Onboarding Checklist / Next Steps */}
            <div className="glass rounded-2xl p-5 border border-white/[0.04] space-y-3.5 bg-sky-950/10">
              <h3 className="text-xs font-mono font-bold text-sky-200/70 uppercase tracking-widest">
                Onboarding Checklist
              </h3>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight font-sans">Claimed Founding Badge</div>
                  <div className="text-[10px] text-sky-200/50 font-sans">Unique ID serial {member.serial} is assigned.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight font-sans">Founding Cohort Registered</div>
                  <div className="text-[10px] text-sky-200/50 font-sans">You will receive flight-tracking reports and launch invitations at {member.email}.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/5 pt-3.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-white leading-tight font-sans">Next Step: Join Discord</div>
                    <div className="text-[10px] text-sky-200/70 font-sans">Estimated Time: 30 seconds</div>
                  </div>
                  <a 
                    href="https://discord.gg/aerosky" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-[10px] font-mono font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Join
                  </a>
                </div>
              </div>
            </div>

            {/* Social Sharing Overlay */}
            <ShareOverlay role={member.role} memberNumber={member.serial} className="mt-4" memberSlug={member.slug} />

            {/* General CTA Link to Pre-Launch site */}
            <div className="pt-4 flex gap-4">
              <Link to="/" className="text-xs font-mono font-bold text-sky-200/60 hover:text-white uppercase tracking-widest flex items-center gap-1.5">
                <ArrowLeft size={12} /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;