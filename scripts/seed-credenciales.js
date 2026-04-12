require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const credenciales = [
    // ==================== HIK-CONNECT / CAMARAS ====================
    { plataforma: 'HIK-CONNECT', categoria: 'Cámaras', usuario_plataforma: 'admin@licormart.com', password_plataforma: 'Licormart174', notas: 'Cámaras de seguridad' },
    { plataforma: 'HIK-CONNECT', categoria: 'Cámaras', usuario_plataforma: 'serviciosgm@licormart.net', password_plataforma: 'LMgmr123', notas: 'Cámaras de seguridad' },
    { plataforma: 'HIK-CONNECT', categoria: 'Cámaras', usuario_plataforma: 'edm_demarchena@hotmail.com', password_plataforma: 'Eedmp119', notas: 'Cámaras de seguridad' },
    { plataforma: 'HIK-CONNECT', categoria: 'Cámaras', usuario_plataforma: 'licormartbavaro@gmail.com', password_plataforma: 'abc12345', notas: 'Cámaras de seguridad' },
    { plataforma: 'HIK-CONNECT', categoria: 'Cámaras', usuario_plataforma: 'soporte@licormart.net', password_plataforma: 'L@tech0695', notas: 'Cámaras de seguridad' },
    { plataforma: 'HIK-CONNECT', categoria: 'Cámaras', usuario_plataforma: 'Nvr kennedy', password_plataforma: 'Licormart@01', notas: 'NVR Kennedy' },
    { plataforma: 'HIK-CONNECT', categoria: 'Cámaras', usuario_plataforma: 'Nvr kennedy codigo', password_plataforma: 'LM2025', notas: 'NVR Kennedy código' },

    // ==================== CORREOS (sección 1 - corporativos) ====================
    { plataforma: 'Correo Corporativo', categoria: 'Correo', usuario_plataforma: 'serviciosjfk@licormart.net', password_plataforma: 'JFK.2025LM', notas: 'Correo JFK' },
    { plataforma: 'Correo Corporativo', categoria: 'Correo', usuario_plataforma: 'serviciosgm@licormart.net', password_plataforma: 'GM.2025LM', notas: 'Correo GM' },
    { plataforma: 'Correo Corporativo', categoria: 'Correo', usuario_plataforma: 'serviciospop@licormart.net', password_plataforma: 'POP.2025LM', notas: 'Correo POP' },
    { plataforma: 'Correo Corporativo', categoria: 'Correo', usuario_plataforma: 'serviciosal@licormart.net', password_plataforma: 'AL.2025LM', notas: 'Correo AL' },
    { plataforma: 'Correo Corporativo', categoria: 'Correo', usuario_plataforma: 'servicioslt@licormart.net', password_plataforma: 'IT2022LM', notas: 'Correo LT' },
    { plataforma: 'Correo Corporativo', categoria: 'Correo', usuario_plataforma: 'serviciospc@licormart.net', password_plataforma: 'pC2022LM', notas: 'Correo PC' },
    { plataforma: 'Correo Corporativo', categoria: 'Correo', usuario_plataforma: 'albertslicores.01@gmail.com', password_plataforma: 'Al@2024.', notas: 'Correo Gmail' },
    { plataforma: 'Correo Corporativo', categoria: 'Correo', usuario_plataforma: 'admin@licormat.net', password_plataforma: 'Licormart174', notas: 'Correo Admin' },

    // ==================== CORREOS (sección 2 - personales) ====================
    { plataforma: 'Correo Personal', categoria: 'Correo', usuario_plataforma: 'Candi', password_plataforma: 'Candybell8930', notas: '' },
    { plataforma: 'Correo Personal', categoria: 'Correo', usuario_plataforma: 'Yocauri', password_plataforma: 'Comienzo1', notas: '' },
    { plataforma: 'Correo Personal', categoria: 'Correo', usuario_plataforma: 'Mirna', password_plataforma: 'MLPM.07*', notas: '' },
    { plataforma: 'Correo Personal', categoria: 'Correo', usuario_plataforma: 'Roschela', password_plataforma: 'LM2025RS$', notas: '' },
    { plataforma: 'Correo Personal', categoria: 'Correo', usuario_plataforma: 'Johanny', password_plataforma: 'LM2023RS$', notas: '' },
    { plataforma: 'Correo Personal', categoria: 'Correo', usuario_plataforma: 'Rosanna', password_plataforma: 'Rb2025LM', notas: '' },
    { plataforma: 'Correo Personal', categoria: 'Correo', usuario_plataforma: 'Patricia', password_plataforma: 'Pb2025LM', notas: '' },

    // ==================== PC ====================
    { plataforma: 'PC - ALBERT SERVICIO', categoria: 'PC', usuario_plataforma: 'ALBERT SERVICIO', password_plataforma: 'AL2024', notas: 'PC tienda' },
    { plataforma: 'PC - GMR/TRN SERV', categoria: 'PC', usuario_plataforma: 'GMR/TRN SERV', password_plataforma: '1234', notas: 'PC tienda' },
    { plataforma: 'PC - KND COT/SERV', categoria: 'PC', usuario_plataforma: 'KND COT/SERV', password_plataforma: 'Licormart01@', notas: 'PC tienda' },
    { plataforma: 'PC - ASISTENTE AL', categoria: 'PC', usuario_plataforma: 'ASISTENTE AL', password_plataforma: 'Licormart174', notas: 'PC tienda' },
    { plataforma: 'PC - SOPORTE', categoria: 'PC', usuario_plataforma: 'SOPORTE', password_plataforma: 'Soporte123', notas: 'PC tienda' },

    // ==================== SYMASOFT ====================
    { plataforma: 'SYMASOFT', categoria: 'Programa', usuario_plataforma: 'SKENNEDY', password_plataforma: 'Knd01', notas: 'Sistema POS' },
    { plataforma: 'SYMASOFT', categoria: 'Programa', usuario_plataforma: 'SPUNTACANA', password_plataforma: 'LM2025LKM', notas: 'Sistema POS' },
    { plataforma: 'SYMASOFT', categoria: 'Programa', usuario_plataforma: 'SGUSTAVO', password_plataforma: 'LM2025LKM', notas: 'Sistema POS' },
    { plataforma: 'SYMASOFT', categoria: 'Programa', usuario_plataforma: 'SALBERT', password_plataforma: 'LM2025LKM', notas: 'Sistema POS' },
    { plataforma: 'SYMASOFT', categoria: 'Programa', usuario_plataforma: 'SPOP', password_plataforma: 'LM2025LKM', notas: 'Sistema POS' },
    { plataforma: 'SYMASOFT', categoria: 'Programa', usuario_plataforma: 'STERRENA', password_plataforma: 'LM2025LKM', notas: 'Sistema POS' },
    { plataforma: 'SYMASOFT DB-SERVER', categoria: 'Programa', usuario_plataforma: 'LICORMARTDC', password_plataforma: 'mb97', url: 'DB-SERVER\\LICORMARTDC', notas: 'Servidor base de datos SYMASOFT' },

    // ==================== DynDNS / ZOHO / SOPHOS ====================
    { plataforma: 'DynDNS/ZOHO/SOPHOS', categoria: 'Plataforma', usuario_plataforma: 'serviciosjfk@licormart.net', password_plataforma: 'IM@2025LKM', notas: '' },
    { plataforma: 'DynDNS/ZOHO/SOPHOS', categoria: 'Plataforma', usuario_plataforma: 'admin@licormart.com', password_plataforma: 'Licormart174', notas: '' },
    { plataforma: 'DynDNS/ZOHO/SOPHOS', categoria: 'Plataforma', usuario_plataforma: 'soporte@licormart.net', password_plataforma: 'Soporte1234', notas: '' },
    { plataforma: 'DynDNS', categoria: 'Plataforma', usuario_plataforma: 'DynDNS', password_plataforma: 'Vence 13-03-2026', notas: 'Vencimiento DNS dinámico' },
    { plataforma: 'ZOHO ICG', categoria: 'Plataforma', usuario_plataforma: 'ZOHO ICG', password_plataforma: 'N8W7wLJ7WMxL', notas: '' },

    // ==================== INTERVENCIONES ====================
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'RUTH', password_plataforma: '20012128', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'PACHECO', password_plataforma: '20012130', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'CRUZ', password_plataforma: '20012131', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'GABRIEL', password_plataforma: '20012133', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'MIGUELINA', password_plataforma: '20012134', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'LAWRENCE', password_plataforma: '20012135', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'AIMEE', password_plataforma: '20012136', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'YAHAIRA', password_plataforma: '20012137', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'ESTAFANNY', password_plataforma: '20012138', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'JHONNY', password_plataforma: '20012139', notas: '' },
    { plataforma: 'Intervenciones', categoria: 'Intervenciones', usuario_plataforma: 'VALENTINA', password_plataforma: '20012140', notas: '' },

    // ==================== ROUTERS ====================
    { plataforma: 'Router GUSTAVO', categoria: 'Red', usuario_plataforma: '48575443D451279F', password_plataforma: '48575443D451279F', notas: 'Tienda: GUSTAVO' },

    // ==================== WIFI ====================
    { plataforma: 'WiFi ALBERT LICORES', categoria: 'WiFi', usuario_plataforma: 'ALBERT LICORES', password_plataforma: 'AL@2025LM', notas: 'Tienda: ALBERT' },
    { plataforma: 'WiFi KENNEDY', categoria: 'WiFi', usuario_plataforma: 'KENNEDY', password_plataforma: 'LMGARTA2020', notas: 'Tienda: KENNEDY' },
    { plataforma: 'WiFi KENNEDY 2', categoria: 'WiFi', usuario_plataforma: 'KENNEDY 2', password_plataforma: '8093620000', notas: 'Tienda: KENNEDY' },
    { plataforma: 'WiFi LICORMART', categoria: 'WiFi', usuario_plataforma: 'LICORMART', password_plataforma: 'LG2020LM', notas: 'Tienda: GUSTAVO' },
    { plataforma: 'WiFi LICORMART GUSTAVO', categoria: 'WiFi', usuario_plataforma: 'LICORMART GUSTAVO 1', password_plataforma: '8093620000', notas: 'Tienda: GUSTAVO' },

    // ==================== REMOTO (como credenciales, no conexiones) ====================
    { plataforma: 'Acceso Remoto', categoria: 'Plataforma', usuario_plataforma: 'cotizacionesal', password_plataforma: 'aL2025LM', notas: 'Acceso remoto' },
    { plataforma: 'Acceso Remoto', categoria: 'Plataforma', usuario_plataforma: 'LICENCIA MNG', password_plataforma: '701037937', notas: 'Licencia MNG' },
];

(async () => {
    console.log(`\n📋 Importando ${credenciales.length} credenciales...\n`);

    let ok = 0, fail = 0;
    for (const cred of credenciales) {
        const { data, error } = await supabase.from('credenciales').insert([cred]).select().single();
        if (error) {
            console.log(`❌ Error: ${cred.plataforma} / ${cred.usuario_plataforma}: ${error.message}`);
            fail++;
        } else {
            console.log(`✅ ${cred.categoria} → ${cred.plataforma} / ${cred.usuario_plataforma}`);
            ok++;
        }
    }

    console.log(`\n🏁 Resultado: ${ok} importados, ${fail} errores de ${credenciales.length} total\n`);
    process.exit(0);
})();
