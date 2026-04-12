const { supabase, setCorsHeaders, handleOptions } = require('../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [usuariosRes, equiposRes, sucursalesRes, credencialesRes, conexionesRes, departamentosRes, tareasRes] = await Promise.all([
      supabase.from('usuarios').select('*'),
      supabase.from('equipos').select('*'),
      supabase.from('sucursales').select('*'),
      supabase.from('credenciales').select('*'),
      supabase.from('conexiones_remotas').select('*'),
      supabase.from('departamentos').select('*'),
      supabase.from('tareas').select('*')
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
