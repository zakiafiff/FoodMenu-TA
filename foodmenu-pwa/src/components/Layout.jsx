import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { PROFILE } from '../config/profile';
import useOnline from '../hooks/useOnline';
import { initials } from '../utils';
import { Icon, Logo } from './ui';

export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div role="status" className="flex items-center justify-center gap-2 bg-primary-container/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
      <Icon name="wifi_off" className="text-[14px]" /> Kamu sedang offline - menampilkan data tersimpan
    </div>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/25 bg-surface-lowest/90 backdrop-blur-md pt-safe">
      <OfflineBanner />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="FoodMenu - Beranda">
          <Logo size={38} className="rounded-xl" />
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">FoodMenu</div>
            <div className="text-[11px] font-semibold tracking-wide text-on-surface-variant">Kantin FT Undip</div>
          </div>
        </Link>
        <Link to="/profile" aria-label="Profil" className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-surface-container">
          {PROFILE.avatarUrl
            ? <img src={PROFILE.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-outline-variant/50" />
            : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-secondary">{initials(PROFILE.name)}</span>}
        </Link>
      </div>
    </header>
  );
}

export function PageHeader({ title, right }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/25 bg-surface-lowest/90 backdrop-blur-md pt-safe">
      <OfflineBanner />
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-8">
        <button onClick={() => navigate(-1)} aria-label="Kembali"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface transition hover:bg-surface-high active:scale-95">
          <Icon name="arrow_back" className="text-[20px]" />
        </button>
        <h1 className="flex-1 truncate font-display text-lg font-bold tracking-tight">{title}</h1>
        {right}
      </div>
    </header>
  );
}

const TABS = [
  { to: '/', label: 'Beranda', icon: 'home', end: true },
  { to: '/menu', label: 'Menu', icon: 'restaurant_menu' },
  { to: '/kios', label: 'Kios', icon: 'storefront' },
  { to: '/profile', label: 'Profil', icon: 'person' },
];

export function BottomNav() {
  return (
    <nav aria-label="Navigasi utama"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-safe md:bottom-5 md:px-4">
      <ul className="pointer-events-auto flex w-full items-center justify-around border-t border-outline-variant/30 bg-surface-lowest/95 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md dark:shadow-[0_-6px_24px_rgba(0,0,0,0.35)] md:w-auto md:gap-1.5 md:rounded-full md:border md:px-3 md:py-1.5 md:shadow-lg">
        {TABS.map((t) => (
          <li key={t.to}>
            <NavLink to={t.to} end={t.end}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center rounded-full px-3.5 text-[11px] font-bold transition md:px-4 ${
                  isActive ? 'bg-primary-container/15 text-primary' : 'text-on-surface-variant hover:bg-surface-container/60'}`}>
              {({ isActive }) => (
                <span className="flex flex-col items-center gap-0.5 py-0.5 md:flex-row md:gap-2">
                  <Icon name={t.icon} fill={isActive} className="text-[20px]" />
                  <span>{t.label}</span>
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Halaman utama: TopBar + BottomNav
export function MainLayout() {
  return (
    <>
      <TopBar />
      <main className="mx-auto w-full max-w-6xl pb-28 pt-2 md:px-4"><Outlet /></main>
      <BottomNav />
    </>
  );
}

// Halaman detail: tanpa TopBar/BottomNav (punya PageHeader sendiri)
export function DetailLayout() {
  return <main className="pb-28"><Outlet /></main>;
}
