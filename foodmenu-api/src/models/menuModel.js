const supabase = require('../config/supabase');
const pick = require('../utils/pick');

const SELECT = '*, kios(id, name, location, open_time, close_time, is_open, image_url), categories(id, name)';
const FIELDS = ['kios_id', 'category_id', 'name', 'description', 'price', 'original_price', 'rating',
  'review_count', 'image_url', 'is_available', 'is_popular', 'tags', 'prep_time', 'stock'];

const getAll = async ({ search, category_id, kios_id, sort, popular, limit } = {}) => {
  let query = supabase.from('menus').select(SELECT);

  if (search) {
    const s = search.replace(/[,()]/g, ' ');
    query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%`);
  }
  if (category_id) query = query.eq('category_id', category_id);
  if (kios_id) query = query.eq('kios_id', kios_id);
  if (popular === 'true') query = query.eq('is_popular', true);

  switch (sort) {
    case 'termurah':
      query = query.order('price', { ascending: true });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    default: // terpopuler
      query = query.order('review_count', { ascending: false });
  }
  if (limit) query = query.limit(Number(limit));

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const getById = async (id) => {
  const { data, error } = await supabase.from('menus').select(SELECT).eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
};

const getByIds = async (ids) => {
  const { data, error } = await supabase.from('menus').select(SELECT).in('id', ids);
  if (error) throw error;
  return data;
};

const create = async (payload) => {
  const { data, error } = await supabase.from('menus').insert([pick(payload, FIELDS)]).select(SELECT).single();
  if (error) throw error;
  return data;
};

const update = async (id, payload) => {
  const values = pick(payload, FIELDS);
  if (!Object.keys(values).length) throw new Error('Tidak ada data yang valid untuk diperbarui');
  const { data, error } = await supabase.from('menus').update(values).eq('id', id).select(SELECT).maybeSingle();
  if (error) throw error;
  return data;
};

// Ubah stok: { amount: -1 } = kurangi/tambah, atau { stock: 20 } = set langsung (minimal 0)
const adjustStock = async (id, { amount, stock }) => {
  let next = stock;
  if (next === undefined) {
    const current = await getById(id);
    if (!current) return null;
    next = Number(current.stock) + Number(amount);
  }
  next = Math.max(0, Math.floor(Number(next)));
  if (Number.isNaN(next)) throw new Error('amount / stock harus berupa angka');
  return update(id, { stock: next });
};

const remove = async (id) => {
  const { data, error } = await supabase.from('menus').delete().eq('id', id).select();
  if (error) throw error;
  return data.length > 0;
};

module.exports = { getAll, getById, getByIds, create, update, adjustStock, remove };