// src/kernel/components/RemoteRenderer.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useTheme } from './ThemeProvider';

interface ComponentSchema {
  type: string;
  props: Record<string, any>;
  children?: ComponentSchema[];
}

interface RemoteRendererProps {
  schema: ComponentSchema;
  onAction?: (action: string, data?: any) => void;
}

const RemoteRenderer: React.FC<RemoteRendererProps> = ({ schema, onAction }) => {
  const [componentState, setComponentState] = useState<Record<string, any>>({});
  const { theme } = useTheme(); // Get the current theme

  const renderComponent = (compSchema: ComponentSchema): JSX.Element | null => {
    const { type, props, children } = compSchema;

    switch (type) {
      case 'View':
        return (
          <View {...props}>
            {children?.map((child, index) => (
              <React.Fragment key={index}>{renderComponent(child)}</React.Fragment>
            ))}
          </View>
        );
      case 'Text':
        return <Text {...props}>{props.children}</Text>;
      case 'Button':
        // Use primary color from theme for button background
        const buttonStyle = {
          backgroundColor: theme.colors.primary,
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
          ...props.style, // Allow overriding with props
        };

        return (
          <TouchableOpacity
            style={buttonStyle}
            onPress={() => onAction && onAction(props.action, props.data)}
          >
            <Text style={{ color: theme.colors.onPrimary }}>{props.title}</Text>
          </TouchableOpacity>
        );
      case 'Input':
        // Use theme colors for input styling
        const inputContainerStyle = {
          marginBottom: 16,
          ...styles.inputContainer,
          ...props.containerStyle,
        };

        const inputStyle = {
          borderWidth: 1,
          borderColor: theme.colors.primary,
          padding: 8,
          borderRadius: 4,
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          ...styles.input,
          ...props.inputStyle,
        };

        return (
          <View style={inputContainerStyle}>
            <Text style={{ color: theme.colors.text }}>{props.label}</Text>
            <TextInput
              value={componentState[props.id] || ''}
              onChangeText={(text) =>
                setComponentState({ ...componentState, [props.id]: text })
              }
              style={inputStyle}
            />
          </View>
        );
      default:
        return <Text style={{ color: theme.colors.text }}>Unsupported component type: {type}</Text>;
    }
  };

  return <View style={[styles.container, { backgroundColor: theme.colors.background }]}>{renderComponent(schema)}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
});

export default RemoteRenderer;