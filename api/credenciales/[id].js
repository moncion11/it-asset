const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('credenciales')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { plataforma, url, usuario_plataforma, password_plataforma, categoria, usuario_id, notas } = req.body;

      const { data, error } = await supabase
        .from('credenciales')
        .update({ plataforma, url, usuario_plataforma, password_plataforma, categoria, usuario_id: usuario_id || null, notas })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('credenciales')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Credencial eliminada' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
