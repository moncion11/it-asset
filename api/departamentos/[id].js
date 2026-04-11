const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Departamento no encontrado' });
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { nombre, descripcion, responsable, sucursal_id, notas } = req.body;

      const { data, error } = await supabase
        .from('departamentos')
        .update({ nombre, descripcion, responsable, sucursal_id: sucursal_id || null, notas })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      // Desvincular usuarios del departamento
      await supabase
        .from('usuarios')
        .update({ departamento_id: null })
        .eq('departamento_id', id);

      const { error } = await supabase
        .from('departamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Departamento eliminado' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
