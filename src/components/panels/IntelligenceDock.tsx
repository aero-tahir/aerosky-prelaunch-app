import React from 'react';
import {
  Radar, Globe, Settings, CloudSun,
  LayoutDashboard, History,
} from 'lucide-react';

export type DockMode = 'FILTER' | 'LAYERS' | 'SETTINGS' | 'WEATHER' | 'WIDGETS' | 'PLAYBACK' | 'FLIGHT' | null;

interface IntelligenceDockProps {
  activeMode: DockMode;
  onModeChange: (mode: DockMode) => void;
  hidden?: boolean;
}

const dockItems: { mode: DockMode; icon: React.ReactNode; label: string }[] = [
  { mode: 'FILTER',   icon: <Radar size={20} strokeWidth={1.8} />,          label: 'Traffic' },
  { mode: 'LAYERS',   icon: <Globe size={20} strokeWidth={1.8} />,          label: 'Airspace' },
  { mode: 'SETTINGS', icon: <Settings size={20} strokeWidth={1.8} />,       label: 'System' },
  { mode: 'WEATHER',  icon: <CloudSun size={20} strokeWidth={1.8} />,       label: 'Weather' },
  { mode: 'WIDGETS',  icon: <LayoutDashboard size={20} strokeWidth={1.8} />,label: 'Widgets' },
  { mode: 'PLAYBACK', icon: <History size={20} strokeWidth={1.8} />,        label: 'Playback' },
];

const IntelligenceDock: React.FC<IntelligenceDockProps> = ({ activeMode, onModeChange, hidden = false }) => {
  return (
    <div className={`absolute bottom-6 left-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      hidden
        ? 'translate-y-24 -translate-x-1/2 opacity-0 pointer-events-none'
        : '-translate-x-1/2 translate-y-0 opacity-100'
    }`}>
      {/* ── Outer shell: layered shadows for floating depth ── */}
      <div
        className="
          relative dock-noise
          flex items-center gap-1.5 px-3 py-1.5
          rounded-[20px]
          bg-white/65 dark:bg-[rgb(20,25,35)]/80
          backdrop-blur-[16px] dark:backdrop-blur-[20px]
          border border-white/40 dark:border-white/[0.08]
          shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.06)]
          dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_12px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.04)]
        "
        role="toolbar"
        aria-label="Map intelligence controls"
      >
        {/* Gradient tint overlay */}
        <div
          className="
            absolute inset-0 rounded-[20px] pointer-events-none z-0
            bg-gradient-to-r from-white/30 via-blue-50/20 to-white/30
            dark:from-blue-900/20 dark:via-slate-800/10 dark:to-blue-900/20
          "
          aria-hidden="true"
        />

        {dockItems.map((item) => {
          const isActive = activeMode === item.mode;

          return (
            <button
              key={item.mode}
              onClick={() => onModeChange(isActive ? null : item.mode)}
              aria-pressed={isActive}
              aria-label={item.label}
              className={`
                group relative z-10 flex items-center justify-center
                w-9 h-9 rounded-xl
                transition-all duration-[180ms] ease-out
                focus-ring
                ${isActive
                  ? 'bg-cyan-500/15 dark:bg-cyan-400/15 text-cyan-600 dark:text-cyan-400 dock-icon-active scale-[1.02] shadow-[inset_0_1px_4px_rgba(34,211,238,0.15)]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white/80 hover:bg-white/40 dark:hover:bg-white/[0.06] hover:scale-105 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                }
              `}
            >
              {item.icon}

              {/* Tooltip */}
              <span
                className="
                  absolute -top-10 left-1/2 -translate-x-1/2
                  px-2.5 py-1 rounded-lg
                  bg-slate-800/90 dark:bg-slate-950/90 backdrop-blur-sm
                  text-white text-[10px] font-semibold tracking-wide
                  border border-white/10
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-150
                  pointer-events-none whitespace-nowrap
                  shadow-lg
                "
                role="tooltip"
              >
                {item.label}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <span
                  className="
                    absolute -bottom-1 left-1/2 -translate-x-1/2
                    w-1 h-1 rounded-full
                    bg-cyan-500 dark:bg-cyan-400
                    shadow-[0_0_6px_rgba(34,211,238,0.7),0_0_12px_rgba(34,211,238,0.3)]
                  "
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IntelligenceDock;
