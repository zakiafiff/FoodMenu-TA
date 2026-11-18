import { useFavorites } from '../context/FavoritesContext';
import { Icon } from './ui';

export default function FavButton({ menu, className = '' }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(menu.id);
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(menu); }}
      aria-label={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
      aria-pressed={fav}
      className={`flex h-11 w-11 items-center justify-center rounded-full transition active:scale-90 ${className}`}>
      <Icon name="favorite" fill={fav} className={`text-[22px] ${fav ? 'text-primary-container' : 'text-outline'}`} />
    </button>
  );
}
