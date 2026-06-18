import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage = 'https://aerosky.in/assets/og-image.jpg', // Default fallback image
  ogUrl,
  twitterCard = 'summary_large_image'
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

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
    setMetaTag('name', 'description', description);
    
    // 3. OpenGraph Tags
    setMetaTag('property', 'og:title', ogTitle || title);
    setMetaTag('property', 'og:description', ogDescription || description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', ogUrl || window.location.href);
    setMetaTag('property', 'og:type', 'website');

    // 4. Canonical Link Tag
    const setCanonicalLink = (href: string) => {
      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };
    setCanonicalLink(ogUrl || window.location.href);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', ogTitle || title);
    setMetaTag('name', 'twitter:description', ogDescription || description);
    setMetaTag('name', 'twitter:image', ogImage);
  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl, twitterCard]);

  return null; // Renderless SEO component
};

export default SEO;
