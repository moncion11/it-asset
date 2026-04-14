-- ============================================
-- IT Asset Pro - Schema Update v9
-- Departamentos: estructura de árbol (parent_id)
-- Usuarios: subdepartamento_id reemplaza subcategoria
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1) Add parent_id to departamentos for tree structure
ALTER TABLE departamentos ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES departamentos(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_departamentos_parent ON departamentos(parent_id);

-- 2) Add subdepartamento_id to usuarios (replaces subcategoria)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS subdepartamento_id UUID REFERENCES departamentos(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_subdepartamento ON usuarios(subdepartamento_id);
