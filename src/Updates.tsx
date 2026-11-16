import {useEffect, useState} from 'react';
import {availableUpdate, refreshUrl} from './update-check.js';

const env = (import.meta as any).env;
export function Updates({disabled}: {disabled: boolean}) {
  const [version, setVersion] = useState<string | null>(null);
  useEffect(() => {
    if (!env.PROD) return;
    let active = true;
    let lastCheck = 0;
    async function check() {
      if (document.visibilityState === 'hidden' || Date.now() - lastCheck < 60000) return;
      lastCheck = Date.now();
      try {
        const update = await availableUpdate(env.BASE_URL, env.VITE_APP_VERSION);
        if (active) setVersion(update);
      } catch { /* Try again on the next visit or connection. */ }
    }
    void check();
    document.addEventListener('visibilitychange', check);
    window.addEventListener('online', check);
    const timer = window.setInterval(check, 60000);
    return () => {
      active = false;
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('online', check);
      window.clearInterval(timer);
    };
  }, []);
  if (!version) return null;
  return <div className="app-updates">
    <button type="button" className="secondary" disabled={disabled} onClick={() => window.location.replace(refreshUrl(window.location.href))}>Update app</button>
  </div>;
}
