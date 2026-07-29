import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global error handler to catch any uncaught errors in browser
window.addEventListener('error', (event) => {
  showGlobalError(event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  showGlobalError(event.reason);
});

function showGlobalError(err: any) {
  const root = document.getElementById('root');
  if (root) {
    const errorMsg = err instanceof Error ? (err.stack || err.message) : String(err);
    root.innerHTML = `
      <div style="min-height:100vh;background:#020617;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;font-family:sans-serif">
        <div style="max-width:600px;width:100%;background:rgba(15,23,42,0.98);border:1px solid rgba(239,68,68,0.5);border-radius:24px;padding:40px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.8)">
          <div style="font-size:44px;margin-bottom:16px">🚨</div>
          <h1 style="color:#fff;font-size:22px;font-weight:700;margin-bottom:8px">Runtime JavaScript Error</h1>
          <p style="color:#94a3b8;font-size:13px;margin-bottom:20px">An unhandled exception occurred in the application. Details below:</p>
          <div style="background:#000;border-radius:12px;padding:16px;text-align:left;border:1px solid #1e293b;margin-bottom:20px;max-height:260px;overflow-y:auto">
            <pre style="color:#f87171;font-size:11px;font-family:monospace;white-space:pre-wrap;word-break:break-all;margin:0">${errorMsg}</pre>
          </div>
          <button onclick="window.location.reload()" style="width:100%;padding:14px;background:#059669;color:#fff;border:none;border-radius:999px;font-weight:600;cursor:pointer;font-size:14px">Reload Application</button>
        </div>
      </div>
    `;
  }
}

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  showGlobalError(err);
}
