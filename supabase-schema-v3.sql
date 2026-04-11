-- ============================================
-- IT Asset Pro - Schema Update v3
-- Departamentos + Remove password from usuarios
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Tabla Departamentos
CREATE TABLE departamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  responsable TEXT DEFAULT '',
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE SET NULL,
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agregar departamento_id a usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS departamento_id UUID REFERENCES departamentos(id) ON DELETE SET NULL;

-- Índices
CREATE INDEX idx_departamentos_sucursal ON departamentos(sucursal_id);
CREATE INDEX idx_usuarios_departamento ON usuarios(departamento_id);

-- RLS
ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on departamentos" ON departamentos FOR ALL USING (true) WITH CHECK (true);

-- Eliminar columna password de usuarios (ya no se usa para login)
ALTER TABLE usuarios DROP COLUMN IF EXISTS password;

-- Eliminar columna rol de usuarios (login es independiente)
ALTER TABLE usuarios DROP COLUMN IF EXISTS rol;
