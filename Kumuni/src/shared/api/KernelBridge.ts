// src/shared/api/KernelBridge.ts

import CentralApiClient from './centralClient';
import TenantApiClient from './tenantClient';
import Bootstrapper, { ModuleRegistry } from '../../kernel/services/Bootstrapper';

interface RequestConfig {
  moduleId: string; // Identity of the calling module
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  clientType: 'central' | 'tenant'; // Specifies which backend to use
  isGuestRequest?: boolean; // Indicates if this is a guest request
}

class KernelBridge {
  private static instance: KernelBridge;

  private constructor() { }

  public static getInstance(): KernelBridge {
    if (!KernelBridge.instance) {
      KernelBridge.instance = new KernelBridge();
    }
    return KernelBridge.instance;
  }

  /**
   * Validates if the module has permission to access the endpoint
   */
  private checkPermission(moduleId: string, endpoint: string): void {
    const bootstrapper = Bootstrapper.getInstance();
    const config = bootstrapper.getMasterConfig();

    if (!config) {
      console.warn('KernelBridge: Master config not found, blocking request for security.');
      throw new Error('Security Error: System not initialized');
    }

    const module = config.module_registry.find((m: ModuleRegistry) => m.id === moduleId);
    if (!module) {
      console.error(`KernelBridge: Unknown module ${moduleId} attempted a request.`);
      throw new Error(`Security Error: Unknown module ${moduleId}`);
    }

    // Permission check logic (Simplified)
    // In a real app, this would match patterns or specific scope strings
    const hasPermission = module.permissions.includes('*') ||
      module.permissions.some((p: string) => endpoint.startsWith(p));

    if (!hasPermission) {
      console.error(`KernelBridge: Permission denied for module ${moduleId} on endpoint ${endpoint}`);
      throw new Error(`Security Error: Access denied to ${endpoint}`);
    }
  }

  /**
   * Main method for micro-apps to make authenticated requests to either central or tenant backend
   * This enforces the security rule that micro-apps cannot directly access fetch/axios
   */
  public async request(config: RequestConfig): Promise<any> {
    try {
      // SECURITY ENFORCEMENT
      this.checkPermission(config.moduleId, config.endpoint);

      if (config.isGuestRequest) {
        // For guest requests, we may need to attach a guest token
        // This would be handled by the API clients if needed
        if (config.clientType === 'central') {
          return await CentralApiClient.makeRequest(config.endpoint, {
            method: config.method,
            headers: config.headers,
            body: config.body ? JSON.stringify(config.body) : undefined,
          });
        } else {
          return await TenantApiClient.makeRequest(config.endpoint, {
            method: config.method,
            headers: config.headers,
            body: config.body ? JSON.stringify(config.body) : undefined,
          });
        }
      } else {
        // For authenticated requests
        if (config.clientType === 'central') {
          // Route request through central API client
          return await CentralApiClient.makeRequest(config.endpoint, {
            method: config.method,
            headers: config.headers,
            body: config.body ? JSON.stringify(config.body) : undefined,
          });
        } else {
          // Route request through tenant API client
          return await TenantApiClient.makeRequest(config.endpoint, {
            method: config.method,
            headers: config.headers,
            body: config.body ? JSON.stringify(config.body) : undefined,
          });
        }
      }
    } catch (error) {
      console.error('KernelBridge request error:', error);
      throw error;
    }
  }

  /**
   * Method for micro-apps to access the bridge securely
   */
  public static async makeSecureRequest(config: RequestConfig): Promise<any> {
    const bridge = KernelBridge.getInstance();
    return bridge.request(config);
  }
}

export default KernelBridge;