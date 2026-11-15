import {useEffect, useRef, useState} from 'react';
import {availableUpdate, refreshUrl} from './update-check.js';

const env = (import.meta as any).env;
export function Updates({disabled}: {disabled: boolean}) {
  const [version, setVersion] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const checking = useRef(false);
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
  async function checkNow() {
    if (checking.current) return;
    checking.current = true;
    setStatus('Checking…');
    try {
      const update = await availableUpdate(env.BASE_URL, env.VITE_APP_VERSION);
      setVersion(update);
      setStatus(update ? '' : 'Up to date.');
    } catch { setStatus('Could not check. Try again when connected.'); }
    finally { checking.current = false; }
  }
  return <div className="app-updates">
    <button type="button" className="secondary" disabled={disabled || status === 'Checking…'} onClick={() => version ? window.location.replace(refreshUrl(window.location.href)) : void checkNow()}>{version ? 'Update app' : 'Check for updates'}</button>
    <span role="status">{status}</span>
  </div>;
}
