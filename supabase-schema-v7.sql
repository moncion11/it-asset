-- ============================================
-- IT Asset Pro - Schema Update v7
-- 1) usuario_sucursales: many-to-many relationship
-- 2) departamentos: add subcategoria column
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- ==========================================
-- FEATURE 1: Multiple sucursales per usuario
-- ==========================================

-- Junction table for usuario <-> sucursal (many-to-many)
CREATE TABLE IF NOT EXISTS usuario_sucursales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  sucursal_id UUID NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(usuario_id, sucursal_id)
);

CREATE INDEX IF NOT EXISTS idx_usuario_sucursales_usuario ON usuario_sucursales(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_sucursales_sucursal ON usuario_sucursales(sucursal_id);

-- Migrate existing sucursal_id data to junction table
INSERT INTO usuario_sucursales (usuario_id, sucursal_id)
SELECT id, sucursal_id FROM usuarios WHERE sucursal_id IS NOT NULL
ON CONFLICT (usuario_id, sucursal_id) DO NOTHING;

-- RLS
ALTER TABLE usuario_sucursales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on usuario_sucursales" ON usuario_sucursales FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- FEATURE 2: Subcategorías en departamentos
-- ==========================================

ALTER TABLE departamentos ADD COLUMN IF NOT EXISTS subcategoria TEXT DEFAULT '';
