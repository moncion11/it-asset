const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

function getId(req) {
  const segments = req.url.split('?')[0].split('/').filter(Boolean);
  return segments.length > 2 ? segments[2] : null;
}

async function getSucursalIds(usuarioId) {
  const { data } = await supabase.from('usuario_sucursales').select('sucursal_id').eq('usuario_id', usuarioId);
  return (data || []).map(r => r.sucursal_id);
}

async function syncSucursales(usuarioId, sucursalIds) {
  await supabase.from('usuario_sucursales').delete().eq('usuario_id', usuarioId);
  if (sucursalIds && sucursalIds.length > 0) {
    const rows = sucursalIds.map(sid => ({ usuario_id: usuarioId, sucursal_id: sid }));
    const { error } = await supabase.from('usuario_sucursales').insert(rows);
    if (error) throw error;
  }
  // Keep sucursal_id in sync (first selected or null) for backward compat
  const primarySucursal = (sucursalIds && sucursalIds.length > 0) ? sucursalIds[0] : null;
  await supabase.from('usuarios').update({ sucursal_id: primarySucursal }).eq('id', usuarioId);
}

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const id = getId(req);

  try {
    if (id) {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
        data.sucursal_ids = await getSucursalIds(id);
        return res.status(200).json(data);
      }
      if (req.method === 'PUT') {
        const { nombre, email, posicion, sucursal_ids, departamento_id, telefono, notas } = req.body;
        const primarySucursal = (sucursal_ids && sucursal_ids.length > 0) ? sucursal_ids[0] : null;
        const { data, error } = await supabase.from('usuarios')
          .update({ nombre, email, posicion, sucursal_id: primarySucursal, departamento_id: departamento_id || null, telefono, notas })
          .eq('id', id).select().single();
        if (error) throw error;
        await syncSucursales(id, sucursal_ids || []);
        data.sucursal_ids = sucursal_ids || [];
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('equipos')
          .update({ asignado_tipo: '', asignado_id: null, estado: 'Disponible' })
          .eq('asignado_tipo', 'usuario').eq('asignado_id', id);
        const { error } = await supabase.from('usuarios').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ message: 'Usuario eliminado' });
      }
    } else {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        // Fetch all junction rows in one query
        const { data: allRels } = await supabase.from('usuario_sucursales').select('usuario_id, sucursal_id');
        const relMap = {};
        (allRels || []).forEach(r => {
          if (!relMap[r.usuario_id]) relMap[r.usuario_id] = [];
          relMap[r.usuario_id].push(r.sucursal_id);
        });
        data.forEach(u => { u.sucursal_ids = relMap[u.id] || []; });
        return res.status(200).json(data);
      }
      if (req.method === 'POST') {
        const { nombre, email, posicion, sucursal_ids, departamento_id, telefono, notas } = req.body;
        if (!nombre || !posicion) return res.status(400).json({ error: 'nombre y posicion son requeridos' });
        const primarySucursal = (sucursal_ids && sucursal_ids.length > 0) ? sucursal_ids[0] : null;
        const { data, error } = await supabase.from('usuarios')
          .insert([{ nombre, email, posicion, sucursal_id: primarySucursal, departamento_id: departamento_id || null, telefono, notas }])
          .select().single();
        if (error) throw error;
        await syncSucursales(data.id, sucursal_ids || []);
        data.sucursal_ids = sucursal_ids || [];
        return res.status(201).json(data);
      }
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
