import React, { useState } from 'react';
import {
  Sun, Moon, Lock, ChevronDown, ChevronRight,
  Eye, Compass, Sparkles, Ruler, Globe, Brain,
  Bell, CloudSun, Radio, Signal, Plane, Shield, Code
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TEXT, SPACE, COLOR, ACCENT } from './design-tokens';

interface Props {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

/* ── Fold (shared pattern) ── */
const Fold: React.FC<{
  title: string; icon: React.ReactNode; open?: boolean;
  locked?: boolean; accent?: string; children: React.ReactNode;
}> = ({ title, icon, open: init = false, locked, accent, children }) => {
  const [open, setOpen] = useState(init);
  return (
    <div className={`border-t ${COLOR.divider}`} style={open && accent ? { borderLeftWidth: '2px', borderLeftColor: accent } : undefined}>
      <button onClick={() => !locked && setOpen(p => !p)} className={`w-full flex items-center gap-2 ${SPACE.pad} text-left group transition-colors ${open && !locked ? COLOR.subtleBg : ''}`}>
        <span style={open && accent ? { color: accent } : undefined} className={open && accent ? '' : COLOR.inactiveText}>{icon}</span>
        <span className={`flex-1 ${TEXT.sectionTitle} transition-colors ${open && !locked ? COLOR.titleActiveText : COLOR.titleText}`}>{title}</span>
        {locked
          ? <Lock size={11} className={COLOR.lockedText} />
          : <span className={COLOR.inactiveText}>{open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</span>
        }
      </button>
      {open && !locked && <div className={`${SPACE.px} pb-2.5 sm:pb-3`}>{children}</div>}
    </div>
  );
};

/* ── Toggle row ── */
const Toggle: React.FC<{ label: string; desc?: string; active: boolean; onClick: () => void }> = ({ label, desc, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-2 py-1.5 sm:py-2 rounded-md transition-all ${active ? 'bg-cyan-50/80 dark:bg-cyan-500/[0.06]' : ''}`}>
    <div className="text-left">
      <span className={`${TEXT.label} font-bold block ${active ? COLOR.activeText : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
      {desc && <span className={`${TEXT.sub} ${COLOR.labelText} block`}>{desc}</span>}
    </div>
    <div className={`w-7 h-[16px] rounded-full relative transition-all shrink-0 ${active ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-white/10'}`}>
      <div className={`absolute top-[2px] w-3 h-3 bg-white rounded-full shadow-sm transition-all ${active ? 'left-[12px]' : 'left-[2px]'}`} />
    </div>
  </button>
);

/* ── Option selector ── */
const Option: React.FC<{ options: { id: string; label: string; icon?: React.ReactNode }[]; active: string; onChange: (id: string) => void }> = ({ options, active, onChange }) => (
  <div className={`grid grid-cols-${options.length} ${SPACE.gridGap}`}>
    {options.map(o => (
      <button key={o.id} onClick={() => onChange(o.id)}
        className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md border transition-all ${
          active === o.id ? `${COLOR.activeBg} ${COLOR.activeBorder} ${COLOR.activeText}` : `${COLOR.subtleBg} ${COLOR.inactiveBorder} text-slate-500 dark:text-slate-400 ${COLOR.hoverBg}`
        }`}>
        {o.icon}{o.label && <span className={`${TEXT.badge} font-bold`}>{o.label}</span>}
      </button>
    ))}
  </div>
);

/* ── Info row ── */
const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className={`flex items-center justify-between ${SPACE.rowPy}`}>
    <span className={`${TEXT.label} ${COLOR.labelText}`}>{label}</span>
    <span className={`${TEXT.value} ${COLOR.valueText}`}>{value}</span>
  </div>
);

const SettingsPanel: React.FC<Props> = ({ theme, toggleTheme }) => {
  const { isLoggedIn } = useAuth();
  const L = !isLoggedIn;
  const [units, setUnits] = useState<'aviation' | 'simplified'>('aviation');
  const [region, setRegion] = useState<'india' | 'global'>('india');
  const [explainLevel, setExplainLevel] = useState<'simple' | 'detailed'>('simple');
  const [alertLevel, setAlertLevel] = useState<'low' | 'medium' | 'high'>('medium');

  return (
    <div className="flex flex-col min-h-0 h-full overflow-hidden">

      {/* ── Header ── */}
      <div className={`${SPACE.pad} ${COLOR.subtleBg} border-b ${COLOR.divider} shrink-0`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">⚙️</span>
          <span className={`${TEXT.label} font-bold text-slate-700 dark:text-slate-300`}>Control Center</span>
        </div>
        <p className={`${TEXT.sub} ${COLOR.labelText} leading-relaxed`}>
          Personalize your AeroSky experience. Passenger-first defaults, advanced controls for enthusiasts.
        </p>
      </div>

      {/* ── Scrollable sections ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ═══ 1. EXPERIENCE & DISPLAY ═══ */}
        <Fold title="Experience & Display" icon={<Sun size={12} />} open accent={ACCENT.aircraft}>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5`}>Theme</div>
          <Option
            options={[
              { id: 'light', label: 'Standard', icon: <Sun size={13} /> },
              { id: 'dark', label: 'Night Ops', icon: <Moon size={13} /> },
            ]}
            active={theme}
            onChange={(id) => { if (id !== theme) toggleTheme(); }}
          />
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5 mt-3`}>Visual</div>
          <div className="space-y-0.5">
            <Toggle label="Smooth Animations" desc="Transition effects on map" active={true} onClick={() => {}} />
            <Toggle label="Auto-Focus Selected" desc="Center map on clicked flight" active={true} onClick={() => {}} />
            <Toggle label="Follow Aircraft" desc="Auto-pan with selected flight" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 2. UNITS & LOCALIZATION ═══ */}
        <Fold title="Units & Region" icon={<Ruler size={12} />} open accent={ACCENT.environment}>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5`}>Measurement</div>
          <Option
            options={[
              { id: 'aviation', label: 'Aviation (ft, kts, FL)' },
              { id: 'simplified', label: 'Simplified (km, km/h)' },
            ]}
            active={units}
            onChange={(id) => setUnits(id as any)}
          />
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5 mt-3`}>Region</div>
          <Option
            options={[
              { id: 'india', label: '🇮🇳 India', icon: undefined },
              { id: 'global', label: '🌍 Global', icon: undefined },
            ]}
            active={region}
            onChange={(id) => setRegion(id as any)}
          />
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>DGCA-compliant units for Indian airspace</p>
        </Fold>

        {/* ═══ 3. INTELLIGENCE PREFERENCES ═══ */}
        <Fold title="Intelligence Preferences" icon={<Brain size={12} />} accent={ACCENT.telemetry}>
          <div className="space-y-0.5">
            <Toggle label="Show AI Insights" desc="Passenger intelligence briefings" active={true} onClick={() => {}} />
          </div>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5 mt-3`}>Explanation Level</div>
          <Option
            options={[
              { id: 'simple', label: '🧍 Passenger' },
              { id: 'detailed', label: '🧠 Enthusiast' },
            ]}
            active={explainLevel}
            onChange={(id) => setExplainLevel(id as any)}
          />
          <p className={`mt-1 ${TEXT.sub} ${COLOR.labelText} italic`}>
            {explainLevel === 'simple' ? '"Flight delayed due to fog at Delhi"' : '"CAT III visibility conditions at VIDP, RVR 200m"'}
          </p>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5 mt-3`}>Alert Sensitivity</div>
          <Option
            options={[
              { id: 'low', label: 'Low' },
              { id: 'medium', label: 'Medium' },
              { id: 'high', label: 'High' },
            ]}
            active={alertLevel}
            onChange={(id) => setAlertLevel(id as any)}
          />
        </Fold>

        {/* ═══ 4. ENVIRONMENT AWARENESS ═══ */}
        <Fold title="Environment Awareness" icon={<CloudSun size={12} />} accent={ACCENT.environment}>
          <div className="space-y-0.5">
            <Toggle label="Weather Impact" desc="Show weather-affected flights" active={true} onClick={() => {}} />
            <Toggle label="Congestion Alerts" desc="Airport & FIR congestion" active={true} onClick={() => {}} />
            <Toggle label="Delay Predictions" desc="AI-powered delay forecasts" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ AUTH-GATED SECTIONS ═══ */}

        {/* ═══ 5. DATA TRANSPARENCY (Auth — CORE USP) ═══ */}
        <Fold title="Data Sovereignty" icon={<Radio size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className={`px-2 py-2 bg-emerald-50 dark:bg-emerald-500/[0.04] border border-emerald-200 dark:border-emerald-500/10 rounded-md mb-2`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`${TEXT.badge} font-bold text-emerald-700 dark:text-emerald-400`}>🇮🇳 Sovereign Mode Active</span>
            </div>
            <p className={`${TEXT.sub} text-emerald-600/70 dark:text-emerald-400/50`}>Only Indian ADS-B network data. Zero foreign cloud dependency.</p>
          </div>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5`}>Data Strategy</div>
          <Option
            options={[
              { id: 'sovereign', label: '🇮🇳 Sovereign' },
              { id: 'hybrid', label: '🌐 Hybrid' },
            ]}
            active="sovereign"
            onChange={() => {}}
          />
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5 mt-3`}>Transparency</div>
          <div className="space-y-0.5">
            <Toggle label="Show Signal Source" desc="Station IDs on data" active={true} onClick={() => {}} />
            <Toggle label="Show Confidence Levels" desc="Real vs estimated indicators" active={true} onClick={() => {}} />
            <Toggle label="Show Estimated Tracks" desc="Dashed lines for MLAT" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 6. FEEDER & CONTRIBUTION (Auth) ═══ */}
        <Fold title="Feeder & Contribution" icon={<Signal size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className="space-y-0.5">
            <Toggle label="Show My Station Impact" desc="Highlight your coverage area" active={false} onClick={() => {}} />
            <Toggle label="Contribution Attribution" desc="Your name on tracked flights" active={true} onClick={() => {}} />
          </div>
          <div className={`mt-2 px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="Your Stations" value="0 active" />
            <Info label="Flights Tracked" value="—" />
            <p className={`${TEXT.sub} ${COLOR.labelText} italic mt-1`}>Host a receiver to contribute to Indian airspace coverage</p>
          </div>
        </Fold>

        {/* ═══ 7. FLIGHT DATA PREFERENCES (Auth) ═══ */}
        <Fold title="Flight Preferences" icon={<Plane size={12} />} locked={L} accent={ACCENT.aircraft}>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5`}>Default Aircraft Label</div>
          <Option
            options={[
              { id: 'callsign', label: 'Callsign' },
              { id: 'registration', label: 'Registration' },
              { id: 'airline', label: 'Airline' },
            ]}
            active="callsign"
            onChange={() => {}}
          />
          <div className="mt-3 space-y-0.5">
            <Toggle label="Advanced Telemetry" desc="TAS, IAS, Mach, Roll" active={true} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 8. SECURITY & ACCESS (Auth) ═══ */}
        <Fold title="Security & Access" icon={<Shield size={12} />} locked={L} accent={ACCENT.sovereign}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="Access Level" value="Standard" />
            <Info label="Mode" value="Civil" />
            <p className={`${TEXT.sub} ${COLOR.labelText} italic mt-1`}>Restricted & Defence views available for authorized personnel</p>
          </div>
        </Fold>

        {/* ═══ 9. API & INTEGRATION (Auth) ═══ */}
        <Fold title="API & Integration" icon={<Code size={12} />} locked={L} accent={ACCENT.telemetry}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <p className={`${TEXT.sub} ${COLOR.labelText} italic`}>API access keys, data export preferences, and webhook configuration — available in Enterprise tier.</p>
          </div>
        </Fold>

        {/* ── Auth CTA ── */}
        {L && (
          <div className={`${SPACE.pad} border-t ${COLOR.divider}`}>
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-md px-2.5 py-2">
              <Lock size={10} className="text-amber-500 shrink-0" />
              <span className={`${TEXT.sub} text-amber-700 dark:text-amber-400 font-bold`}>Sign in for data sovereignty controls, feeder settings, flight preferences & API access</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SettingsPanel;
