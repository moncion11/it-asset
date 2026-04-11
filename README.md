# IT Asset Manager Pro

Sistema de gestión de activos IT con Node.js, Supabase y Vercel.

## Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com)

## Setup

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. Abre el **SQL Editor** y ejecuta el contenido de `supabase-schema.sql`
3. Copia la **URL** y la **anon key** del proyecto (Settings > API)

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Seed de datos (opcional)

```bash
npm install dotenv --save-dev
npm run seed
```

### 5. Desarrollo local

```bash
npx vercel dev
```

La app estará en `http://localhost:3000`

## Deploy a Vercel

### Opción A: Desde CLI

```bash
npx vercel
```

### Opción B: Desde GitHub

1. Sube el repo a GitHub
2. Importa el proyecto en [vercel.com/new](https://vercel.com/new)
3. Agrega las variables de entorno en Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Deploy automático

## Estructura

```
├── api/
│   ├── dashboard.js          # GET /api/dashboard
│   ├── usuarios/
│   │   ├── index.js           # GET/POST /api/usuarios
│   │   └── [id].js            # GET/PUT/DELETE /api/usuarios/:id
│   ├── equipos/
│   │   ├── index.js           # GET/POST /api/equipos
│   │   └── [id].js            # GET/PUT/DELETE /api/equipos/:id
│   └── sucursales/
│       ├── index.js           # GET/POST /api/sucursales
│       └── [id].js            # GET/PUT/DELETE /api/sucursales/:id
├── lib/
│   └── supabase.js            # Cliente Supabase
├── public/
│   └── index.html             # Frontend SPA
├── scripts/
│   └── seed.js                # Script de datos iniciales
├── supabase-schema.sql        # Schema de la base de datos
├── vercel.json                # Configuración de Vercel
└── package.json
```

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/dashboard` | Stats + todos los datos |
| GET | `/api/usuarios` | Listar usuarios |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |
| GET | `/api/equipos` | Listar equipos |
| POST | `/api/equipos` | Crear equipo |
| PUT | `/api/equipos/:id` | Actualizar equipo |
| DELETE | `/api/equipos/:id` | Eliminar equipo |
| GET | `/api/sucursales` | Listar sucursales |
| POST | `/api/sucursales` | Crear sucursal |
| PUT | `/api/sucursales/:id` | Actualizar sucursal |
| DELETE | `/api/sucursales/:id` | Eliminar sucursal |
