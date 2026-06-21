# Catálogo de Cuadros y Obras de Arte

Este proyecto es una plataforma independiente para mostrar y administrar un catálogo de obras de arte, cuadros y productos decorativos. Está preparado para funcionar en la nube usando Supabase y Vercel, manteniendo un modo de fallback local para desarrollo.

## Tecnologías Utilizadas
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Zustand (Estado global)
- Supabase (Autenticación, Base de datos y Almacenamiento)
- React Router DOM
- Lucide React (Íconos)

## Despliegue en la Nube (Producción)

### 1. Crear proyecto Supabase
1. Ingresa a [Supabase](https://supabase.com) y crea un nuevo proyecto.
2. Ve a la sección **Project Settings -> API** para copiar dos datos:
   - **Project URL**
   - **Project API Key (anon/public)**

### 2. Configurar Variables de Entorno
Crea un archivo llamado `.env.local` en la carpeta raíz del proyecto (basado en `.env.example`) y completa los datos:
```env
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
VITE_ADMIN_EMAIL=tu-email-para-admin@ejemplo.com
```

### 3. Configurar la Base de Datos
1. En el panel de Supabase, ve al **SQL Editor**.
2. Copia y pega el contenido del archivo `supabase/schema.sql` y ejecútalo.
3. Copia y pega el contenido del archivo `supabase/seed.sql` y ejecútalo (opcional, carga datos demo).

### 4. Configurar Almacenamiento (Imágenes)
1. Ve a **Storage** en Supabase.
2. Crea un nuevo **Bucket** llamado `catalog-images`.
3. Asegúrate de marcarlo como **Público** ("Public bucket").

### 5. Crear Usuario Administrador
1. Ve a **Authentication** -> **Users** en Supabase.
2. Agrega un usuario nuevo ("Add user").
3. Utiliza exactamente el mismo email que pusiste en `VITE_ADMIN_EMAIL`.
4. Define una contraseña segura.

### 6. Desplegar en Vercel
1. Sube tu código a un repositorio de GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. En la configuración de Vercel, agrega las mismas tres variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
4. ¡Despliega! 

### Rutas Finales
- **Catálogo Público:** `https://tu-proyecto.vercel.app/`
- **Administrador:** `https://tu-proyecto.vercel.app/admin`
*(Nota: No existe ningún link al administrador desde la página pública por seguridad).*

---

## Ejecución Local (Desarrollo)

Si descargas el proyecto y quieres probarlo en tu computadora:

```bash
cd C:\Users\Nicolás\Desktop\cuadros
npm install
npm run dev
```

La app iniciará en `http://localhost:5173/`. 
Si no agregas el archivo `.env.local`, el proyecto funcionará automáticamente en **Modo Local** (guardando datos en localStorage y permitiendo acceso al panel con la contraseña temporal `admin123`).
