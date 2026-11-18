import { useState } from 'react';
import {
  ArrowLeft, ChevronRight, Clock, Compass, CloudOff, Download, Flame, Heart, Home, MapPin, MessageSquare,
  Moon, Search, SearchX, SlidersHorizontal, Star, Store, Sun, Tag, ThumbsUp, User, Utensils,
  UtensilsCrossed, WifiOff, X, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ICONS = {
  arrow_back: ArrowLeft, bolt: Zap, chevron_right: ChevronRight, close: X, cloud_off: CloudOff,
  dark_mode: Moon, explore_off: Compass, favorite: Heart, home: Home, install_mobile: Download,
  light_mode: Sun, local_fire_department: Flame, local_offer: Tag, location_on: MapPin, person: User,
  pin_drop: MapPin, rate_review: MessageSquare, restaurant: Utensils, restaurant_menu: UtensilsCrossed,
  schedule: Clock, search: Search, search_off: SearchX, star: Star, storefront: Store,
  thumb_up: ThumbsUp, tune: SlidersHorizontal, wifi_off: WifiOff,
};

// Ikon SVG: ukuran mengikuti kelas text-[..px], warna mengikuti text-*
export const Icon = ({ name, fill = false, className = '' }) => {
  const Cmp = ICONS[name] || Utensils;
  const size = className.includes('text-[') ? '' : 'text-[24px] ';
  return (
    <Cmp aria-hidden="true" strokeWidth={2} fill={fill ? 'currentColor' : 'none'}
      className={`inline-block shrink-0 ${size}${className}`} style={{ width: '1em', height: '1em' }} />
  );
};

export const Logo = ({ size = 40, className = '' }) => (
  <img src="/logo.svg" alt="Logo FoodMenu" width={size} height={size} className={`shrink-0 ${className}`}
       style={{ width: size, height: size }} />
);

// Gambar dengan fallback jika URL gagal dimuat / offline & belum ter-cache
export function Img({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-surface-high text-outline ${className}`} role="img" aria-label={alt}>
        <Icon name="restaurant" className="text-[32px]" />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

export function StatusBadge({ ok, okText = 'Tersedia', noText = 'Habis', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
      ok ? 'bg-tertiary/15 text-tertiary' : 'bg-danger/15 text-danger'} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-tertiary' : 'bg-danger'}`} />
      {ok ? okText : noText}
    </span>
  );
}

export function Chips({ items, value, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-1">
      {items.map((it) => {
        const active = String(value) === String(it.value);
        return (
          <button key={it.value} onClick={() => onChange(it.value)}
            className={`min-h-[40px] shrink-0 rounded-full px-4 text-xs font-bold transition active:scale-95 ${
              active ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`}>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex h-12 flex-1 items-center rounded-full bg-surface-container px-4 focus-within:ring-2 focus-within:ring-primary-container/60">
      <Icon name="search" className="text-[20px] text-primary" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent px-3 text-sm text-on-surface outline-none placeholder:text-outline" />
      {value && (
        <button onClick={() => onChange('')} aria-label="Hapus pencarian" className="text-outline">
          <Icon name="close" className="text-[18px]" />
        </button>
      )}
    </div>
  );
}

export const SkeletonList = ({ count = 4 }) => (
  <div className="space-y-3 px-4" aria-busy="true">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-3 rounded-2xl bg-surface-low p-3">
        <div className="skeleton h-24 w-24 shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export function EmptyState({ icon = 'search_off', title, text, action }) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container text-primary">
        <Icon name={icon} className="text-[40px]" />
      </div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      {text && <p className="mt-1 text-sm text-on-surface-variant">{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <EmptyState icon="cloud_off" title="Gagal memuat data"
      text="Periksa koneksi internet atau pastikan API sudah berjalan."
      action={<button onClick={onRetry}
        className="mt-5 min-h-[44px] rounded-full bg-primary-container px-6 text-sm font-bold text-on-primary-container">Coba Lagi</button>} />
  );
}

export const SectionTitle = ({ icon, title, to, toText = 'Lihat Semua' }) => (
  <div className="flex items-center justify-between px-4">
    <h2 className="flex items-center gap-2 font-display text-xl font-bold">
      {icon && <Icon name={icon} className="text-primary" />}{title}
    </h2>
    {to && <Link to={to} className="text-xs font-bold text-primary">{toText} →</Link>}
  </div>
);
