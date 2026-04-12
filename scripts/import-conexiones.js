require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const SUCURSALES = ['KENNEDY', 'ALBERTS', 'PUNTA CANA', 'PUERTO PLATA', 'GUSTAVO', 'LAS TERRENAS'];

async function importConexiones() {
  console.log('📂 Leyendo archivo LISTADO REMOTOS.xlsx...');
  const wb = XLSX.readFile('LISTADO REMOTOS.xlsx');

  // Parse both sheets
  const anydesk = XLSX.utils.sheet_to_json(wb.Sheets['ANYDESK'], { header: 1 });
  const rustdesk = XLSX.utils.sheet_to_json(wb.Sheets['RUSTDESK'], { header: 1 });

  // Get or create sucursales
  console.log('🏢 Verificando sucursales...');
  const { data: existingSuc } = await supabase.from('sucursales').select('*');
  const sucursalMap = {};

  for (const nombre of SUCURSALES) {
    const existing = existingSuc.find(s => s.nombre.toUpperCase() === nombre);
    if (existing) {
      sucursalMap[nombre] = existing.id;
      console.log(`   ✅ Sucursal "${nombre}" ya existe (${existing.id})`);
    } else {
      const { data, error } = await supabase.from('sucursales')
        .insert([{ nombre: nombre.charAt(0) + nombre.slice(1).toLowerCase(), notas: 'Importada desde listado de conexiones remotas' }])
        .select().single();
      if (error) { console.error(`   ❌ Error creando sucursal ${nombre}:`, error.message); continue; }
      sucursalMap[nombre] = data.id;
      console.log(`   🆕 Sucursal "${nombre}" creada (${data.id})`);
    }
  }

  // Parse entries from a sheet: each sucursal has 2 columns (usuario, id)
  // Data starts at row 3 (index 3)
  function parseSheet(rows, tipo) {
    const entries = [];
    for (let row = 3; row < rows.length; row++) {
      const cells = rows[row];
      if (!cells || cells.length === 0) continue;
      for (let sucIdx = 0; sucIdx < SUCURSALES.length; sucIdx++) {
        const colUser = sucIdx * 2;
        const colId = sucIdx * 2 + 1;
        const usuario = cells[colUser];
        const idConexion = cells[colId];
        if (usuario && idConexion) {
          entries.push({
            sucursal: SUCURSALES[sucIdx],
            usuario: String(usuario).trim(),
            id_conexion: String(idConexion).trim().replace(/\s+/g, ' '),
            tipo
          });
        }
      }
    }
    return entries;
  }

  const anydeskEntries = parseSheet(anydesk, 'AnyDesk');
  const rustdeskEntries = parseSheet(rustdesk, 'RustDesk');

  console.log(`\n📊 Encontradas: ${anydeskEntries.length} conexiones AnyDesk, ${rustdeskEntries.length} conexiones RustDesk`);

  const allEntries = [...anydeskEntries, ...rustdeskEntries];

  // Insert into conexiones_remotas
  console.log('\n🔗 Importando conexiones remotas...');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const entry of allEntries) {
    const sucursalId = sucursalMap[entry.sucursal];
    const nombre = `${entry.usuario} - ${entry.sucursal}`;

    // Check if already exists (same tipo + id_conexion)
    const { data: existing } = await supabase.from('conexiones_remotas')
      .select('id')
      .eq('tipo', entry.tipo)
      .eq('id_conexion', entry.id_conexion)
      .limit(1);

    if (existing && existing.length > 0) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from('conexiones_remotas').insert([{
      nombre: nombre,
      tipo: entry.tipo,
      id_conexion: entry.id_conexion,
      password_conexion: '',
      equipo_id: null,
      usuario_id: null,
      notas: `Sucursal: ${entry.sucursal} | Equipo/Usuario: ${entry.usuario} | Tipo: ${entry.tipo}`
    }]);

    if (error) {
      console.error(`   ❌ Error: ${nombre} (${entry.id_conexion}): ${error.message}`);
      errors++;
    } else {
      created++;
    }
  }

  console.log(`\n✅ Importación completada:`);
  console.log(`   📥 Creadas: ${created}`);
  console.log(`   ⏭️  Omitidas (ya existían): ${skipped}`);
  if (errors > 0) console.log(`   ❌ Errores: ${errors}`);
  console.log(`   📊 Total procesadas: ${allEntries.length}`);
}

importConexiones().catch(err => {
  console.error('💥 Error fatal:', err.message);
  process.exit(1);
});
