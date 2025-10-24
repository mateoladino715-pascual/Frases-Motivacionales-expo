import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configuración para React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tipos de TypeScript para la base de datos
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorite_quotes: {
        Row: {
          id: string;
          user_id: string;
          quote_text: string;
          quote_author: string;
          quote_category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quote_text: string;
          quote_author: string;
          quote_category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quote_text?: string;
          quote_author?: string;
          quote_category?: string | null;
          created_at?: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          text: string;
          author: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          author: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          author?: string;
          category?: string;
          created_at?: string;
        };
      };
    };
  };
}
