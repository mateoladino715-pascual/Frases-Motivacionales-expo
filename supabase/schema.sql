-- Esquema de base de datos para Frases Motivacionales
-- Ejecutar estos comandos en el SQL Editor de Supabase

-- 1. Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de frases favoritas
CREATE TABLE IF NOT EXISTS public.favorite_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quote_text TEXT NOT NULL,
  quote_author TEXT NOT NULL,
  quote_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de frases (opcional, para gestión centralizada)
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Habilitar Row Level Security en nuestras tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Row Level Security para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Políticas de Row Level Security para favorite_quotes
CREATE POLICY "Users can view own favorites" ON public.favorite_quotes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorite_quotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites" ON public.favorite_quotes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorite_quotes
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Políticas de Row Level Security para quotes (lectura pública)
CREATE POLICY "Anyone can view quotes" ON public.quotes
  FOR SELECT USING (true);

-- 8. Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Triggers para updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 12. Insertar algunas frases de ejemplo (opcional)
INSERT INTO public.quotes (text, author, category) VALUES
('El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.', 'Albert Schweitzer', 'Éxito'),
('La única forma de hacer un gran trabajo es amar lo que haces.', 'Steve Jobs', 'Motivación'),
('No esperes por el momento perfecto, toma el momento y hazlo perfecto.', 'Zoey Sayward', 'Motivación'),
('El fracaso es simplemente la oportunidad de empezar de nuevo, pero de forma más inteligente.', 'Henry Ford', 'Perseverancia'),
('Tu actitud, no tu aptitud, determinará tu altitud.', 'Zig Ziglar', 'Motivación')
ON CONFLICT DO NOTHING;

-- 13. Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_favorite_quotes_user_id ON public.favorite_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_quotes_created_at ON public.favorite_quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_category ON public.quotes(category);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
