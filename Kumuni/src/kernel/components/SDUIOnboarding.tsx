// src/kernel/components/SDUIOnboarding.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from './ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import KernelBridge from '../../shared/api/KernelBridge';
import MiniAppRenderer from './MiniAppRenderer';

interface SDUIOnboardingProps {
  onComplete: () => void;
}

const SDUIOnboarding: React.FC<SDUIOnboardingProps> = ({ onComplete }) => {
  const [sduiData, setSduiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchOnboardingSlides();
  }, []);

  const fetchOnboardingSlides = async () => {
    try {
      const response = await KernelBridge.makeSecureRequest({
        moduleId: 'shell',
        endpoint: '/central/sdui/onboarding-slides',
        method: 'GET',
        clientType: 'central',
      });

      if (response.success) {
        setSduiData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch onboarding slides');
      }
    } catch (err) {
      console.error('Error fetching onboarding slides:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string) => {
    console.log('SDUIOnboarding Action:', action);
    if (action === 'registration' || action === 'skip') {
      onComplete();
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00ff5e" />
      </View>
    );
  }

  if (error || !sduiData) {
    return (
      <View style={[styles.container, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: '#FFF', textAlign: 'center', marginBottom: 20 }}>Oops! {error || "No data found"}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchOnboardingSlides}>
          <Text style={{ fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onComplete} style={{ marginTop: 20 }}>
          <Text style={{ color: '#666' }}>Skip onboarding</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MiniAppRenderer data={sduiData} onAction={handleAction} />
      <TouchableOpacity
        style={[styles.skipLink, { top: Math.max(insets.top, 20) }]}
        onPress={onComplete}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  retryBtn: {
    backgroundColor: '#00ff5e',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  skipLink: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});

export default SDUIOnboarding;