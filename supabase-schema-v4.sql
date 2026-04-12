-- ============================================
-- IT Asset Pro - Schema Update v4
-- Tareas Pendientes (IT Support Tasks)
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Tabla Tareas
CREATE TABLE tareas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  prioridad TEXT NOT NULL DEFAULT 'Media' CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Urgente')),
  estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En Progreso', 'Completada', 'Cancelada')),
  categoria TEXT NOT NULL DEFAULT 'Otro' CHECK (categoria IN ('Reparación', 'Instalación', 'Mantenimiento', 'Configuración', 'Otro')),
  fecha_limite DATE,
  equipo_id UUID REFERENCES equipos(id) ON DELETE SET NULL,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE SET NULL,
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_tareas_estado ON tareas(estado);
CREATE INDEX idx_tareas_prioridad ON tareas(prioridad);
CREATE INDEX idx_tareas_equipo ON tareas(equipo_id);
CREATE INDEX idx_tareas_usuario ON tareas(usuario_id);
CREATE INDEX idx_tareas_sucursal ON tareas(sucursal_id);
CREATE INDEX idx_tareas_fecha_limite ON tareas(fecha_limite);

-- RLS
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on tareas" ON tareas FOR ALL USING (true) WITH CHECK (true);
