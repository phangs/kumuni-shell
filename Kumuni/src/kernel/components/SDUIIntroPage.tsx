// src/kernel/components/SDUIIntroPage.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useTheme } from './ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import KernelBridge from '../../shared/api/KernelBridge';
import SDUIRenderer, { SDUIData } from './SDUIRenderer';

const { width, height } = Dimensions.get('window');

interface SDUIIntroPageProps {
  onContinue: () => void;
  onSkip: () => void;
}

const SDUIIntroPage: React.FC<SDUIIntroPageProps> = ({ onContinue, onSkip }) => {
  const [sduiData, setSduiData] = useState<SDUIData | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchSDUIData();
  }, []);

  const fetchSDUIData = async () => {
    try {
      console.log('SDUIIntroPage: Fetching SDUI data...');
      const response = await KernelBridge.makeSecureRequest({
        moduleId: 'shell',
        endpoint: '/central/sdui/intro-page',
        method: 'GET',
        clientType: 'central',
      });

      if (response.success) {
        setSduiData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch SDUI data');
      }
    } catch (err) {
      console.error('Error fetching SDUI data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string) => {
    if (action === 'continue') {
      onContinue();
    } else if (action === 'skip') {
      onSkip();
    } else {
      Alert.alert('Action', `Action "${action}" triggered`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00ff5e" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      {sduiData && (
        <>
          <Image
            source={{ uri: sduiData.props.backgroundImage }}
            style={styles.backgroundImage}
            resizeMode="cover"
            onError={(e) => console.error('SDUIIntroPage: Image load error:', e.nativeEvent.error)}
          />
          <View style={styles.overlay} />
          <View style={StyleSheet.absoluteFill}>
            <SDUIRenderer data={sduiData} onAction={handleAction} />
          </View>
          <TouchableOpacity
            style={[styles.skipLink, { top: Math.max(insets.top, 20) }]}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
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
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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

export default SDUIIntroPage;