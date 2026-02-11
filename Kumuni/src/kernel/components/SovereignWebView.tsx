// src/kernel/components/SovereignWebView.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from './ThemeProvider';

interface SovereignWebViewProps {
  source: { uri: string } | { html: string };
  onMessage?: (event: any) => void;
  injectedJavaScript?: string;
  [key: string]: any; // For additional props
}

const SovereignWebView: React.FC<SovereignWebViewProps> = ({
  source,
  onMessage,
  injectedJavaScript,
  ...props
}) => {
  const { theme } = useTheme(); // Get the current theme

  // Secure postMessage bridge implementation
  const secureInjectedJavaScript = `
    // Inject theme colors into the web view
    window.appTheme = {
      primary: '${theme.colors.primary}',
      secondary: '${theme.colors.secondary}',
      background: '${theme.colors.background}',
      surface: '${theme.colors.surface}',
      text: '${theme.colors.text}'
    };

    // Apply primary color to default button styles
    const styleElement = document.createElement('style');
    styleElement.textContent = \`
      button, input[type="submit"], input[type="button"] {
        background-color: \${window.appTheme.primary} !important;
        color: \${window.appTheme.onPrimary} || '#fff' !important;
      }
      input, textarea, select {
        border-color: \${window.appTheme.primary} !important;
      }
    \`;
    document.head.appendChild(styleElement);

    window.kernelBridge = {
      call: function(action, data) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ action, data }));
      }
    };
    ${injectedJavaScript || ''}
    true;
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={source}
        onMessage={(event) => {
          try {
            const message = JSON.parse(event.nativeEvent.data);
            if (onMessage) {
              onMessage(message);
            }
          } catch (e) {
            console.warn('Could not parse webview message:', event.nativeEvent.data);
          }
        }}
        injectedJavaScript={secureInjectedJavaScript}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SovereignWebView;