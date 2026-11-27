export const rupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');
export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'FM';

// Menu dianggap habis jika ditandai tidak tersedia ATAU stoknya 0
export const isSoldOut = (m) => !m.is_available || Number(m.stock) <= 0;

// Teks stok: "Stok 10", "Sisa 3" (stok menipis, 3 ke bawah)
export const stockText = (m) => {
  if (m.stock === undefined || m.stock === null) return 'Tersedia';
  return Number(m.stock) <= 3 ? `Sisa ${m.stock}` : `Stok ${m.stock}`;
};

