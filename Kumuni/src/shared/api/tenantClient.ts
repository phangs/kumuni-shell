// src/shared/api/tenantClient.ts
// Tenant API client for LGU-specific PII/Storage
// This connects to the Tenant Backend which uses Supabase internally

export interface TenantApiConfig {
  baseUrl: string;
  apiKey: string;
}

class TenantApiClient {
  private config: TenantApiConfig | null = null;
  private authToken: string | null = null;

  initialize(config: TenantApiConfig) {
    this.config = config;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.config) {
      throw new Error('TenantApiClient not initialized. Call initialize() first.');
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.authToken ? `Bearer ${this.authToken}` : '',
      'X-API-Key': this.config.apiKey,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Tenant API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Specific methods for tenant backend functionality
  async getUserProfile(userId: string) {
    return this.makeRequest(`/users/${userId}`);
  }

  async getLGUSpecificData(lguId: string) {
    return this.makeRequest(`/lgu/${lguId}/data`);
  }

  async exchangeGuestTokenForTenantToken(guestToken: string) {
    // Exchange the guest token from central backend for a tenant-specific token
    return this.makeRequest('/auth/exchange-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${guestToken}`, // Use the guest token for authentication
      },
      body: JSON.stringify({}),
    });
  }

  async getTenantContent() {
    // Get tenant-specific content using tenant token
    return this.makeRequest('/content/tenant-specific');
  }

  async uploadFile(fileData: FormData) {
    return this.makeRequest('/storage/upload', {
      method: 'POST',
      body: fileData,
    });
  }
}

export default new TenantApiClient();