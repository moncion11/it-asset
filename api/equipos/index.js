const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('equipos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { tipo, marca, modelo, serial, estado, fecha_compra, notas, asignado_tipo, asignado_id } = req.body;

      if (!tipo || !marca) {
        return res.status(400).json({ error: 'tipo y marca son requeridos' });
      }

      const finalEstado = asignado_id ? 'Asignado' : (estado || 'Disponible');
      const fechaAsignacion = asignado_id ? new Date().toISOString() : null;

      const { data, error } = await supabase
        .from('equipos')
        .insert([{
          tipo, marca, modelo, serial,
          estado: finalEstado,
          fecha_compra: fecha_compra || null,
          notas,
          asignado_tipo: asignado_id ? asignado_tipo : '',
          asignado_id: asignado_id || null,
          fecha_asignacion: fechaAsignacion
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
