import { useEffect } from 'react';
import { APP } from '../config/profile';
import { Logo } from './ui';

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1326] via-[#1E3A8A] to-[#c2410c] text-center">
      <Logo size={120} className="rounded-[28px] shadow-2xl shadow-black/40" />
      <h1 className="mt-6 font-display text-4xl font-extrabold text-white">{APP.name}</h1>
      <p className="mt-2 px-8 text-sm text-white/80">{APP.tagline}</p>
      <div className="mt-10 h-1.5 w-40 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-label="Memuat">
        <div className="loadbar h-full w-1/3 rounded-full bg-primary-container" />
      </div>
    </div>
  );
}
