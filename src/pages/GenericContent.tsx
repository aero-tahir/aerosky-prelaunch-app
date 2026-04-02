import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft, ArrowRight, Zap, Globe, BarChart3, Radio, Database } from 'lucide-react';

const GenericContent: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    // Derive title from path
    const getPageInfo = (path: string) => {
        if (path.includes('/playback')) return { title: 'Flight Playback', icon: <Globe size={48} />, desc: 'Replay historical flight traffic and analyze past airspace events with precision.' };
        if (path.includes('/flights')) return { title: 'Flight Intelligence', icon: <Database size={48} />, desc: 'Deep dive into flight metrics, route analysis, and aircraft profiles.' };
        if (path.includes('/airports')) return { title: 'Airport Operations', icon: <Construction size={48} />, desc: 'Real-time congestion analytics, runway usage, and turnaround efficiency metrics.' };
        if (path.includes('/coverage') || path.includes('/feeders')) return { title: 'Coverage Network', icon: <Radio size={48} />, desc: 'Explore our global receiver network and contribution statistics.' };
        if (path.includes('/insights') || path.includes('/alerts')) return { title: 'Strategic Insights', icon: <BarChart3 size={48} />, desc: 'Data-driven reports, anomaly detection, and airspace trend analysis.' };
        if (path.includes('/community') || path.includes('/data')) return { title: 'Community & API', icon: <Zap size={48} />, desc: 'Developer resources, API documentation, and community leaderboards.' };
        return { title: 'Module Coming Soon', icon: <Construction size={48} />, desc: 'This feature is currently under active development. Stay tuned for updates.' };
    };

    const info = getPageInfo(path);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#060a18] pt-24 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 dark:opacity-10 bg-blue-500" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 dark:opacity-10 bg-indigo-500" />
            </div>

            <div className="max-w-3xl w-full text-center relative z-10">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-8 shadow-xl text-slate-800 dark:text-blue-400">
                    {info.icon}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
                    {info.title}
                </h1>

                <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    {info.desc}
                </p>

                <div className="p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm max-w-xl mx-auto mb-10">
                    <div className="flex items-center gap-3 mb-4 justify-center">
                        <div className="h-1 w-12 bg-amber-500 rounded-full" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-gray-500">Under Construction</span>
                        <div className="h-1 w-12 bg-amber-500 rounded-full" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-500">
                        We are meticulously crafting this experience to bring you the best <strong>human-centric aviation intelligence</strong>.
                        Expected launch: <span className="text-slate-900 dark:text-white font-bold">Q3 2026</span>.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-white font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back Home
                    </button>
                    <button
                        onClick={() => navigate('/explore/map')}
                        className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        Explore Live Map <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenericContent;
