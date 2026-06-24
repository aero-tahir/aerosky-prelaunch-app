import Clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_ID || 'x8wfvn11ya';

// Ensure dataLayer is initialized on window
if (typeof window !== 'undefined') {
  (window as any).dataLayer = (window as any).dataLayer || [];
}

/**
 * Initializes Microsoft Clarity only in production environments.
 */
export function initClarity(): void {
  if (!import.meta.env.PROD) {
    console.log('[Analytics] Microsoft Clarity initialization skipped (development environment)');
    return;
  }

  try {
    console.log(`[Analytics] Initializing Microsoft Clarity with Project ID: ${CLARITY_PROJECT_ID}`);
    Clarity.init(CLARITY_PROJECT_ID);
  } catch (err) {
    console.error('[Analytics] Error initializing Microsoft Clarity:', err);
  }
}

/**
 * Tracks custom events by pushing them to the GTM dataLayer.
 * @param eventName The event name, e.g. "newsletter_signup_completed"
 * @param params Additional custom fields to send alongside the event
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  try {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      const payload = {
        event: eventName,
        ...params,
        page_path: window.location.pathname,
        page_title: document.title
      };
      (window as any).dataLayer.push(payload);
      
      // Also send custom events to Microsoft Clarity if initialized
      try {
        Clarity.event(eventName);
        // If specific params exist that are useful for Clarity tags
        Object.entries(params).forEach(([key, val]) => {
          if (typeof val === 'string' || Array.isArray(val)) {
            Clarity.setTag(key, Array.isArray(val) ? val.join(',') : val);
          }
        });
      } catch (clarityErr) {
        // Clarity might not be initialized, ignore silently
      }

      console.log(`[Analytics] dataLayer.push:`, payload);
    }
  } catch (err) {
    console.error('[Analytics] Error logging event to dataLayer:', err);
  }
}

/**
 * Initializes Google Tag Manager dynamically if a valid VITE_GTM_ID is provided.
 */
export function initGTM(): void {
  const gtmId = import.meta.env.VITE_GTM_ID;
  if (!gtmId || gtmId.startsWith('%VITE_') || gtmId === 'GTM-XXXXXXX' || gtmId.trim() === '') {
    console.log('[Analytics] Google Tag Manager initialization skipped (no valid VITE_GTM_ID env var)');
    return;
  }

  try {
    console.log(`[Analytics] Initializing Google Tag Manager with Container ID: ${gtmId}`);
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    const f = document.getElementsByTagName('script')[0];
    const j = document.createElement('script') as HTMLScriptElement;
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + gtmId;
    f.parentNode?.insertBefore(j, f);
  } catch (err) {
    console.error('[Analytics] Error initializing Google Tag Manager:', err);
  }
}

/**
 * Injects Google Search Console verification meta tag dynamically if the environment variable is provided.
 */
export function initGoogleVerification(): void {
  const code = import.meta.env.VITE_GOOGLE_VERIFICATION_CODE;
  if (!code || code.startsWith('%VITE_') || code.includes('your_google') || code.trim() === '') {
    return;
  }

  try {
    if (document.querySelector('meta[name="google-site-verification"]')) {
      return;
    }
    const meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = code.trim();
    document.head.appendChild(meta);
    console.log('[SEO] Google Search Console verification tag injected.');
  } catch (err) {
    console.error('[SEO] Error injecting Google verification tag:', err);
  }
}
