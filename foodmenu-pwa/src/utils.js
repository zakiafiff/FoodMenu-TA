export const rupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');
export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'FM';
