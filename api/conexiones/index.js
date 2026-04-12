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
        const { data, error } = await supabase.from('conexiones_remotas').select('*').eq('id', id).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'PUT') {
        const { nombre, tipo, id_conexion, password_conexion, equipo_id, usuario_id, sucursal_id, departamento_id, notas } = req.body;
        const { data, error } = await supabase.from('conexiones_remotas')
          .update({ nombre, tipo, id_conexion, password_conexion, equipo_id: equipo_id || null, usuario_id: usuario_id || null, sucursal_id: sucursal_id || null, departamento_id: departamento_id || null, notas })
          .eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        const { error } = await supabase.from('conexiones_remotas').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ message: 'Conexión eliminada' });
      }
    } else {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('conexiones_remotas').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'POST') {
        const { nombre, tipo, id_conexion, password_conexion, equipo_id, usuario_id, sucursal_id, departamento_id, notas } = req.body;
        if (!nombre || !tipo || !id_conexion) return res.status(400).json({ error: 'nombre, tipo e id_conexion son requeridos' });
        const { data, error } = await supabase.from('conexiones_remotas')
          .insert([{ nombre, tipo, id_conexion, password_conexion, equipo_id: equipo_id || null, usuario_id: usuario_id || null, sucursal_id: sucursal_id || null, departamento_id: departamento_id || null, notas }])
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
