# Frases Motivacionales - App React Native

Una aplicación móvil desarrollada con React Native y Expo que proporciona frases motivacionales diarias en español, con sistema de autenticación y gestión de favoritos.

## 🚀 Características

- **Frases Motivacionales**: Obtiene frases inspiradoras desde APIs externas
- **Traducción Automática**: Traduce frases de inglés a español automáticamente
- **Sistema de Autenticación**: Login y registro con Supabase
- **Favoritos**: Guarda tus frases favoritas en la nube
- **Perfil de Usuario**: Gestiona tu información personal
- **Interfaz Moderna**: Diseño atractivo con gradientes y animaciones

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework para desarrollo móvil
- **Expo** - Plataforma de desarrollo React Native
- **TypeScript** - Tipado estático para JavaScript
- **Supabase** - Backend-as-a-Service (autenticación y base de datos)
- **Expo Router** - Navegación basada en archivos
- **Lucide React Native** - Iconos modernos
- **Expo Linear Gradient** - Gradientes para la UI

## 📱 Pantallas

### 🏠 Inicio
- Muestra una frase motivacional diaria
- Botón para refrescar y obtener nueva frase
- Opción para guardar en favoritos
- Botón para compartir (funcionalidad futura)

### ❤️ Favoritos
- Lista de frases guardadas como favoritas
- Opción para eliminar favoritos
- Requiere autenticación para acceder

### 👤 Perfil
- Información del usuario autenticado
- Edición de nombre y email
- Botón para cerrar sesión
- Requiere autenticación para acceder

## 🔧 Configuración del Proyecto

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Supabase

### Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Frases-Motivacionales-expo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

Editar el archivo `.env` con tus credenciales de Supabase:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
EXPO_PUBLIC_APP_NAME=Frases Motivacionales
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_QUOTES_API_URL=https://api.quotable.io
EXPO_PUBLIC_BACKUP_API_URL=https://zenquotes.io/api
```

4. **Configurar Supabase**
   - Crear un proyecto en [Supabase](https://supabase.com)
   - Ejecutar el script SQL en `supabase/schema.sql`
   - Configurar autenticación según `supabase/auth-config.sql`

5. **Ejecutar la aplicación**
```bash
npm start
```

## 🗄️ Base de Datos

### Tablas Principales

#### `profiles`
- `id` (UUID) - Referencia a auth.users
- `email` (TEXT) - Email del usuario
- `name` (TEXT) - Nombre del usuario
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `favorite_quotes`
- `id` (UUID) - ID único de la frase favorita
- `user_id` (UUID) - Referencia al usuario
- `quote_text` (TEXT) - Texto de la frase
- `quote_author` (TEXT) - Autor de la frase
- `quote_category` (TEXT) - Categoría de la frase
- `created_at` (TIMESTAMP)

### Políticas de Seguridad (RLS)
- Los usuarios solo pueden ver y modificar sus propios datos
- Las frases favoritas están protegidas por usuario
- Lectura pública de frases generales

## 🌐 APIs Externas

### APIs de Frases
- **Principal**: `quotable.io` - Frases motivacionales en inglés
- **Respaldo**: `zenquotes.io` - API alternativa de frases
- **Traducción**: `MyMemory API` - Traducción automática a español

### Flujo de Datos
1. Obtiene frase en inglés desde API principal
2. Traduce automáticamente al español
3. Categoriza la frase según su contenido
4. Muestra la frase traducida al usuario

## 🔐 Autenticación

### Características
- Registro de nuevos usuarios
- Login con email y contraseña
- Gestión de sesiones con Supabase Auth
- Logout completo (local y remoto)
- Perfiles de usuario automáticos

### Configuración
- Email confirmation deshabilitada para desarrollo
- Row Level Security habilitada
- Triggers automáticos para crear perfiles

## 📁 Estructura del Proyecto

```
Frases-Motivacionales-expo/
├── app/                    # Pantallas con Expo Router
│   ├── (tabs)/           # Navegación por tabs
│   │   ├── index.tsx     # Pantalla de inicio
│   │   ├── favorites.tsx # Pantalla de favoritos
│   │   └── profile.tsx   # Pantalla de perfil
│   └── _layout.tsx       # Layout principal
├── components/           # Componentes reutilizables
│   ├── AuthModal.tsx     # Modal de autenticación
│   ├── QuoteCard.tsx     # Tarjeta de frase
│   └── DateHeader.tsx    # Encabezado con fecha
├── contexts/            # Contextos de React
│   └── AuthContext.tsx  # Contexto de autenticación
├── hooks/               # Hooks personalizados
│   ├── useFavorites.ts  # Hook para favoritos
│   └── useFrameworkReady.ts
├── lib/                 # Configuración y utilidades
│   ├── supabase.ts      # Cliente de Supabase
│   └── config.ts        # Variables de entorno
├── services/            # Servicios externos
│   └── quotesService.ts # Servicio de frases
├── supabase/           # Scripts de base de datos
│   ├── schema.sql      # Esquema de BD
│   └── auth-config.sql # Configuración de auth
└── constants/          # Constantes de la app
    └── Colors.ts       # Paleta de colores
```

## 🎨 Diseño

### Paleta de Colores
- Gradientes principales: `#667eea`, `#764ba2`, `#f093fb`
- Colores de acento: `#EF4444` (rojo), `#10B981` (verde)
- Texto: Blanco sobre gradientes, gris oscuro sobre fondo claro

### Componentes UI
- **QuoteCard**: Tarjeta principal para mostrar frases
- **AuthModal**: Modal para login/registro
- **DateHeader**: Encabezado con fecha actual
- **LinearGradient**: Fondos con gradientes

## 🚀 Despliegue

### Desarrollo
```bash
npm start
```

### Producción
```bash
expo build:android
expo build:ios
```

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en web

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ usando React Native y Expo.

## 🔗 Enlaces Útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de Supabase](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)

---

**¡Disfruta de tus frases motivacionales diarias! 🌟**