const fs = require('fs');
const path = require('path');

// Manually parse .env file to fetch credentials without external dependencies
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../../.env');
    if (!fs.existsSync(envPath)) {
      console.warn('[Seeder] No .env file found at project root. Relying on process.env.');
      return {};
    }
    const content = fs.readFileSync(envPath, 'utf8');
    const config = {};
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] ? match[2].trim() : '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        config[match[1]] = value;
      }
    });
    return config;
  } catch (e) {
    console.error('[Seeder] Error parsing .env file:', e);
    return {};
  }
}

const env = { ...loadEnv(), ...process.env };

const STRAPI_API_URL = env.VITE_STRAPI_API_URL || 'https://strapi-0jnq.srv1286779.hstgr.cloud/api';
const STRAPI_API_KEY = env.VITE_STRAPI_API_KEY || '';

if (!STRAPI_API_KEY) {
  console.error('[Seeder Failed] VITE_STRAPI_API_KEY is not defined in your environment or .env file.');
  process.exit(1);
}

// ----------------------------------------------------
// SEED DATA CONFIGURATION
// ----------------------------------------------------

const siteSettingsData = {
  siteName: "AeroSky",
  tagline: "India's community-powered airspace intelligence and flight tracking network",
  heroTitle: "India's Own|Airspace|Intelligence",
  heroSubtitle: "Help build India's independent aviation intelligence network. Join our founding community to host ground receiver nodes, decode transponder feeds, and map Indian airspace together.",
  announcementBanner: "Pre-Launch Community Open",
  discordInviteUrl: "https://discord.gg/aerosky",
  communityUrl: "https://aerosky.in/community",
  newsletterCta: "India Airspace Report",
  primaryCtaText: "Become a Founding AeroCaptain",
  primaryCtaLink: "/aerocaptains",
  secondaryCtaText: "Join the Founding Community",
  secondaryCtaLink: "#community",
  footerCopyright: "© 2026 AeroSky - AeroLytics Intelligence Pvt. Ltd. | Made in India",
  defaultSeoTitle: "India's Airspace Intelligence Network | AeroSky",
  defaultSeoDescription: "AeroSky is India's community-powered airspace intelligence and flight tracking network. Host a receiver ground station or join our airspace data forums.",
  socialLinks: { github: "https://github.com/AeroLytics", discord: "https://discord.gg/aerosky" }
};

const articlesData = [
  {
    slug: 'what-is-adsb-guide',
    title: 'What is ADS-B? A Beginner\'s Guide to Tracking Flights',
    excerpt: 'Automatic Dependent Surveillance-Broadcast explained. Learn how modern aircraft broadcast their speed, altitude, and position.',
    featured: true,
    publishedDate: '2026-06-18',
    seoTitle: 'What is ADS-B? A Beginner\'s Guide | AeroSky Insights',
    seoDescription: 'Learn how modern aircraft transmit their coordinates via ADS-B frequencies and how AeroSky tracks sovereign flights.',
    status: 'Published',
    description: `Automatic Dependent Surveillance-Broadcast (ADS-B) is a foundational technology in modern aviation traffic surveillance. Unlike traditional radar which queries aircraft position by bouncing radio pulses (primary radar) or interrogating transponders (secondary radar), ADS-B is entirely dependent and broadcast-based.

## How ADS-B Works

1. **Determine Position:** The aircraft uses onboard GPS/GNSS receivers to compute its exact latitude, longitude, altitude, and velocity.
2. **Transmit Broadcast:** An onboard transponder automatically broadcasts this position data, along with callsigns and squawk codes, on the 1090 MHz radio frequency.
3. **Ground Capture:** Ground stations receive these transmissions and stream them to air traffic control displays and flight tracking networks like AeroSky.

## Why it Matters for India

As Indian airspace becomes busier, dense ADS-B receiver grids help monitor flight corridors, track low-altitude helicopters, and optimize arrival queues at high-density hubs like Delhi and Mumbai. Building independent, locally-hosted grids ensures our skies remain mapped on sovereign servers.`,
    // Fallback field in case content is the primary body field in their schema
    content: `Automatic Dependent Surveillance-Broadcast (ADS-B) is a foundational technology in modern aviation traffic surveillance. Unlike traditional radar which queries aircraft position by bouncing radio pulses (primary radar) or interrogating transponders (secondary radar), ADS-B is entirely dependent and broadcast-based.

## How ADS-B Works

1. **Determine Position:** The aircraft uses onboard GPS/GNSS receivers to compute its exact latitude, longitude, altitude, and velocity.
2. **Transmit Broadcast:** An onboard transponder automatically broadcasts this position data, along with callsigns and squawk codes, on the 1090 MHz radio frequency.
3. **Ground Capture:** Ground stations receive these transmissions and stream them to air traffic control displays and flight tracking networks like AeroSky.

## Why it Matters for India

As Indian airspace becomes busier, dense ADS-B receiver grids help monitor flight corridors, track low-altitude helicopters, and optimize arrival queues at high-density hubs like Delhi and Mumbai. Building independent, locally-hosted grids ensures our skies remain mapped on sovereign servers.`
  },
  {
    slug: 'setup-adsb-receiver-guide',
    title: 'Setting Up Your First DIY ADS-B Station with RTL-SDR',
    excerpt: 'A step-by-step guide to building your own aircraft tracking station with a Raspberry Pi and RTL-SDR in India.',
    featured: false,
    publishedDate: '2026-06-18',
    seoTitle: 'Build Your Own DIY ADS-B Ground Station | AeroSky Academy',
    seoDescription: 'Follow our hardware installation guide to capture flight telemetry in India using RTL-SDR blog dongles.',
    status: 'Published',
    description: `Building your own ADS-B ground station is a rewarding project for SDR hobbyists, student pilots, and aviation geeks. Here is how you can set up a receiver node in under 30 minutes.

## Required Hardware

- **Microcontroller:** Raspberry Pi (3B+ or newer) or Orange Pi running a Linux distro.
- **USB SDR Dongle:** RTL-SDR Blog V3 or V4 dongle tuned to 1090 MHz.
- **Antenna:** A 1090 MHz omni-directional outdoor antenna.
- **Cabling:** Low-loss SMA coaxial cable (e.g. RG58 or LMR200).

## Step-by-Step Installation

1. **Flash OS:** Flash Raspberry Pi OS Lite onto a MicroSD card using Raspberry Pi Imager. Enable SSH and configure local WiFi.
2. **Connect Dongle:** Plug the RTL-SDR dongle into a USB port on the Pi, and connect it to your antenna.
3. **Install Decoder:** Install dump1090-fa or readsb to decode the raw 1090 MHz signals by running:
\`\`\`bash
sudo bash -c "$(wget -O - https://github.com/wiedehopf/adsb-scripts/raw/master/readsb-install.sh)"
\`\`\`
4. **Verify Stream:** Open a web browser on your local network and point to http://<your-pi-ip>/tar1090 to view live flights captured by your antenna.`,
    content: `Building your own ADS-B ground station is a rewarding project for SDR hobbyists, student pilots, and aviation geeks. Here is how you can set up a receiver node in under 30 minutes.

## Required Hardware

- **Microcontroller:** Raspberry Pi (3B+ or newer) or Orange Pi running a Linux distro.
- **USB SDR Dongle:** RTL-SDR Blog V3 or V4 dongle tuned to 1090 MHz.
- **Antenna:** A 1090 MHz omni-directional outdoor antenna.
- **Cabling:** Low-loss SMA coaxial cable (e.g. RG58 or LMR200).

## Step-by-Step Installation

1. **Flash OS:** Flash Raspberry Pi OS Lite onto a MicroSD card using Raspberry Pi Imager. Enable SSH and configure local WiFi.
2. **Connect Dongle:** Plug the RTL-SDR dongle into a USB port on the Pi, and connect it to your antenna.
3. **Install Decoder:** Install dump1090-fa or readsb to decode the raw 1090 MHz signals by running:
\`\`\`bash
sudo bash -c "$(wget -O - https://github.com/wiedehopf/adsb-scripts/raw/master/readsb-install.sh)"
\`\`\`
4. **Verify Stream:** Open a web browser on your local network and point to http://<your-pi-ip>/tar1090 to view live flights captured by your antenna.`
  },
  {
    slug: 'behind-aerosky-indian-network',
    title: 'Behind AeroSky: Building India\'s Sovereign Airspace Network',
    excerpt: 'The story of why we started AeroSky and the critical need for locally-hosted, community-powered airspace intelligence.',
    featured: false,
    publishedDate: '2026-06-18',
    seoTitle: 'AeroSky: Sovereign Aviation Data Network | Mission',
    seoDescription: 'Discover why localized, independent flight telemetry servers are critical for data sovereignty in India.',
    status: 'Published',
    description: `India is the world's fastest-growing domestic aviation market, yet the tracking data and intelligence of its airspace have historically relied on foreign platforms. AeroSky was founded to solve this infrastructure gap.

## The Sovereign Data Deficit

Currently, the vast majority of ADS-B data from flights over India is streamed to servers hosted outside the country. This creates a data sovereignty gap for local aviation intelligence, route optimization research, and domestic defense audits.

## The AeroSky Vision

By placing physical nodes hosted by local AeroCaptains across India's tier-1 and tier-2 corridors, AeroSky is constructing an independent airspace telemetry grid. We process, decode, and cache every transponder package on physical servers located in Pune and Maharashtra. This ensures local developers and researchers have free, low-latency, sovereign access to the airspace data mapping our skies.`,
    content: `India is the world's fastest-growing domestic aviation market, yet the tracking data and intelligence of its airspace have historically relied on foreign platforms. AeroSky was founded to solve this infrastructure gap.

## The Sovereign Data Deficit

Currently, the vast majority of ADS-B data from flights over India is streamed to servers hosted outside the country. This creates a data sovereignty gap for local aviation intelligence, route optimization research, and domestic defense audits.

## The AeroSky Vision

By placing physical nodes hosted by local AeroCaptains across India's tier-1 and tier-2 corridors, AeroSky is constructing an independent airspace telemetry grid. We process, decode, and cache every transponder package on physical servers located in Pune and Maharashtra. This ensures local developers and researchers have free, low-latency, sovereign access to the airspace data mapping our skies.`
  }
];

const eventsData = [
  {
    slug: 'aerosky-community-kickoff',
    title: 'AeroSky Community Kickoff',
    description: 'Meet the team online on July 25, 2026 at 19:00 IST. Learn how to setup your SDR receiver.',
    startDate: '2026-07-25T19:00:00+05:30',
    endDate: '2026-07-25T21:00:00+05:30',
    online: true,
    location: 'Online (Discord)',
    registrationUrl: 'https://discord.gg/aerosky',
    status: 'Upcoming'
  }
];

const faqsData = [
  // AeroCaptains FAQs
  { question: 'Do I need aviation experience?', answer: 'No. Anyone comfortable with basic hardware connections and having internet access can set up a station.', displayOrder: 1, active: true },
  { question: 'Is hosting a ground station legal in India?', answer: 'Yes. Aircraft telemetry is broadcasted publicly on unencrypted frequencies. Receiving public signal streams for situational and scientific analysis is common globally.', displayOrder: 2, active: true },
  { question: 'How much internet bandwidth does it consume?', answer: 'The data transmission is very lightweight, using less than 1-2 GB of bandwidth per month.', displayOrder: 3, active: true },
  { question: 'Where should I place the antenna?', answer: 'Rooftops or outdoor poles with a clear, unobstructed line of sight to the horizon provide the maximum tracking range.', displayOrder: 4, active: true },
  { question: 'Will AeroSky provide hardware receiver kits?', answer: 'Yes. AeroSky evaluates locations and provides free hardware kits to selected hosts in critical coverage zones. We also assist self-funded DIY setups.', displayOrder: 5, active: true },
  { question: 'How is my privacy protected?', answer: 'To maintain host security, the exact coordinates of your receiver are fuzzed on public maps.', displayOrder: 6, active: true },
  // Coverage FAQs
  { question: 'What is ADS-B coverage?', answer: 'ADS-B coverage is the line-of-sight range where ground stations can capture signals broadcasted by aircraft transponders. Dense regional setups allow seamless tracking.', displayOrder: 7, active: true },
  { question: 'How can I help expand the network?', answer: 'You can apply to host an AeroSky receiver ground station. We provide hardware kits to qualified nodes, or you can feed data using your own DIY receiver.', displayOrder: 8, active: true },
  { question: 'Which airports need coverage most?', answer: 'Chennai, Kolkata, Hyderabad, Ahmedabad, Jaipur, Kochi, Goa, Lucknow, and over 100 other locations currently represent critical coverage gaps.', displayOrder: 9, active: true },
  { question: 'Do I need to live right next to an airport?', answer: 'No. ADS-B signals travel line-of-sight up to 200+ miles. Even Simple setups 50km away from airports can capture cruising aircraft telemetry.', displayOrder: 10, active: true }
];

const pagesData = [
  {
    slug: 'about',
    title: 'Built For Indian Skies',
    seoTitle: 'About Us - Built For Indian Skies | AeroSky',
    seoDescription: 'AeroSky is building sovereign, independent airspace tracking infrastructure in India, powered by aviation enthusiasts.',
    published: true,
    content: `# Built for Indian Skies

AeroSky is creating a community-powered aviation intelligence platform designed specifically for India's rapidly growing aviation ecosystem. Built by aviation enthusiasts, engineers, and contributors who believe airspace intelligence should be transparent, accessible, and community-driven.

## Our Mission

AeroSky exists to democratize airspace intelligence in India. We believe that understanding the skies above us shouldn't rely on expensive proprietary software systems or foreign data pipelines.

By building a community-powered network of ADS-B ground stations across India, we are creating comprehensive, real-time airspace visibility that is owned by the community, processed on local infrastructure, and accessible to everyone.

India represents one of the largest domestic aviation growth corridors globally, yet lacks independent airspace data infrastructure. AeroSky is filling this gap, one ground station at a time.

## Core Principles

- **Data Sovereignty:** Indian flight statistics and logs should remain on domestic soil, processed by Indian servers.
- **Community Ownership:** No single corporation should control airspace visibility. The community builds, hosts, and feeds the network.
- **Universal Access:** Democratizing airspace data for aviation enthusiasts, academic researchers, and local developers alike.
- **Low-Altitude Coverage:** Shoring up coverage holes in remote or mountainous terrains that lack standard ground receivers today.
- **Real-Time Telemetry:** Streaming sub-second transponder updates, not delayed data feeds, for accurate regional awareness.
- **India-First Innovation:** Optimized for Indian airports, airlines, flight safety regulations, and local timezone metrics.`
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    seoTitle: 'Privacy Policy | AeroSky',
    seoDescription: 'Learn how AeroSky collects, protects, and handles your email, receiver coordinates, and telemetry data.',
    published: true,
    content: `# Privacy Policy

AeroSky collects data necessary to maintain pre-launch subscriptions, evaluate prospective ground station hosts, and audit system performance.

## 1. Data Collection & Usage

- **Newsletter Signups:** We store email addresses submitted to our monthly airspace report forms.
- **AeroCaptain Applications:** If you apply to host a ground station, we collect your name, contact details, approximate coordinate grid, rooftop availability, and network speeds.
- **Telemetry Submissions:** Feeds from operational ADS-B receivers process aircraft flight data, packet metadata, and station coordinates.

## 2. Contributor Geolocation Privacy

Airspace mapping requires geographical reference tags. To safeguard the privacy and physical security of our AeroCaptains:

> All public-facing ground station markers and coordinate indicators are programmatically fuzzed (rounded and randomized) to prevent pinpointing exact home or facility locations.

## 3. Cookies & Analytical Tools

AeroSky integrates industry-standard optimization plugins to review layout usage, load metrics, and site performance:

- **Google Tag Manager (GTM):** Handles active marketing triggers and tag distribution.
- **Google Analytics (GA4):** Analyzes search conversions, page flows, and geographic user groupings.
- **Microsoft Clarity:** Records visual heatmaps to identify design hurdles and render failures.

## 4. Security & Data Sovereignty

In alignment with our sovereign skies philosophy, all collected records, databases, and logs are hosted on secure servers located within India. We do not sell user, applicant, or telemetry records to commercial third-party marketing brokers.`
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    seoTitle: 'Terms of Service | AeroSky',
    seoDescription: 'Review user rights, contributor data parameters, and platform limits for the AeroSky pre-launch network.',
    published: true,
    content: `# Terms of Service

AeroSky is currently operating under a pre-launch community beta framework. Feature structures, analytics datasets, coverage visualization tools, and metrics reports are supplied "as-is" for evaluation, hobbyist, and academic interest.

## 1. Pre-Launch Beta Services

The pre-launch website is intended to register interest in ground stations, gather email subscriptions, and highlight coverage statistics. We make no guarantees about uptime or feature persistence.

## 2. Contributor Telemetry Feeds

Founding AeroCaptains hosting receiver nodes and DIY feeders who choose to stream raw 1090 MHz transponder broadcasts (ADS-B, Mode S) agree to:

- Stream raw signals captured locally without modifying flight tracking packet values.
- Provide stable hardware availability to the best of their ability to support network statistics.
- Acknowledge that raw transponder data feeds submitted to our server coordinates are granted under a universal, royalty-free, perpetual license to map airspace metrics.

## 3. Service Scope & Limitations

AeroSky is not a primary source of official, safety-critical navigation flight routing controls. It should not be used as a replacement for official air traffic management radars, airline dispatch systems, or state civil aviation channels.

## 4. General Terms

AeroSky reserves the right to suspend or block specific ground station feeds that are found to transmit corrupted packets, fake coordinates, or modified signal streams. These terms are governed under Indian jurisdiction.`
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    seoTitle: 'Cookie Policy | AeroSky',
    seoDescription: 'Learn how AeroSky uses cookies and tracking technologies to optimize our pre-launch community platform.',
    published: true,
    content: `# Cookie Policy

Cookies are small text files stored on your computer or mobile device by websites you visit. They are widely used to make websites run efficiently and provide analytical data to site operators.

## 1. What Are Cookies?

Cookies do not harm your computer and are stored locally for duration limits. They let us understand navigation loops, optimize page components, and store local parameters.

## 2. Cookies We Use

AeroSky uses basic optimization cookies to track traffic, referrals, and layout performance:

- **Essential Session Variables:** We store small variables locally (such as referral source codes: \`aerosky_ref\`) to identify what campaign referred an application.
- **Google Analytics (GA4) Cookies:** These cookies gather anonymous logs about page visits, clicks, conversion registrations, and session lengths.
- **Microsoft Clarity Cookies:** Help record mouse maps and rendering patterns to prevent navigation bugs on dynamic screens.

## 3. Managing Your Cookies

You can instruct your browser to block cookies or notify you when they are set by adjusting your browser options. Disabling cookies will not break the pre-launch landing page or form submissions, but will disable referral tracking parameters.`
  },
  {
    slug: 'support',
    title: 'AeroSky Support Channels',
    seoTitle: 'Support & Contact Channels | AeroSky',
    seoDescription: 'Get in touch with AeroSky support, partnerships, security response, or press inquiries.',
    published: true,
    content: `# Support & Contact Channels

Reach out to the appropriate team for hardware assistance, data access, partnerships, or security reports.

## Contact Directory

- **Support & AeroCaptains:** support@aerosky.in
  *Hardware configurations, RTL-SDR setups, receiver kit deliveries, and connection logs.*
- **Press & Media:** press@aerosky.in
  *Airspace data requests, media publications, and pre-launch report citations.*
- **Partnerships:** partners@aerosky.in
  *Academic research collaborations, commercial airspace analytics, and local database integrations.*
- **Security (VDP):** security@aerosky.in
  *Report transponder decode issues, network vulnerabilities, or data leakage reports.*
- **General Administrative:** contact@aerosky.in
  *General inquiries, corporate details, parent organization (AeroLytics) correspondence.*

For institutional queries or official business correspondence, please email contact@aerosky.in.`
  }
];

// ----------------------------------------------------
// SEED EXECUTION LOGIC
// ----------------------------------------------------

// Unified API requester with self-healing retry logic
async function apiCall(endpoint, method = 'GET', body = null) {
  let currentBody = body ? { ...body } : null;

  while (true) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_KEY}`
    };
    
    const options = { method, headers };
    if (currentBody) {
      options.body = JSON.stringify({ data: currentBody });
    }

    const res = await fetch(`${STRAPI_API_URL}/${endpoint}`, options);
    
    if (res.status === 404) {
      throw { status: 404, message: `Endpoint ${endpoint} not found (404).` };
    }
    
    if (!res.ok) {
      const errText = await res.text();
      let errObj = null;
      try {
        errObj = JSON.parse(errText);
      } catch (_) {}

      // If validation error, attempt to auto-heal by deleting the rejected field and retrying
      if (res.status === 400 && errObj && errObj.error && errObj.error.name === 'ValidationError') {
        const details = errObj.error.details;
        const invalidKey = details && details.key;
        if (invalidKey && currentBody && currentBody[invalidKey] !== undefined) {
          console.warn(`[Seeder Warning] Endpoint /api/${endpoint} rejected field "${invalidKey}". Removing field and retrying...`);
          delete currentBody[invalidKey];
          continue; // retry
        }
      }

      throw { status: res.status, message: errText };
    }

    if (res.status === 204) {
      return null;
    }

    return await res.json();
  }
}

// Helper to flatten Strapi items to find matching slug or title
function getFlatData(json) {
  if (!json || json.data === undefined) return json;
  if (Array.isArray(json.data)) {
    return json.data.map(item => ({ id: item.id, documentId: item.documentId, ...(item.attributes || item) }));
  }
  if (json.data) {
    return { id: json.data.id, documentId: json.data.documentId, ...(json.data.attributes || json.data) };
  }
  return json;
}

async function run() {
  console.log('==================================================');
  console.log('          AEROSKY STRAPI CONTENT SEEDER           ');
  console.log('==================================================');
  console.log(`Strapi Endpoint: ${STRAPI_API_URL}`);
  
  // 1. Seed Site Settings (Single Type or Collection Type fallback)
  console.log('\n[1/5] Seeding Site Settings...');
  let siteSettingSeeded = false;

  // Try singular endpoint (Single Type)
  try {
    console.log(`Trying PUT to /api/site-setting...`);
    await apiCall('site-setting', 'PUT', siteSettingsData);
    console.log(`[Success] Site Settings successfully updated on /api/site-setting`);
    siteSettingSeeded = true;
  } catch (e) {
    if (e.status !== 404 && e.status !== 405) {
      console.error(`[Error] Failed to update /api/site-setting:`, e.message || e);
    }
  }

  // Try plural endpoint (Collection Type or Plural Single Type)
  if (!siteSettingSeeded) {
    try {
      console.log(`Trying GET/POST/PUT on /api/site-settings...`);
      const existing = getFlatData(await apiCall('site-settings'));
      if (existing && Array.isArray(existing) && existing.length > 0) {
        // Update first entry
        const match = existing[0];
        const identifier = match.documentId || match.id;
        await apiCall(`site-settings/${identifier}`, 'PUT', siteSettingsData);
        console.log(`[Success] Updated existing Site Settings entry`);
      } else {
        // Create first entry
        await apiCall('site-settings', 'POST', siteSettingsData);
        console.log(`[Success] Created new Site Settings entry`);
      }
      siteSettingSeeded = true;
    } catch (e) {
      console.error(`[Error] Failed to seed /api/site-settings:`, e.message || e);
    }
  }

  if (!siteSettingSeeded) {
    console.log('[Warning] Could not seed Site Settings. Please ensure either Single Type "Site Setting" (apiId: site-setting) or Collection Type "Site Settings" (apiId: site-settings) is created and token permissions are enabled.');
  }

  // 2. Seed Articles (Collection Type)
  console.log('\n[2/5] Seeding Articles...');
  try {
    const existing = getFlatData(await apiCall('articles'));
    for (const article of articlesData) {
      const match = existing.find(a => a.slug === article.slug);
      const payload = { ...article, publishedAt: new Date().toISOString() };
      
      if (match) {
        console.log(`Article "${article.title}" exists. Updating...`);
        const identifier = match.documentId || match.id;
        await apiCall(`articles/${identifier}`, 'PUT', payload);
        console.log(`[Success] Updated: ${article.slug}`);
      } else {
        console.log(`Creating Article "${article.title}"...`);
        await apiCall('articles', 'POST', payload);
        console.log(`[Success] Created: ${article.slug}`);
      }
    }
  } catch (e) {
    console.error('[Error Seeding Articles]:', e.message || e);
    const errStr = typeof e.message === 'string' ? e.message : JSON.stringify(e);
    if (errStr.includes('description must be at most 80 characters')) {
      console.log('\n[Action Required] The "description" field on your "Article" model on Strapi is configured as Short Text (limited to 80 characters).');
      console.log('To resolve this, please go to your Strapi Admin Panel -> Content-Types Builder, edit the "Article" model, change the "description" field to Rich Text (Markdown) or Long Text, save, and run this seeder again.\n');
    }
  }

  // 3. Seed Events (Collection Type)
  console.log('\n[3/5] Seeding Events...');
  try {
    const existing = getFlatData(await apiCall('events'));
    for (const event of eventsData) {
      const match = existing.find(e => e.slug === event.slug);
      const payload = { 
        ...event, 
        eventStatus: event.status,
        publishedAt: new Date().toISOString() 
      };
      
      if (match) {
        console.log(`Event "${event.title}" exists. Updating...`);
        const identifier = match.documentId || match.id;
        await apiCall(`events/${identifier}`, 'PUT', payload);
        console.log(`[Success] Updated: ${event.slug}`);
      } else {
        console.log(`Creating Event "${event.title}"...`);
        await apiCall('events', 'POST', payload);
        console.log(`[Success] Created: ${event.slug}`);
      }
    }
  } catch (e) {
    if (e.status === 404) {
      console.log('[Warning] Collection "Event" (apiId: event) does not exist on your Strapi instance. Skipping seeding for Events.');
      console.log('To enable, create the "Event" Collection Type in Strapi Admin Builder and assign write permissions to your API token.');
    } else {
      console.error('[Error Seeding Events]:', e.message || e);
    }
  }

  // 4. Seed FAQs (Collection Type)
  console.log('\n[4/5] Seeding FAQs...');
  try {
    const existing = getFlatData(await apiCall('faqs'));
    for (const faq of faqsData) {
      const match = existing.find(f => f.question.toLowerCase() === faq.question.toLowerCase());
      const payload = { ...faq, publishedAt: new Date().toISOString() };

      if (match) {
        console.log(`FAQ "${faq.question.substring(0, 30)}..." exists. Updating...`);
        const identifier = match.documentId || match.id;
        await apiCall(`faqs/${identifier}`, 'PUT', payload);
        console.log('[Success] Updated FAQ');
      } else {
        console.log(`Creating FAQ "${faq.question.substring(0, 30)}..."`);
        await apiCall('faqs', 'POST', payload);
        console.log('[Success] Created FAQ');
      }
    }
  } catch (e) {
    if (e.status === 404) {
      console.log('[Warning] Collection "FAQ" (apiId: faq) does not exist on your Strapi instance. Skipping seeding for FAQs.');
      console.log('To enable, create the "FAQ" Collection Type in Strapi Admin Builder and assign write permissions to your API token.');
    } else {
      console.error('[Error Seeding FAQs]:', e.message || e);
    }
  }

  // 5. Seed Pages (Collection Type)
  console.log('\n[5/5] Seeding Pages...');
  try {
    const existing = getFlatData(await apiCall('pages'));
    for (const page of pagesData) {
      const match = existing.find(p => p.slug === page.slug);
      const payload = { ...page, publishedAt: new Date().toISOString() };

      if (match) {
        console.log(`Page "${page.title}" exists. Updating...`);
        const identifier = match.documentId || match.id;
        await apiCall(`pages/${identifier}`, 'PUT', payload);
        console.log(`[Success] Updated Page: ${page.slug}`);
      } else {
        console.log(`Creating Page "${page.title}"...`);
        await apiCall('pages', 'POST', payload);
        console.log(`[Success] Created Page: ${page.slug}`);
      }
    }
  } catch (e) {
    if (e.status === 404) {
      console.log('[Warning] Collection "Page" (apiId: page) does not exist on your Strapi instance. Skipping seeding for Pages.');
      console.log('To enable, create the "Page" Collection Type in Strapi Admin Builder and assign write permissions to your API token.');
    } else {
      console.error('[Error Seeding Pages]:', e.message || e);
    }
  }

  console.log('\n==================================================');
  console.log('              SEED OPERATIONS COMPLETED           ');
  console.log('==================================================');
}

run();
