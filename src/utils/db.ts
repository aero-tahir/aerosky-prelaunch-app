import { neon } from '@neondatabase/serverless';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || '';

// Seeding static database entries
const SEED_APPLICATIONS: any[] = [];


export interface AeroCaptainApplication {
  founding_number: string;
  name: string;
  email: string;
  city: string;
  state: string;
  country: string;
  internet_type: string;
  rooftop_available: boolean;
  existing_hardware: string[];
  referral_code: string;
  application_date?: string;
  status?: string;
}

export interface NewsletterSubscriber {
  email: string;
  source_page: string;
  referral_code: string;
  timestamp?: string;
}

export interface LaunchMetrics {
  foundingCaptains: number;
  citiesRegistered: number;
  statesRepresented: number;
  newsletterSubscribers: number;
  communityMembers: number;
}

let sqlClient: any = null;
let useLocalFallback = true;

if (DATABASE_URL) {
  try {
    sqlClient = neon(DATABASE_URL);
    useLocalFallback = false;
    console.log('[Database] Connecting to Neon Postgres DB...');
  } catch (e) {
    console.error('[Database] Failed to initialize Neon connection, falling back to Local Storage:', e);
  }
} else {
  console.log('[Database] No DATABASE_URL provided. Operating in Local Storage fallback mode.');
}

/**
 * Ensures the prelaunch schema and tables exist.
 * Seeds initial 31 applications and mocks if they do not exist.
 */
export async function initDB(): Promise<void> {
  if (useLocalFallback) {
    initLocalStorageDB();
    return;
  }

  try {
    // 1. Create Schema and Tables
    await sqlClient`CREATE SCHEMA IF NOT EXISTS prelaunch;`;
    
    await sqlClient`
      CREATE TABLE IF NOT EXISTS prelaunch.newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        source_page VARCHAR(255) NOT NULL,
        referral_code VARCHAR(50),
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sqlClient`
      CREATE TABLE IF NOT EXISTS prelaunch.aerocaptain_applications (
        id SERIAL PRIMARY KEY,
        founding_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        internet_type VARCHAR(100) NOT NULL,
        rooftop_available BOOLEAN NOT NULL,
        existing_hardware VARCHAR(100)[] NOT NULL,
        referral_code VARCHAR(50),
        application_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Pending'
      );
    `;

    // 2. No seeding required for Day 0 public launch
    console.log('[Database] Neon DB isolation layer successfully verified.');
  } catch (err) {
    console.error('[Database] Failed to run schema migrations in Neon DB, shifting to Local Storage:', err);
    useLocalFallback = true;
    initLocalStorageDB();
  }
}

/**
 * Helper to initialize localStorage-based DB
 */
function initLocalStorageDB() {
  try {
    if (!localStorage.getItem('prelaunch_newsletter_subscribers')) {
      localStorage.setItem('prelaunch_newsletter_subscribers', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('prelaunch_aerocaptain_applications')) {
      localStorage.setItem('prelaunch_aerocaptain_applications', JSON.stringify(SEED_APPLICATIONS));
    }
    
    if (!localStorage.getItem('prelaunch_event_registrations_count')) {
      localStorage.setItem('prelaunch_event_registrations_count', '0');
    }
    console.log('[Database] Local Storage database wrapper successfully verified.');
  } catch (e) {
    console.error('[Database] Local Storage is not accessible:', e);
  }
}

/**
 * Persist newsletter subscription.
 * Returns true if success, false if duplicate or failed.
 */
export async function addNewsletterSubscription(sub: NewsletterSubscriber): Promise<boolean> {
  if (useLocalFallback) {
    try {
      const subs = JSON.parse(localStorage.getItem('prelaunch_newsletter_subscribers') || '[]');
      if (subs.some((s: any) => s.email === sub.email)) {
        return false; // already exists
      }
      subs.push({
        ...sub,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('prelaunch_newsletter_subscribers', JSON.stringify(subs));
      return true;
    } catch (e) {
      return false;
    }
  }

  try {
    await sqlClient`
      INSERT INTO prelaunch.newsletter_subscribers (email, source_page, referral_code)
      VALUES (${sub.email}, ${sub.source_page}, ${sub.referral_code});
    `;
    return true;
  } catch (err: any) {
    // Unique violation check (code 23505)
    if (err.code === '23505') {
      console.log('[Database] Subscriber email already registered in Neon DB.');
    } else {
      console.error('[Database] Error adding subscriber:', err);
    }
    return false;
  }
}

/**
 * Persists AeroCaptain application and returns the generated sequential ID.
 */
export async function submitAeroCaptainApplication(
  app: Omit<AeroCaptainApplication, 'founding_number'>
): Promise<string> {
  if (useLocalFallback) {
    const apps = JSON.parse(localStorage.getItem('prelaunch_aerocaptain_applications') || '[]');
    const nextNum = apps.length + 1;
    const founding_number = `AC${String(nextNum).padStart(3, '0')}`;
    
    const newApp = {
      ...app,
      founding_number,
      application_date: new Date().toISOString(),
      status: 'Pending'
    };
    
    apps.push(newApp);
    localStorage.setItem('prelaunch_aerocaptain_applications', JSON.stringify(apps));
    return founding_number;
  }

  try {
    // 1. Get lock-free sequential count safely (can also query max code to handle deletes)
    const maxResult = await sqlClient`
      SELECT founding_number FROM prelaunch.aerocaptain_applications 
      ORDER BY id DESC LIMIT 1;
    `;
    
    let nextNum = 32; // Default if somehow count is empty
    if (maxResult.length > 0) {
      const lastCode = maxResult[0].founding_number; // e.g. "AC031"
      const numericPart = parseInt(lastCode.replace('AC', ''), 10);
      if (!isNaN(numericPart)) {
        nextNum = numericPart + 1;
      }
    } else {
      const countResult = await sqlClient`SELECT COUNT(*)::int as count FROM prelaunch.aerocaptain_applications;`;
      nextNum = (countResult[0]?.count || 0) + 1;
    }
    
    const founding_number = `AC${String(nextNum).padStart(3, '0')}`;

    await sqlClient`
      INSERT INTO prelaunch.aerocaptain_applications (
        founding_number, name, email, city, state, country, internet_type, rooftop_available, existing_hardware, referral_code, status
      ) VALUES (
        ${founding_number}, ${app.name}, ${app.email}, ${app.city}, ${app.state}, ${app.country}, ${app.internet_type}, ${app.rooftop_available}, ${app.existing_hardware}, ${app.referral_code}, 'Pending'
      );
    `;
    return founding_number;
  } catch (err) {
    console.error('[Database] Failed to submit application, retrying with fallback:', err);
    // Dynamic runtime failover
    useLocalFallback = true;
    initLocalStorageDB();
    return submitAeroCaptainApplication(app);
  }
}

/**
 * Returns dynamic pre-launch progress metrics.
 */
export async function getLaunchMetrics(): Promise<LaunchMetrics> {
  const baseCommunityMembers = 0;
  const baseNewsletterSubscribers = 0;

  if (useLocalFallback) {
    const apps = JSON.parse(localStorage.getItem('prelaunch_aerocaptain_applications') || '[]');
    const subs = JSON.parse(localStorage.getItem('prelaunch_newsletter_subscribers') || '[]');
    const eventRegsCount = parseInt(localStorage.getItem('prelaunch_event_registrations_count') || '0', 10);

    const uniqueCities = new Set(apps.map((a: any) => a.city.toLowerCase().trim()));
    const uniqueStates = new Set(apps.map((a: any) => a.state.toLowerCase().trim()));

    return {
      foundingCaptains: apps.length,
      citiesRegistered: uniqueCities.size,
      statesRepresented: uniqueStates.size,
      newsletterSubscribers: baseNewsletterSubscribers + subs.length,
      communityMembers: baseCommunityMembers + eventRegsCount
    };
  }

  try {
    const countResult = await sqlClient`SELECT COUNT(*)::int as count FROM prelaunch.aerocaptain_applications;`;
    const foundingCaptains = countResult[0]?.count || 0;

    const citiesResult = await sqlClient`SELECT COUNT(DISTINCT LOWER(TRIM(city)))::int as count FROM prelaunch.aerocaptain_applications;`;
    const citiesRegistered = citiesResult[0]?.count || 0;

    const statesResult = await sqlClient`SELECT COUNT(DISTINCT LOWER(TRIM(state)))::int as count FROM prelaunch.aerocaptain_applications;`;
    const statesRepresented = statesResult[0]?.count || 0;

    const subsCount = await sqlClient`SELECT COUNT(*)::int as count FROM prelaunch.newsletter_subscribers;`;
    const newsletterSubscribers = baseNewsletterSubscribers + (subsCount[0]?.count || 0);

    const communityMembers = baseCommunityMembers;

    return {
      foundingCaptains,
      citiesRegistered,
      statesRepresented,
      newsletterSubscribers,
      communityMembers
    };
  } catch (err) {
    console.error('[Database] Failed to fetch metrics from Neon DB, returning localStorage stats:', err);
    useLocalFallback = true;
    initLocalStorageDB();
    return getLaunchMetrics();
  }
}

/**
 * Returns dynamic list of approved AeroCaptains for Directory.
 */
export async function getAeroCaptainsDirectory(): Promise<{ num: string; state: string; status: string }[]> {
  if (useLocalFallback) {
    const apps = JSON.parse(localStorage.getItem('prelaunch_aerocaptain_applications') || '[]');
    // Return last 10 entries format: e.g. #001, Maharashtra
    return apps.map((a: any) => ({
      num: `#${a.founding_number.replace('AC', '')}`,
      state: a.state,
      status: a.status === 'Approved' ? 'Reserved' : 'Pending'
    }));
  }

  try {
    const apps = await sqlClient`
      SELECT founding_number, state, status FROM prelaunch.aerocaptain_applications
      ORDER BY id ASC;
    `;
    return apps.map((a: any) => ({
      num: `#${a.founding_number.replace('AC', '')}`,
      state: a.state,
      status: a.status === 'Approved' ? 'Reserved' : 'Pending'
    }));
  } catch (err) {
    console.error('[Database] Error fetching captains directory:', err);
    useLocalFallback = true;
    initLocalStorageDB();
    return getAeroCaptainsDirectory();
  }
}

/**
 * Increments community members count on registrations.
 */
export function registerCommunityKickoff(): void {
  try {
    const current = parseInt(localStorage.getItem('prelaunch_event_registrations_count') || '0', 10);
    localStorage.setItem('prelaunch_event_registrations_count', (current + 1).toString());
  } catch (e) {
    // Ignore
  }
}
