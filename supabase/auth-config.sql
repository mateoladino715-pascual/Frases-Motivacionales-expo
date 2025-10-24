-- Configuración adicional para desarrollo
-- Ejecutar estos comandos en el SQL Editor de Supabase si necesitas deshabilitar confirmación de email

-- 1. Deshabilitar confirmación de email (solo para desarrollo)
-- Ve a Authentication > Settings en el dashboard de Supabase
-- Desactiva "Enable email confirmations"

-- 2. Si quieres mantener confirmación de email, puedes usar este SQL:
-- (No es necesario ejecutar si ya deshabilitaste la confirmación)

-- Crear función para manejar usuarios no confirmados
CREATE OR REPLACE FUNCTION public.handle_unconfirmed_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el usuario no está confirmado, crear perfil temporal
  IF NEW.email_confirmed_at IS NULL THEN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para usuarios no confirmados
DROP TRIGGER IF EXISTS on_auth_user_unconfirmed ON auth.users;
CREATE TRIGGER on_auth_user_unconfirmed
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_unconfirmed_user();

-- 3. Verificar que las políticas RLS permitan acceso a usuarios no confirmados
-- (Las políticas actuales ya están bien configuradas)

-- 4. Para desarrollo local, también puedes usar:
-- Supabase CLI: supabase auth users create --email test@example.com --password password123
