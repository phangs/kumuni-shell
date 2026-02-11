// src/kernel/services/Bootstrapper.ts

import CentralApiClient from '../../shared/api/centralClient';
import TenantApiClient from '../../shared/api/tenantClient';
import UserManager, { UserLevel } from '../../shared/utils/UserManager';

export interface ModuleRegistry {
  id: string;
  name: string;
  type: 'remote_js' | 'sdui' | 'web';
  entry_url: string;
  permissions: string[];
}

export interface MasterConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    brandAssets?: string;
  };
  central_config: {
    url: string;
    credentials: {
      apiKey: string;
      secret: string;
    };
    apiKey?: string; // Compatibility
  };
  tenant_config: {
    id: string;
    url: string;
    credentials: {
      apiKey: string;
      secret: string;
    };
    apiKey?: string; // Compatibility
  };
  module_registry: ModuleRegistry[];
  cms_content: {
    dashboard_news: any[];
    banners: any[];
  };
}

class Bootstrapper {
  private static instance: Bootstrapper;
  private masterConfig: MasterConfig | null = null;

  private constructor() { }

  public static getInstance(): Bootstrapper {
    if (!Bootstrapper.instance) {
      Bootstrapper.instance = new Bootstrapper();
    }
    return Bootstrapper.instance;
  }

  async initialize(userLevel: UserLevel = UserLevel.GUEST): Promise<void> {
    console.log('Starting bootstrapping process...');
    try {
      this.masterConfig = await this.fetchMasterConfig();
      console.log('Bootstrapper: Master config received success');

      if (!this.masterConfig || !this.masterConfig.central_config) {
        console.error('Bootstrapper: Master config is invalid!', JSON.stringify(this.masterConfig));
        throw new Error('Invalid master configuration');
      }

      this.initializeApiClients();

      const userManager = UserManager.getInstance();
      switch (userLevel) {
        case UserLevel.GUEST:
          await userManager.initializeGuestMode(this.masterConfig.tenant_config.id);
          break;
        case UserLevel.REGISTERED:
          await userManager.initializeRegisteredMode('registered-user-token', this.masterConfig.tenant_config.id);
          break;
        case UserLevel.VERIFIED:
          await userManager.initializeVerifiedMode('verified-user-token', this.masterConfig.tenant_config.id);
          break;
      }

      console.log('Bootstrapping completed successfully');
    } catch (error) {
      console.error('Bootstrapping failed:', error);
      throw error;
    }
  }

  private initializeApiClients(): void {
    if (!this.masterConfig) throw new Error('No config');

    CentralApiClient.initialize({
      baseUrl: this.masterConfig.central_config.url,
      apiKey: this.masterConfig.central_config.credentials.apiKey,
    });

    TenantApiClient.initialize({
      baseUrl: this.masterConfig.tenant_config.url,
      apiKey: this.masterConfig.tenant_config.credentials.apiKey,
    });
  }

  private async fetchMasterConfig(): Promise<MasterConfig> {
    const response = await fetch('https://mock-api.example.com/master_config');
    const data = await response.json();
    return data;
  }

  getMasterConfig(): MasterConfig | null {
    return this.masterConfig;
  }
}

export default Bootstrapper;