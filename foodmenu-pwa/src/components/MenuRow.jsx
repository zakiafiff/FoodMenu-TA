import { Link } from 'react-router-dom';
import { isSoldOut, rupiah, stockText } from '../utils';
import FavButton from './FavButton';
import { Icon, Img, StatusBadge } from './ui';

export default function MenuRow({ menu, showKios = true }) {
  const off = isSoldOut(menu);
  return (
    <Link to={`/menu/${menu.id}`}
      className={`relative flex gap-3 rounded-2xl border border-outline-variant/30 bg-surface-low p-3 transition active:scale-[0.99] ${off ? 'opacity-60' : ''}`}>
      <Img src={menu.image_url} alt={menu.name} className={`h-24 w-24 shrink-0 rounded-xl ${off ? 'grayscale' : ''}`} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-1 pr-9">
          <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-tight">{menu.name}</h3>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">{menu.description}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
          <Icon name="star" fill className="text-[14px] text-primary-container" />
          <b className="text-on-surface">{Number(menu.rating).toFixed(1)}</b>
          {showKios && menu.kios?.name && <span className="truncate">• {menu.kios.name}</span>}
        </div>
        <div className="mt-auto flex items-end justify-between pt-1">
          <span className="font-display text-lg font-extrabold text-primary-container">{rupiah(menu.price)}</span>
          <StatusBadge ok={!off} okText={stockText(menu)} noText="Habis" />
        </div>
      </div>
      <FavButton menu={menu} className="absolute right-1 top-1" />
    </Link>
  );
}