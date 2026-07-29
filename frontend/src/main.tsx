import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Remove the HTML fallback once React takes over
const fallback = document.getElementById('app-fallback');
if (fallback) fallback.style.display = 'none';

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  // Show error visibly if React fails to mount
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="min-height:100vh;background:#020617;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;font-family:sans-serif">
        <div style="max-width:560px;width:100%;background:rgba(15,23,42,0.95);border:1px solid rgba(239,68,68,0.4);border-radius:24px;padding:40px;text-align:center">
          <div style="font-size:40px;margin-bottom:16px">⚠️</div>
          <h1 style="color:#fff;font-size:20px;font-weight:700;margin-bottom:12px">React Failed to Mount</h1>
          <p style="color:#94a3b8;font-size:13px;margin-bottom:20px">The application crashed before it could start. This is usually a JavaScript module import error.</p>
          <div style="background:#000;border-radius:12px;padding:16px;text-align:left;border:1px solid #1e293b;margin-bottom:20px;max-height:200px;overflow-y:auto">
            <pre style="color:#f87171;font-size:11px;font-family:monospace;white-space:pre-wrap;word-break:break-all;margin:0">${err instanceof Error ? err.stack || err.message : String(err)}</pre>
          </div>
          <button onclick="window.location.reload()" style="width:100%;padding:12px;background:#059669;color:#fff;border:none;border-radius:999px;font-weight:600;cursor:pointer;font-size:14px">Reload Page</button>
        </div>
      </div>
    `;
  }
}
