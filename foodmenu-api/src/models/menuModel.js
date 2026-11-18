const supabase = require('../config/supabase');

const SELECT = '*, kios(id, name, location, open_time, close_time, is_open, image_url), categories(id, name)';

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

module.exports = { getAll, getById, getByIds };
