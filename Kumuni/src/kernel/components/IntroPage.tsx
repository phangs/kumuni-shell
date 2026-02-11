// src/kernel/components/IntroPage.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from './ThemeProvider';
import KernelBridge from '../../shared/api/KernelBridge';
import UserManager from '../../shared/utils/UserManager';

const { width, height } = Dimensions.get('window');

interface AppConfig {
  imageUrl: string;
  colorScheme: {
    primary: string;
    secondary: string;
  };
  lguURL: string;
  sections: string[];
}

const IntroPage: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, updateTheme } = useTheme();
  const userManager = UserManager.getInstance();

  useEffect(() => {
    fetchAppConfig();
  }, []);

  const fetchAppConfig = async () => {
    try {
      // In a real implementation, this would fetch from the central backend
      // For now, we'll simulate the API call
      const response = await KernelBridge.makeSecureRequest({
        moduleId: 'shell',
        endpoint: '/central/app-config', // This endpoint would exist on the central backend
        method: 'GET',
        clientType: 'central',
        isGuestRequest: userManager.getUserLevel() === 'guest',
      });

      if (response.success) {
        setAppConfig(response.data);

        // Update theme based on the config
        updateTheme({
          colors: {
            ...theme.colors,
            primary: response.data.colorScheme.primary,
            secondary: response.data.colorScheme.secondary,
          },
        });
      } else {
        throw new Error(response.message || 'Failed to fetch app config');
      }
    } catch (err) {
      console.error('Error fetching app config:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');

      // Use fallback config
      const fallbackConfig: AppConfig = {
        imageUrl: 'https://example.com/default-intro-image.jpg',
        colorScheme: {
          primary: '#3498db',
          secondary: '#2c3e50',
        },
        lguURL: 'https://default.lgubackend.com/',
        sections: ['miniapps', 'news', 'promos', 'services', 'support'],
      };
      setAppConfig(fallbackConfig);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading app configuration...</Text>
        </View>
      </View>
    );
  }

  if (error && !appConfig) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading configuration: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAppConfig}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {appConfig && (
        <>
          {/* Background image */}
          <Image
            source={{ uri: appConfig.imageUrl }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          {/* Overlay for better text readability */}
          <View style={styles.overlay} />

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Text style={[styles.logoText, { color: appConfig.colorScheme.primary }]}>KUMUNI</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: '#FFFFFF' }]}>
                Welcome to Kumuni
              </Text>
              <Text style={[styles.subtitle, { color: '#FFFFFF' }]}>
                Your Local Government Unit Super App
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Features:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuresScrollContainer}
              >
                {appConfig.sections.map((section, index) => (
                  <View key={index} style={styles.featureCard}>
                    <View style={[
                      styles.featureCircle,
                      { backgroundColor: `${appConfig.colorScheme.primary}20` } // 20 = 12.5% opacity
                    ]}>
                      <Text style={[
                        styles.featureInitial,
                        { color: appConfig.colorScheme.primary }
                      ]}>
                        {section.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.featureLabel}>{section}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.continueButton, { backgroundColor: appConfig.colorScheme.primary }]}
                onPress={onContinue}
              >
                <Text style={styles.continueButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // More opaque overlay for better contrast
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuresScrollContainer: {
    paddingHorizontal: 10,
  },
  featureCard: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 80,
  },
  featureCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureInitial: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  featureLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  continueButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default IntroPage;