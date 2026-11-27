import { Link } from 'react-router-dom';
import { isSoldOut, rupiah, stockText } from '../utils';
import FavButton from './FavButton';
import { Icon, Img, StatusBadge } from './ui';

export default function MenuFeatured({ menu }) {
  const off = isSoldOut(menu);
  return (
    <Link to={`/menu/${menu.id}`}
      className={`block w-64 shrink-0 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-low transition active:scale-[0.98] lg:w-auto ${off ? 'opacity-60' : ''}`}>
      <div className="relative">
        <Img src={menu.image_url} alt={menu.name} className={`h-36 w-full ${off ? 'grayscale' : ''}`} />
        <StatusBadge ok={!off} okText={stockText(menu)} noText="Habis" className="absolute left-3 top-3 bg-surface-lowest/80 backdrop-blur" />
        <FavButton menu={menu} className="absolute right-1 top-1 bg-surface-lowest/60 backdrop-blur" />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 text-xs text-on-surface-variant">
          <Icon name="star" fill className="text-[14px] text-primary-container" />
          <b className="text-on-surface">{Number(menu.rating).toFixed(1)}</b> ({menu.review_count})
        </div>
        <h3 className="mt-1 line-clamp-1 font-display text-base font-bold">{menu.name}</h3>
        <p className="line-clamp-1 text-xs text-on-surface-variant">{menu.kios?.name}</p>
        <p className="mt-2 font-display text-xl font-extrabold text-primary-container">{rupiah(menu.price)}</p>
      </div>
    </Link>
  );
}