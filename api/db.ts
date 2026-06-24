import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || '';

let sqlClient: any = null;
if (DATABASE_URL) {
  try {
    sqlClient = neon(DATABASE_URL);
    console.log('[Database] Initialized Neon connection...');
  } catch (e) {
    console.error('[Database] Failed to initialize Neon connection:', e);
  }
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

async function generateUniqueSlug(name: string, isCaptain: boolean): Promise<string> {
  const baseSlug = slugify(name) || 'member';
  let slug = baseSlug;
  let counter = 1;
  let exists = true;
  
  while (exists) {
    try {
      const result = isCaptain
        ? await sqlClient`SELECT id FROM prelaunch.aerocaptain_applications WHERE slug = ${slug} LIMIT 1;`
        : await sqlClient`SELECT id FROM prelaunch.newsletter_subscribers WHERE slug = ${slug} LIMIT 1;`;
      exists = result.length > 0;
    } catch (err) {
      exists = false;
    }
    
    if (exists) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
  return slug;
}

async function initDatabase(): Promise<void> {
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

  // Create Airport Targets Table
  await sqlClient`
    CREATE TABLE IF NOT EXISTS prelaunch.airport_targets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(10) UNIQUE NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      status VARCHAR(20) DEFAULT 'needed'
    );
  `;

  // Create Event Registrations Table
  await sqlClient`
    CREATE TABLE IF NOT EXISTS prelaunch.event_registrations (
      id SERIAL PRIMARY KEY,
      registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Seeding airports if table is empty
  const airportsCount = await sqlClient`SELECT COUNT(*)::int as count FROM prelaunch.airport_targets;`;
  if (airportsCount[0]?.count === 0) {
    // Seed Active Airports
    await sqlClient`
      INSERT INTO prelaunch.airport_targets (name, lat, lng, status) VALUES
      ('DEL', 28.556, 77.100, 'active'),
      ('BOM', 19.089, 72.865, 'active'),
      ('BLR', 13.198, 77.706, 'active'),
      ('PNQ', 18.582, 73.919, 'active'),
      ('SSE', 17.625, 75.934, 'active'),
      ('GBI', 17.520, 76.820, 'active');
    `;
    // Seed Needed Airports
    await sqlClient`
      INSERT INTO prelaunch.airport_targets (name, lat, lng, status) VALUES
      ('HYD', 17.231, 78.429, 'needed'),
      ('MAA', 12.994, 80.170, 'needed'),
      ('CCU', 22.654, 88.446, 'needed'),
      ('AMD', 23.077, 72.634, 'needed'),
      ('COK', 10.152, 76.401, 'needed'),
      ('JAI', 26.824, 75.812, 'needed'),
      ('LKO', 26.760, 80.889, 'needed'),
      ('GOI', 15.380, 73.831, 'needed'),
      ('GAU', 26.106, 91.585, 'needed'),
      ('PAT', 25.591, 85.087, 'needed'),
      ('SXR', 33.987, 74.774, 'needed'),
      ('IXC', 30.673, 76.788, 'needed'),
      ('NAG', 21.092, 79.047, 'needed'),
      ('VNS', 25.452, 82.859, 'needed'),
      ('TRV', 8.482, 76.920, 'needed'),
      ('IXB', 26.681, 88.328, 'needed'),
      ('BBI', 20.244, 85.817, 'needed'),
      ('IDR', 22.721, 75.801, 'needed'),
      ('RPR', 21.180, 81.738, 'needed'),
      ('IXR', 23.314, 85.321, 'needed'),
      ('VTZ', 17.721, 83.224, 'needed'),
      ('IXM', 9.834, 78.093, 'needed'),
      ('CJB', 11.030, 77.043, 'needed'),
      ('CCJ', 11.136, 75.955, 'needed'),
      ('IXE', 12.961, 74.890, 'needed'),
      ('STV', 21.114, 72.741, 'needed'),
      ('RAJ', 22.309, 70.779, 'needed'),
      ('BHO', 23.287, 77.337, 'needed'),
      ('DEP', 24.432, 87.232, 'needed'),
      ('IMF', 24.760, 93.896, 'needed'),
      ('DIB', 27.483, 95.016, 'needed'),
      ('JRH', 26.731, 94.175, 'needed'),
      ('IXA', 23.886, 91.240, 'needed'),
      ('AJL', 23.746, 92.619, 'needed'),
      ('DMU', 25.883, 93.771, 'needed'),
      ('IXS', 24.912, 92.978, 'needed'),
      ('PYB', 12.274, 76.624, 'needed'),
      ('HBX', 15.361, 75.084, 'needed'),
      ('BEK', 25.240, 86.971, 'needed'),
      ('DED', 30.189, 78.180, 'needed'),
      ('KUU', 31.876, 77.154, 'needed'),
      ('DHM', 32.165, 76.263, 'needed'),
      ('IXL', 34.135, 77.546, 'needed'),
      ('ATQ', 31.706, 74.797, 'needed'),
      ('JLR', 23.177, 80.052, 'needed'),
      ('GWL', 26.293, 78.227, 'needed'),
      ('KLH', 18.218, 77.917, 'needed'),
      ('TIR', 13.632, 79.543, 'needed'),
      ('RJA', 17.110, 81.818, 'needed'),
      ('CDP', 10.936, 79.253, 'needed');
    `;
  }

  // Schema Migrations (Add columns if they do not exist)
  await sqlClient`
    ALTER TABLE prelaunch.newsletter_subscribers 
    ADD COLUMN IF NOT EXISTS name VARCHAR(255);
  `;
  await sqlClient`
    ALTER TABLE prelaunch.newsletter_subscribers 
    ADD COLUMN IF NOT EXISTS cadet_number VARCHAR(50) UNIQUE;
  `;
  await sqlClient`
    ALTER TABLE prelaunch.newsletter_subscribers 
    ADD COLUMN IF NOT EXISTS invited_by VARCHAR(50);
  `;
  await sqlClient`
    ALTER TABLE prelaunch.newsletter_subscribers 
    ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;
  `;
  await sqlClient`
    ALTER TABLE prelaunch.newsletter_subscribers 
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
  `;

  await sqlClient`
    ALTER TABLE prelaunch.aerocaptain_applications 
    ADD COLUMN IF NOT EXISTS invited_by VARCHAR(50);
  `;
  await sqlClient`
    ALTER TABLE prelaunch.aerocaptain_applications 
    ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;
  `;
  await sqlClient`
    ALTER TABLE prelaunch.aerocaptain_applications 
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
  `;
}

async function addNewsletterSubscription(sub: any): Promise<boolean> {
  try {
    await sqlClient`
      INSERT INTO prelaunch.newsletter_subscribers (email, source_page, referral_code)
      VALUES (${sub.email}, ${sub.source_page}, ${sub.referral_code});
    `;
    return true;
  } catch (err: any) {
    if (err.code === '23505') {
      console.log('[Database] Subscriber email already registered in Neon DB.');
    } else {
      console.error('[Database] Error adding subscriber:', err);
    }
    return false;
  }
}

async function incrementReferrerCount(referrerCode: string): Promise<void> {
  if (!referrerCode) return;
  const code = referrerCode.trim();
  const codeUpper = code.toUpperCase();

  // In Neon Postgres, first update subscribers
  const subUpdate = await sqlClient`
    UPDATE prelaunch.newsletter_subscribers
    SET referral_count = COALESCE(referral_count, 0) + 1
    WHERE slug = ${code} OR UPPER(cadet_number) = ${codeUpper}
    RETURNING id;
  `;
  
  // If not found in subscribers, update captains
  if (subUpdate.length === 0) {
    await sqlClient`
      UPDATE prelaunch.aerocaptain_applications
      SET referral_count = COALESCE(referral_count, 0) + 1
      WHERE slug = ${code} OR UPPER(founding_number) = ${codeUpper};
    `;
  }
}

async function getMemberBySlugOrId(identifier: string): Promise<any | null> {
  const idUpper = identifier.trim().toUpperCase();
  const slug = identifier.trim().toLowerCase();

  // 1. Search newsletter subscribers
  const subResult = await sqlClient`
    SELECT name, email, cadet_number, referral_count, timestamp, slug
    FROM prelaunch.newsletter_subscribers
    WHERE slug = ${slug} OR UPPER(cadet_number) = ${idUpper} LIMIT 1;
  `;
  
  if (subResult.length > 0) {
    const match = subResult[0];
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

  // 2. Search captains
  const appResult = await sqlClient`
    SELECT name, email, founding_number, referral_count, application_date, status, slug
    FROM prelaunch.aerocaptain_applications
    WHERE slug = ${slug} OR UPPER(founding_number) = ${idUpper} LIMIT 1;
  `;
  
  if (appResult.length > 0) {
    const match = appResult[0];
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

async function addAeroCadet(cadet: any): Promise<{ code: string; slug: string }> {
  const invited_by = cadet.invited_by || '';
  const slug = await generateUniqueSlug(cadet.name, false);

  const existing = await sqlClient`
    SELECT cadet_number, slug FROM prelaunch.newsletter_subscribers
    WHERE LOWER(email) = ${cadet.email.toLowerCase()} LIMIT 1;
  `;

  if (existing.length > 0) {
    if (existing[0].cadet_number) {
      let existingSlug = existing[0].slug;
      if (!existingSlug) {
        existingSlug = slug;
        await sqlClient`
          UPDATE prelaunch.newsletter_subscribers
          SET slug = ${existingSlug}
          WHERE LOWER(email) = ${cadet.email.toLowerCase()};
        `;
      }
      return { code: existing[0].cadet_number, slug: existingSlug };
    }
    
    const maxResult = await sqlClient`
      SELECT cadet_number FROM prelaunch.newsletter_subscribers
      WHERE cadet_number IS NOT NULL AND cadet_number LIKE 'CAD%'
      ORDER BY id DESC LIMIT 1;
    `;
    let nextNum = 1;
    if (maxResult.length > 0) {
      const lastCode = maxResult[0].cadet_number;
      const numericPart = parseInt(lastCode.replace('CAD', ''), 10);
      if (!isNaN(numericPart)) {
        nextNum = numericPart + 1;
      }
    }
    const cadet_number = `CAD${String(nextNum).padStart(3, '0')}`;

    await sqlClient`
      UPDATE prelaunch.newsletter_subscribers
      SET name = ${cadet.name}, cadet_number = ${cadet_number}, invited_by = ${invited_by}, referral_count = 0, slug = ${slug}
      WHERE LOWER(email) = ${cadet.email.toLowerCase()};
    `;

    if (invited_by) {
      await incrementReferrerCount(invited_by);
    }
    return { code: cadet_number, slug };
  }

  const maxResult = await sqlClient`
    SELECT cadet_number FROM prelaunch.newsletter_subscribers
    WHERE cadet_number IS NOT NULL AND cadet_number LIKE 'CAD%'
    ORDER BY id DESC LIMIT 1;
  `;
  let nextNum = 1;
  if (maxResult.length > 0) {
    const lastCode = maxResult[0].cadet_number;
    const numericPart = parseInt(lastCode.replace('CAD', ''), 10);
    if (!isNaN(numericPart)) {
      nextNum = numericPart + 1;
    }
  }
  const cadet_number = `CAD${String(nextNum).padStart(3, '0')}`;

  await sqlClient`
    INSERT INTO prelaunch.newsletter_subscribers (name, email, cadet_number, invited_by, referral_count, source_page, slug)
    VALUES (${cadet.name}, ${cadet.email}, ${cadet_number}, ${invited_by}, 0, ${cadet.source_page}, ${slug});
  `;

  if (invited_by) {
    await incrementReferrerCount(invited_by);
  }
  return { code: cadet_number, slug };
}

async function submitAeroCaptainApplication(app: any): Promise<{ code: string; slug: string }> {
  const invited_by = app.referral_code || '';
  const slug = await generateUniqueSlug(app.name, true);

  const maxResult = await sqlClient`
    SELECT founding_number FROM prelaunch.aerocaptain_applications 
    ORDER BY id DESC LIMIT 1;
  `;
  
  let nextNum = 1;
  if (maxResult.length > 0) {
    const lastCode = maxResult[0].founding_number;
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
      founding_number, name, email, city, state, country, internet_type, rooftop_available, existing_hardware, referral_code, invited_by, referral_count, status, slug
    ) VALUES (
      ${founding_number}, ${app.name}, ${app.email}, ${app.city}, ${app.state}, ${app.country}, ${app.internet_type}, ${app.rooftop_available}, ${app.existing_hardware}, ${app.referral_code}, ${invited_by}, 0, 'Pending', ${slug}
    );
  `;
  
  if (invited_by) {
    await incrementReferrerCount(invited_by);
  }
  return { code: founding_number, slug };
}

async function getLaunchMetrics() {
  const baseCommunityMembers = 0;
  const baseNewsletterSubscribers = 0;

  const countResult = await sqlClient`SELECT COUNT(*)::int as count FROM prelaunch.aerocaptain_applications;`;
  const foundingCaptains = countResult[0]?.count || 0;

  const citiesResult = await sqlClient`SELECT COUNT(DISTINCT LOWER(TRIM(city)))::int as count FROM prelaunch.aerocaptain_applications;`;
  const citiesRegistered = citiesResult[0]?.count || 0;

  const statesResult = await sqlClient`SELECT COUNT(DISTINCT LOWER(TRIM(state)))::int as count FROM prelaunch.aerocaptain_applications;`;
  const statesRepresented = statesResult[0]?.count || 0;

  const subsCount = await sqlClient`SELECT COUNT(*)::int as count FROM prelaunch.newsletter_subscribers;`;
  const newsletterSubscribers = baseNewsletterSubscribers + (subsCount[0]?.count || 0);

  const eventRegsResult = await sqlClient`SELECT COUNT(*)::int as count FROM prelaunch.event_registrations;`;
  const communityMembers = baseCommunityMembers + (eventRegsResult[0]?.count || 0);

  return {
    foundingCaptains,
    citiesRegistered,
    statesRepresented,
    newsletterSubscribers,
    communityMembers
  };
}

async function getAeroCaptainsDirectory() {
  const apps = await sqlClient`
    SELECT founding_number, state, status FROM prelaunch.aerocaptain_applications
    ORDER BY id ASC;
  `;
  return apps.map((a: any) => ({
    num: `#${a.founding_number.replace('AC', '')}`,
    state: a.state,
    status: a.status === 'Approved' ? 'Reserved' : 'Pending'
  }));
}

async function getAirportTargets() {
  const airports = await sqlClient`
    SELECT name, lat, lng, status FROM prelaunch.airport_targets
    ORDER BY name ASC;
  `;
  return airports;
}

async function registerKickoff() {
  await sqlClient`
    INSERT INTO prelaunch.event_registrations DEFAULT VALUES;
  `;
  return { success: true };
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!DATABASE_URL) {
    console.warn('[API] DATABASE_URL not set. Client should fall back to LocalStorage.');
    return res.status(500).json({ error: 'Database URL not configured', useFallback: true });
  }

  if (!sqlClient) {
    return res.status(500).json({ error: 'Database client not initialized', useFallback: true });
  }

  // Extract action: support both query string and request body
  const action = req.method === 'POST' ? req.body?.action : req.query?.action;

  if (!action) {
    return res.status(400).json({ error: 'Missing action parameter' });
  }

  try {
    switch (action) {
      case 'init':
        await initDatabase();
        return res.status(200).json({ success: true, message: 'Database initialized' });

      case 'metrics':
        const metrics = await getLaunchMetrics();
        return res.status(200).json(metrics);

      case 'subscribe':
        const subSuccess = await addNewsletterSubscription(req.body.subscriber);
        return res.status(200).json({ success: subSuccess });

      case 'cadet':
        const cadetResult = await addAeroCadet(req.body.cadet);
        return res.status(200).json(cadetResult);

      case 'captain-submit':
        const captainResult = await submitAeroCaptainApplication(req.body.application);
        return res.status(200).json(captainResult);

      case 'captain-directory':
        const directory = await getAeroCaptainsDirectory();
        return res.status(200).json(directory);

      case 'airports':
        const airports = await getAirportTargets();
        return res.status(200).json(airports);

      case 'register-kickoff':
        const regResult = await registerKickoff();
        return res.status(200).json(regResult);

      case 'member':
        const identifier = req.query.identifier || req.body.identifier;
        if (!identifier) {
          return res.status(400).json({ error: 'Missing identifier parameter' });
        }
        const member = await getMemberBySlugOrId(identifier);
        return res.status(200).json({ member });

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err: any) {
    console.error(`[API] Error executing action ${action}:`, err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}