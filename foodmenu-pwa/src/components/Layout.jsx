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
    <header className="sticky top-0 z-40 bg-surface-lowest/85 backdrop-blur-xl pt-safe">
      <OfflineBanner />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="FoodMenu - Beranda">
          <Logo size={40} className="rounded-[10px]" />
          <div className="leading-tight">
            <div className="font-display text-xl font-bold">FoodMenu</div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Kantin FT Undip</div>
          </div>
        </Link>
        <Link to="/profile" aria-label="Profil" className="flex h-11 w-11 items-center justify-center">
          {PROFILE.avatarUrl
            ? <img src={PROFILE.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-container/40" />
            : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-secondary ring-2 ring-primary-container/40">{initials(PROFILE.name)}</span>}
        </Link>
      </div>
    </header>
  );
}

export function PageHeader({ title, right }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-surface-lowest/85 backdrop-blur-xl pt-safe">
      <OfflineBanner />
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-8">
        <button onClick={() => navigate(-1)} aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-high active:scale-90">
          <Icon name="arrow_back" />
        </button>
        <h1 className="flex-1 truncate font-display text-lg font-bold">{title}</h1>
        {right}
      </div>
    </header>
  );
}

const TABS = [
  { to: '/', label: 'Beranda', icon: 'home', end: true },
  { to: '/menu', label: 'Daftar Menu', icon: 'restaurant_menu' },
  { to: '/kios', label: 'Kios Kantin', icon: 'storefront' },
  { to: '/profile', label: 'Profil', icon: 'person' },
];

export function BottomNav() {
  return (
    <nav aria-label="Navigasi utama"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-safe md:bottom-4 md:px-4">
      <ul className="pointer-events-auto flex w-full items-center justify-around border-t border-outline-variant/30 bg-surface-lowest/90 px-2 pb-2 pt-2 shadow-[0_-12px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl md:w-auto md:gap-2 md:rounded-full md:border md:px-4 md:shadow-2xl">
        {TABS.map((t) => (
          <li key={t.to}>
            <NavLink to={t.to} end={t.end}
              className={({ isActive }) =>
                `flex min-h-[48px] items-center rounded-full px-3 text-[11px] font-bold transition md:px-5 ${
                  isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}`}>
              {({ isActive }) => (
                <span className="flex flex-col items-center py-1">
                  <Icon name={t.icon} className="text-[22px]" />
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
