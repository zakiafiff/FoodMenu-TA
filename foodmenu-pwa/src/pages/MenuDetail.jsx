import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FavButton from '../components/FavButton';
import { PageHeader } from '../components/Layout';
import { ErrorState, Icon, Img, StatusBadge } from '../components/ui';
import { useFavorites } from '../context/FavoritesContext';
import useFetch from '../hooks/useFetch';
import { getMenu } from '../services/api';
import { isSoldOut, rupiah, stockText } from '../utils';

export default function MenuDetail() {
  const { id } = useParams();
  const { data: menu, loading, error, reload } = useFetch(() => getMenu(id), [id]);
  const { isFavorite, toggle } = useFavorites();
  const [level, setLevel] = useState(3);

  if (loading) return (<><PageHeader title="Menu Detail" /><div className="skeleton m-4 h-72" /></>);
  if (error || !menu) return (<><PageHeader title="Menu Detail" /><ErrorState onRetry={reload} /></>);

  const fav = isFavorite(menu.id);
  const pedas = menu.tags?.includes('Pedas');
  const kios = menu.kios;
  const off = isSoldOut(menu);

  return (
    <>
      <PageHeader title="Menu Detail" />
      <div className="mx-auto max-w-5xl md:grid md:grid-cols-2 md:gap-8 md:px-8 md:pt-6">
        <div className="relative md:self-start md:overflow-hidden md:rounded-3xl">
          <Img src={menu.image_url} alt={menu.name} className={`h-72 w-full md:h-[30rem] ${off ? 'grayscale' : ''}`} />
          <FavButton menu={menu} className="absolute right-4 top-4 bg-surface-lowest/70 backdrop-blur" />
        </div>

        <div className="relative -mt-6 space-y-5 rounded-t-3xl bg-surface px-4 pt-6 md:mt-0 md:rounded-none md:px-0 md:pt-0">
          <div className="flex flex-wrap gap-2">
            <StatusBadge ok={!off} okText={stockText(menu)} noText="Stok Habis" />
            {menu.categories?.name && (
              <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-[11px] font-bold text-secondary">
                {menu.categories.name}
              </span>
            )}
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold leading-9">{menu.name}</h2>
            <div className="mt-2 flex items-baseline gap-3">
              <span className={`font-display text-4xl font-extrabold ${off ? 'text-outline line-through' : 'text-primary-container'}`}>{rupiah(menu.price)}</span>
              {menu.original_price && (
                <>
                  <s className="text-sm text-outline">{rupiah(menu.original_price)}</s>
                  <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-secondary">Hemat Kantin</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-surface-low px-4 py-3 text-sm">
            <span className="flex items-center gap-1.5">
              <Icon name="star" fill className="text-primary-container" />
              <b className="text-lg">{Number(menu.rating).toFixed(1)}</b>
              <span className="text-on-surface-variant">({menu.review_count} ulasan)</span>
            </span>
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <Icon name="schedule" className="text-[18px] text-secondary" />{menu.prep_time}
            </span>
          </div>

          {menu.tags?.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-primary">Highlight Menu</h3>
              <div className="flex flex-wrap gap-2">
                {menu.tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-container px-3 py-1.5 text-xs font-bold">{t}</span>
                ))}
              </div>
            </div>
          )}

          {pedas && (
            <div className="rounded-2xl bg-surface-low p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                  <Icon name="local_fire_department" className="text-primary-container" />Level Pedas
                </h3>
                <span className="text-xs font-bold text-primary">Level {level}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setLevel(n)} aria-pressed={level === n}
                    className={`min-h-[44px] flex-1 rounded-full text-xs font-bold ${
                      level === n ? 'bg-primary-container text-on-primary-container' : 'bg-surface-high text-on-surface-variant'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-display text-xl font-bold">Deskripsi</h3>
            <p className="mt-1 leading-relaxed text-on-surface-variant">{menu.description}</p>
          </div>

          {kios && (
            <div>
              <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-primary">Dijual oleh kios</h3>
              <Link to={`/kios/${kios.id}`} className="flex gap-3 rounded-2xl bg-surface-low p-4 active:scale-[0.99]">
                <Img src={kios.image_url} alt={kios.name} className="h-16 w-16 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-display text-lg font-bold">{kios.name}</h4>
                  <StatusBadge ok={kios.is_open} okText="Buka Sekarang" noText="Tutup Sementara" />
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-on-surface-variant">
                    <Icon name="location_on" className="text-[16px] text-primary" />{kios.location}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <Icon name="schedule" className="text-[16px] text-secondary" />{kios.open_time} - {kios.close_time} WIB
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 gap-3 border-t border-outline-variant/30 bg-surface-lowest/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] backdrop-blur-xl md:max-w-3xl md:rounded-t-3xl">
        {kios && (
          <Link to={`/kios/${kios.id}`}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-secondary-container text-sm font-bold text-secondary">
            <Icon name="storefront" />Lihat Kios
          </Link>
        )}
        <button onClick={() => toggle(menu)}
          className={`flex min-h-[52px] flex-[1.4] items-center justify-center gap-2 rounded-full text-sm font-bold active:scale-95 ${
            fav ? 'border-2 border-primary-container text-primary' : 'bg-primary-container text-on-primary-container'}`}>
          <Icon name="favorite" fill={fav} />{fav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
        </button>
      </div>
    </>
  );
}