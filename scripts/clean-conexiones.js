require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function cleanConexiones() {
  console.log('🔧 Limpiando conexiones remotas...\n');

  const { data: conexiones, error: errC } = await supabase.from('conexiones_remotas').select('*');
  if (errC) { console.error('Error:', errC.message); return; }

  const { data: sucursales } = await supabase.from('sucursales').select('*');
  const sucMap = {};
  sucursales.forEach(s => { sucMap[s.nombre.toUpperCase()] = s.id; });

  let updated = 0;
  let skipped = 0;

  for (const c of conexiones) {
    const updates = {};
    let changed = false;

    // Extract sucursal from name (e.g. "SERVICIO - ALBERTS" → name="SERVICIO", sucursal=ALBERTS)
    const nameMatch = c.nombre.match(/^(.+?)\s*-\s*(.+)$/);
    if (nameMatch) {
      const cleanName = nameMatch[1].trim();
      const sucName = nameMatch[2].trim().toUpperCase();
      const sucId = sucMap[sucName];

      if (sucId && !c.sucursal_id) {
        updates.sucursal_id = sucId;
        changed = true;
      }
      // Clean the name
      updates.nombre = cleanName;
      changed = true;
    }

    // Also try to extract from notas if no sucursal set
    if (!updates.sucursal_id && !c.sucursal_id && c.notas) {
      const notaMatch = c.notas.match(/Sucursal:\s*([^|]+)/);
      if (notaMatch) {
        const sucName = notaMatch[1].trim().toUpperCase();
        const sucId = sucMap[sucName];
        if (sucId) {
          updates.sucursal_id = sucId;
          changed = true;
        }
      }
    }

    if (changed) {
      const { error } = await supabase.from('conexiones_remotas')
        .update(updates)
        .eq('id', c.id);
      if (error) {
        console.error(`   ❌ ${c.nombre}: ${error.message}`);
      } else {
        const newName = updates.nombre || c.nombre;
        const sucId = updates.sucursal_id || c.sucursal_id;
        const sucName = sucursales.find(s => s.id === sucId)?.nombre || '?';
        console.log(`   ✅ "${c.nombre}" → "${newName}" | Sucursal: ${sucName}`);
        updated++;
      }
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   ✅ Actualizadas: ${updated}`);
  console.log(`   ⏭️  Sin cambios: ${skipped}`);
  console.log(`   📊 Total: ${conexiones.length}`);
}

cleanConexiones().catch(err => {
  console.error('💥 Error:', err.message);
  process.exit(1);
});
