require('dotenv').config({ path: '.env.local' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

const sql = `
ALTER TABLE credenciales DROP CONSTRAINT IF EXISTS credenciales_categoria_check;
ALTER TABLE credenciales ADD CONSTRAINT credenciales_categoria_check 
CHECK (categoria IN ('Programa','Plataforma','Servidor','Red','Cámaras','Correo','PC','WiFi','Intervenciones','Otro'));
`;

async function run() {
    // Try via RPC first
    const res = await fetch(url + '/rest/v1/rpc/exec_sql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': key,
            'Authorization': 'Bearer ' + key
        },
        body: JSON.stringify({ sql_string: sql })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
}

run().catch(e => console.error(e));
