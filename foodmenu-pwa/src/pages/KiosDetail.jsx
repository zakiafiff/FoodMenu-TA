import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MenuRow from '../components/MenuRow';
import { PageHeader } from '../components/Layout';
import { Chips, EmptyState, ErrorState, Icon, Img, StatusBadge } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { getKios } from '../services/api';

const Info = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl bg-surface-container p-3">
    <Icon name={icon} className="text-primary" />
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase text-on-surface-variant">{label}</div>
      <div className="truncate text-sm font-bold">{value}</div>
    </div>
  </div>
);

export default function KiosDetail() {
  const { id } = useParams();
  const { data: kios, loading, error, reload } = useFetch(() => getKios(id), [id]);
  const [cat, setCat] = useState('');

  if (loading) return (<><PageHeader title="Kios Detail" /><div className="skeleton m-4 h-64" /></>);
  if (error || !kios) return (<><PageHeader title="Kios Detail" /><ErrorState onRetry={reload} /></>);

  // sisipkan info kios ke tiap menu agar favorit & kartu menu lengkap
  const menus = (kios.menus || []).map((m) => ({
    ...m, kios: { id: kios.id, name: kios.name, location: kios.location, open_time: kios.open_time,
      close_time: kios.close_time, is_open: kios.is_open, image_url: kios.image_url },
  }));
  const catNames = [...new Set(menus.map((m) => m.categories?.name).filter(Boolean))];
  const chipItems = [{ value: '', label: 'Semua Menu' }, ...catNames.map((n) => ({ value: n, label: n }))];
  const shown = menus.filter((m) => !cat || m.categories?.name === cat);

  return (
    <>
      <PageHeader title="Kios Detail" />
      <div className="relative">
        <Img src={kios.image_url} alt={kios.name} className="h-56 w-full md:h-80" />
        <StatusBadge ok={kios.is_open} okText="Buka Sekarang" noText="Tutup Sementara"
          className="absolute left-4 top-4 bg-surface-lowest/80 backdrop-blur" />
      </div>

      <div className="relative mx-auto -mt-8 max-w-4xl space-y-4 px-4">
        <section className="space-y-3 rounded-3xl bg-surface-low p-5 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-2xl font-bold leading-7">{kios.name}</h2>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-surface-high px-2.5 py-1 text-sm font-bold">
              <Icon name="star" fill className="text-[16px] text-primary-container" />{Number(kios.rating).toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">{kios.specialty}</p>
          <p className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <Icon name="rate_review" className="text-[16px] text-primary" />{kios.review_count} ulasan mahasiswa & dosen FT Undip
          </p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <Info icon="schedule" label="Jam Buka" value={`${kios.open_time} - ${kios.close_time} WIB`} />
            <Info icon="bolt" label="Rata-rata Saji" value={kios.avg_serve_time} />
            <Info icon="location_on" label="Lokasi" value={kios.area} />
            <Info icon="restaurant" label="Total Menu" value={`${menus.length} Menu`} />
          </div>
          <p className="rounded-xl bg-surface-container p-3 text-sm leading-relaxed text-on-surface-variant">{kios.description}</p>
          <p className="flex items-start gap-1.5 text-xs text-on-surface-variant">
            <Icon name="pin_drop" className="text-[16px] text-primary" />{kios.location}
          </p>
        </section>

        <h2 className="font-display text-xl font-bold">Daftar Menu di Kios Ini</h2>
      </div>

      <div className="mt-2"><Chips items={chipItems} value={cat} onChange={setCat} /></div>

      {shown.length === 0 ? <EmptyState title="Belum ada menu" /> : (
        <div className="mx-auto mt-3 grid max-w-6xl gap-3 px-4 md:grid-cols-2">
          {shown.map((m) => <MenuRow key={m.id} menu={m} showKios={false} />)}
        </div>
      )}
    </>
  );
}
