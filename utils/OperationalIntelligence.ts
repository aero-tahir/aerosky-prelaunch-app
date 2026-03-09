import { Flight } from '../types';

export const SignalQuality = { HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

/**
 * Operational Intelligence Engine (India First)
 * 
 * Transforms raw ADS-B telemetry into human-readable aviation insights.
 * Deep awareness of Indian airspace, FIR sectors, key airports,
 * seasonal weather patterns, and DGCA operational context.
 */

// ══════════════════════════════════════════════
// INDIA-SPECIFIC KNOWLEDGE BASE
// ══════════════════════════════════════════════

const INDIAN_FIR: Record<string, { name: string; center: string; freq: string }> = {
    'DEL': { name: 'Delhi FIR', center: 'Delhi ACC', freq: '128.05 MHz' },
    'BOM': { name: 'Mumbai FIR', center: 'Mumbai ACC', freq: '125.20 MHz' },
    'MAA': { name: 'Chennai FIR', center: 'Chennai ACC', freq: '126.90 MHz' },
    'CCU': { name: 'Kolkata FIR', center: 'Kolkata ACC', freq: '127.90 MHz' },
};

const AIRPORT_INTEL: Record<string, {
    congestion: 'Saturated' | 'High' | 'Moderate' | 'Low';
    risk: string;
    humanNote: string;
    notam: string;
    rwyInfo: string;
}> = {
    'DEL': {
        congestion: 'Saturated',
        risk: 'High',
        humanNote: 'IGI Airport operating at peak capacity. Average taxi time 25 minutes. Stack holding likely over IIMOD/REVOL waypoints during evening rush.',
        notam: 'RWY 28/10 resurfacing. Single runway ops may cause 15-30 min delays.',
        rwyInfo: 'RWY 29 ILS CAT IIIB',
    },
    'BOM': {
        congestion: 'High',
        risk: 'Moderate',
        humanNote: 'CSIA intersecting runways active. Cross-runway delays 8-12 mins. Heavy departure traffic towards GULF sector.',
        notam: 'Noise abatement procedures in effect 2300-0600 IST.',
        rwyInfo: 'RWY 27 ILS CAT I',
    },
    'BLR': {
        congestion: 'Moderate',
        risk: 'Low',
        humanNote: 'KIA dual runway ops normal. Terminal 2 international arrivals flowing smoothly.',
        notam: 'No active NOTAMs affecting operations.',
        rwyInfo: 'RWY 09L/27R Active',
    },
    'MAA': {
        congestion: 'Moderate',
        risk: 'Low',
        humanNote: 'Chennai International operating normally. Sea breeze may shift runway preference to 25 post-1400 local.',
        notam: 'Apron Bay 21-25 under maintenance.',
        rwyInfo: 'RWY 07/25',
    },
    'HYD': {
        congestion: 'Low',
        risk: 'Low',
        humanNote: 'RGIA traffic flow nominal. Good weather operations throughout the day.',
        notam: 'No active NOTAMs.',
        rwyInfo: 'RWY 09R/27L',
    },
    'CCU': {
        congestion: 'Moderate',
        risk: 'Moderate',
        humanNote: 'NSCBI Airport operating in mixed mode. Fog advisories active during winter mornings.',
        notam: 'Low visibility ops may be in effect 0500-0900 IST during fog season.',
        rwyInfo: 'RWY 01/19',
    },
    'GOI': {
        congestion: 'Low',
        risk: 'Moderate',
        humanNote: 'Dabolim / Mopa operations. Tourist season traffic elevated. Terrain awareness required on missed approach.',
        notam: 'Night landing restrictions in effect.',
        rwyInfo: 'RWY 08/26',
    },
    'COK': {
        congestion: 'Low',
        risk: 'Low',
        humanNote: 'Cochin International operating normally. Monsoon season may affect afternoon slots.',
        notam: 'Solar-powered runway lighting active.',
        rwyInfo: 'RWY 09/27',
    },
    'SXR': {
        congestion: 'Moderate',
        risk: 'High',
        humanNote: 'Srinagar Sheikh ul-Alam: Mountain-surrounded approach (visual only in clear weather). High-security clearances required.',
        notam: 'NOTAM: Restricted area active. ATC clearance mandatory before descent.',
        rwyInfo: 'RWY 17/35 VOR/DME',
    },
    'IXL': {
        congestion: 'Low',
        risk: 'High',
        humanNote: 'Leh Kushok Bakula: one of the world\'s highest airports. Operations are limited to a morning window (0530-0930 local) due to terrain winds.',
        notam: 'CRITICAL: All operations daylight VFR only. No go-around possible.',
        rwyInfo: 'RWY 07/25 VISUAL',
    },
};

// ══════════════════════════════════════════════
// FIR SECTOR DETECTION
// ══════════════════════════════════════════════

const getFIRSector = (lat: number, lng: number): { name: string; center: string; freq: string } => {
    if (lat > 24 && lng < 77) return INDIAN_FIR['DEL'];
    if (lat < 24 && lng < 77) return INDIAN_FIR['BOM'];
    if (lat < 16 && lng > 77) return INDIAN_FIR['MAA'];
    if (lat > 16 && lng > 77) return INDIAN_FIR['CCU'];
    return { name: 'Mumbai FIR', center: 'Mumbai ACC', freq: '125.20 MHz' };
};

// ══════════════════════════════════════════════
// HUMAN-CENTRIC FLIGHT PHASE INTERPRETATION
// ══════════════════════════════════════════════

export const getFlightPhase = (flight: Flight): {
    phase: string;
    humanLabel: string;
    description: string;
    icon: string;
    color: string;
} => {
    const { altitude, groundSpeed, vertRate = 0 } = flight.liveMetrics;
    const vr = vertRate || 0;

    if (altitude < 500 && groundSpeed < 50) return {
        phase: 'GROUND', humanLabel: 'On Ground', icon: '🛬',
        description: `Aircraft is on ground at ${flight.origin.city}. Pushback or taxi in progress.`, color: 'text-gray-400',
    };
    if (altitude < 5000 && vr > 500) return {
        phase: 'TAKEOFF', humanLabel: 'Just Departed', icon: '🛫',
        description: `Climbing out of ${flight.origin.iata}. Expect initial climb restrictions in congested sector.`, color: 'text-emerald-400',
    };
    if (altitude < 15000 && vr > 200) return {
        phase: 'CLIMB', humanLabel: 'Climbing', icon: '📈',
        description: `Gaining altitude after departure. Transitioning through lower airspace towards cruise level.`, color: 'text-cyan-400',
    };
    if (altitude > 28000 && Math.abs(vr) < 200) return {
        phase: 'CRUISE', humanLabel: 'Cruising', icon: '✈️',
        description: `Stable at FL${Math.round(altitude / 100)}. Smooth air operations at optimal fuel burn altitude.`, color: 'text-blue-400',
    };
    if (altitude > 15000 && altitude < 28000 && vr < -200) return {
        phase: 'TOD', humanLabel: 'Top of Descent', icon: '📉',
        description: `Beginning descent towards ${flight.destination.iata}. Speed management for arrival sequence.`, color: 'text-yellow-400',
    };
    if (altitude < 10000 && vr < -300) return {
        phase: 'APPROACH', humanLabel: 'On Approach', icon: '🎯',
        description: `In approach phase for ${flight.destination.city}. Landing in approximately ${Math.floor(altitude / 800)} minutes.`, color: 'text-orange-400',
    };
    if (altitude < 3000 && vr < -500) return {
        phase: 'FINAL', humanLabel: 'Final Approach', icon: '🏁',
        description: `On final approach to ${flight.destination.iata}. Gear down, landing imminent.`, color: 'text-red-400',
    };

    return {
        phase: 'EN_ROUTE', humanLabel: 'En Route', icon: '✈️',
        description: `Transiting ${getFIRSector(flight.liveMetrics.lat, flight.liveMetrics.lng).name} airspace.`, color: 'text-cyan-400',
    };
};

// ══════════════════════════════════════════════
// RICH OPERATIONAL INTELLIGENCE
// ══════════════════════════════════════════════

export const getOperationalStatus = (flight: Flight): string => {
    return getFlightPhase(flight).humanLabel;
};

export const getDelayRiskDetails = (flight: Flight) => {
    const dest = flight.destination.iata;
    const info = AIRPORT_INTEL[dest];

    if (info) {
        return {
            level: info.congestion,
            message: info.humanNote,
            riskColor: info.congestion === 'Saturated' ? 'text-red-400' :
                info.congestion === 'High' ? 'text-orange-400' :
                    info.congestion === 'Moderate' ? 'text-yellow-400' :
                        'text-emerald-400',
        };
    }
    return { level: 'Nominal', message: 'No specific advisories for this destination.', riskColor: 'text-emerald-400' };
};

export const getDestinationIntel = (iata: string) => {
    return AIRPORT_INTEL[iata] || {
        congestion: 'Low' as const,
        risk: 'Low',
        humanNote: 'Standard operations. No significant alerts.',
        notam: 'No active NOTAMs.',
        rwyInfo: 'Information not available',
    };
};

export const generatePilotReport = (flight: Flight): string => {
    const { altitude, signalConfidence, lat, lng, vertRate = 0, windSpeed = 0, oat } = flight.liveMetrics;
    const vr = vertRate || 0;
    const fir = getFIRSector(lat, lng);
    const phase = getFlightPhase(flight);
    const dest = flight.destination.iata;
    const destIntel = AIRPORT_INTEL[dest];

    // Terrain awareness - Himalayan corridor
    if (lat > 30 && lng > 75 && lng < 85) {
        return `Operating in Himalayan corridor. Mountain wave turbulence possible. ${fir.center} providing awareness on ${fir.freq}. Minimum sector altitude restrictions apply.`;
    }

    // Signal degradation
    if (signalConfidence === 'Low') {
        return `ADS-B signal intermittent. Likely terrain masking in ${fir.name}, position accuracy may be reduced. Last reliable fix at FL${Math.round(altitude / 100)}.`;
    }

    // High winds
    if (windSpeed > 40) {
        return `Strong headwind component ${windSpeed}kt reported at FL${Math.round(altitude / 100)}. Fuel monitoring advisory. ETA may be affected by ${Math.round(windSpeed / 10)} minutes.`;
    }

    // Cold temperature
    if (oat && oat < -55) {
        return `Cold air mass at FL${Math.round(altitude / 100)}, OAT ${Math.round(oat)}°C. Temperature correction required for altitude. Crew observing fuel temperature limits.`;
    }

    // Approach to congested airport
    if (phase.phase === 'APPROACH' || phase.phase === 'TOD') {
        if (destIntel && (destIntel.congestion === 'High' || destIntel.congestion === 'Saturated')) {
            return `Descending for ${dest}. ${destIntel.congestion} traffic reported. ${destIntel.humanNote}`;
        }
        return `Commencing approach for ${dest}. ${destIntel?.rwyInfo || 'Runway info pending'} expected.`;
    }

    // Cruising - provide sector awareness
    if (phase.phase === 'CRUISE') {
        return `Cruising at FL${Math.round(altitude / 100)} through ${fir.name}. ${fir.center} observing. Smooth ride, operations normal.`;
    }

    // Climbing
    if (vr > 300) {
        return `Climbing out of ${flight.origin.iata} at ${Math.abs(Math.round(vr))} fpm. Transitioning through ${fir.name}. Clear above.`;
    }

    // Default context
    return `Transiting ${fir.name}, ${fir.center} on ${fir.freq}. FL${Math.round(altitude / 100)}, ${phase.humanLabel}. Operations normal.`;
};

// ══════════════════════════════════════════════
// INDIAN AIRSPACE INTELLIGENCE
// ══════════════════════════════════════════════

export const getIndianAirspaceContext = (flight: Flight): {
    fir: { name: string; center: string; freq: string };
    phase: ReturnType<typeof getFlightPhase>;
    destIntel: ReturnType<typeof getDestinationIntel>;
    humanSummary: string;
    alerts: string[];
} => {
    const fir = getFIRSector(flight.liveMetrics.lat, flight.liveMetrics.lng);
    const phase = getFlightPhase(flight);
    const destIntel = getDestinationIntel(flight.destination.iata);
    const alerts: string[] = [];

    // Generate alerts
    if (destIntel.congestion === 'Saturated' || destIntel.congestion === 'High') {
        alerts.push(`⚠️ ${flight.destination.iata}: ${destIntel.congestion} traffic. Expect delays.`);
    }
    if (flight.liveMetrics.lat > 30 && flight.liveMetrics.lng > 75) {
        alerts.push(`🏔️ Himalayan Corridor: terrain awareness zone`);
    }
    if (flight.liveMetrics.signalConfidence === 'Low') {
        alerts.push(`📡 Signal quality degraded: terrain masking likely`);
    }
    if ((flight.liveMetrics.windSpeed || 0) > 35) {
        alerts.push(`💨 Strong winds ${flight.liveMetrics.windSpeed}kt at altitude`);
    }

    // Human-readable summary
    const humanSummary = `${flight.airline} flight ${flight.flightNumber} is ${phase.humanLabel.toLowerCase()} ` +
        `from ${flight.origin.city} to ${flight.destination.city}. ` +
        `Currently in ${fir.name} airspace at ${flight.liveMetrics.altitude.toLocaleString()} ft.` +
        (destIntel.congestion !== 'Low' ? ` ${flight.destination.iata} is reporting ${destIntel.congestion.toLowerCase()} traffic levels.` : '');

    return { fir, phase, destIntel, humanSummary, alerts };
};

// ══════════════════════════════════════════════
// SIGNAL & FEEDER UTILITIES
// ══════════════════════════════════════════════

export const getFeederStatus = (flight: Flight) => {
    const count = flight.liveMetrics.feederCount || 1;
    const strongest = flight.liveMetrics.rssi || -20;
    return {
        text: `${count} Station${count > 1 ? 's' : ''} Observing`,
        quality: strongest > -15 ? 'Excellent' : strongest > -25 ? 'Good' : 'Marginal',
        source: 'ADS-B (1090MHz)',
    };
};

export const measureSignalConfidence = (lastContact: number): 'High' | 'Medium' | 'Low' => {
    const now = Date.now() / 1000;
    const diff = now - lastContact;
    if (diff < 10) return 'High';
    if (diff < 30) return 'Medium';
    return 'Low';
};

export const generateMockSignalData = () => ({
    rssi: -Math.floor(Math.random() * 30) - 5,
    feederCount: Math.floor(Math.random() * 12) + 1,
});

export const deriveOperationalStatus = (alt: number, speed: number, vRate: number, onGround: boolean): string => {
    if (onGround) return 'Taxi / Ground';
    if (alt < 2000 && vRate < -500) return 'Final Approach';
    if (alt < 5000 && vRate > 500) return 'Initial Climb';
    if (speed < 200 && alt > 10000) return 'Holding Pattern';
    if (alt > 28000) return 'Cruising';
    return 'En Route';
};
