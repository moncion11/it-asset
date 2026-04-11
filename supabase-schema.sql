-- ============================================
-- IT Asset Pro - Supabase Schema
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Tabla Sucursales
CREATE TABLE sucursales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT DEFAULT '',
  ciudad TEXT DEFAULT '',
  telefono TEXT DEFAULT '',
  responsable TEXT DEFAULT '',
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla Usuarios
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT DEFAULT '',
  password TEXT NOT NULL,
  posicion TEXT NOT NULL,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE SET NULL,
  telefono TEXT DEFAULT '',
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla Equipos
CREATE TABLE equipos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('Laptop','Desktop','Monitor','Impresora','Red','Servidor','Tablet','Teléfono','Otro')),
  marca TEXT NOT NULL,
  modelo TEXT DEFAULT '',
  serial TEXT DEFAULT '',
  estado TEXT DEFAULT 'Disponible' CHECK (estado IN ('Disponible','Asignado','En Reparación','Retirado')),
  fecha_compra DATE,
  notas TEXT DEFAULT '',
  asignado_tipo TEXT DEFAULT '' CHECK (asignado_tipo IN ('','usuario','sucursal')),
  asignado_id UUID,
  fecha_asignacion TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_usuarios_sucursal ON usuarios(sucursal_id);
CREATE INDEX idx_equipos_estado ON equipos(estado);
CREATE INDEX idx_equipos_asignado ON equipos(asignado_tipo, asignado_id);
CREATE INDEX idx_equipos_tipo ON equipos(tipo);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (ajustar según necesidades de auth)
CREATE POLICY "Allow all on sucursales" ON sucursales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on usuarios" ON usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on equipos" ON equipos FOR ALL USING (true) WITH CHECK (true);
