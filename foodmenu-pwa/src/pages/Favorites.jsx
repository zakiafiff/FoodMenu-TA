import { Link } from 'react-router-dom';
import MenuRow from '../components/MenuRow';
import { PageHeader } from '../components/Layout';
import { EmptyState } from '../components/ui';
import { useFavorites } from '../context/FavoritesContext';

export default function Favorites() {
  const { list } = useFavorites();
  return (
    <>
      <PageHeader title="Menu Favorit Saya" />
      {list.length === 0 ? (
        <EmptyState icon="favorite" title="Belum ada favorit"
          text="Ketuk ikon hati pada menu untuk menyimpannya. Favorit tetap tersedia saat offline."
          action={<Link to="/menu" className="mt-5 flex min-h-[44px] items-center rounded-full bg-primary-container px-6 text-sm font-bold text-on-primary-container">Jelajahi Menu</Link>} />
      ) : (
        <div className="mx-auto grid max-w-6xl gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">{list.map((m) => <MenuRow key={m.id} menu={m} />)}</div>
      )}
    </>
  );
}
