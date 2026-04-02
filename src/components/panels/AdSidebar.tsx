import React from 'react';
import { Sparkles, Plane, Shield, Zap } from 'lucide-react';
import { TEXT, COLOR } from './design-tokens';

interface Props {
  onUpgrade: () => void;
}

const AdSidebar: React.FC<Props> = ({ onUpgrade }) => (
  <div className="flex flex-col gap-3 p-3 w-full h-full">

    {/* ── Premium CTA ── */}
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.06]">
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-3.5 py-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles size={14} className="text-white" />
          <span className={`${TEXT.badge} font-black text-white uppercase tracking-wider`}>Go Premium</span>
        </div>
        <p className={`${TEXT.sub} text-white/80 leading-relaxed`}>
          Unlock full telemetry, sovereign data controls & ad-free experience.
        </p>
      </div>
      <div className="bg-white dark:bg-white/[0.02] px-3.5 py-2.5 space-y-2">
        {[
          { icon: <Plane size={12} />, text: 'Advanced flight telemetry' },
          { icon: <Shield size={12} />, text: 'Sovereign data mode' },
          { icon: <Zap size={12} />, text: 'No ads, faster updates' },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-amber-500">{f.icon}</span>
            <span className={`${TEXT.label} text-slate-600 dark:text-white/50`}>{f.text}</span>
          </div>
        ))}
        <button onClick={onUpgrade}
          className="w-full py-2 mt-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors">
          Try free for 7 days
        </button>
      </div>
    </div>

    {/* ── Ad Slot 1 ── */}
    <div className="flex-1 rounded-xl border border-slate-200 dark:border-white/[0.06] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 dark:border-white/[0.04]">
        <span className={`${TEXT.sub} ${COLOR.labelText}`}>Ads help keep AeroSky free</span>
      </div>
      <div className="flex-1 relative bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center min-h-[250px]">
        {/* AdSense container — replace data-ad-slot with real values */}
        <ins className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="vertical"
          data-full-width-responsive="true"
        />
        {/* Fallback placeholder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center">
            <Plane size={24} className="text-slate-300 dark:text-white/10 -rotate-12" />
          </div>
          <span className={`${TEXT.sub} ${COLOR.labelText}`}>Advertisement</span>
        </div>
      </div>
    </div>

    {/* ── Upgrade footer ── */}
    <button onClick={onUpgrade}
      className="w-full bg-cyan-50 dark:bg-cyan-500/[0.06] border border-cyan-200 dark:border-cyan-500/15 rounded-xl px-3.5 py-2.5 text-left hover:bg-cyan-100 dark:hover:bg-cyan-500/10 transition-colors shrink-0">
      <span className={`${TEXT.badge} font-bold text-cyan-700 dark:text-cyan-400 block`}>Upgrade to go ad-free</span>
      <span className={`${TEXT.sub} ${COLOR.labelText}`}>Support Indian aviation data sovereignty</span>
    </button>

  </div>
);

export default AdSidebar;
