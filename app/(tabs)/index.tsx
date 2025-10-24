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
import { QuoteCard } from '@/components/QuoteCard';
import { DateHeader } from '@/components/DateHeader';
import { AuthModal } from '@/components/AuthModal';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { quotesService, Quote } from '@/services/quotesService';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadQuoteOfTheDay();
  }, []);

  const loadQuoteOfTheDay = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting to load quote from API...');
      
      // Crear un timeout general de 15 segundos para toda la operación
      const timeoutPromise = new Promise<Quote>((_, reject) => {
        setTimeout(() => reject(new Error('Overall timeout')), 15000);
      });
      
      const loadPromise = async (): Promise<Quote> => {
        // Intentar primero con la API principal
        try {
          const quote = await quotesService.getRandomQuote();
          console.log('✅ Quote loaded successfully:', quote);
          return quote;
        } catch (error) {
          console.log('⚠️ Primary API failed, trying backup...');
          
          // Si falla, intentar con la API de respaldo
          const backupQuote = await quotesService.getRandomQuoteBackup();
          console.log('✅ Backup quote loaded:', backupQuote);
          return backupQuote;
        }
      };
      
      // Usar Promise.race para tener un timeout general
      const quote = await Promise.race([loadPromise(), timeoutPromise]);
      setCurrentQuote(quote);
      
    } catch (error) {
      console.error('❌ Error loading quote:', error);
      
      // Si ambas APIs fallan o hay timeout, usar frase de respaldo
      const fallbackQuote: Quote = {
        text: "La forma de empezar es dejar de hablar y comenzar a hacer.",
        author: "Walt Disney",
        category: "Motivación"
      };
      
      console.log('🔄 Using fallback quote:', fallbackQuote);
      setCurrentQuote(fallbackQuote);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
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

    try {
      console.log('🔄 Refreshing quote from API...');
      
      // Crear un timeout de 12 segundos para refresh
      const timeoutPromise = new Promise<Quote>((_, reject) => {
        setTimeout(() => reject(new Error('Refresh timeout')), 12000);
      });
      
      const refreshPromise = async (): Promise<Quote> => {
        // Intentar primero con la API principal
        try {
          const quote = await quotesService.getRandomQuote();
          console.log('✅ Quote refreshed successfully:', quote);
          return quote;
        } catch (error) {
          console.log('⚠️ Primary API failed, trying backup...');
          
          // Si falla, intentar con la API de respaldo
          const backupQuote = await quotesService.getRandomQuoteBackup();
          console.log('✅ Backup quote refreshed:', backupQuote);
          return backupQuote;
        }
      };
      
      // Usar Promise.race para tener un timeout
      const quote = await Promise.race([refreshPromise(), timeoutPromise]);
      setCurrentQuote(quote);
      
    } catch (error) {
      console.error('❌ Error refreshing quote:', error);
      
      // Si ambas APIs fallan o hay timeout, usar frase de respaldo
      const fallbackQuote: Quote = {
        text: "No tengas miedo de renunciar a lo bueno para ir por lo grandioso.",
        author: "John D. Rockefeller",
        category: "Éxito"
      };
      
      console.log('🔄 Using fallback quote:', fallbackQuote);
      setCurrentQuote(fallbackQuote);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!currentQuote) return;

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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando frase...</Text>
          </View>
        ) : currentQuote ? (
          <>
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
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Sin conexión a internet</Text>
            <Text style={styles.errorSubtext}>
              No se pudo conectar con las APIs de frases motivacionales
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadQuoteOfTheDay}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
      retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      },
    });