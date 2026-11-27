import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FavButton from '../components/FavButton';
import { PageHeader } from '../components/Layout';
import { ErrorState, Icon, Img, StatusBadge } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { buyMenu, getMenu } from '../services/api';
import { isSoldOut, rupiah, stockText } from '../utils';

export default function MenuDetail() {
  const { id } = useParams();
  const { data: menu, loading, error, reload } = useFetch(() => getMenu(id), [id]);
  const [level, setLevel] = useState(3);
  const [qty, setQty] = useState(1);
  const [buying, setBuying] = useState(false);
  const [notice, setNotice] = useState(null);

  if (loading) return (<><PageHeader title="Menu Detail" /><div className="skeleton m-4 h-72" /></>);
  if (error || !menu) return (<><PageHeader title="Menu Detail" /><ErrorState onRetry={reload} /></>);

  const pedas = menu.tags?.includes('Pedas');
  const kios = menu.kios;
  const off = isSoldOut(menu);
  const maxStock = Math.max(0, Number(menu.stock ?? 0));
  const safeQty = Math.min(qty, Math.max(1, maxStock));

  const handleBuy = async () => {
    if (off || buying) return;
    setBuying(true);
    setNotice(null);
    try {
      const updated = await buyMenu(menu.id, safeQty);
      setQty(1);
      setNotice({
        type: 'ok',
        text: `Berhasil membeli ${safeQty}x ${menu.name}! Sisa stok: ${updated.stock}`,
      });
      reload();
    } catch (err) {
      setNotice({
        type: 'err',
        text: err.response?.data?.message || 'Gagal memproses pembelian. Pastikan API berjalan.',
      });
      reload();
    } finally {
      setBuying(false);
    }
  };

  const kiosCard = kios && (
    <Link to={`/kios/${kios.id}`}
      className="flex gap-3.5 rounded-2xl border border-outline-variant/60 bg-surface-lowest p-3.5 transition hover:border-outline-variant active:scale-[0.99] dark:bg-surface-low">
      <Img src={kios.image_url} alt={kios.name} className="h-12 w-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate font-display text-sm font-bold">{kios.name}</h4>
          <StatusBadge ok={kios.is_open} okText="Buka" noText="Tutup" />
        </div>
        <p className="mt-1 truncate text-xs text-on-surface-variant">{kios.location}</p>
        <p className="mt-0.5 text-[11px] text-outline">{kios.open_time} - {kios.close_time} WIB</p>
      </div>
    </Link>
  );

  return (
    <>
      <PageHeader title="Menu Detail" />
      <div className="mx-auto max-w-5xl md:grid md:grid-cols-12 md:gap-8 md:px-6 md:pt-6">
        <div className="space-y-4 md:sticky md:top-20 md:col-span-5 md:self-start">
          <div className="relative md:overflow-hidden md:rounded-2xl md:border md:border-outline-variant/50">
            <Img src={menu.image_url} alt={menu.name} className={`h-64 w-full md:h-80 ${off ? 'grayscale' : ''}`} />
            <FavButton menu={menu} className="absolute right-3 top-3 bg-surface-lowest/85 shadow-sm backdrop-blur-sm" />
          </div>
          {kios && (
            <div className="hidden md:block">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Dijual oleh kios</p>
              {kiosCard}
            </div>
          )}
        </div>

        <div className="relative -mt-4 space-y-4 rounded-t-2xl bg-surface px-4 pt-5 md:col-span-7 md:mt-0 md:rounded-none md:px-0 md:pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge ok={!off} okText={stockText(menu)} noText="Stok Habis" />
            {menu.categories?.name && (
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[11px] font-semibold text-on-surface-variant">
                {menu.categories.name}
              </span>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl">{menu.name}</h2>
            <div className="mt-1.5 flex items-baseline gap-2.5">
              <span className={`font-display text-3xl font-extrabold ${off ? 'text-outline line-through' : 'text-primary'}`}>
                {rupiah(menu.price)}
              </span>
              {menu.original_price && (
                <>
                  <s className="text-sm text-outline">{rupiah(menu.original_price)}</s>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-tertiary">Hemat</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-outline-variant/50 bg-surface-lowest px-4 py-2.5 text-sm dark:bg-surface-low">
            <span className="flex items-center gap-1.5">
              <Icon name="star" fill className="text-[17px] text-primary" />
              <b>{Number(menu.rating).toFixed(1)}</b>
              <span className="text-on-surface-variant">({menu.review_count})</span>
            </span>
            <span className="h-4 w-px bg-outline-variant/60" />
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <Icon name="schedule" className="text-[17px] text-outline" />{menu.prep_time}
            </span>
          </div>

          <div className={`rounded-2xl border p-4 ${off ? 'border-outline-variant/40 bg-surface-container/50 opacity-70' : 'border-outline-variant/60 bg-surface-lowest dark:bg-surface-low'}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold">Jumlah Pesanan</h3>
                <p className="text-xs text-on-surface-variant">
                  {off ? 'Stok habis, menu tidak dapat dibeli' : `Tersedia ${maxStock} porsi`}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={off || safeQty <= 1 || buying} aria-label="Kurangi jumlah"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/60 bg-surface-container text-on-surface disabled:cursor-not-allowed disabled:opacity-40">
                  <Icon name="remove" className="text-[16px]" />
                </button>
                <span className="min-w-[24px] text-center font-display text-base font-bold">{off ? 0 : safeQty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(maxStock, q + 1))}
                  disabled={off || safeQty >= maxStock || buying} aria-label="Tambah jumlah"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/60 bg-surface-container text-on-surface disabled:cursor-not-allowed disabled:opacity-40">
                  <Icon name="add" className="text-[16px]" />
                </button>
              </div>
            </div>

            {!off && (
              <div className="mt-3 flex items-center justify-between border-t border-outline-variant/40 pt-3 text-sm">
                <span className="text-on-surface-variant">Total Harga</span>
                <span className="font-display text-lg font-extrabold text-primary">{rupiah(menu.price * safeQty)}</span>
              </div>
            )}

            <button type="button" onClick={handleBuy} disabled={off || buying}
              className={`mt-3 hidden h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition md:flex ${
                off
                  ? 'cursor-not-allowed bg-surface-high text-outline'
                  : 'bg-primary-container text-on-primary-container hover:brightness-105 active:scale-[0.99]'
              }`}>
              <Icon name="shopping_bag" className="text-[18px]" />
              {off ? 'Stok Habis' : buying ? 'Memproses...' : `Beli Sekarang • ${rupiah(menu.price * safeQty)}`}
            </button>

            {notice && (
              <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                notice.type === 'ok' ? 'bg-tertiary/10 text-tertiary' : 'bg-danger/10 text-danger'}`}>
                <Icon name={notice.type === 'ok' ? 'check_circle' : 'cloud_off'} className="text-[16px]" />
                <span>{notice.text}</span>
              </div>
            )}
          </div>

          {pedas && (
            <div className="rounded-2xl border border-outline-variant/60 bg-surface-lowest p-4 dark:bg-surface-low">
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 font-display text-sm font-bold">
                  <Icon name="local_fire_department" className="text-[18px] text-primary" />Level Pedas
                </h3>
                <span className="text-xs font-bold text-primary">Level {level}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setLevel(n)} aria-pressed={level === n}
                    className={`h-9 flex-1 rounded-lg text-xs font-bold transition ${
                      level === n ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-high'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-display text-base font-bold">Deskripsi</h3>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{menu.description}</p>
          </div>

          {menu.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {menu.tags.map((t) => (
                <span key={t} className="rounded-lg bg-surface-container px-2.5 py-1 text-xs font-medium text-on-surface-variant">{t}</span>
              ))}
            </div>
          )}

          {kios && (
            <div className="md:hidden">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Dijual oleh kios</p>
              {kiosCard}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-2.5 border-t border-outline-variant/50 bg-surface-lowest/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md md:hidden">
        {kios && (
          <Link to={`/kios/${kios.id}`}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-surface-container text-sm font-bold text-on-surface">
            <Icon name="storefront" className="text-[18px]" />Kios
          </Link>
        )}
        <button type="button" onClick={handleBuy} disabled={off || buying}
          className={`flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
            off
              ? 'cursor-not-allowed bg-surface-high text-outline'
              : 'bg-primary-container text-on-primary-container active:scale-[0.98]'
          }`}>
          <Icon name="shopping_bag" className="text-[18px]" />
          {off ? 'Stok Habis' : buying ? 'Memproses...' : `Beli • ${rupiah(menu.price * safeQty)}`}
        </button>
      </div>
    </>
  );
}