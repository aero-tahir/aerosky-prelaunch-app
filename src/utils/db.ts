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
  invited_by?: string;
  referral_count?: number;
  application_date?: string;
  status?: string;
}

export interface NewsletterSubscriber {
  email: string;
  source_page: string;
  referral_code: string;
  timestamp?: string;
  name?: string;
  cadet_number?: string;
  invited_by?: string;
  referral_count?: number;
}

export interface AeroCadetRegistration {
  name: string;
  email: string;
  cadet_number?: string;
  invited_by?: string;
  referral_count?: number;
  source_page: string;
  timestamp?: string;
}

export interface LaunchMetrics {
  foundingCaptains: number;
  citiesRegistered: number;
  statesRepresented: number;
  newsletterSubscribers: number;
  communityMembers: number;
}

// Helper to make API requests to our consolidated Vercel serverless function
async function callApi(action: string, method: 'GET' | 'POST', payload?: any): Promise<any> {
  const url = method === 'GET'
    ? `/api/db?action=${action}${payload ? `&${new URLSearchParams(payload)}` : ''}`
    : `/api/db`;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method === 'POST') {
    options.body = JSON.stringify({ action, ...payload });
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  if (data.useFallback) {
    throw new Error('Server requested client fallback');
  }
  return data;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function generateUniqueSlug(name: string, isCaptain: boolean): Promise<string> {
  const baseSlug = slugify(name) || 'member';
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    if (isCaptain) {
      const apps = JSON.parse(localStorage.getItem('prelaunch_aerocaptain_applications') || '[]');
      exists = apps.some((a: any) => a.slug === slug);
    } else {
      const subs = JSON.parse(localStorage.getItem('prelaunch_newsletter_subscribers') || '[]');
      exists = subs.some((s: any) => s.slug === slug);
    }

    if (exists) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
  return slug;
}

/**
 * Initialize growth scripts & database schema
 */
export async function initDB(): Promise<void> {
  try {
    await callApi('init', 'GET');
    console.log('[Database] Secure Serverless API layer initialized successfully.');
  } catch (err) {
    console.warn('[Database] API connection failed, operating in Local Storage mode:', err);
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
      localStorage.setItem('prelaunch_aerocaptain_applications', JSON.stringify([]));
    }

    if (!localStorage.getItem('prelaunch_event_registrations_count')) {
      localStorage.setItem('prelaunch_event_registrations_count', '0');
    }
    console.log('[Database] Local Storage database wrapper verified.');
  } catch (e) {
    console.error('[Database] Local Storage is not accessible:', e);
  }
}

/**
 * Persist newsletter subscription.
 * Returns true if success, false if duplicate or failed.
 */
export async function addNewsletterSubscription(sub: NewsletterSubscriber): Promise<boolean> {
  try {
    const res = await callApi('subscribe', 'POST', { subscriber: sub });
    return res.success;
  } catch (err) {
    console.warn('[Database] API subscribe failed, running local fallback:', err);
    try {
      const subs = JSON.parse(localStorage.getItem('prelaunch_newsletter_subscribers') || '[]');
      if (subs.some((s: any) => s.email === sub.email)) {
        return false;
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
}

/**
 * Increments the referral count for a given referrer code (slug, CADxxx, or ACxxx).
 * Only called internally by local fallbacks.
 */
export async function incrementReferrerCount(referrerCode: string): Promise<void> {
  if (!referrerCode) return;
  const code = referrerCode.trim();
  const codeUpper = code.toUpperCase();

  try {
    // 1. Search in cadets (newsletter subscribers)
    const subs = JSON.parse(localStorage.getItem('prelaunch_newsletter_subscribers') || '[]');
    const cadetIdx = subs.findIndex((s: any) =>
      (s.slug && s.slug === code) ||
      (s.cadet_number && s.cadet_number.toUpperCase() === codeUpper)
    );

    if (cadetIdx !== -1) {
      subs[cadetIdx].referral_count = (subs[cadetIdx].referral_count || 0) + 1;
      localStorage.setItem('prelaunch_newsletter_subscribers', JSON.stringify(subs));
      console.log(`[Referral] Incremented local cadet referrer count for: ${code}`);
      return;
    }

    // 2. Search in captains
    const apps = JSON.parse(localStorage.getItem('prelaunch_aerocaptain_applications') || '[]');
    const captainIdx = apps.findIndex((a: any) =>
      (a.slug && a.slug === code) ||
      (a.founding_number && a.founding_number.toUpperCase() === codeUpper)
    );

    if (captainIdx !== -1) {
      apps[captainIdx].referral_count = (apps[captainIdx].referral_count || 0) + 1;
      localStorage.setItem('prelaunch_aerocaptain_applications', JSON.stringify(apps));
      console.log(`[Referral] Incremented local captain referrer count for: ${code}`);
      return;
    }
  } catch (e) {
    console.error('[Database] Failed to increment referrer count locally:', e);
  }
}

/**
 * Returns a member's registration details by slug or founding serial ID.
 * Returns null if not found.
 */
export async function getMemberBySlugOrId(identifier: string): Promise<any | null> {
  if (!identifier) return null;
  try {
    const res = await callApi('member', 'GET', { identifier });
    return res.member;
  } catch (err) {
    console.warn('[Database] API getMember failed, running local fallback:', err);
    const idUpper = identifier.trim().toUpperCase();
    const slug = identifier.trim().toLowerCase();

    const subs = JSON.parse(localStorage.getItem('prelaunch_newsletter_subscribers') || '[]');
    let match = subs.find((s: any) =>
      (s.slug && s.slug.toLowerCase() === slug) ||
      (s.cadet_number && s.cadet_number.toUpperCase() === idUpper)
    );

    if (match) {
      return {
        name: match.name || 'Founding AeroCadet',
        email: match.email,
        role: 'cadet',
        serial: match.cadet_number,
        referralCount: match.referral_count || 0,
        joinedDate: match.timestamp ? new Date(match.timestamp).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'June 2026',
        status: 'Verified founding member',
        slug: match.slug
      };
    }

    const apps = JSON.parse(localStorage.getItem('prelaunch_aerocaptain_applications') || '[]');
    match = apps.find((a: any) =>
      (a.slug && a.slug.toLowerCase() === slug) ||
      (a.founding_number && a.founding_number.toUpperCase() === idUpper)
    );

    if (match) {
      return {
        name: match.name || 'Founding AeroCaptain',
        email: match.email,
        role: 'captain',
        serial: match.founding_number,
        referralCount: match.referral_count || 0,
        joinedDate: match.application_date ? new Date(match.application_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'June 2026',
        status: match.status === 'Approved' ? 'Verified founding member' : 'Application under review',
        slug: match.slug
      };
    }
    return null;
  }
}

/**
 * Registers an AeroCadet, generates a sequential Cadet number, and handles referrals.
 */
export async function addAeroCadet(
  cadet: Omit<AeroCadetRegistration, 'cadet_number' | 'referral_count'>
): Promise<{ code: string; slug: string }> {
  try {
    return await callApi('cadet', 'POST', { cadet });
  } catch (err) {
    console.warn('[Database] API addAeroCadet failed, running local fallback:', err);
    const invited_by = cadet.invited_by || '';
    const slug = await generateUniqueSlug(cadet.name, false);

    try {
      const subs = JSON.parse(localStorage.getItem('prelaunch_newsletter_subscribers') || '[]');
      const existing = subs.find((s: any) => s.email.toLowerCase() === cadet.email.toLowerCase());

      if (existing) {
        if (existing.cadet_number) {
          return { code: existing.cadet_number, slug: existing.slug || slug };
        }
        const cadets = subs.filter((s: any) => s.cadet_number && s.cadet_number.startsWith('CAD'));
        const nextNum = cadets.length + 1;
        const cadet_number = `CAD${String(nextNum).padStart(3, '0')}`;
        existing.cadet_number = cadet_number;
        existing.name = cadet.name;
        existing.invited_by = invited_by;
        existing.referral_count = existing.referral_count || 0;
        existing.slug = existing.slug || slug;
        localStorage.setItem('prelaunch_newsletter_subscribers', JSON.stringify(subs));
        if (invited_by) {
          await incrementReferrerCount(invited_by);
        }
        return { code: cadet_number, slug: existing.slug };
      }

      const cadets = subs.filter((s: any) => s.cadet_number && s.cadet_number.startsWith('CAD'));
      const nextNum = cadets.length + 1;
      const cadet_number = `CAD${String(nextNum).padStart(3, '0')}`;

      const newCadet = {
        name: cadet.name,
        email: cadet.email,
        cadet_number,
        invited_by,
        referral_count: 0,
        source_page: cadet.source_page,
        timestamp: new Date().toISOString(),
        slug
      };

      subs.push(newCadet);
      localStorage.setItem('prelaunch_newsletter_subscribers', JSON.stringify(subs));

      if (invited_by) {
        await incrementReferrerCount(invited_by);
      }
      return { code: cadet_number, slug };
    } catch (e) {
      console.error('[Database] Failed to add AeroCadet locally:', e);
      throw e;
    }
  }
}

/**
 * Persists AeroCaptain application and returns the generated sequential ID.
 */
export async function submitAeroCaptainApplication(
  app: Omit<AeroCaptainApplication, 'founding_number'>
): Promise<{ code: string; slug: string }> {
  try {
    return await callApi('captain-submit', 'POST', { application: app });
  } catch (err) {
    console.warn('[Database] API submitAeroCaptainApplication failed, running local fallback:', err);
    const invited_by = app.referral_code || '';
    const slug = await generateUniqueSlug(app.name, true);

    try {
      const apps = JSON.parse(localStorage.getItem('prelaunch_aerocaptain_applications') || '[]');
      const nextNum = apps.length + 1;
      const founding_number = `AC${String(nextNum).padStart(3, '0')}`;

      const newApp = {
        ...app,
        founding_number,
        application_date: new Date().toISOString(),
        status: 'Pending',
        invited_by,
        referral_count: 0,
        slug
      };

      apps.push(newApp);
      localStorage.setItem('prelaunch_aerocaptain_applications', JSON.stringify(apps));
      if (invited_by) {
        await incrementReferrerCount(invited_by);
      }
      return { code: founding_number, slug };
    } catch (e) {
      console.error('[Database] Failed to submit application locally:', e);
      throw e;
    }
  }
}

/**
 * Returns dynamic pre-launch progress metrics.
 */
export async function getLaunchMetrics(): Promise<LaunchMetrics> {
  try {
    return await callApi('metrics', 'GET');
  } catch (err) {
    console.warn('[Database] API getLaunchMetrics failed, running local fallback:', err);
    const apps = JSON.parse(localStorage.getItem('prelaunch_aerocaptain_applications') || '[]');
    const subs = JSON.parse(localStorage.getItem('prelaunch_newsletter_subscribers') || '[]');
    const eventRegsCount = parseInt(localStorage.getItem('prelaunch_event_registrations_count') || '0', 10);

    const uniqueCities = new Set(apps.map((a: any) => a.city.toLowerCase().trim()));
    const uniqueStates = new Set(apps.map((a: any) => a.state.toLowerCase().trim()));

    return {
      foundingCaptains: apps.length,
      citiesRegistered: uniqueCities.size,
      statesRepresented: uniqueStates.size,
      newsletterSubscribers: subs.length,
      communityMembers: eventRegsCount
    };
  }
}

/**
 * Returns dynamic list of approved AeroCaptains for Directory.
 */
export async function getAeroCaptainsDirectory(): Promise<{ num: string; state: string; status: string }[]> {
  try {
    return await callApi('captain-directory', 'GET');
  } catch (err) {
    console.warn('[Database] API getAeroCaptainsDirectory failed, running local fallback:', err);
    const apps = JSON.parse(localStorage.getItem('prelaunch_aerocaptain_applications') || '[]');
    return apps.map((a: any) => ({
      num: `#${a.founding_number.replace('AC', '')}`,
      state: a.state,
      status: a.status === 'Approved' ? 'Reserved' : 'Pending'
    }));
  }
}

/**
 * Increments community members count on registrations.
 */
export async function registerCommunityKickoff(): Promise<void> {
  try {
    await callApi('register-kickoff', 'POST');
    console.log('[Database] Community kickoff registration registered on Neon DB.');
  } catch (err) {
    console.warn('[Database] API register-kickoff failed, running local fallback:', err);
    try {
      const current = parseInt(localStorage.getItem('prelaunch_event_registrations_count') || '0', 10);
      localStorage.setItem('prelaunch_event_registrations_count', (current + 1).toString());
    } catch (e) {
      // Ignore
    }
  }
}

export interface AirportTarget {
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'needed';
}

/**
 * Returns dynamic list of airport targets (active and needed) from database or fallback.
 */
export async function getAirports(): Promise<{ active: AirportTarget[]; needed: AirportTarget[] }> {
  try {
    const list: AirportTarget[] = await callApi('airports', 'GET');
    const active = list.filter(a => a.status === 'active');
    const needed = list.filter(a => a.status === 'needed');
    return { active, needed };
  } catch (err) {
    console.warn('[Database] API getAirports failed, running offline fallback:', err);
    // Offline / Local development fallback using the hardcoded values
    const active: AirportTarget[] = [
      { name: 'DEL', lat: 28.556, lng: 77.100, status: 'active' },
      { name: 'BOM', lat: 19.089, lng: 72.865, status: 'active' },
      { name: 'BLR', lat: 13.198, lng: 77.706, status: 'active' },
      { name: 'PNQ', lat: 18.582, lng: 73.919, status: 'active' },
      { name: 'SSE', lat: 17.625, lng: 75.934, status: 'active' }, // Solapur
      { name: 'GBI', lat: 17.520, lng: 76.820, status: 'active' }, // Gulbarga
    ];

    const needed: AirportTarget[] = [
      { name: 'HYD', lat: 17.231, lng: 78.429, status: 'needed' },
      { name: 'MAA', lat: 12.994, lng: 80.170, status: 'needed' },
      { name: 'CCU', lat: 22.654, lng: 88.446, status: 'needed' },
      { name: 'AMD', lat: 23.077, lng: 72.634, status: 'needed' },
      { name: 'COK', lat: 10.152, lng: 76.401, status: 'needed' },
      { name: 'JAI', lat: 26.824, lng: 75.812, status: 'needed' },
      { name: 'LKO', lat: 26.760, lng: 80.889, status: 'needed' },
      { name: 'GOI', lat: 15.380, lng: 73.831, status: 'needed' },
      { name: 'GAU', lat: 26.106, lng: 91.585, status: 'needed' },
      { name: 'PAT', lat: 25.591, lng: 85.087, status: 'needed' },
      { name: 'SXR', status: 'needed', lat: 33.987, lng: 74.774 },
      { name: 'IXC', lat: 30.673, lng: 76.788, status: 'needed' },
      { name: 'NAG', lat: 21.092, lng: 79.047, status: 'needed' },
      { name: 'VNS', lat: 25.452, lng: 82.859, status: 'needed' },
      { name: 'TRV', lat: 8.482, lng: 76.920, status: 'needed' },
      { name: 'IXB', lat: 26.681, lng: 88.328, status: 'needed' },
      { name: 'BBI', lat: 20.244, lng: 85.817, status: 'needed' },
      { name: 'IDR', lat: 22.721, lng: 75.801, status: 'needed' },
      { name: 'RPR', lat: 21.180, lng: 81.738, status: 'needed' },
      { name: 'IXR', lat: 23.314, lng: 85.321, status: 'needed' },
      { name: 'VTZ', lat: 17.721, lng: 83.224, status: 'needed' },
      { name: 'IXM', lat: 9.834, lng: 78.093, status: 'needed' },
      { name: 'CJB', lat: 11.030, lng: 77.043, status: 'needed' },
      { name: 'CCJ', lat: 11.136, lng: 75.955, status: 'needed' },
      { name: 'IXE', lat: 12.961, lng: 74.890, status: 'needed' },
      { name: 'STV', lat: 21.114, lng: 72.741, status: 'needed' },
      { name: 'RAJ', lat: 22.309, lng: 70.779, status: 'needed' },
      { name: 'BHO', lat: 23.287, lng: 77.337, status: 'needed' },
      { name: 'DEP', lat: 24.432, lng: 87.232, status: 'needed' },
      { name: 'IMF', lat: 24.760, lng: 93.896, status: 'needed' },
      { name: 'DIB', lat: 27.483, lng: 95.016, status: 'needed' },
      { name: 'JRH', lat: 26.731, lng: 94.175, status: 'needed' },
      { name: 'IXA', lat: 23.886, lng: 91.240, status: 'needed' },
      { name: 'AJL', lat: 23.746, lng: 92.619, status: 'needed' },
      { name: 'DMU', lat: 25.883, lng: 93.771, status: 'needed' },
      { name: 'IXS', lat: 24.912, lng: 92.978, status: 'needed' },
      { name: 'PYB', lat: 12.274, lng: 76.624, status: 'needed' },
      { name: 'HBX', lat: 15.361, lng: 75.084, status: 'needed' },
      { name: 'BEK', lat: 25.240, lng: 86.971, status: 'needed' },
      { name: 'DED', lat: 30.189, lng: 78.180, status: 'needed' },
      { name: 'KUU', lat: 31.876, lng: 77.154, status: 'needed' },
      { name: 'DHM', lat: 32.165, lng: 76.263, status: 'needed' },
      { name: 'IXL', lat: 34.135, lng: 77.546, status: 'needed' },
      { name: 'ATQ', lat: 31.706, lng: 74.797, status: 'needed' },
      { name: 'JLR', lat: 23.177, lng: 80.052, status: 'needed' },
      { name: 'GWL', lat: 26.293, lng: 78.227, status: 'needed' },
      { name: 'KLH', lat: 18.218, lng: 77.917, status: 'needed' },
      { name: 'TIR', lat: 13.632, lng: 79.543, status: 'needed' },
      { name: 'RJA', lat: 17.110, lng: 81.818, status: 'needed' },
      { name: 'CDP', lat: 10.936, lng: 79.253, status: 'needed' },
    ];
    return { active, needed };
  }
}
