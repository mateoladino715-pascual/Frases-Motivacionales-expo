// Servicio para obtener frases motivacionales de APIs externas
export interface Quote {
  text: string;
  author: string;
  category: string;
}

// API de frases motivacionales gratuitas
class QuotesService {
  private baseUrl = 'https://api.quotable.io';

  // Traducir texto a español usando una API gratuita
  private async translateToSpanish(text: string): Promise<string> {
    try {
      console.log('🔄 Translating to Spanish:', text);
      
      // Usar MyMemory API (gratuita)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.responseStatus === 200 && data.responseData) {
          console.log('✅ Translation successful:', data.responseData.translatedText);
          return data.responseData.translatedText;
        }
      }
      
      // Si la traducción falla, devolver el texto original
      console.log('⚠️ Translation failed, using original text');
      return text;
      
    } catch (error) {
      console.log('❌ Translation error:', error);
      return text; // Devolver texto original si falla la traducción
    }
  }

  // Obtener frase aleatoria en inglés (método principal)
  async getRandomQuote(): Promise<Quote> {
    try {
      console.log('🌐 Fetching quote from API:', `${this.baseUrl}/random`);
      
      // Crear un timeout de 10 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${this.baseUrl}/random`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ API Response:', data);
      
      // Traducir al español
      const translatedText = await this.translateToSpanish(data.content);
      
      return {
        text: translatedText,
        author: data.author,
        category: this.categorizeQuote(translatedText),
      };
    } catch (error) {
      console.error('❌ Error fetching random quote:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('⏰ Request timed out, using fallback');
      }
      return this.getFallbackQuote();
    }
  }

  // Obtener frase del día (usa el mismo método que random)
  async getQuoteOfTheDay(): Promise<Quote> {
    return this.getRandomQuote();
  }

  // Obtener múltiples frases
  async getMultipleQuotes(count: number = 5): Promise<Quote[]> {
    try {
      const promises = Array.from({ length: count }, () => this.getRandomQuote());
      const quotes = await Promise.all(promises);
      return quotes;
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      return [this.getFallbackQuote()];
    }
  }

  // Categorizar frase basada en palabras clave
  private categorizeQuote(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('success') || lowerText.includes('achieve') || lowerText.includes('win')) {
      return 'Success';
    }
    if (lowerText.includes('motivation') || lowerText.includes('inspire') || lowerText.includes('motivate')) {
      return 'Motivation';
    }
    if (lowerText.includes('perseverance') || lowerText.includes('persist') || lowerText.includes('continue')) {
      return 'Perseverance';
    }
    if (lowerText.includes('dream') || lowerText.includes('goal') || lowerText.includes('future')) {
      return 'Dreams';
    }
    if (lowerText.includes('wisdom') || lowerText.includes('knowledge') || lowerText.includes('learn')) {
      return 'Wisdom';
    }
    
    return 'Motivation'; // Categoría por defecto
  }

  // Frase de respaldo en caso de error
  private getFallbackQuote(): Quote {
    const fallbackQuotes = [
      {
        text: "La forma de empezar es dejar de hablar y comenzar a hacer.",
        author: "Walt Disney",
        category: "Motivación"
      },
      {
        text: "No tengas miedo de renunciar a lo bueno para ir por lo grandioso.",
        author: "John D. Rockefeller",
        category: "Éxito"
      },
      {
        text: "La innovación distingue entre un líder y un seguidor.",
        author: "Steve Jobs",
        category: "Motivación"
      },
      {
        text: "El futuro pertenece a quienes creen en la belleza de sus sueños.",
        author: "Eleanor Roosevelt",
        category: "Sueños"
      },
      {
        text: "El éxito no es definitivo, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
        author: "Winston Churchill",
        category: "Perseverancia"
      }
    ];
    
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

  // Verificar conectividad
  async checkConnectivity(): Promise<boolean> {
    try {
      console.log('🔍 Checking API connectivity...');
      const response = await fetch(`${this.baseUrl}/random`, {
        method: 'HEAD',
      });
      const isConnected = response.ok;
      console.log('📡 Connectivity check result:', isConnected);
      return isConnected;
    } catch (error) {
      console.error('❌ Connectivity check failed:', error);
      return false;
    }
  }

  // Método alternativo con API de respaldo
  async getRandomQuoteBackup(): Promise<Quote> {
    try {
      console.log('🔄 Trying backup API...');
      
      // Crear un timeout de 8 segundos para la API de respaldo
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      // Usar una API diferente como respaldo
      const response = await fetch('https://zenquotes.io/api/random', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('📊 Backup API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backup API Response:', data);
        
        // La API de zenquotes devuelve un array
        const quoteData = Array.isArray(data) ? data[0] : data;
        
        // Traducir al español
        const translatedText = await this.translateToSpanish(quoteData.q || quoteData.quote || 'No quote available');
        
        return {
          text: translatedText,
          author: quoteData.a || quoteData.author || 'Unknown',
          category: 'Motivación',
        };
      } else {
        throw new Error(`Backup API error: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Backup API failed:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('⏰ Backup request timed out, using fallback');
      }
      return this.getFallbackQuote();
    }
  }
}

// Instancia singleton del servicio
export const quotesService = new QuotesService();

// Hook personalizado para usar el servicio
export function useQuotesService() {
  return {
    getQuoteOfTheDay: () => quotesService.getQuoteOfTheDay(),
    getRandomQuote: () => quotesService.getRandomQuote(),
    getRandomQuoteBackup: () => quotesService.getRandomQuoteBackup(),
    getMultipleQuotes: (count: number) => quotesService.getMultipleQuotes(count),
    checkConnectivity: () => quotesService.checkConnectivity(),
  };
}