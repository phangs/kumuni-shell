// src/shared/utils/UserManager.ts

import CentralApiClient from '../api/centralClient';
import TenantApiClient from '../api/tenantClient';

export enum UserLevel {
  GUEST = 'guest',
  REGISTERED = 'registered',
  VERIFIED = 'verified'
}

class UserManager {
  private static instance: UserManager;
  private token: string | null = null;
  private userLevel: UserLevel = UserLevel.GUEST;

  private constructor() { }

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  /**
   * Initializes guest mode by requesting a guest token from the central backend
   * and then exchanging it for a tenant-specific token
   */
  async initializeGuestMode(tenantId: string): Promise<void> {
    try {
      // Step 1: Request a guest token from the central backend with tenant ID
      const centralResponse = await CentralApiClient.getGuestToken(tenantId);
      const guestToken = centralResponse.token; // Assuming the response contains a token field

      // Step 2: Exchange the guest token for a tenant-specific token
      const tenantResponse = await TenantApiClient.exchangeGuestTokenForTenantToken(guestToken);
      const tenantToken = tenantResponse.token; // Assuming the response contains a token field

      // Step 3: Set the tenant token in both API clients
      CentralApiClient.setAuthToken(guestToken); // Keep central token for central operations
      TenantApiClient.setAuthToken(tenantToken); // Use tenant token for tenant operations

      this.token = tenantToken; // Store the tenant token as the primary token
      this.userLevel = UserLevel.GUEST;

      console.log('Guest mode initialized successfully with tenant token');
    } catch (error) {
      console.error('Failed to initialize guest mode:', error);
      throw error;
    }
  }

  /**
   * Initializes registered user mode after successful registration
   */
  async initializeRegisteredMode(authToken: string, tenantId: string): Promise<void> {
    try {
      // Exchange the auth token for a tenant-specific token
      const tenantResponse = await TenantApiClient.exchangeGuestTokenForTenantToken(authToken);
      const tenantToken = tenantResponse.token; // Assuming the response contains a token field

      // Set the tokens in both API clients
      CentralApiClient.setAuthToken(authToken); // Use original token for central operations
      TenantApiClient.setAuthToken(tenantToken); // Use tenant token for tenant operations

      this.token = tenantToken; // Store the tenant token as the primary token
      this.userLevel = UserLevel.REGISTERED;

      console.log('Registered user mode initialized successfully with tenant token');
    } catch (error) {
      console.error('Failed to initialize registered mode:', error);
      throw error;
    }
  }

  /**
   * Initializes verified user mode after successful eKYC verification
   */
  async initializeVerifiedMode(authToken: string, tenantId: string): Promise<void> {
    try {
      // Exchange the auth token for a tenant-specific token
      const tenantResponse = await TenantApiClient.exchangeGuestTokenForTenantToken(authToken);
      const tenantToken = tenantResponse.token; // Assuming the response contains a token field

      // Set the tokens in both API clients
      CentralApiClient.setAuthToken(authToken); // Use original token for central operations
      TenantApiClient.setAuthToken(tenantToken); // Use tenant token for tenant operations

      this.token = tenantToken; // Store the tenant token as the primary token
      this.userLevel = UserLevel.VERIFIED;

      console.log('Verified user mode initialized successfully with tenant token');
    } catch (error) {
      console.error('Failed to initialize verified mode:', error);
      throw error;
    }
  }

  /**
   * Gets the current user level
   */
  getUserLevel(): UserLevel {
    return this.userLevel;
  }

  /**
   * Gets the current auth token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Checks if a specific module is accessible based on user level
   */
  isModuleAccessible(moduleId: string, moduleRegistry: { id: string; permissions: string[] }[]): boolean {
    const module = moduleRegistry.find(m => m.id === moduleId);
    if (!module) return false;

    // Determine access based on user level and module permissions
    switch (this.userLevel) {
      case UserLevel.GUEST:
        return module.permissions.includes('guest') || module.permissions.includes('public');
      case UserLevel.REGISTERED:
        return module.permissions.includes('guest') ||
          module.permissions.includes('public') ||
          module.permissions.includes('registered');
      case UserLevel.VERIFIED:
        // Verified users have access to all modules except explicitly restricted ones
        return !module.permissions.includes('restricted_to_lower_levels');
      default:
        return false;
    }
  }

  /**
   * Checks if content is accessible based on user level
   */
  isContentAccessible(contentType: string): boolean {
    switch (this.userLevel) {
      case UserLevel.GUEST:
        return ['public_news', 'promotions', 'basic_info', 'public_modules'].includes(contentType);
      case UserLevel.REGISTERED:
        return ['public_news', 'promotions', 'basic_info', 'public_modules', 'user_dashboard', 'profile_settings'].includes(contentType);
      case UserLevel.VERIFIED:
        return true; // Verified users can access all content
      default:
        return false;
    }
  }

  /**
   * Transitions user level (e.g., from registered to verified)
   */
  async transitionUserLevel(newLevel: UserLevel, newToken?: string): Promise<void> {
    this.userLevel = newLevel;
    if (newToken) {
      this.token = newToken;
      // Update both API clients with the new auth token
      CentralApiClient.setAuthToken(this.token);
      TenantApiClient.setAuthToken(this.token);
    }

    console.log(`User level transitioned to: ${newLevel}`);
  }

  /**
   * Resets the user manager state and clears API tokens
   */
  async logout(): Promise<void> {
    try {
      // 1. Call central logout if possible
      await CentralApiClient.logout().catch(() => { }); // Fire and forget central logout

      // 2. Clear local state
      this.token = null;
      this.userLevel = UserLevel.GUEST;

      // 3. Clear API client tokens
      CentralApiClient.setAuthToken('');
      TenantApiClient.setAuthToken('');

      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export default UserManager;