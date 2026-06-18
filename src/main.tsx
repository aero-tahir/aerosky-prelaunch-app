import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initClarity } from './utils/analytics';
import { initDB } from './utils/db';
import { CMSProvider } from './context/CMSContext';

// Capture and persist referral code from URL parameter
try {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref) {
    localStorage.setItem('aerosky_ref', ref.trim());
    console.log(`[Referral] Saved attribution code: ${ref.trim()}`);
  }
} catch (err) {
  console.error('[Referral] Failed to store query ref code:', err);
}

// Initialize growth scripts & database schema
initClarity();
initDB().catch(err => {
  console.error('[Database] Failed to verify prelaunch schema:', err);
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <CMSProvider>
        <App />
      </CMSProvider>
    </BrowserRouter>
  </React.StrictMode>
);

