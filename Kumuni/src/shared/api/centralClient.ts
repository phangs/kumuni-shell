// src/shared/api/centralClient.ts
// Central API client for Auth and Global Finance
// This connects to the Central Backend which uses Supabase internally

export interface CentralApiConfig {
  baseUrl: string;
  apiKey: string;
}

class CentralApiClient {
  private config: CentralApiConfig | null = null;
  private authToken: string | null = null;

  initialize(config: CentralApiConfig) {
    this.config = config;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.config) {
      throw new Error('CentralApiClient not initialized. Call initialize() first.');
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
      throw new Error(`Central API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Specific methods for central backend functionality
  async authenticate(credentials: { email: string; password: string }) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { email: string; password: string; [key: string]: any }) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken(token: string) {
    return this.makeRequest('/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getGuestToken(tenantId: string) {
    // Get a temporary guest token for unregistered users
    return this.makeRequest('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({ tenantId }),
    });
  }

  async getGlobalFinanceData(userId: string) {
    return this.makeRequest(`/finance/user/${userId}`);
  }

  async logout() {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }
}

export default new CentralApiClient();