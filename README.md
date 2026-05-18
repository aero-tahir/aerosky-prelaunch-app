# AeroSky — Pre-Launch Website

India's community-powered airspace intelligence network. This is the static pre-launch marketing and onboarding website.

## Pages

- **/** — Home (hero, features, preview, feeder program, coverage, community, waitlist)
- **/feeders** — Founding Feeder Program (what, how, hardware, benefits, application form)
- **/coverage** — Coverage expansion map with target cities
- **/blog** — Aviation insights and articles (static cards)
- **/community** — Social links, Discord, Telegram, contributor highlights
- **/about** — Mission, philosophy, vision

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- React Router 7
- Lucide Icons

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Design

- Dark aviation theme
- Glassmorphism panels
- Cyan/blue glow accents
- Animated radar and signal effects
- Mobile responsive
- SEO optimized

## Forms

Forms currently show success state on submit. To connect to a backend:
- Replace form `onSubmit` handlers with API calls to Supabase, Formspree, or Resend
- The form data structure is ready for any backend integration
