require('dotenv/config');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function seed() {
  console.log('🌱 Iniciando seed de datos...');

  // Check if data already exists
  const { data: existing } = await supabase.from('sucursales').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('⚠️  Ya existen datos en la base de datos. Abortando seed.');
    return;
  }

  // Insert sucursales
  const { data: sucursales, error: errSuc } = await supabase.from('sucursales').insert([
    { nombre: 'Oficina Central', direccion: 'Av. Reforma 505, Col. Cuauhtémoc', ciudad: 'Ciudad de México', telefono: '+52 55 1234 5678', responsable: 'Carlos Mendoza', notas: 'Sede principal' },
    { nombre: 'Sucursal Norte', direccion: 'Blvd. Díaz Ordaz 1234', ciudad: 'Monterrey', telefono: '+52 81 9876 5432', responsable: 'Ana García', notas: '' },
    { nombre: 'Sucursal Sur', direccion: 'Calle 60 #456 x 51 y 53', ciudad: 'Mérida', telefono: '+52 99 1122 3344', responsable: 'Roberto Díaz', notas: 'Nueva sucursal' }
  ]).select();

  if (errSuc) { console.error('Error insertando sucursales:', errSuc); return; }
  console.log(`✅ ${sucursales.length} sucursales creadas`);

  const s1 = sucursales[0].id;
  const s2 = sucursales[1].id;
  const s3 = sucursales[2].id;

  // Insert usuarios
  const { data: usuarios, error: errUsr } = await supabase.from('usuarios').insert([
    { nombre: 'María López', email: 'maria@empresa.com', password: 'admin123', posicion: 'Gerente de TI', sucursal_id: s1, telefono: '+52 55 1111 2222' },
    { nombre: 'Juan Martínez', email: 'juan@empresa.com', password: 'juan123', posicion: 'Desarrollador Senior', sucursal_id: s1, telefono: '+52 55 3333 4444' },
    { nombre: 'Laura Hernández', email: 'laura@empresa.com', password: 'laura123', posicion: 'Diseñadora UX', sucursal_id: s2, telefono: '+52 81 5555 6666' },
    { nombre: 'Pedro Sánchez', email: 'pedro@empresa.com', password: 'pedro123', posicion: 'Analista de Sistemas', sucursal_id: s2, telefono: '+52 81 7777 8888' },
    { nombre: 'Sofía Ramírez', email: 'sofia@empresa.com', password: 'sofia123', posicion: 'Soporte Técnico', sucursal_id: s3, telefono: '+52 99 9999 0000' }
  ]).select();

  if (errUsr) { console.error('Error insertando usuarios:', errUsr); return; }
  console.log(`✅ ${usuarios.length} usuarios creados`);

  const u1 = usuarios[0].id;
  const u2 = usuarios[1].id;
  const u3 = usuarios[2].id;
  const u5 = usuarios[4].id;

  // Insert equipos
  const { data: equipos, error: errEq } = await supabase.from('equipos').insert([
    { tipo: 'Laptop', marca: 'Dell', modelo: 'Latitude 5540', serial: 'DL-2024-001', estado: 'Asignado', fecha_compra: '2024-01-15', asignado_tipo: 'usuario', asignado_id: u1, fecha_asignacion: new Date().toISOString() },
    { tipo: 'Laptop', marca: 'Lenovo', modelo: 'ThinkPad X1 Carbon', serial: 'LN-2024-002', estado: 'Asignado', fecha_compra: '2024-02-20', asignado_tipo: 'usuario', asignado_id: u2, fecha_asignacion: new Date().toISOString() },
    { tipo: 'Monitor', marca: 'Samsung', modelo: 'S27A800', serial: 'SM-2024-003', estado: 'Asignado', fecha_compra: '2024-03-10', notas: 'Monitor 27"', asignado_tipo: 'usuario', asignado_id: u2, fecha_asignacion: new Date().toISOString() },
    { tipo: 'Impresora', marca: 'HP', modelo: 'LaserJet Pro M404', serial: 'HP-2023-004', estado: 'Asignado', fecha_compra: '2023-11-05', notas: 'Impresora láser color', asignado_tipo: 'sucursal', asignado_id: s1, fecha_asignacion: new Date().toISOString() },
    { tipo: 'Desktop', marca: 'HP', modelo: 'ProDesk 400 G9', serial: 'HP-2024-005', estado: 'Disponible', fecha_compra: '2024-04-01', notas: 'Equipo nuevo, en almacén' },
    { tipo: 'Red', marca: 'Cisco', modelo: 'Catalyst 9200', serial: 'CS-2023-006', estado: 'Asignado', fecha_compra: '2023-08-20', notas: 'Switch de piso 3', asignado_tipo: 'sucursal', asignado_id: s1, fecha_asignacion: new Date().toISOString() },
    { tipo: 'Laptop', marca: 'Apple', modelo: 'MacBook Pro 14"', serial: 'AP-2024-007', estado: 'Asignado', fecha_compra: '2024-05-15', asignado_tipo: 'usuario', asignado_id: u3, fecha_asignacion: new Date().toISOString() },
    { tipo: 'Servidor', marca: 'Dell', modelo: 'PowerEdge R750', serial: 'DL-SRV-008', estado: 'Asignado', fecha_compra: '2023-06-01', notas: 'Servidor principal', asignado_tipo: 'sucursal', asignado_id: s1, fecha_asignacion: new Date().toISOString() },
    { tipo: 'Tablet', marca: 'Apple', modelo: 'iPad Pro 12.9"', serial: 'AP-2024-009', estado: 'En Reparación', fecha_compra: '2024-01-20', notas: 'Pantalla rota', asignado_tipo: 'usuario', asignado_id: u5, fecha_asignacion: new Date().toISOString() },
    { tipo: 'Monitor', marca: 'LG', modelo: '27UP850', serial: 'LG-2024-010', estado: 'Disponible', fecha_compra: '2024-06-01', notas: 'Monitor 4K USB-C' }
  ]).select();

  if (errEq) { console.error('Error insertando equipos:', errEq); return; }
  console.log(`✅ ${equipos.length} equipos creados`);

  console.log('\n🎉 Seed completado exitosamente!');
}

seed().catch(console.error);
