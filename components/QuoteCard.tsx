import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface QuoteCardProps {
  quote: {
    text: string;
    author: string;
    category?: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.quoteText}>"{quote.text}"</Text>
      <Text style={styles.author}>— {quote.author}</Text>
      {quote.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{quote.category}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    minHeight: 250,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    width: width - 40,
    position: 'relative',
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 30,
    color: '#1F2937',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    fontWeight: '400',
  },
  author: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'right',
    fontWeight: '600',
  },
  categoryBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});