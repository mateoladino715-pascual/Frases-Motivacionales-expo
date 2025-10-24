import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface FavoriteQuote {
  id: string;
  quote_text: string;
  quote_author: string;
  quote_category?: string;
  created_at: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadFavorites = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('favorite_quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading favorites:', error);
        return;
      }

      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (quote: { text: string; author: string; category?: string }) => {
    if (!isAuthenticated || !user) return false;

    try {
      const { data, error } = await supabase
        .from('favorite_quotes')
        .insert({
          user_id: user.id,
          quote_text: quote.text,
          quote_author: quote.author,
          quote_category: quote.category || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding favorite:', error);
        return false;
      }

      setFavorites(prev => [data, ...prev]);
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  };

  const removeFavorite = async (quoteId: string) => {
    if (!isAuthenticated) return;

    try {
      const { error } = await supabase
        .from('favorite_quotes')
        .delete()
        .eq('id', quoteId);

      if (error) {
        console.error('Error removing favorite:', error);
        return;
      }

      setFavorites(prev => prev.filter(fav => fav.id !== quoteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const isFavorite = (quoteText: string): boolean => {
    return favorites.some(fav => fav.quote_text === quoteText);
  };

  const toggleFavorite = async (quote: { text: string; author: string; category?: string }): Promise<boolean> => {
    if (!isAuthenticated) return false;

    const existingFavorite = favorites.find(fav => fav.quote_text === quote.text);
    
    if (existingFavorite) {
      await removeFavorite(existingFavorite.id);
      return false;
    } else {
      return await addFavorite(quote);
    }
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    isAuthenticated,
  };
}