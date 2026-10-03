import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { assetUrl } from './assets';

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

// Cache only the compiled app. The dev server always serves the current source.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(assetUrl('sw.js'), { scope: assetUrl('') }).catch(() => {
      // Offline support is optional; the online app remains usable.
    });
  });
}
