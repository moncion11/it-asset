const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('equipos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Equipo no encontrado' });
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { tipo, marca, modelo, serial, estado, fecha_compra, notas, asignado_tipo, asignado_id } = req.body;

      const finalEstado = asignado_id ? 'Asignado' : (estado === 'Asignado' ? 'Disponible' : (estado || 'Disponible'));
      const fechaAsignacion = asignado_id ? new Date().toISOString() : null;

      const { data, error } = await supabase
        .from('equipos')
        .update({
          tipo, marca, modelo, serial,
          estado: finalEstado,
          fecha_compra: fecha_compra || null,
          notas,
          asignado_tipo: asignado_id ? asignado_tipo : '',
          asignado_id: asignado_id || null,
          fecha_asignacion: fechaAsignacion
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('equipos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Equipo eliminado' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
