export interface StrapiSiteSettings {
  id?: number;
  siteName?: string;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  announcementBanner?: string;
  discordInviteUrl?: string;
  communityUrl?: string;
  newsletterCta?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  footerCopyright?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultOgImage?: any; // Media object or string url
  socialLinks?: any; // JSON or object representation
  launchPhase?: string;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface StrapiArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string; // Rich Text (Markdown)
  featuredImage?: any; // Media object
  publishedDate?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  status?: 'Draft' | 'Published';
  category?: StrapiCategory;
}

export interface StrapiEvent {
  id: number;
  title: string;
  slug: string;
  description?: string;
  bannerImage?: any; // Media object
  startDate?: string;
  endDate?: string;
  online?: boolean;
  location?: string;
  registrationUrl?: string;
  status?: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface StrapiFAQ {
  id: number;
  question: string;
  answer: string;
  displayOrder?: number;
  active?: boolean;
}

export interface StrapiPage {
  id: number;
  title: string;
  slug: string;
  content: string; // Rich Text (Markdown)
  seoTitle?: string;
  seoDescription?: string;
  published?: boolean;
}
