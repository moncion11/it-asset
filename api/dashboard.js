const { supabase, setCorsHeaders, handleOptions } = require('../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [usuariosRes, equiposRes, sucursalesRes, credencialesRes, conexionesRes, departamentosRes, tareasRes, usuarioSucursalesRes] = await Promise.all([
      supabase.from('usuarios').select('*').order('created_at', { ascending: false }),
      supabase.from('equipos').select('*').order('created_at', { ascending: false }),
      supabase.from('sucursales').select('*').order('created_at', { ascending: false }),
      supabase.from('credenciales').select('*').order('created_at', { ascending: false }),
      supabase.from('conexiones_remotas').select('*').order('created_at', { ascending: false }),
      supabase.from('departamentos').select('*').order('created_at', { ascending: false }),
      supabase.from('tareas').select('*').order('created_at', { ascending: false }),
      supabase.from('usuario_sucursales').select('usuario_id, sucursal_id')
    ]);

    if (usuariosRes.error) throw usuariosRes.error;
    if (equiposRes.error) throw equiposRes.error;
    if (sucursalesRes.error) throw sucursalesRes.error;

    const usuarios = usuariosRes.data;
    const equipos = equiposRes.data;
    const sucursales = sucursalesRes.data;
    const credenciales = credencialesRes.data || [];
    const conexiones = conexionesRes.data || [];
    const departamentos = departamentosRes.data || [];
    const tareas = tareasRes.data || [];

    // Build sucursal_ids map for each usuario
    const relMap = {};
    (usuarioSucursalesRes.data || []).forEach(r => {
      if (!relMap[r.usuario_id]) relMap[r.usuario_id] = [];
      relMap[r.usuario_id].push(r.sucursal_id);
    });
    usuarios.forEach(u => { u.sucursal_ids = relMap[u.id] || []; });

    return res.status(200).json({
      totalUsuarios: usuarios.length,
      totalEquipos: equipos.length,
      totalSucursales: sucursales.length,
      totalAsignados: equipos.filter(e => e.asignado_tipo).length,
      usuarios,
      equipos,
      sucursales,
      credenciales,
      conexiones,
      departamentos,
      tareas
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
