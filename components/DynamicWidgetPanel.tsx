import React from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface DynamicWidgetPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    width?: number;
}

const DynamicWidgetPanel: React.FC<DynamicWidgetPanelProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    children,
    width = 340
}) => {
    if (!isOpen) return null;

    return (
        <div
            style={{ width: `${width}px` }}
            className={`
        fixed left-6 top-1/2 -translate-y-1/2 z-40 
        max-h-[80vh] flex flex-col
        bg-white/95 dark:bg-[#0c1020]/95 backdrop-blur-2xl 
        border border-slate-200 dark:border-white/[0.07] 
        rounded-2xl shadow-2xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]
        animate-in slide-in-from-left duration-300 ease-out
      `}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.05] shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{title}</h2>
                        <p className="text-[9px] text-slate-500 dark:text-white/30 tracking-wider mt-0.5">{subtitle}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-400 dark:text-white/25 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {children}
            </div>

            {/* Footer / Status */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-white/[0.05] text-[8px] text-slate-400 dark:text-white/10 uppercase tracking-[0.2em] font-bold">
                AeroSky Intelligence Interface v2.0
            </div>
        </div>
    );
};

export default DynamicWidgetPanel;
