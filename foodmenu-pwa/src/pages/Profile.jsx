import { Link } from 'react-router-dom';
import { Icon, Logo } from '../components/ui';
import { APP, PROFILE } from '../config/profile';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import useOnline from '../hooks/useOnline';
import usePWAInstall from '../hooks/usePWAInstall';
import { initials } from '../utils';

function Toggle({ on, onChange, label }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`relative h-8 w-14 shrink-0 rounded-full transition ${on ? 'bg-primary-container' : 'bg-surface-highest'}`}>
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? 'left-7' : 'left-1'}`} />
    </button>
  );
}

const TECH = ['PWA (Service Worker)', 'REST API (Express)', 'React + Vite', 'Tailwind CSS', 'Supabase'];

export default function Profile() {
  const { theme, toggle } = useTheme();
  const { count } = useFavorites();
  const online = useOnline();
  const { canInstall, installed, install } = usePWAInstall();

  return (
    <div className="space-y-4 px-4">
      <section className="flex items-center gap-4 rounded-3xl bg-surface-low p-5">
        {PROFILE.avatarUrl
          ? <img src={PROFILE.avatarUrl} alt={PROFILE.name} className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-primary-container" />
          : <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-secondary-container font-display text-3xl font-extrabold text-secondary ring-4 ring-primary-container">{initials(PROFILE.name)}</div>}
        <div className="min-w-0">
          <h1 className="font-display text-xl font-bold leading-6">{PROFILE.name}</h1>
          <p className="font-mono text-sm font-bold tracking-wider text-primary">NIM: {PROFILE.nim}</p>
          <p className="text-sm text-on-surface-variant">{PROFILE.jurusan}, Universitas Diponegoro</p>
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 text-[11px] font-bold">
            <Icon name="location_on" className="text-[14px] text-primary" />{PROFILE.kampus}
          </p>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl bg-surface-low p-5">
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${installed ? 'bg-tertiary/15 text-tertiary' : 'bg-surface-container text-on-surface-variant'}`}>
          <span className={`h-2 w-2 rounded-full ${online ? 'bg-tertiary' : 'bg-danger'}`} />
          {installed ? 'Aplikasi Terpasang (PWA Aktif)' : 'Aplikasi belum dipasang'}
          <span className="ml-auto text-[11px] font-medium">{online ? 'Online' : 'Offline'}</span>
        </div>

        {!installed && (
          canInstall ? (
            <button onClick={install}
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary-container text-base font-bold text-on-primary-container shadow-lg shadow-primary-container/25 active:scale-95">
              <Icon name="install_mobile" />Install FoodMenu ke Layar Utama
            </button>
          ) : (
            <p className="rounded-xl bg-surface-container p-3 text-xs text-on-surface-variant">
              Untuk memasang: buka menu browser lalu pilih <b>Tambahkan ke Layar Utama</b> / <b>Install app</b>. Tombol install otomatis muncul di Chrome Android dan desktop.
            </p>
          )
        )}

        <div className="flex items-center gap-3 rounded-xl bg-surface-container p-4">
          <Icon name={theme === 'dark' ? 'dark_mode' : 'light_mode'} className="text-secondary" />
          <div className="flex-1">
            <div className="text-sm font-bold">Dark Mode</div>
            <div className="text-xs text-on-surface-variant">Visual hemat daya & nyaman di mata</div>
          </div>
          <Toggle on={theme === 'dark'} onChange={toggle} label="Dark mode" />
        </div>
      </section>

      <section className="rounded-3xl bg-surface-low p-2">
        <Link to="/favorites" className="flex min-h-[56px] items-center gap-3 rounded-2xl px-3 active:bg-surface-container">
          <Icon name="favorite" className="text-primary" />
          <span className="flex-1 text-sm font-bold">Menu Favorit Saya</span>
          <span className="rounded-full bg-surface-high px-2.5 py-0.5 text-[11px] font-bold">{count} item </span>
          <Icon name="chevron_right" className="text-outline" />
        </Link>
      </section>

      <section className="space-y-4 rounded-3xl bg-surface-low p-5">
        <div className="flex items-center gap-4">
          <Logo size={64} className="rounded-2xl" />
          <div>
            <h2 className="font-display text-2xl font-bold">{APP.name}
              <span className="ml-2 rounded-full bg-surface-high px-2 py-0.5 align-middle text-[11px] font-bold">v{APP.version}</span>
            </h2>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-primary">Release Build • Mahasiswa FT Undip</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {TECH.map((t) => <span key={t} className="rounded-full bg-surface-container px-3 py-1.5 text-xs font-bold">{t}</span>)}
        </div>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          FoodMenu adalah katalog digital menu kantin Fakultas Teknik Universitas Diponegoro untuk memudahkan mahasiswa dan civitas akademika melihat daftar menu, harga, ketersediaan, dan profil kios. Favorit dan data menu tetap bisa dibuka saat offline.
        </p>
        <p className="rounded-xl bg-surface-container p-3 text-center text-xs font-bold text-primary">
          🎓 Dibuat untuk Tugas Akhir Praktikum • Fakultas Teknik Universitas Diponegoro
        </p>
      </section>
    </div>
  );
}
