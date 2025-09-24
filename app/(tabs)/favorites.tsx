import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Trash2, LogIn, User } from 'lucide-react-native';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { favorites, removeFavorite, isAuthenticated } = useFavorites();
  const { user } = useAuth();

  const handleRemoveFavorite = async (quoteText: string) => {
    Alert.alert(
      'Eliminar favorito',
      '¿Estás seguro de que quieres eliminar esta frase de tus favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => removeFavorite(quoteText)
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        {isAuthenticated ? (
          <>
            <Text style={styles.headerTitle}>Mis Favoritos</Text>
            <Text style={styles.headerSubtitle}>
              Hola, {user?.name} • {favorites.length} frases guardadas
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.headerTitle}>Favoritos</Text>
            <Text style={styles.headerSubtitle}>
              Inicia sesión para guardar tus frases favoritas
            </Text>
          </>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!isAuthenticated ? (
          <View style={styles.emptyState}>
            <LogIn size={48} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.emptyText}>
              Inicia sesión para acceder a tus favoritos
            </Text>
            <Text style={styles.emptySubtext}>
              Guarda las frases que más te inspiren y accede a ellas cuando quieras
            </Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => setShowAuthModal(true)}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        ) : favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={48} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.emptyText}>
              Aún no tienes frases favoritas
            </Text>
            <Text style={styles.emptySubtext}>
              Toca el corazón en cualquier frase para guardarla aquí
            </Text>
          </View>
        ) : (
          favorites.map((favorite, index) => (
            <View key={favorite.id} style={styles.favoriteCard}>
              <Text style={styles.favoriteText}>{favorite.text}</Text>
              <Text style={styles.favoriteAuthor}>— {favorite.author}</Text>
              
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveFavorite(favorite.text)}
              >
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      
      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {}}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  favoriteText: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  favoriteAuthor: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    fontWeight: '500',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
});