import React from 'react';
import {
    Radar, Globe, Settings, CloudSun,
    LayoutDashboard, History
} from 'lucide-react';

export type DockMode = 'FILTER' | 'LAYERS' | 'SETTINGS' | 'WEATHER' | 'WIDGETS' | 'PLAYBACK' | 'FLIGHT' | null;

interface IntelligenceDockProps {
    activeMode: DockMode;
    onModeChange: (mode: DockMode) => void;
}

const IntelligenceDock: React.FC<IntelligenceDockProps> = ({ activeMode, onModeChange }) => {
    const dockItems = [
        { mode: 'FILTER' as DockMode, icon: <Radar size={20} />, label: 'Traffic' },
        { mode: 'LAYERS' as DockMode, icon: <Globe size={20} />, label: 'Airspace' },
        { mode: 'SETTINGS' as DockMode, icon: <Settings size={20} />, label: 'System' },
        { mode: 'WEATHER' as DockMode, icon: <CloudSun size={20} />, label: 'Weather' },
        { mode: 'WIDGETS' as DockMode, icon: <LayoutDashboard size={20} />, label: 'Widgets' },
        { mode: 'PLAYBACK' as DockMode, icon: <History size={20} />, label: 'Playback' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center">
            <div className="flex items-center gap-1 p-1.5 bg-white/90 dark:bg-[#0c1020]/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-black/40 mb-2">
                {dockItems.map((item) => (
                    <button
                        key={item.mode}
                        onClick={() => onModeChange(activeMode === item.mode ? null : item.mode)}
                        className={`
              group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300
              ${activeMode === item.mode
                                ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'}
            `}
                    >
                        {item.icon}

                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 dark:bg-slate-950 text-white text-[10px] font-bold rounded border border-slate-700 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {item.label}
                        </div>

                        {/* Active Indicator */}
                        {activeMode === item.mode && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 dark:bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default IntelligenceDock;
