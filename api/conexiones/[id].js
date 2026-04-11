const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('conexiones_remotas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { nombre, tipo, id_conexion, password_conexion, equipo_id, usuario_id, notas } = req.body;

      const { data, error } = await supabase
        .from('conexiones_remotas')
        .update({ nombre, tipo, id_conexion, password_conexion, equipo_id: equipo_id || null, usuario_id: usuario_id || null, notas })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('conexiones_remotas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Conexión eliminada' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
