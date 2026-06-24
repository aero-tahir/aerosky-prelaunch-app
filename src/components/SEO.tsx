import React, { useEffect } from 'react';
import { useSiteSettings } from '../context/CMSContext';
import { formatImageUrl } from '../services/strapi';

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  noindex
}) => {
  const siteSettings = useSiteSettings();

  useEffect(() => {
    const finalTitle = title || siteSettings.defaultSeoTitle || "India's Airspace Intelligence Network | AeroSky";
    const finalDescription = description || siteSettings.defaultSeoDescription || "AeroSky is India's community-powered airspace intelligence and flight tracking network.";
    
    // Resolve OG Image from:
    // 1. Explicitly passed image (if it's not the generic asset)
    // 2. CMS Default OG Image
    // 3. Fallback static asset
    let resolvedImage = 'https://aerosky.ai/assets/og-image.jpg';
    if (ogImage && ogImage !== 'https://aerosky.ai/assets/og-image.jpg') {
      resolvedImage = formatImageUrl(ogImage) || ogImage;
    } else if (siteSettings.defaultOgImage) {
      resolvedImage = formatImageUrl(siteSettings.defaultOgImage) || resolvedImage;
    }

    // 1. Update Title
    document.title = finalTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (attr: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', finalDescription);
    
    // Robots Noindex Meta Tag
    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      const el = document.querySelector('meta[name="robots"]');
      if (el) {
        el.setAttribute('content', 'index, follow');
      }
    }
    
    // 3. OpenGraph Tags
    setMetaTag('property', 'og:title', ogTitle || finalTitle);
    setMetaTag('property', 'og:description', ogDescription || finalDescription);
    setMetaTag('property', 'og:image', resolvedImage);

    setMetaTag('property', 'og:url', ogUrl || window.location.href);
    setMetaTag('property', 'og:type', 'website');

    // 4. Canonical Link Tag
    const setCanonicalLink = (href?: string) => {
      let cleanUrl = '';
      if (href) {
        // If an explicit href is passed (like ogUrl), ensure it has clean lowercase domain/path structure
        cleanUrl = href.split(/[?#]/)[0].toLowerCase();
      } else {
        // Enforce lowercase pathname, strip trailing slash except for root, and prepend sovereign domain
        const pathname = window.location.pathname.toLowerCase();
        const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
        cleanUrl = `https://aerosky.ai${cleanPath}`;
      }

      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', cleanUrl);
    };
    setCanonicalLink(ogUrl);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', ogTitle || finalTitle);
    setMetaTag('name', 'twitter:description', ogDescription || finalDescription);
    setMetaTag('name', 'twitter:image', resolvedImage);
  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl, twitterCard, siteSettings]);

  return null; // Renderless SEO component
};

export default SEO;
