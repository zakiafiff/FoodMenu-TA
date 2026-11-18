const supabase = require('../config/supabase');

const getAll = async () => {
  const { data, error } = await supabase.from('categories').select('*').order('id');
  if (error) throw error;
  return data;
};

module.exports = { getAll };
