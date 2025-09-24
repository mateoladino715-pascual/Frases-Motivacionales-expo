# 📱 Frases Motivacionales

Una aplicación móvil desarrollada con React Native y Expo que proporciona frases motivacionales diarias para inspirar a los usuarios.

## ✨ Características

- 🌅 **Frase del día**: Una nueva frase motivacional cada día
- ❤️ **Favoritos**: Guarda tus frases favoritas (requiere autenticación)
- 👤 **Perfil de usuario**: Gestiona tu información personal
- 🔐 **Autenticación**: Sistema de login/registro seguro
- 📱 **Responsive**: Funciona en web, iOS y Android
- 🎨 **Diseño moderno**: Interfaz elegante con gradientes y animaciones

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Expo Router** - Navegación
- **AsyncStorage** - Almacenamiento local
- **Lucide React Native** - Iconos
- **Expo Linear Gradient** - Gradientes

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** o **yarn**
- **Git**

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/frases-motivacionales.git
cd frases-motivacionales
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar Expo CLI (si no lo tienes)

```bash
npm install -g @expo/cli
```

## 🏃‍♂️ Ejecutar la Aplicación

### Desarrollo Web
```bash
npm start
# o
npm run dev
```

### iOS (requiere macOS y Xcode)
```bash
npm run ios
```

### Android (requiere Android Studio)
```bash
npm run android
```

### Usando Expo Go (Recomendado para desarrollo)
1. Instala **Expo Go** en tu dispositivo móvil:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Ejecuta el proyecto:
```bash
npm start
```

3. Escanea el código QR con la app Expo Go

## 📁 Estructura del Proyecto

```
frases-motivacionales/
├── app/                    # Pantallas de la aplicación
│   ├── (tabs)/            # Navegación por pestañas
│   │   ├── index.tsx      # Pantalla principal (Hoy)
│   │   ├── favorites.tsx  # Pantalla de favoritos
│   │   ├── profile.tsx    # Pantalla de perfil
│   │   └── _layout.tsx    # Layout de pestañas
│   ├── _layout.tsx        # Layout principal
│   └── +not-found.tsx     # Pantalla 404
├── components/            # Componentes reutilizables
│   ├── AuthModal.tsx      # Modal de autenticación
│   ├── QuoteCard.tsx      # Tarjeta de frase
│   └── DateHeader.tsx     # Header con fecha
├── contexts/              # Contextos de React
│   └── AuthContext.tsx    # Contexto de autenticación
├── hooks/                 # Hooks personalizados
│   ├── useFrameworkReady.ts
│   └── useFavorites.ts    # Hook para favoritos
├── data/                  # Datos estáticos
│   └── quotes.ts          # Base de datos de frases
└── assets/               # Recursos estáticos
    └── images/
```

## 🔧 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start
npm run dev

# Construir para web
npm run build:web

# Linter
npm run lint

# Limpiar caché
npx expo start --clear
```

## 🎯 Funcionalidades Principales

### 🌅 Pantalla Principal (Hoy)
- Muestra una frase motivacional basada en el día del año
- Botón para generar frases aleatorias
- Opción para guardar en favoritos (requiere login)
- Header con fecha actual y saludo personalizado

### ❤️ Favoritos
- Lista de frases guardadas por el usuario
- Funcionalidad para eliminar favoritos
- Requiere autenticación para acceder
- Botón de cerrar sesión

### 👤 Perfil
- Edición de información personal (nombre y email)
- Validación de formularios
- Gestión de sesión de usuario
- Interfaz intuitiva para actualizar datos

### 🔐 Autenticación
- Sistema de registro e inicio de sesión
- Validación de campos
- Almacenamiento seguro local
- Modal elegante con diseño consistente

## 🗃️ Gestión de Datos

La aplicación utiliza **AsyncStorage** para:
- Información del usuario autenticado
- Frases favoritas por usuario
- Persistencia entre sesiones

### Estructura de datos:
```typescript
// Usuario
interface User {
  id: string;
  email: string;
  name: string;
}

// Frase favorita
interface FavoriteQuote {
  id: string;
  text: string;
  author: string;
  category?: string;
  dateAdded: string;
}
```

## 🎨 Personalización

### Agregar nuevas frases
Edita el archivo `data/quotes.ts`:

```typescript
export const quotesData: Quote[] = [
  {
    text: "Tu nueva frase motivacional",
    author: "Autor",
    category: "Categoría"
  },
  // ... más frases
];
```

### Modificar colores y estilos
Los gradientes y colores principales se pueden modificar en cada componente. Busca las propiedades `colors` en los componentes `LinearGradient`.

## 🐛 Solución de Problemas

### Error: "Metro bundler crashed"
```bash
npx expo start --clear
```

### Error: "Unable to resolve module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Expo CLI not found"
```bash
npm install -g @expo/cli
```

### Problemas con TypeScript
```bash
npx tsc --noEmit
```

## 📱 Compilación para Producción

### Web
```bash
npm run build:web
```

### Aplicación nativa (requiere Expo Application Services)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar proyecto
eas build:configure

# Compilar para iOS
eas build --platform ios

# Compilar para Android
eas build --platform android
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseño UI/UX**: [Nombre del diseñador]

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de [Solución de Problemas](#-solución-de-problemas)
2. Busca en los [Issues existentes](https://github.com/tu-usuario/frases-motivacionales/issues)
3. Crea un nuevo issue si no encuentras solución

## 🔄 Changelog

### v1.0.0 (2024-01-XX)
- ✅ Implementación inicial
- ✅ Sistema de autenticación
- ✅ Gestión de favoritos
- ✅ Perfil de usuario
- ✅ Interfaz responsive
- ✅ Base de datos de frases

---

**¡Gracias por usar Frases Motivacionales! 🌟**
