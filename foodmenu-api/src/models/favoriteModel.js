const supabase = require('../config/supabase');

const getByDevice = async (deviceId) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('menu_id')
    .eq('device_id', deviceId);
  if (error) throw error;
  return data.map((f) => f.menu_id);
};

const add = async (deviceId, menuId) => {
  const { error } = await supabase
    .from('favorites')
    .upsert({ device_id: deviceId, menu_id: menuId }, { onConflict: 'device_id,menu_id' });
  if (error) throw error;
};

const remove = async (deviceId, menuId) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('device_id', deviceId)
    .eq('menu_id', menuId);
  if (error) throw error;
};

module.exports = { getByDevice, add, remove };
