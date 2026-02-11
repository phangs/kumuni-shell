// src/kernel/components/ModuleLoader.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import UserManager from '../../shared/utils/UserManager';
import Bootstrapper from '../services/Bootstrapper';

interface ModuleLoaderProps {
  onModulesLoaded?: (count: number) => void;
}

const ModuleLoader: React.FC<ModuleLoaderProps> = ({ onModulesLoaded }) => {
  const [loadedModules, setLoadedModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const bootstrapper = Bootstrapper.getInstance();
        const config = bootstrapper.getMasterConfig();

        if (!config || !config.module_registry) {
          throw new Error('Master configuration or module registry not found');
        }

        const modules = config.module_registry;

        setLoadedModules(modules);
        if (onModulesLoaded) {
          onModulesLoaded(modules.length);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Module loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [onModulesLoaded]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#3498db" />
        <Text style={styles.loadingText}>Loading modules...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading modules: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loaded Modules:</Text>
      {loadedModules.length === 0 ? (
        <Text style={styles.emptyText}>No modules available for your user level</Text>
      ) : (
        loadedModules.map((module, index) => (
          <View key={index} style={styles.moduleItem}>
            <Text style={styles.moduleName}>{module.name}</Text>
            <Text style={styles.moduleType}>{module.type}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    padding: 10,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  moduleName: {
    fontSize: 14,
    color: '#333',
  },
  moduleType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default ModuleLoader;