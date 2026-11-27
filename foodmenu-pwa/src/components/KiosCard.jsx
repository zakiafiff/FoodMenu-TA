import { Link } from 'react-router-dom';
import { Icon, Img, StatusBadge } from './ui';

export default function KiosCard({ kios }) {
  return (
    <Link to={`/kios/${kios.id}`}
      className={`group block overflow-hidden rounded-2xl border border-outline-variant/35 bg-surface-lowest shadow-sm transition hover:border-outline-variant/70 hover:shadow-md active:scale-[0.99] dark:bg-surface-low ${kios.is_open ? '' : 'opacity-75'}`}>
      <div className="relative">
        <Img src={kios.image_url} alt={kios.name} className={`h-40 w-full ${kios.is_open ? '' : 'grayscale-[40%]'}`} />
        <StatusBadge ok={kios.is_open} okText={`Buka (${kios.open_time} - ${kios.close_time})`}
          noText={`Tutup • Buka ${kios.open_time}`}
          className="absolute left-3 top-3 bg-surface-lowest/90 shadow-sm backdrop-blur-sm" />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-surface-lowest/90 px-2.5 py-0.5 text-[11px] font-bold shadow-sm backdrop-blur-sm">
          <Icon name="star" fill className="text-[13px] text-primary-container" />{Number(kios.rating).toFixed(1)} ({kios.review_count})
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold leading-snug text-on-surface">{kios.name}</h3>
            <p className="mt-0.5 text-xs font-medium text-primary">{kios.specialty}</p>
          </div>
          <Icon name="chevron_right" className="mt-0.5 text-outline transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-on-surface-variant">
          <Icon name="location_on" className="text-[15px] text-outline" />{kios.location}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-outline-variant/25 pt-3 text-xs">
          <span className="flex items-center gap-1.5 text-on-surface-variant">
            <Icon name="schedule" className="text-[15px] text-tertiary" />Saji ~{kios.avg_serve_time}
          </span>
          <b className="font-semibold text-on-surface">{kios.menu_count} menu</b>
        </div>
      </div>
    </Link>
  );
}
