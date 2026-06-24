import {
  StrapiSiteSettings,
  StrapiArticle,
  StrapiEvent,
  StrapiFAQ,
  StrapiPage
} from '../types/strapi';

const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || 'https://strapi-0jnq.srv1286779.hstgr.cloud/api';
const STRAPI_API_KEY = import.meta.env.VITE_STRAPI_API_KEY || '';

// Local Storage Cache Helper with TTL (5 minutes)
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(`strapi_cache_${key}`);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(`strapi_cache_${key}`);
      return null;
    }
    return parsed.data as T;
  } catch (e) {
    return null;
  }
}

function setCachedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`strapi_cache_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    // Ignore cache write failures (e.g., in private browsing mode)
  }
}

// Media URL formatter supporting relative local upload paths
export function formatImageUrl(urlPath: any): string | null {
  if (!urlPath) return null;
  
  let pathString = '';
  if (typeof urlPath === 'string') {
    pathString = urlPath;
  } else if (urlPath.url) {
    pathString = urlPath.url;
  } else if (urlPath.data) {
    if (urlPath.data.attributes && urlPath.data.attributes.url) {
      pathString = urlPath.data.attributes.url;
    } else if (urlPath.data.url) {
      pathString = urlPath.data.url;
    }
  }

  if (!pathString) return null;

  if (pathString.startsWith('http://') || pathString.startsWith('https://') || pathString.startsWith('data:')) {
    return pathString;
  }

  // Prepend Strapi origin
  const origin = STRAPI_API_URL.replace(/\/api\/?$/, '');
  return `${origin}${pathString}`;
}

// Flatten Strapi v4 response (which nests fields inside attributes) to a flat object (like Strapi v5)
function flattenStrapiItem(item: any): any {
  if (!item) return null;
  const result: any = { id: item.id };
  if (item.attributes) {
    Object.assign(result, item.attributes);
  } else {
    Object.assign(result, item);
  }
  return result;
}

// Model Mappers to make the frontend schema resilient to backend variations
function mapRawArticleToStrapiArticle(item: any): StrapiArticle {
  const flat = flattenStrapiItem(item);
  
  // Extract body content from either description or content field
  const contentText = flat.content || flat.description || '';
  
  // Auto-generate excerpt if not available
  const excerptText = flat.excerpt || (contentText 
    ? contentText.substring(0, 150).replace(/[#*_`\-]/g, '').replace(/\s+/g, ' ').trim() + '...' 
    : '');

  return {
    id: flat.id,
    title: flat.title || '',
    slug: flat.slug || '',
    content: contentText,
    excerpt: excerptText,
    featuredImage: flat.featuredImage || flat.image || null,
    publishedDate: flat.publishedDate || flat.createdAt || '',
    featured: flat.featured === true || flat.isFeatured === true,
    seoTitle: flat.seoTitle || flat.title || '',
    seoDescription: flat.seoDescription || excerptText,
    status: flat.publishedAt ? 'Published' : 'Draft',
    category: flat.category ? {
      id: flat.category.id,
      documentId: flat.category.documentId,
      name: flat.category.name,
      slug: flat.category.slug,
      description: flat.category.description
    } : undefined
  };
}

function mapRawSiteSettings(item: any): StrapiSiteSettings {
  return flattenStrapiItem(item) || {};
}

function mapRawEvent(item: any): StrapiEvent {
  const flat = flattenStrapiItem(item);
  return {
    id: flat.id,
    title: flat.title || '',
    slug: flat.slug || '',
    description: flat.description || '',
    bannerImage: flat.bannerImage || flat.image || null,
    startDate: flat.startDate || '',
    endDate: flat.endDate || '',
    online: flat.online !== false,
    location: flat.location || '',
    registrationUrl: flat.registrationUrl || '',
    status: flat.eventStatus || flat.status || 'Upcoming'
  };
}

function mapRawFAQ(item: any): StrapiFAQ {
  const flat = flattenStrapiItem(item);
  return {
    id: flat.id,
    question: flat.question || '',
    answer: flat.answer || '',
    displayOrder: flat.displayOrder || 0,
    active: flat.active !== false
  };
}

function mapRawPage(item: any): StrapiPage {
  const flat = flattenStrapiItem(item);
  return {
    id: flat.id,
    title: flat.title || '',
    slug: flat.slug || '',
    content: flat.content || flat.description || '',
    seoTitle: flat.seoTitle || '',
    seoDescription: flat.seoDescription || '',
    published: flat.published !== false
  };
}

// Core fetch client
async function strapiFetch<T>(endpoint: string): Promise<T | null> {
  const cacheKey = encodeURIComponent(endpoint);
  const cached = getCachedData<T>(cacheKey);
  if (cached !== null) return cached;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (STRAPI_API_KEY) {
      headers['Authorization'] = `Bearer ${STRAPI_API_KEY}`;
    }

    const response = await fetch(`${STRAPI_API_URL}/${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`Strapi API Fetch Failed: GET ${endpoint} responded with status ${response.status}`);
    }

    const json = await response.json();
    let parsedData: any = null;

    if (json && json.data !== undefined) {
      if (Array.isArray(json.data)) {
        parsedData = json.data.map((item: any) => flattenStrapiItem(item));
      } else if (json.data) {
        parsedData = flattenStrapiItem(json.data);
      }
    } else {
      parsedData = json;
    }

    if (parsedData !== null) {
      setCachedData(cacheKey, parsedData);
    }
    return parsedData as T;
  } catch (error) {
    console.error(`[Strapi Error] Failed to fetch endpoint: ${endpoint}`, error);
    return null;
  }
}

// Get global Site Settings (Single Type or Collection Type fallback)
export async function getSiteSettings(): Promise<StrapiSiteSettings | null> {
  let data = await strapiFetch<any>('site-setting?populate=*');
  if (data) return mapRawSiteSettings(data);

  let dataPlural = await strapiFetch<any>('site-settings?populate=*');
  if (dataPlural) {
    if (Array.isArray(dataPlural)) {
      return dataPlural.length > 0 ? mapRawSiteSettings(dataPlural[0]) : null;
    }
    return mapRawSiteSettings(dataPlural);
  }
  return null;
}

// Get all articles (Collection Type)
export async function getArticles(): Promise<StrapiArticle[]> {
  const rawArticles = await strapiFetch<any[]>('articles?populate=*');
  if (!rawArticles) return [];
  return rawArticles.map(item => mapRawArticleToStrapiArticle(item));
}

// Get featured articles
export async function getFeaturedArticles(): Promise<StrapiArticle[]> {
  const articles = await getArticles();
  return articles.filter(a => a.featured === true);
}

// Get article by slug
export async function getArticle(slug: string): Promise<StrapiArticle | null> {
  const articles = await getArticles();
  return articles.find(a => a.slug === slug) || null;
}

// Get all events (Collection Type)
export async function getEvents(): Promise<StrapiEvent[]> {
  const rawEvents = await strapiFetch<any[]>('events?populate=*');
  if (!rawEvents) return [];
  return rawEvents.map(item => mapRawEvent(item));
}

// Get upcoming events
export async function getUpcomingEvents(): Promise<StrapiEvent[]> {
  const events = await getEvents();
  return events.filter(e => e.status === 'Upcoming');
}

// Get all FAQs (Collection Type)
export async function getFAQs(): Promise<StrapiFAQ[]> {
  const rawFAQs = await strapiFetch<any[]>('faqs?populate=*');
  if (!rawFAQs) return [];
  return rawFAQs.map(item => mapRawFAQ(item));
}

// Get static page by slug (Collection Type)
export async function getPage(slug: string): Promise<StrapiPage | null> {
  const pages = await strapiFetch<any[]>('pages?populate=*');
  if (!pages) return null;
  
  const targetSlug = slug.toLowerCase().replace(/-policy$/, '').replace(/-of-service$/, '');
  const found = pages.find(p => {
    const pageSlug = p.slug.toLowerCase().replace(/-policy$/, '').replace(/-of-service$/, '');
    return pageSlug === targetSlug || p.slug.toLowerCase() === slug.toLowerCase();
  });
  
  if (!found) return null;
  return mapRawPage(found);
}
