import React, { useEffect } from 'react';

interface SchemaProps {
  type: 'Article' | 'BreadcrumbList' | 'Organization';
  data: Record<string, any>;
}

const Schema: React.FC<SchemaProps> = ({ type, data }) => {
  useEffect(() => {
    const scriptId = `jsonld-schema-${type}-${JSON.stringify(data).slice(0, 32)}`;
    
    // Check if script already exists to avoid duplicates
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    const schemaPayload = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };
    
    script.text = JSON.stringify(schemaPayload);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
};

export default Schema;
