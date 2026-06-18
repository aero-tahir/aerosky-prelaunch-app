import React, { createContext, useContext, useState, useEffect } from 'react';
import { StrapiSiteSettings } from '../types/strapi';
import { getSiteSettings } from '../services/strapi';

interface CMSContextProps {
  siteSettings: StrapiSiteSettings;
  loading: boolean;
}

const CMSContext = createContext<CMSContextProps>({
  siteSettings: {},
  loading: true
});

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<StrapiSiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSiteSettings();
        if (settings) {
          setSiteSettings(settings);
        }
      } catch (err) {
        console.error('[CMS Context] Failed to resolve global settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  return (
    <CMSContext.Provider value={{ siteSettings, loading }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useSiteSettings = () => useContext(CMSContext).siteSettings;
export const useCMSLoading = () => useContext(CMSContext).loading;
export const useCMSContext = () => useContext(CMSContext);
