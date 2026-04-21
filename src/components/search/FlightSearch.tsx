import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Search, X, Plane, ArrowRight } from 'lucide-react';
import type { Flight } from '@/types';

/* ── Scoring: exact matches rank highest ── */
function scoreFlight(flight: Flight, q: string): number {
  const fn = flight.flightNumber.toLowerCase().replace(/\s/g, '');
  const qn = q.replace(/\s/g, '');

  if (fn === qn) return 100;
  if (flight.aircraft.registration.toLowerCase() === q) return 95;
  if (flight.airlineCode.toLowerCase() === q) return 90;
  if (fn.startsWith(qn)) return 85;
  if (flight.aircraft.registration.toLowerCase().includes(q)) return 80;
  if (flight.airline.toLowerCase().includes(q)) return 70;
  if (flight.origin.iata.toLowerCase() === q || flight.destination.iata.toLowerCase() === q) return 65;
  if (flight.origin.city.toLowerCase().includes(q) || flight.destination.city.toLowerCase().includes(q)) return 60;
  if (flight.aircraft.type.toLowerCase().includes(q)) return 50;
  if (flight.aircraft.typeCode?.toLowerCase().includes(q)) return 50;
  if (flight.aircraft.icao24?.toLowerCase().includes(q)) return 40;
  if (flight.flightNumber.toLowerCase().includes(q)) return 35;
  return 0;
}

export function rankedSearch(query: string, flights: Flight[]): Flight[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return flights
    .map(f => ({ flight: f, score: scoreFlight(f, q) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(r => r.flight);
}

/* ── Highlight matched text ── */
export const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-cyan-600 dark:text-cyan-400 font-bold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
};

interface FlightSearchProps {
  flights: Flight[];
  onSelect: (flightId: string) => void;
  hidden?: boolean;
}

/* ── Result row (shared between floating and embedded) ── */
export const FlightResultRow: React.FC<{
  flight: Flight; query: string; active: boolean;
  onClick: () => void; onHover: () => void;
}> = ({ flight, query, active, onClick, onHover }) => (
  <button
    onClick={onClick}
    onMouseEnter={onHover}
    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors duration-100 ${
      active ? 'bg-cyan-500/10 dark:bg-cyan-400/10' : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
    }`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
      flight.status === 'Delayed' ? 'bg-red-500/10 text-red-500'
        : flight.status === 'Landing' ? 'bg-amber-500/10 text-amber-500'
        : 'bg-cyan-500/10 text-cyan-500 dark:text-cyan-400'
    }`}>
      <Plane size={14} strokeWidth={1.8} className={flight.status === 'Landing' ? 'rotate-45' : '-rotate-45'} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono">
          <Highlight text={flight.flightNumber} query={query} />
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
          <Highlight text={flight.airline} query={query} />
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
          <Highlight text={flight.aircraft.registration} query={query} />
        </span>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
          <Highlight text={flight.origin.iata} query={query} />
          <ArrowRight size={8} />
          <Highlight text={flight.destination.iata} query={query} />
        </div>
      </div>
    </div>
    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
      flight.status === 'Delayed' ? 'bg-red-500/10 text-red-500 dark:text-red-400'
        : flight.status === 'Landing' ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
        : flight.status === 'Scheduled' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    }`}>
      {flight.status}
    </span>
  </button>
);

const FlightSearch: React.FC<FlightSearchProps> = ({ flights, onSelect, hidden = false }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => rankedSearch(query, flights), [query, flights]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveIdx(-1);
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const handleSelect = useCallback((flightId: string) => {
    onSelect(flightId);
    setOpen(false);
  }, [onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0 && results[activeIdx]) {
      e.preventDefault();
      handleSelect(results[activeIdx].id);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`absolute top-16 sm:top-20 right-3 sm:right-4 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hidden ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* ── Collapsed: icon button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            dock-noise relative
            w-10 h-10 flex items-center justify-center rounded-2xl
            bg-white/65 dark:bg-[rgb(20,25,35)]/80
            backdrop-blur-[16px] dark:backdrop-blur-[20px]
            border border-white/40 dark:border-white/[0.08]
            shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]
            dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_12px_40px_rgba(0,0,0,0.35)]
            text-slate-600 dark:text-slate-300
            hover:text-slate-900 dark:hover:text-white
            hover:scale-105
            transition-all duration-[180ms] ease-out
          "
          aria-label="Search flights"
        >
          <Search size={18} strokeWidth={1.8} />
        </button>
      )}

      {/* ── Expanded: search bar + dropdown ── */}
      {open && (
        <div className="dock-noise relative w-[calc(100vw-24px)] sm:w-[380px] rounded-2xl overflow-visible
          bg-white/70 dark:bg-[rgb(20,25,35)]/85
          backdrop-blur-[20px]
          border border-white/40 dark:border-white/[0.08]
          shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.12)]
          dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_16px_48px_rgba(0,0,0,0.4)]
        ">
          {/* Gradient tint */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-r from-white/20 via-blue-50/10 to-white/20 dark:from-blue-900/15 dark:via-slate-800/5 dark:to-blue-900/15" />

          {/* Input row */}
          <div className="relative z-10 flex items-center gap-2 px-3.5 py-2.5">
            <Search size={16} strokeWidth={1.8} className="text-slate-400 dark:text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveIdx(-1); }}
              onKeyDown={handleKeyDown}
              placeholder="Flight, airline, registration, airport..."
              className="flex-1 bg-transparent text-[12px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none font-medium"
            />
            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.06] text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Results dropdown */}
          {query.trim() && (
            <div className="relative z-10 border-t border-white/20 dark:border-white/[0.06] max-h-[320px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">No flights found for "{query}"</p>
                </div>
              ) : (
                results.map((flight, idx) => (
                  <FlightResultRow
                    key={flight.id}
                    flight={flight}
                    query={query}
                    active={idx === activeIdx}
                    onClick={() => handleSelect(flight.id)}
                    onHover={() => setActiveIdx(idx)}
                  />
                ))
              )}
            </div>
          )}

          {/* Keyboard hint */}
          {!query.trim() && (
            <div className="relative z-10 border-t border-white/20 dark:border-white/[0.06] px-3.5 py-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Search by flight number, airline, registration, airport code or city
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
