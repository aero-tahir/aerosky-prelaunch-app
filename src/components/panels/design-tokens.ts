/**
 * Panel Design Tokens
 *
 * Single source of truth for all panel typography, spacing, colors, and component styles.
 * Import and use these constants across every panel component.
 * Update here → every panel updates automatically.
 */

/* ── Typography ── */
export const TEXT = {
    /** Section headers: "ENVIRONMENT", "AIRCRAFT", etc. */
    sectionTitle: 'text-[10px] sm:text-[11px] font-bold uppercase tracking-wider',
    /** Data labels: "Air Temp", "Registration", etc. */
    label: 'text-[10px] sm:text-[11px] font-medium',
    /** Data values: "32,000 ft", "VT-IZM", etc. */
    value: 'text-[10px] sm:text-[11px] font-bold font-mono',
    /** Small sublabels, descriptions, hints */
    sub: 'text-[8px] sm:text-[9px]',
    /** Badges, tags, status pills */
    badge: 'text-[9px] sm:text-[10px] font-bold',
    /** Search input text */
    input: 'text-[10px] sm:text-[11px]',
    /** Large display values (altitude, speed cards) */
    display: 'text-xs sm:text-sm font-black font-mono',
    /** Flight number in hero */
    heroTitle: 'text-xl sm:text-2xl font-black font-mono tracking-tight',
    /** IATA codes in route bar */
    iata: 'text-sm sm:text-base font-black font-mono leading-none',
} as const;

/* ── Spacing ── */
export const SPACE = {
    /** Standard horizontal padding inside panels */
    px: 'px-3 sm:px-4',
    /** Standard vertical padding inside sections */
    py: 'py-2.5 sm:py-3',
    /** Combined padding for section content */
    pad: 'px-3 sm:px-4 py-2.5 sm:py-3',
    /** Padding for compact rows */
    rowPy: 'py-[5px] sm:py-[6px]',
    /** Gap between sections */
    sectionGap: 'space-y-4',
    /** Gap between items in a section */
    itemGap: 'space-y-1',
    /** Grid gap for 2-col layouts */
    gridGap: 'gap-1.5 sm:gap-2',
} as const;

/* ── Colors (light / dark) ── */
export const COLOR = {
    /** Card / info box background */
    cardBg: 'bg-white dark:bg-white/[0.02]',
    /** Subtle background for sections */
    subtleBg: 'bg-slate-50 dark:bg-white/[0.03]',
    /** Standard border */
    border: 'border border-slate-200 dark:border-white/[0.05]',
    /** Active / selected state */
    activeBg: 'bg-cyan-50 dark:bg-cyan-500/10',
    activeBorder: 'border-cyan-200 dark:border-cyan-500/20',
    activeText: 'text-cyan-600 dark:text-cyan-400',
    /** Inactive / default state */
    inactiveText: 'text-slate-500 dark:text-slate-400',
    inactiveBg: 'bg-slate-50 dark:bg-white/[0.03]',
    inactiveBorder: 'border-slate-200 dark:border-white/[0.05]',
    /** Label text */
    labelText: 'text-slate-500 dark:text-slate-400',
    /** Value text */
    valueText: 'text-slate-700 dark:text-slate-300',
    /** Section title text (default) */
    titleText: 'text-slate-600 dark:text-slate-400',
    /** Section title text (expanded) */
    titleActiveText: 'text-slate-800 dark:text-slate-200',
    /** Hover background */
    hoverBg: 'hover:bg-slate-50 dark:hover:bg-white/[0.03]',
    /** Divider */
    divider: 'border-slate-100 dark:border-white/[0.04]',
    /** Locked / disabled */
    lockedText: 'text-slate-300 dark:text-slate-500',
    /** Error / clear */
    errorText: 'text-red-500 hover:text-red-600',
} as const;

/* ── Component Sizes ── */
export const SIZE = {
    /** Icon size inside toggles / buttons */
    icon: 13,
    /** Toggle switch dimensions */
    toggleTrack: 'w-7 h-[16px]',
    toggleKnob: 'w-3 h-3',
    toggleKnobOn: 'left-[12px]',
    toggleKnobOff: 'left-[2px]',
    /** Icon container in toggles */
    iconBox: 'w-7 h-7 rounded-md',
    /** Checkbox size */
    checkbox: 'w-4 h-4 rounded-md',
    /** Border radius for cards */
    radius: 'rounded-lg',
    /** Border radius for sections */
    sectionRadius: 'rounded-lg',
} as const;

/* ── Section Accent Colors (hex for inline styles) ── */
export const ACCENT = {
    environment: '#60a5fa',   // blue-400
    aircraft: '#fbbf24',      // amber-400
    telemetry: '#c084fc',     // purple-400
    transparency: '#34d399',  // emerald-400
    sovereign: '#22d3ee',     // cyan-400
    registry: '#fb923c',      // orange-400
    service: '#818cf8',       // indigo-400
} as const;
