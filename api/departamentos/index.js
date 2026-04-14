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
        const { data, error } = await supabase.from('departamentos').select('*').eq('id', id).single();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Departamento no encontrado' });
        return res.status(200).json(data);
      }
      if (req.method === 'PUT') {
        const { nombre, descripcion, responsable, sucursal_id, subcategoria, notas } = req.body;
        const { data, error } = await supabase.from('departamentos')
          .update({ nombre, descripcion, responsable, sucursal_id: sucursal_id || null, subcategoria: subcategoria || '', notas })
          .eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('usuarios').update({ departamento_id: null }).eq('departamento_id', id);
        const { error } = await supabase.from('departamentos').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ message: 'Departamento eliminado' });
      }
    } else {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('departamentos').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'POST') {
        const { nombre, descripcion, responsable, sucursal_id, subcategoria, notas } = req.body;
        if (!nombre) return res.status(400).json({ error: 'nombre es requerido' });
        const { data, error } = await supabase.from('departamentos')
          .insert([{ nombre, descripcion, responsable, sucursal_id: sucursal_id || null, subcategoria: subcategoria || '', notas }])
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
