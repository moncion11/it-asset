-- ============================================
-- IT Asset Pro - Schema Update v6
-- Sucursales: add extension column
-- Ejecutar en Supabase SQL Editor
-- ============================================

ALTER TABLE sucursales ADD COLUMN IF NOT EXISTS extension TEXT DEFAULT '';
