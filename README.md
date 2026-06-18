# AeroSky: Pre-Launch Airspace Network App

AeroSky is India's sovereign, community-powered airspace intelligence and flight tracking network. This pre-launch application is designed to onboard the founding community, register target ground stations, capture monthly airspace reports subscriptions, and map underserved aviation corridors across India.

---

## Table of Contents
1. [Core Features](#1-core-features)
2. [Project Architecture](#2-project-architecture)
3. [Environment Configuration & Setup](#3-environment-configuration--setup)
4. [Form Flows & Data Pipelines](#4-form-flows--data-pipelines)
5. [Security & Abuse Prevention](#5-security--abuse-prevention)
6. [Analytics & SEO Integrations](#6-analytics--seo-integrations)
7. [Development & Build Commands](#7-development--build-commands)

---

## 1. Core Features

### 🌌 Day 0 Honest Launch Design
- **No Seeded Data/Counters**: Fully authentic stats reporting. Counters for cities, captains, and airspace range report `0` live nodes on launch day, reflecting a genuine call to action for early builders.
- **Pre-Launch Status Cards**: Displays real-time operational status for core initiatives directly on the home hero:
  - **Founding AeroCaptain Program**: *Applications Open*
  - **Community Forums**: *Join Our Discord*
  - **India Airspace Report**: *Subscribe for Monthly Updates*
  - **Platform Infrastructure**: *Pre-Launch*

### 📡 Founding AeroCaptain Onboarding
- Contributors apply to host local, low-power ADS-B ground receiver nodes (consisting of Raspberry Pi / SBC, RTL-SDR USB dongle, and an omnidirectional 1090 MHz antenna).
- **Founding Directory**: Shows anonymized confirmations of approved ground nodes. If no applications are approved, the directory falls back to a clean placeholder message: *"The Founding Directory is currently empty. Be one of the first to apply..."*

### 🏆 Aspirational Hall of Fame
- Features empty premium placeholder slots waiting to celebrate the first operational stations:
  - *Reserved for First AeroCaptain* (first stream connected)
  - *Reserved for First Longest Uptime* (99.9% reliability over 30 days)
  - *Reserved for First Coverage Champion* (maximum signal range in nautical miles)
  - *Reserved for Community Champion* (open-source decoder contributors and workshop leads)

### 🗺️ Coverage Vision Map
- Uses **Ola Maps Vector Tiles** integrated via **React Map GL (MapLibre)** to render a conceptual grid of target aviation gaps.
- Renders high-priority target zones (large airports and metros like DEL, BOM, BLR, PNQ) in amber alongside secondary expansion regional airports.
- Avoids displaying misleading live flight tracking lines or fake coverage rings until active nodes are verified.

### 📰 India Airspace Report
- A monthly newsletter pipeline providing sovereign airspace analysis, community milestones, receiver updates, and upcoming launches.

---

## 2. Project Architecture

The codebase is organized as a single-page TypeScript React app built with Vite and styled with CSS:

```
aerosky-prelaunch-app/
├── public/                  # Static assets & icons
├── src/
│   ├── components/
│   │   ├── DiscordCTA.tsx   # Trackable Discord community button
│   │   ├── Footer.tsx       # Desktop & mobile footer navigation
│   │   ├── Layout.tsx       # Header/footer layout wrap
│   │   ├── MapBackground.tsx# Decorative canvas map background
│   │   ├── Navbar.tsx       # Tri-color desktop header and mobile nav
│   │   ├── SEO.tsx          # Dynamic React Helmet page metadata injector
│   │   └── Schema.tsx       # Dynamic JSON-LD structured data injector
│   ├── pages/
│   │   ├── Home.tsx         # Homepage (Hero, pillars, roadmap, signup)
│   │   ├── AeroCaptains.tsx # Feeder node applications & hosting requirements
│   │   ├── HallOfFame.tsx   # Contributor honor roll and placeholders
│   │   ├── Coverage.tsx     # Airspace gap visualizer & Ola Maps tile grid
│   │   ├── Blog.tsx         # Aviation science deep dives (Coming Soon)
│   │   ├── Community.tsx    # Forum categories and progression tiers
│   │   ├── About.tsx        # Mission statement and data sovereignty values
│   │   └── Launch.tsx       # Hidden Launch Dashboard (Router path enabled)
│   ├── utils/
│   │   ├── analytics.ts     # GTM & GA4 tracking push triggers
│   │   ├── db.ts            # Neon DB client, LocalStorage fallback, & sequences
│   │   └── security.ts      # Rate limiters, honeypots, and input sanitizers
│   ├── App.tsx              # React routing setup and page view tracking
│   ├── data.ts              # Airport coordinate definitions and headings
│   ├── index.css            # Base Tailwind config, custom animations, glass panels
│   └── main.tsx             # App mounting & referral link interceptor
└── vite.config.ts           # Bundler config & path aliases
```

---

## 3. Environment Configuration & Setup

### Environment Variables (`.env`)
Create a `.env` file in the root directory:

```env
# Ola Maps API key used to download vector map tiles and style maps
VITE_OLA_MAP_API_KEY=your_ola_maps_key_here

# Neon DB Connection String. If left blank, the app runs in LocalStorage fallback mode
VITE_DATABASE_URL=postgresql://user:password@subdomain.neon.tech/dbname?sslmode=require
```

### Database Schema Setup
When connected to a database via `VITE_DATABASE_URL`, the application automatically runs schema migrations inside a schema named `prelaunch` when starting up (`initDB` call). 

#### Tables Created:
1. `prelaunch.newsletter_subscribers`
   - `id SERIAL PRIMARY KEY`
   - `email VARCHAR(255) UNIQUE NOT NULL`
   - `source_page VARCHAR(255) NOT NULL`
   - `referral_code VARCHAR(50)`
   - `timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`

2. `prelaunch.aerocaptain_applications`
   - `id SERIAL PRIMARY KEY`
   - `founding_number VARCHAR(50) UNIQUE NOT NULL`
   - `name VARCHAR(255) NOT NULL`
   - `email VARCHAR(255) NOT NULL`
   - `city VARCHAR(255) NOT NULL`
   - `state VARCHAR(255) NOT NULL`
   - `country VARCHAR(255) NOT NULL`
   - `internet_type VARCHAR(100) NOT NULL`
   - `rooftop_available BOOLEAN NOT NULL`
   - `existing_hardware VARCHAR(100)[] NOT NULL`
   - `referral_code VARCHAR(50)`
   - `application_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`
   - `status VARCHAR(50) DEFAULT 'Pending'`

---

## 4. Form Flows & Data Pipelines

The application uses two core onboarding forms. If a connection to Neon DB fails or is omitted, the pipelines automatically and silently fail over to **HTML5 LocalStorage** client storage.

### Flow A: AeroCaptain Onboarding Flow
```
 [User Form Input]
        │
        ▼
 [security.ts Checks] ──► (Fail? Show inline error & halt)
        │ (Sanitization, email regex validation,
        │  honeypot detection, 15s Rate Limiter check)
        ▼
 [referral check] ────► Pulls referral code from localStorage('aerosky_ref')
        │
        ▼
 [submitAeroCaptainApplication]
        │
        ├──► [Neon DB Connects]
        │         ├──► Check last application row ID
        │         ├──► Increment count -> Generate sequential ID e.g., 'AC001'
        │         └──► Write to `prelaunch.aerocaptain_applications`
        │
        └──► [LocalStorage Fallback]
                  ├──► Read array length from 'prelaunch_aerocaptain_applications'
                  ├──► Increment count -> Generate sequential ID e.g., 'AC001'
                  └──► Append record and save to storage
```

### Flow B: India Airspace Report Subscription Flow
```
 [Email Form Input]
        │
        ▼
 [security.ts Checks] ──► (Fail? Show inline error & halt)
        │ (Sanitization, email validation,
        │  honeypot detection, 10s Rate Limiter check)
        ▼
 [addNewsletterSubscription]
        │
        ├──► [Neon DB Connects]
        │         └──► Write record to `prelaunch.newsletter_subscribers`
        │              (Returns false if email already registered)
        │
        └──► [LocalStorage Fallback]
                  ├──► Read 'prelaunch_newsletter_subscribers' array
                  ├──► Check for duplicate email address
                  └──► Append record to array
```

### Referral Link Interceptor
Referral codes are tracked automatically. Upon loading the index page:
1. `main.tsx` scans the URL for `?ref=ACxxx`.
2. If found, the code is parsed, sanitized, and stored as `localStorage.setItem('aerosky_ref', code)`.
3. When forms are submitted, this code is automatically appended to the application or subscription row.

---

## 5. Security & Abuse Prevention

Form handling incorporates strict client-side verification to protect local storage and Postgres resources from bots and spam:

- **Honeypot Traps**: Invisible input elements (`phone_number` and `website`) act as honeypots. If these fields are populated, the submission is categorized as a bot and is silently ignored (the UI displays a mock success page to the bot, but no data is written to the database).
- **XSS Input Sanitization**: Inputs are passed through an HTML entity encoder to neutralize malicious scripts and strip tags.
- **Client-Side Rate Limiting**:
  - AeroCaptain application submissions: Limit to 1 attempt per **15 seconds** per browser session.
  - Newsletter subscriptions: Limit to 1 attempt per **10 seconds** per browser session.
  - Returns `429 Too Many Attempts` messages inline if violated.

---

## 6. Analytics & SEO Integrations

### Dynamic Search Engine Schemas (`Schema.tsx`)
Pages inject standard JSON-LD structured schemas to boost visibility on search engine result pages (SERPs):
- **Organization Schema**: Injected on `/` (Home) with corporate name, URL, logo, and official handles.
- **BreadcrumbList Schema**: Injected on `/community`, `/coverage`, `/aerocaptains`, and `/about` to improve search snippet structure.
- **Article Schema**: Dynamically injected on the `/blog` index page for every registered blog post.

### GTM & GA4 Tracker (`analytics.ts`)
- Implements custom events (e.g., `aerocaptain_application_submitted`, `newsletter_signup_completed`, `community_event_registered`) pushing payload metrics to the browser `dataLayer`.
- Includes a page tracker in `App.tsx` matching route changes (e.g., `home_page_viewed`, `hall_of_fame_viewed`, `coverage_page_viewed`) to feed Microsoft Clarity, GA4, and Google Tag Manager.

---

## 7. Development & Build Commands

### Initial Setup
```bash
# Install dependencies
npm install
```

### Local Dev Server
```bash
# Starts Vite local server on http://localhost:5173
npm run dev
```

### Build & Production Test
```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview the built distribution folder locally
npm run preview
```
