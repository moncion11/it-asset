-- ============================================
-- IT Asset Pro - Schema Update v8
-- Usuarios: add subcategoria column
-- Ejecutar en Supabase SQL Editor
-- ============================================

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS subcategoria TEXT DEFAULT '';
