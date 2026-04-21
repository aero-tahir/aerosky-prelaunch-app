import React from 'react';
import { X } from 'lucide-react';

interface DynamicWidgetPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    width?: number;
}

const TRANSITION = 'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]';

const PanelHeader: React.FC<{
    icon: React.ReactNode; title: string; subtitle: string; onClose: () => void;
}> = ({ icon, title, subtitle, onClose }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.05] shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                {icon}
            </div>
            <div>
                <h2 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">{title}</h2>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 tracking-wider mt-0.5">{subtitle}</p>
            </div>
        </div>
        <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-300"
        >
            <X size={14} />
        </button>
    </div>
);

const DynamicWidgetPanel: React.FC<DynamicWidgetPanelProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    children,
    width = 340
}) => {
    return (
        <>
            {/* ── Mobile: centered between header and dock ── */}
            <div
                className={`
                    sm:hidden fixed inset-x-0 z-40
                    top-[60px] bottom-[70px]
                    flex items-center justify-center
                    px-4 py-2
                    pointer-events-none
                    ${TRANSITION}
                    ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                `}
            >
                <div
                    className={`
                        w-full max-w-[360px] max-h-full
                        flex flex-col
                        bg-white/95 dark:bg-[#0c1020]/95 backdrop-blur-2xl
                        border border-slate-200 dark:border-white/[0.07]
                        rounded-2xl shadow-2xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]
                        ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
                    `}
                >
                    <PanelHeader icon={icon} title={title} subtitle={subtitle} onClose={onClose} />
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>

            {/* ── Desktop: left-side floating panel with slide animation ── */}
            <div
                style={{ width: `${width}px` }}
                className={`
                    hidden sm:flex
                    absolute top-1/2 -translate-y-1/2 z-40
                    max-h-[80vh] flex-col
                    bg-white/95 dark:bg-[#0c1020]/95 backdrop-blur-2xl
                    border border-slate-200 dark:border-white/[0.07]
                    rounded-2xl shadow-2xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]
                    ${TRANSITION}
                    ${isOpen
                        ? 'left-6 opacity-100'
                        : '-left-[360px] opacity-0 pointer-events-none'
                    }
                `}
            >
                <PanelHeader icon={icon} title={title} subtitle={subtitle} onClose={onClose} />
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
};

export default DynamicWidgetPanel;
