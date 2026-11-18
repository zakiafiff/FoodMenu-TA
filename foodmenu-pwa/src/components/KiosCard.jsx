import { Link } from 'react-router-dom';
import { Icon, Img, StatusBadge } from './ui';

export default function KiosCard({ kios }) {
  return (
    <Link to={`/kios/${kios.id}`}
      className={`block overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-low transition active:scale-[0.99] ${kios.is_open ? '' : 'opacity-80'}`}>
      <div className="relative">
        <Img src={kios.image_url} alt={kios.name} className="h-40 w-full" />
        <StatusBadge ok={kios.is_open} okText={`Buka (${kios.open_time} - ${kios.close_time})`}
          noText={`Tutup (Buka ${kios.open_time})`}
          className="absolute left-3 top-3 bg-surface-lowest/80 backdrop-blur" />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-surface-lowest/80 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur">
          <Icon name="star" fill className="text-[13px] text-primary-container" />{Number(kios.rating).toFixed(1)} ({kios.review_count})
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-primary-container px-3 py-0.5 text-[11px] font-bold text-on-primary-container">
          {kios.specialty}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{kios.name}</h3>
          <Icon name="chevron_right" className="text-primary" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
          <Icon name="location_on" className="text-[16px] text-primary" />{kios.location}
        </p>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-container px-3 py-2 text-xs">
          <span className="flex items-center gap-1.5 text-on-surface-variant">
            <Icon name="bolt" className="text-[16px] text-tertiary" />Antrean ~{kios.avg_serve_time}
          </span>
          <b className="text-primary">{kios.menu_count} pilihan menu</b>
        </div>
      </div>
    </Link>
  );
}
