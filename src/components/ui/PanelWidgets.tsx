import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TEXT, SPACE, COLOR, SIZE } from '@/components/panels/design-tokens';

export const CollapsibleSection: React.FC<{
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-1 py-2 sm:py-2.5 group transition-colors`}
      >
        <span className={`${TEXT.sectionTitle} ${open ? COLOR.titleActiveText : COLOR.titleText} group-hover:${COLOR.titleActiveText} transition-colors`}>{title}</span>
        <span className={`${COLOR.inactiveText} group-hover:${COLOR.labelText} transition-colors`}>
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </button>
      {open && <div className="pb-1">{children}</div>}
    </div>
  );
};

export const FilterCheckbox: React.FC<{
  label: string; code: string; emoji: string; subtitle: string;
  checked: boolean; onChange: () => void;
}> = ({ label, code, emoji, subtitle, checked, onChange }) => (
  <div onClick={onChange} className={`flex items-center gap-3 px-2 sm:px-2.5 ${SPACE.rowPy} sm:py-2.5 ${SIZE.radius} ${COLOR.hoverBg} cursor-pointer transition-all`}>
    <div className={`${SIZE.checkbox} border flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-cyan-500 border-cyan-500' : `border-slate-300 dark:border-white/10`}`}>
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
    </div>
    <div className="min-w-0">
      <div className={`${TEXT.label} font-bold transition-colors truncate ${checked ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-white/60'}`}>{emoji} {label}</div>
      <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-tight`}>{code} · {subtitle}</div>
    </div>
  </div>
);

export const ToggleSwitch: React.FC<{
  label: string; active: boolean; onClick: () => void;
  icon: React.ReactNode; description?: string;
}> = ({ label, active, onClick, icon, description }) => (
  <div onClick={onClick} className={`flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 ${SIZE.radius} cursor-pointer transition-all border ${active ? `${COLOR.activeBg} ${COLOR.activeBorder}` : `border-transparent ${COLOR.hoverBg}`}`}>
    <div className="flex items-center gap-2.5">
      <div className={`${SIZE.iconBox} flex items-center justify-center transition-colors ${active ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-white/30'}`}>
        {icon}
      </div>
      <div>
        <span className={`${TEXT.label} font-bold block ${active ? COLOR.activeText : 'text-slate-700 dark:text-white/60'}`}>{label}</span>
        {description && <span className={`${TEXT.sub} ${COLOR.labelText} block mt-0.5`}>{description}</span>}
      </div>
    </div>
    <div className={`${SIZE.toggleTrack} rounded-full relative transition-all shrink-0 ${active ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-white/10'}`}>
      <div className={`absolute top-[3px] ${SIZE.toggleKnob} bg-white rounded-full shadow-sm transition-all ${active ? SIZE.toggleKnobOn : SIZE.toggleKnobOff}`} />
    </div>
  </div>
);

export const RangeSlider: React.FC<{
  label: string; min: number; max: number; value: number[];
  onChange: (val: number[]) => void; unit?: string; emoji?: string;
}> = ({ label, min, max, value, onChange, unit, emoji }) => (
  <div className="space-y-1.5 py-1">
    <div className="flex justify-between items-center">
      <span className={`${TEXT.badge} ${COLOR.inactiveText} uppercase tracking-wider`}>{emoji} {label}</span>
      <span className={`${TEXT.label} font-bold ${COLOR.activeText} font-mono ${COLOR.activeBg} px-1.5 py-0.5 ${SIZE.radius}`}>{value[1]}{unit}</span>
    </div>
    <input type="range" min={min} max={max} value={value[1]} onChange={(e) => onChange([value[0], Number(e.target.value)])} className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500" />
  </div>
);
