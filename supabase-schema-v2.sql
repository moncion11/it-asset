-- ============================================
-- IT Asset Pro - Schema Update v2
-- Login + Credenciales + Conexiones Remotas
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Tabla Credenciales (contraseñas de plataformas/programas)
CREATE TABLE credenciales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plataforma TEXT NOT NULL,
  url TEXT DEFAULT '',
  usuario_plataforma TEXT DEFAULT '',
  password_plataforma TEXT DEFAULT '',
  categoria TEXT DEFAULT 'Plataforma' CHECK (categoria IN ('Programa','Plataforma','Servidor','Red','Otro')),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla Conexiones Remotas
CREATE TABLE conexiones_remotas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('TeamViewer','AnyDesk','RDP','VNC','SSH','Otro')),
  id_conexion TEXT NOT NULL,
  password_conexion TEXT DEFAULT '',
  equipo_id UUID REFERENCES equipos(id) ON DELETE SET NULL,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agregar campo 'rol' a usuarios para el login
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'usuario' CHECK (rol IN ('admin','usuario'));

-- Índices
CREATE INDEX idx_credenciales_usuario ON credenciales(usuario_id);
CREATE INDEX idx_credenciales_categoria ON credenciales(categoria);
CREATE INDEX idx_conexiones_tipo ON conexiones_remotas(tipo);
CREATE INDEX idx_conexiones_usuario ON conexiones_remotas(usuario_id);
CREATE INDEX idx_conexiones_equipo ON conexiones_remotas(equipo_id);

-- RLS
ALTER TABLE credenciales ENABLE ROW LEVEL SECURITY;
ALTER TABLE conexiones_remotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on credenciales" ON credenciales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on conexiones_remotas" ON conexiones_remotas FOR ALL USING (true) WITH CHECK (true);

-- Actualizar el primer usuario como admin
UPDATE usuarios SET rol = 'admin' WHERE email = 'maria@empresa.com';
