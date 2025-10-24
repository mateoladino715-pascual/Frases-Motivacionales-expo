# 🚀 Configuración de Supabase para Frases Motivacionales

## 📋 Pasos para configurar Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota tu **URL** y **API Key** (anon/public)

### 2. Configurar la base de datos

Ejecuta el siguiente SQL en el **SQL Editor** de Supabase:

```sql
-- Copia y pega todo el contenido del archivo supabase/schema.sql
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copia el contenido de env.example
cp env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Configurar autenticación en Supabase

En el dashboard de Supabase:

1. Ve a **Authentication** > **Settings**
2. Configura las **Site URL** y **Redirect URLs**
3. Habilita los proveedores que necesites (Email/Password)

### 6. Configurar políticas RLS

Las políticas ya están incluidas en el schema.sql, pero puedes verificarlas en:
- **Authentication** > **Policies**

## 🔧 Funcionalidades implementadas

### ✅ Autenticación
- Login/Registro con email y contraseña
- Gestión de perfiles de usuario
- Sesiones persistentes
- Logout seguro

### ✅ Frases Motivacionales
- API externa (quotable.io) para frases frescas
- Frase del día automática
- Frases aleatorias
- Sistema de respaldo con frases locales
- Categorización automática

### ✅ Sistema de Favoritos
- Guardar frases favoritas por usuario
- Sincronización en tiempo real
- Eliminación de favoritos
- Persistencia en base de datos

### ✅ Base de Datos
- Tabla `profiles` para datos de usuario
- Tabla `favorite_quotes` para favoritos
- Tabla `quotes` para gestión centralizada
- Row Level Security (RLS) habilitado
- Triggers automáticos

## 🚀 Ejecutar la aplicación

```bash
# Desarrollo
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🔍 Verificar configuración

La aplicación validará automáticamente la configuración al iniciar. Si hay problemas:

1. Verifica que las variables de entorno estén correctas
2. Confirma que el schema SQL se ejecutó correctamente
3. Revisa los logs de la consola para errores específicos

## 📱 APIs utilizadas

- **Quotable.io**: API principal para frases motivacionales
- **Zenquotes.io**: API de respaldo
- **Supabase**: Backend completo (Auth + Database)

## 🛠️ Desarrollo

### Estructura de archivos nuevos:
```
lib/
├── supabase.ts          # Cliente Supabase
└── config.ts            # Configuración

services/
└── quotesService.ts     # Servicio de frases

supabase/
└── schema.sql           # Esquema de base de datos
```

### Migración completada:
- ✅ AuthContext migrado a Supabase Auth
- ✅ useFavorites migrado a Supabase Database
- ✅ Pantalla principal con API de frases
- ✅ Sistema de favoritos actualizado
- ✅ Manejo de errores mejorado

## 🎯 Próximos pasos

1. **Notificaciones push** con Supabase Edge Functions
2. **Analytics** con Supabase Analytics
3. **Real-time updates** para favoritos
4. **Modo offline** con sincronización
5. **Compartir frases** con React Native Share

## 🆘 Solución de problemas

### Error: "Invalid API key"
- Verifica que `EXPO_PUBLIC_SUPABASE_ANON_KEY` sea correcta
- Confirma que la clave sea la "anon/public" key

### Error: "Failed to fetch"
- Verifica que `EXPO_PUBLIC_SUPABASE_URL` sea correcta
- Confirma que el proyecto esté activo en Supabase

### Error: "Table doesn't exist"
- Ejecuta el schema.sql completo en Supabase
- Verifica que las tablas se crearon correctamente

### Error: "RLS policy violation"
- Confirma que las políticas RLS estén habilitadas
- Verifica que el usuario esté autenticado correctamente
