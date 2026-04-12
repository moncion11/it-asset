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
        const { data, error } = await supabase.from('tareas').select('*').eq('id', id).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'PUT') {
        const { titulo, descripcion, prioridad, estado, categoria, fecha_limite, equipo_id, usuario_id, sucursal_id, notas } = req.body;
        const { data, error } = await supabase.from('tareas')
          .update({ titulo, descripcion, prioridad, estado, categoria, fecha_limite: fecha_limite || null, equipo_id: equipo_id || null, usuario_id: usuario_id || null, sucursal_id: sucursal_id || null, notas })
          .eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        const { error } = await supabase.from('tareas').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ message: 'Tarea eliminada' });
      }
    } else {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('tareas').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'POST') {
        const { titulo, descripcion, prioridad, estado, categoria, fecha_limite, equipo_id, usuario_id, sucursal_id, notas } = req.body;
        if (!titulo) return res.status(400).json({ error: 'titulo es requerido' });
        const { data, error } = await supabase.from('tareas')
          .insert([{ titulo, descripcion, prioridad: prioridad || 'Media', estado: estado || 'Pendiente', categoria: categoria || 'Otro', fecha_limite: fecha_limite || null, equipo_id: equipo_id || null, usuario_id: usuario_id || null, sucursal_id: sucursal_id || null, notas }])
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
