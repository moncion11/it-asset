const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { nombre, email, password, posicion, sucursal_id, telefono, notas } = req.body;

      const { data, error } = await supabase
        .from('usuarios')
        .update({ nombre, email, password, posicion, sucursal_id: sucursal_id || null, telefono, notas })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      // Desvincular equipos asignados a este usuario
      await supabase
        .from('equipos')
        .update({ asignado_tipo: '', asignado_id: null, estado: 'Disponible' })
        .eq('asignado_tipo', 'usuario')
        .eq('asignado_id', id);

      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Usuario eliminado' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
