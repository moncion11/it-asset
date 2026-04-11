const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('conexiones_remotas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { nombre, tipo, id_conexion, password_conexion, equipo_id, usuario_id, notas } = req.body;

      if (!nombre || !tipo || !id_conexion) {
        return res.status(400).json({ error: 'nombre, tipo e id_conexion son requeridos' });
      }

      const { data, error } = await supabase
        .from('conexiones_remotas')
        .insert([{
          nombre, tipo, id_conexion, password_conexion,
          equipo_id: equipo_id || null,
          usuario_id: usuario_id || null, notas
        }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
