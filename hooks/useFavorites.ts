import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';

export interface FavoriteQuote {
  id: string;
  text: string;
  author: string;
  category?: string;
  dateAdded: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadFavorites = async () => {
    try {
      if (!user) return;
      
      const storedFavorites = await AsyncStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: FavoriteQuote[]) => {
    try {
      if (!user) return;
      
      await AsyncStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = async (quote: { text: string; author: string; category?: string }) => {
    if (!isAuthenticated || !user) return false;

    const newFavorite: FavoriteQuote = {
      id: Date.now().toString(),
      text: quote.text,
      author: quote.author,
      category: quote.category,
      dateAdded: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, newFavorite];
    await saveFavorites(updatedFavorites);
    return true;
  };

  const removeFavorite = async (quoteText: string) => {
    if (!isAuthenticated) return;

    const updatedFavorites = favorites.filter(fav => fav.text !== quoteText);
    await saveFavorites(updatedFavorites);
  };

  const isFavorite = (quoteText: string): boolean => {
    return favorites.some(fav => fav.text === quoteText);
  };

  const toggleFavorite = async (quote: { text: string; author: string; category?: string }): Promise<boolean> => {
    if (!isAuthenticated) return false;

    if (isFavorite(quote.text)) {
      await removeFavorite(quote.text);
      return false;
    } else {
      await addFavorite(quote);
      return true;
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