const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const id = req.query.params?.[0];

  try {
    if (id) {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('sucursales').select('*').eq('id', id).single();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Sucursal no encontrada' });
        return res.status(200).json(data);
      }
      if (req.method === 'PUT') {
        const { nombre, direccion, ciudad, telefono, responsable, notas } = req.body;
        const { data, error } = await supabase.from('sucursales')
          .update({ nombre, direccion, ciudad, telefono, responsable, notas })
          .eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('usuarios').update({ sucursal_id: null }).eq('sucursal_id', id);
        await supabase.from('equipos')
          .update({ asignado_tipo: '', asignado_id: null, estado: 'Disponible' })
          .eq('asignado_tipo', 'sucursal').eq('asignado_id', id);
        const { error } = await supabase.from('sucursales').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ message: 'Sucursal eliminada' });
      }
    } else {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('sucursales').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'POST') {
        const { nombre, direccion, ciudad, telefono, responsable, notas } = req.body;
        if (!nombre) return res.status(400).json({ error: 'nombre es requerido' });
        const { data, error } = await supabase.from('sucursales')
          .insert([{ nombre, direccion, ciudad, telefono, responsable, notas }])
          .select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
