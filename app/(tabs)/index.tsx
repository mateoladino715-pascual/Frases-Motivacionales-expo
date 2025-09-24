import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Share2, RefreshCw } from 'lucide-react-native';
import { quotesData } from '@/data/quotes';
import { QuoteCard } from '@/components/QuoteCard';
import { DateHeader } from '@/components/DateHeader';
import { AuthModal } from '@/components/AuthModal';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentQuote, setCurrentQuote] = useState(quotesData[0]);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const quoteIndex = dayOfYear % quotesData.length;
    setCurrentQuote(quotesData[quoteIndex]);
  }, []);

  const handleRefresh = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const randomIndex = Math.floor(Math.random() * quotesData.length);
    setCurrentQuote(quotesData[randomIndex]);
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const wasAdded = await toggleFavorite(currentQuote);
      Alert.alert(
        wasAdded ? 'Agregado a favoritos' : 'Eliminado de favoritos',
        wasAdded 
          ? 'La frase se guardó en tus favoritos' 
          : 'La frase se eliminó de tus favoritos'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la frase');
    }
  };

  const handleAuthSuccess = () => {
    Alert.alert('¡Bienvenido!', 'Ahora puedes guardar tus frases favoritas');
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <DateHeader />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <QuoteCard 
          quote={currentQuote}
          isFavorite={isFavorite(currentQuote.text)}
          onToggleFavorite={handleToggleFavorite}
        />
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleToggleFavorite}
          >
            <Heart 
              size={24} 
              color={isFavorite(currentQuote.text) ? '#EF4444' : '#FFFFFF'} 
              fill={isFavorite(currentQuote.text) ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRefresh}
          >
            <RefreshCw size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});