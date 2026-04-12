-- ============================================
-- IT Asset Pro - Schema Update v5
-- Conexiones: add sucursal_id, departamento_id
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Agregar columnas a conexiones_remotas
ALTER TABLE conexiones_remotas ADD COLUMN IF NOT EXISTS sucursal_id UUID REFERENCES sucursales(id) ON DELETE SET NULL;
ALTER TABLE conexiones_remotas ADD COLUMN IF NOT EXISTS departamento_id UUID REFERENCES departamentos(id) ON DELETE SET NULL;

-- Índices
CREATE INDEX IF NOT EXISTS idx_conexiones_sucursal ON conexiones_remotas(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_conexiones_departamento ON conexiones_remotas(departamento_id);
