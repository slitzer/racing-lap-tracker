import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

(window as any).__API_BASE_URL__ = import.meta.env.VITE_API_URL || '';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
