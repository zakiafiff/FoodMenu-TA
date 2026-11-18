import { useEffect, useState } from 'react';

// Sinyal "bisa di-install" ditangkap sejak aplikasi dimuat (di luar komponen),
// supaya tidak terlewat meski halaman Profil dibuka belakangan.
let deferredPrompt = null;
let installedFlag = false;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

if (typeof window !== 'undefined') {
  installedFlag = isStandalone();
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installedFlag = true;
    notify();
  });
}

export default function usePWAInstall() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notify();
    return outcome === 'accepted';
  };

  return { canInstall: !!deferredPrompt, installed: installedFlag, install };
}