const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { nombre, email, password, posicion, sucursal_id, telefono, notas } = req.body;

      if (!nombre || !password || !posicion) {
        return res.status(400).json({ error: 'nombre, password y posicion son requeridos' });
      }

      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nombre, email, password, posicion, sucursal_id: sucursal_id || null, telefono, notas }])
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
