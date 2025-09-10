import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Hide loading spinner
const loadingEl = document.querySelector('.company-hub-loading');
if (loadingEl) {
  loadingEl.style.display = 'none';
}

// Render React app
const container = document.getElementById('company-hub-root');
const root = createRoot(container);
root.render(<App />);