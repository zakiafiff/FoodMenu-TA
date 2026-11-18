import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuFeatured from '../components/MenuFeatured';
import MenuRow from '../components/MenuRow';
import { Chips, ErrorState, Icon, SearchBar, SectionTitle, SkeletonList } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { getCategories, getMenus } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const cats = useFetch(() => getCategories(), []);
  const popular = useFetch(() => getMenus({ popular: 'true', sort: 'rating' }), []);
  const reco = useFetch(() => getMenus({ sort: 'rating', limit: 5 }), []);

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/menu?search=${encodeURIComponent(q.trim())}` : '/menu');
  };
  const chipItems = [{ value: '', label: 'Semua' }, ...(cats.data || []).map((c) => ({ value: c.id, label: c.name }))];
  const paketId = cats.data?.find((c) => c.name === 'Paket Hemat')?.id;

  if (popular.error && reco.error) return <ErrorState onRetry={() => { popular.reload(); reco.reload(); cats.reload(); }} />;

  return (
    <div className="space-y-5">
      <section className="flex items-start justify-between px-4">
        <div>
          <h1 className="font-display text-[26px] font-bold leading-8">Halo, Mahasiswa Teknik! 👋</h1>
          <p className="text-sm text-on-surface-variant">Mau makan apa hari ini di Kantin FT?</p>
        </div>
      </section>

      <form onSubmit={submit} className="flex gap-2 px-4 md:max-w-2xl">
        <SearchBar value={q} onChange={setQ} placeholder="Cari nasi geprek, soto, es teh..." />
        <Link to="/menu" aria-label="Filter menu"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-md active:scale-95">
          <Icon name="tune" />
        </Link>
      </form>

      <Chips items={chipItems} value="" onChange={(v) => navigate(v ? `/menu?category=${v}` : '/menu')} />

      <section className="px-4">
        <Link to={paketId ? `/menu?category=${paketId}` : '/menu'}
          className="block rounded-2xl bg-gradient-to-r from-[#264191] via-surface-high to-surface-container p-4 shadow-lg md:p-8">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-container/20 px-2.5 py-0.5 text-[11px] font-bold text-primary">
            <Icon name="local_offer" className="text-[13px]" /> Kupon Khusus Anak Teknik
          </span>
          <h2 className="mt-2 font-display text-[22px] font-bold leading-7 text-white">🔥 Paket Hemat Mahasiswa</h2>
          <p className="mt-0.5 text-sm text-white/75">Makan kenyang & hemat mulai Rp10.000 di Dapur Mahasiswa.</p>
          <span className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-primary-container px-5 text-sm font-bold text-on-primary-container">
            Lihat Paket Hemat
          </span>
        </Link>
      </section>

      <section className="space-y-3">
        <SectionTitle icon="star" title="Menu Favorit" to="/menu" />
        {popular.loading ? <SkeletonList count={1} /> : (
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {(popular.data || []).map((m) => <MenuFeatured key={m.id} menu={m} />)}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <SectionTitle icon="thumb_up" title="Rekomendasi Hari Ini" to="/menu" />
        {reco.loading ? <SkeletonList count={3} /> : (
          <div className="grid gap-3 px-4 md:grid-cols-2">
            {(reco.data || []).map((m) => <MenuRow key={m.id} menu={m} />)}
          </div>
        )}
      </section>
    </div>
  );
}
