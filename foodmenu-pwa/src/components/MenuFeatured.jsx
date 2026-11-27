import { Link } from 'react-router-dom';
import { isSoldOut, rupiah, stockText } from '../utils';
import FavButton from './FavButton';
import { Icon, Img, StatusBadge } from './ui';

export default function MenuFeatured({ menu }) {
  const off = isSoldOut(menu);
  return (
    <Link to={`/menu/${menu.id}`}
      className={`group block w-60 shrink-0 overflow-hidden rounded-2xl border border-outline-variant/35 bg-surface-lowest shadow-sm transition hover:border-outline-variant/70 hover:shadow-md active:scale-[0.98] dark:bg-surface-low lg:w-auto ${off ? 'opacity-65' : ''}`}>
      <div className="relative">
        <Img src={menu.image_url} alt={menu.name} className={`h-36 w-full ${off ? 'grayscale' : ''}`} />
        <StatusBadge ok={!off} okText={stockText(menu)} noText="Habis" className="absolute left-2.5 top-2.5 bg-surface-lowest/90 shadow-sm backdrop-blur-sm" />
        <FavButton menu={menu} className="absolute right-1.5 top-1.5 bg-surface-lowest/80 backdrop-blur-sm" />
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-1 text-xs text-on-surface-variant">
          <Icon name="star" fill className="text-[13px] text-primary-container" />
          <b className="text-on-surface">{Number(menu.rating).toFixed(1)}</b>
          <span>({menu.review_count})</span>
        </div>
        <h3 className="mt-1 line-clamp-1 font-display text-[15px] font-bold text-on-surface">{menu.name}</h3>
        <p className="line-clamp-1 text-xs text-on-surface-variant">{menu.kios?.name}</p>
        <p className={`mt-2.5 font-display text-lg font-extrabold ${off ? 'text-outline line-through' : 'text-primary'}`}>
          {rupiah(menu.price)}
        </p>
      </div>
    </Link>
  );
}