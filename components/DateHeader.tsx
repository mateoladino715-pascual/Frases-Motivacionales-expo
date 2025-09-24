import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export function DateHeader() {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const formattedDate = today.toLocaleDateString('es-ES', options);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Buenos días</Text>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.subtitle}>Tu inspiración diaria te espera</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },
});