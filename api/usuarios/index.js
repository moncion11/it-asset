const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

function getId(req) {
  const segments = req.url.split('?')[0].split('/').filter(Boolean);
  return segments.length > 2 ? segments[2] : null;
}

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const id = getId(req);

  try {
    if (id) {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.status(200).json(data);
      }
      if (req.method === 'PUT') {
        const { nombre, email, posicion, sucursal_id, departamento_id, telefono, notas } = req.body;
        const { data, error } = await supabase.from('usuarios')
          .update({ nombre, email, posicion, sucursal_id: sucursal_id || null, departamento_id: departamento_id || null, telefono, notas })
          .eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('equipos')
          .update({ asignado_tipo: '', asignado_id: null, estado: 'Disponible' })
          .eq('asignado_tipo', 'usuario').eq('asignado_id', id);
        const { error } = await supabase.from('usuarios').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ message: 'Usuario eliminado' });
      }
    } else {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'POST') {
        const { nombre, email, posicion, sucursal_id, departamento_id, telefono, notas } = req.body;
        if (!nombre || !posicion) return res.status(400).json({ error: 'nombre y posicion son requeridos' });
        const { data, error } = await supabase.from('usuarios')
          .insert([{ nombre, email, posicion, sucursal_id: sucursal_id || null, departamento_id: departamento_id || null, telefono, notas }])
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
