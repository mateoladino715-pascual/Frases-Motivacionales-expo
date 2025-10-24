// Configuración de variables de entorno
// Reemplaza estos valores con los de tu proyecto Supabase

export const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://tu-proyecto.supabase.co',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'tu_clave_anonima_aqui',
  },
  app: {
    name: process.env.EXPO_PUBLIC_APP_NAME || 'Frases Motivacionales',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  },
  api: {
    quotesUrl: process.env.EXPO_PUBLIC_QUOTES_API_URL || 'https://api.quotable.io',
    backupUrl: process.env.EXPO_PUBLIC_BACKUP_API_URL || 'https://zenquotes.io/api',
  },
};

// Validar configuración
export const validateConfig = () => {
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Variables de entorno faltantes:', missingVars);
    console.warn('📝 Crea un archivo .env con las variables necesarias');
    return false;
  }

  return true;
};
