const { supabase, setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generate simple session token
    const token = Buffer.from(
      JSON.stringify({ id: usuario.id, email: usuario.email, ts: Date.now() })
    ).toString('base64');

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        posicion: usuario.posicion,
        rol: usuario.rol || 'usuario'
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
