const supabase = require('../config/supabase');

const getAll = async ({ search, area } = {}) => {
  let query = supabase.from('kios').select('*, menus(count)').order('id');
  if (search) {
    const s = search.replace(/[,()]/g, ' ');
    query = query.or(`name.ilike.%${s}%,specialty.ilike.%${s}%`);
  }
  if (area) query = query.eq('area', area);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(({ menus, ...k }) => ({ ...k, menu_count: menus?.[0]?.count ?? 0 }));
};

const getById = async (id) => {
  const { data, error } = await supabase
    .from('kios')
    .select('*, menus(*, categories(id, name))')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

module.exports = { getAll, getById };
