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
        const { data, error } = await supabase.from('credenciales').select('*').eq('id', id).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'PUT') {
        const { plataforma, url, usuario_plataforma, password_plataforma, categoria, usuario_id, notas } = req.body;
        const { data, error } = await supabase.from('credenciales')
          .update({ plataforma, url, usuario_plataforma, password_plataforma, categoria, usuario_id: usuario_id || null, notas })
          .eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        const { error } = await supabase.from('credenciales').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ message: 'Credencial eliminada' });
      }
    } else {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('credenciales').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'POST') {
        const { plataforma, url, usuario_plataforma, password_plataforma, categoria, usuario_id, notas } = req.body;
        if (!plataforma) return res.status(400).json({ error: 'plataforma es requerido' });
        const { data, error } = await supabase.from('credenciales')
          .insert([{ plataforma, url, usuario_plataforma, password_plataforma, categoria: categoria || 'Plataforma', usuario_id: usuario_id || null, notas }])
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
