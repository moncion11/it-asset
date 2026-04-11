const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { nombre, descripcion, responsable, sucursal_id, notas } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: 'nombre es requerido' });
      }

      const { data, error } = await supabase
        .from('departamentos')
        .insert([{ nombre, descripcion, responsable, sucursal_id: sucursal_id || null, notas }])
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
