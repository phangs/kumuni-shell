/**
 * Kumuni Super App
 */
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/kernel/components/ThemeProvider';
import { MockInterceptor } from './src/kernel/utils/MockInterceptor';
import SDUIIntroPage from './src/kernel/components/SDUIIntroPage';
import SDUIOnboarding from './src/kernel/components/SDUIOnboarding';
import MainDashboard from './src/kernel/components/MainDashboard';
import Bootstrapper from './src/kernel/services/Bootstrapper';
import { initRegistry } from './src/kernel/components/sdui/InitRegistry';

const AppContent = () => {
  const { theme, updateTheme } = useTheme();
  const [bootstrapped, setBootstrapped] = useState(false);
  const [stage, setStage] = useState('intro'); // intro -> onboarding -> dashboard

  useEffect(() => {
    console.log('App: Initializing...');
    initRegistry();
    MockInterceptor.enable();
    Bootstrapper.getInstance().initialize()
      .then(() => {
        const config = Bootstrapper.getInstance().getMasterConfig();
        if (config && config.theme) {
          updateTheme({ colors: { ...theme.colors, primary: config.theme.primaryColor } });
        }
        setBootstrapped(true);
      })
      .catch((err) => {
        console.error('App: Bootstrap failed', err);
      });
  }, []);

  if (!bootstrapped) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ff5e" />
        <Text style={{ color: '#00ff5e', marginTop: 10 }}>Initializing Kumuni...</Text>
      </View>
    );
  }

  if (stage === 'intro') {
    return (
      <SDUIIntroPage
        onContinue={() => setStage('onboarding')}
        onSkip={() => setStage('dashboard')}
      />
    );
  }

  if (stage === 'onboarding') {
    return <SDUIOnboarding onComplete={() => setStage('dashboard')} />;
  }

  return <MainDashboard onLogout={() => setStage('intro')} />;
};

const App = () => {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#000' }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;