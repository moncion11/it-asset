const { setCorsHeaders, handleOptions } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const adminUser = process.env.ADMIN_USER || 'Soporte';
    const adminPass = process.env.ADMIN_PASS || 'Licormart01';

    if (usuario !== adminUser || password !== adminPass) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generate simple session token
    const token = Buffer.from(
      JSON.stringify({ usuario: adminUser, rol: 'admin', ts: Date.now() })
    ).toString('base64');

    return res.status(200).json({
      token,
      usuario: {
        nombre: adminUser,
        rol: 'admin'
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
