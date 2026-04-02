import React, { useState } from 'react';
import { Search, Plane, MapPin, Globe, AlertTriangle, TrendingUp, ArrowUpRight, Zap, Filter, ChevronRight, Activity, Calendar, Shield, Database as DatabaseIcon, FileText, Server } from 'lucide-react';

/* ─── India Flag Colors ─── */
const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

const Intelligence: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const renderSectionHeader = (title: string, subtitle: string, icon: React.ReactNode, accent: string = INDIA_ORANGE) => (
        <header className="mb-8 flex items-end justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest uppercase mb-2" style={{ color: accent }}>
                    {icon} {subtitle}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {title}
                </h2>
            </div>
            <button className="hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                View Full Registry <ChevronRight size={14} />
            </button>
        </header>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-sky-950 transition-colors duration-300 pb-20">

            {/* ══════════════════════════════════════════════════════════
                HERO SECTION
            ══════════════════════════════════════════════════════════ */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-slate-200/50 to-transparent dark:from-[#020617] dark:to-transparent" />
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 dark:opacity-10" style={{ background: INDIA_ORANGE }} />
                    <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 dark:opacity-10" style={{ background: INDIA_GREEN }} />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
                        <Zap size={10} /> Strategic Insights for Indian Skies
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
                        Aviation Intelligence
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Access deep strategic intelligence on Indian aviation. Analyze fleet dynamics, airport operational efficiency, and airline market performance through our sovereign data platform.
                    </p>

                    {/* Search Bar - Matching Home.tsx style */}
                    <div className="max-w-2xl mx-auto relative group animate-fade-in-up delay-300">
                        <div
                            className={`absolute -inset-1 blur-xl rounded-2xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
                            style={{ background: `linear-gradient(90deg, ${INDIA_ORANGE}40, #FFFFFF30, ${INDIA_GREEN}40)` }}
                        />
                        <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl flex items-center p-2 shadow-xl dark:shadow-2xl hover:border-slate-300 dark:hover:border-white/20 transition-all">
                            <Search className={`ml-3 mr-3 transition-colors ${isFocused ? 'text-orange-500' : 'text-slate-400 dark:text-gray-500'}`} size={22} />
                            <input
                                type="text"
                                placeholder="Search Registry (e.g. VT-ANP, 6E 554, BOM)..."
                                className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-base font-medium outline-none h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                            <div className="hidden md:flex items-center gap-2 mr-2">
                                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-white/5">REG</span>
                                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-white/5">FLT</span>
                            </div>
                            <button
                                className="px-6 py-2.5 rounded-lg text-slate-900 font-bold transition-all hover:opacity-90 shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
                            >
                                SEARCH
                            </button>
                        </div>
                    </div>
                </div>

                {/* Registry Stats */}
                <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg">
                    {[
                        { label: 'Registered Aircraft', value: '3,482', icon: <Plane size={16} />, color: INDIA_ORANGE },
                        { label: 'Active Airports', value: '137', icon: <MapPin size={16} />, color: '#FFFFFF' },
                        { label: 'Daily Sectors', value: '7,200+', icon: <Activity size={16} />, color: INDIA_GREEN },
                        { label: 'Historical Records', value: '1.2M', icon: <DatabaseIcon size={16} />, color: '#60A5FA' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-[#0c1222] p-6 text-center group hover:bg-white dark:hover:bg-[#11182c] transition-colors">
                            <div className="flex justify-center mb-2" style={{ color: stat.color }}>{stat.icon}</div>
                            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                MAIN DIRECTORY
            ══════════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 space-y-20">

                {/* Categories */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Airline Intelligence', desc: 'Market share, fleet utilization, and operational performance metrics', icon: <Plane size={24} />, accent: INDIA_ORANGE, bg: 'from-orange-500/10 to-transparent' },
                            { title: 'Airport Intelligence', desc: 'Turnaround efficiency, slot capacity, and infrastructure analytics', icon: <MapPin size={24} />, accent: '#FFFFFF', bg: 'from-slate-500/10 to-transparent' },
                            { title: 'Aircraft Intelligence', desc: 'Comprehensive fleet registry, ownership data, and age analysis', icon: <Activity size={24} />, accent: INDIA_GREEN, bg: 'from-green-500/10 to-transparent' },
                        ].map((cat, i) => (
                            <div key={i} className="group relative p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-orange-400/30 dark:hover:border-white/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ color: cat.accent }}>
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{cat.title}</h3>
                                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-6">{cat.desc}</p>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        Access Data <ArrowUpRight size={12} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trending & Safety */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Trending Flights */}
                    <section>
                        {renderSectionHeader('Trending Routes', 'Most Observed Sectors', <TrendingUp size={16} />)}
                        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                            {[
                                { rank: 1, airline: 'VIR', callsign: 'VS479', status: 'LIVE', reg: 'G-VBZZ', type: 'B789', route: 'Cape Town CPT → London LHR', logo: '🔴' },
                                { rank: 2, airline: 'UAE', callsign: 'EK7', status: 'LIVE', reg: 'A6-EEA', type: 'A388', route: 'Dubai DXB → London LHR', logo: '🏜️' },
                                { rank: 3, airline: 'BAW', callsign: 'BA126', status: 'LIVE', reg: 'G-YMMT', type: 'B772', route: 'Doha DOH → London LHR', logo: '🇬🇧' },
                                { rank: 4, airline: 'QTR', callsign: 'QR904', status: 'LIVE', reg: 'A7-BEP', type: 'B77W', route: 'Doha DOH → Melbourne MEL', logo: '🇶🇦' },
                                { rank: 5, airline: 'BAW', callsign: 'BA116', status: 'LIVE', reg: 'G-STBM', type: 'B77W', route: 'New York JFK → London LHR', logo: '🇺🇸' },
                            ].map((flight, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                    <div className="w-8 flex justify-center text-lg font-black text-slate-300 dark:text-white/20 italic">{flight.rank}</div>
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xl shadow-inner">
                                        {flight.logo}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-slate-900 dark:text-white">{flight.callsign}</span>
                                            <span className="text-[9px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded">LIVE</span>
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                                            {flight.reg} · {flight.type}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Vector</div>
                                        <div className="text-xs font-semibold text-slate-700 dark:text-gray-300">{flight.route.split('→')[0]} <span className="text-slate-400">→</span> {flight.route.split('→')[1]}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Squawks / Safety Incidents */}
                    <section>
                        {renderSectionHeader('Safety Registry', 'Squawks & Incidents', <AlertTriangle size={16} />, '#EF4444')}
                        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                            {[
                                { date: '17 Feb', airline: 'UAL', callsign: 'UA613', reg: 'N27903', type: 'B788', route: 'LOS → IAD', code: '7700' },
                                { date: '16 Feb', airline: 'RJA', callsign: 'RJ282', reg: 'JY-BAE', type: 'B788', route: 'IAD → AMM', code: '7600' },
                                { date: '15 Feb', airline: 'TVF', callsign: 'TO4601', reg: 'F-HUYI', type: 'B738', route: 'SVQ → ORY', code: '7700' },
                                { date: '14 Feb', airline: 'AFR', callsign: 'AF7464', reg: 'F-HZUN', type: 'BCS3', route: 'CDG → MPL', code: '7700' },
                                { date: '13 Feb', airline: 'AAY', callsign: 'G43045', reg: 'N331NV', type: 'A319', route: 'PIE → TYS', code: '7500' },
                            ].map((squawk, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center w-12 shrink-0 border-r border-slate-100 dark:border-white/5 pr-4">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">{squawk.date.split(' ')[0]}</span>
                                        <span className="text-[9px] text-slate-500 dark:text-gray-400 uppercase">{squawk.date.split(' ')[1]}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-900 dark:text-white">{squawk.callsign}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${squawk.code === '7700' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                                                squawk.code === '7600' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                                                    'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                                }`}>
                                                <AlertTriangle size={8} /> {squawk.code}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-gray-400 truncate">
                                            {squawk.route}
                                        </div>
                                    </div>
                                    <div className="p-2 rounded bg-slate-100 dark:bg-white/5 text-[10px] font-mono text-slate-500 dark:text-gray-400">
                                        {squawk.reg}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Featured / News */}
                <section>
                    {renderSectionHeader('Registry Chronicles', 'Featured Logbook Entries', <FileText size={16} />, INDIA_GREEN)}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 dark:border-white/5">
                            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <span className="inline-block px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-3">Incident Report</span>
                                <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:underline decoration-2 underline-offset-4 decoration-orange-500">
                                    UPS MD-11 crashes departing Louisville
                                </h3>
                                <div className="text-xs font-mono text-slate-300">
                                    05 NOV 2025 • N259UP • 5X2976
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'First Revenue Flight for Global Airlines A380', airline: 'Global', callsign: '3L380', date: 'Thu, 15 May 2025', badge: 'New Route', color: 'bg-emerald-500' },
                                { title: 'VE Day 80 Flypast: Historic Military Aircraft', airline: 'RAF', callsign: 'RRR', date: 'Mon, 05 May 2025', badge: 'Event', color: 'bg-blue-500' },
                                { title: 'Accident Investigation: Bombardier CRJ9 at YYZ', airline: 'DAL', callsign: 'DL4819', date: 'Mon, 17 Feb 2025', badge: 'Safety', color: 'bg-amber-500' },
                            ].map((news, i) => (
                                <div key={i} className="flex gap-5 p-5 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl hover:border-slate-300 dark:hover:border-white/10 transition-all hover:-translate-x-1 cursor-pointer group">
                                    <div className={`w-1 shrink-0 rounded-full ${news.color}`} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">{news.badge}</span>
                                            <span className="text-[10px] font-mono text-slate-400">{news.date}</span>
                                        </div>
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-1">
                                            {news.title}
                                        </h4>
                                        <div className="text-xs text-slate-500 dark:text-gray-400">
                                            {news.airline} • {news.callsign}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SEO Footer for Registry */}
                <section className="py-10 border-t border-slate-200 dark:border-white/5 text-center">
                    <p className="text-sm text-slate-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        The <strong className="text-slate-700 dark:text-gray-300">Bharat Aviation Registry</strong> is India's unitary database for civil aviation intelligence.
                        Indexing over <span className="font-mono text-xs">1M+</span> records, it provides sovereign access to data regarding
                        DGCA-registered aircraft, airport infrastructure (Vimanapura), and historical flight paths (Udaan).
                        Designed for transparency and powered by indigenous server infrastructure.
                    </p>
                </section>

            </div>
        </div>
    );
};

export default Intelligence;
