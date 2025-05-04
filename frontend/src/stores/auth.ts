import {defineStore} from 'pinia';
import type {User} from '../../shared/data-models';

/**
 * Authentication store for managing user authentication and roles
 * Supports role-based access control for Admin, Manager, Analyst, and Logistics roles
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    isAuthenticated: false,
    role: null, // 'admin', 'manager', 'analyst', 'logistics'
    permissions: [],
    loginError: null,
    isLoading: false,
  }),

  getters: {
    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,

    /**
     * Get current user role
     * @returns {string|null} User role
     */
    userRole: (state) => state.role,

    /**
     * Check if user has admin role
     * @returns {boolean} Is admin
     */
    isAdmin: (state) => state.role === 'admin',

    /**
     * Check if user has manager role
     * @returns {boolean} Is manager
     */
    isManager: (state) => state.role === 'manager',

    /**
     * Check if user has analyst role
     * @returns {boolean} Is analyst
     */
    isAnalyst: (state) => state.role === 'analyst',

    /**
     * Check if user has logistics role
     * @returns {boolean} Is logistics
     */
    isLogistics: (state) => state.role === 'logistics',

    /**
     * Check if user has specific permission
     * @param {string} permission Permission to check
     * @returns {boolean} Has permission
     */
    hasPermission: (state) => (permission) => state.permissions.includes(permission),
  },

  actions: {
    /**
     * Login user with credentials
     * @param {Object} credentials User credentials
     * @param {string} credentials.username Username
     * @param {string} credentials.password Password
     */
    async login(credentials) {
      this.isLoading = true;
      this.loginError = null;

      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a successful login
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock user data based on username
        const username = credentials.username.toLowerCase();
        let role = 'analyst'; // default role

        if (username.includes('admin')) {
          role = 'admin';
        } else if (username.includes('manager')) {
          role = 'manager';
        } else if (username.includes('logistics')) {
          role = 'logistics';
        }

        // Set permissions based on role
        const permissions = this.getPermissionsForRole(role);

        // Set user data
        this.user = {
          id: Math.floor(Math.random() * 1000),
          username: credentials.username,
          name: `${credentials.username.charAt(0).toUpperCase()}${credentials.username.slice(1)}`,
          email: `${credentials.username}@example.com`,
          role,
        };

        this.token = `mock-jwt-token-${Date.now()}`;
        this.isAuthenticated = true;
        this.role = role;
        this.permissions = permissions;

        // Store token and role in localStorage
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_role', role);

        return { success: true };
      } catch (error) {
        this.loginError = error.message || 'Login failed';
        return { success: false, error: this.loginError };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Logout current user
     */
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.role = null;
      this.permissions = [];

      // Remove token and role from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
    },

    /**
     * Get permissions for a specific role
     * @param {string} role User role
     * @returns {Array} List of permissions
     */
    getPermissionsForRole(role) {
      const basePermissions = ['view_dashboard', 'view_inventory'];

      switch (role) {
        case 'admin':
          return [
            ...basePermissions,
            'manage_users',
            'manage_roles',
            'manage_settings',
            'view_all_reports',
            'edit_inventory',
            'approve_changes',
            'manage_ai_settings',
          ];
        case 'manager':
          return [
            ...basePermissions,
            'view_reports',
            'edit_inventory',
            'approve_changes',
            'adjust_ai_parameters',
          ];
        case 'analyst':
          return [
            ...basePermissions,
            'view_reports',
            'create_reports',
            'view_analytics',
            'run_simulations',
          ];
        case 'logistics':
          return [
            ...basePermissions,
            'update_inventory',
            'view_shipping',
            'create_shipping_orders',
            'view_logistics_reports',
          ];
        default:
          return basePermissions;
      }
    },

    /**
     * Check if current session is valid and restore user if possible
     */
    async checkSession() {
      const token = localStorage.getItem('auth_token');
      const savedRole = localStorage.getItem('user_role');

      if (!token) {
        this.logout();
        return false;
      }

      // In a real app, validate token with API
      // For demo, we'll assume token is valid if it exists
      this.isAuthenticated = true;
      this.token = token;

      // Use saved role or default to analyst
      const role = savedRole || 'analyst';

      // Mock user data
      this.user = {
        id: 1,
        username: 'user',
        name: 'User',
        email: 'user@example.com',
        role: role,
      };

      this.role = this.user.role;
      this.permissions = this.getPermissionsForRole(this.role);

      return true;
    },
  },
});

// Export an alias for backward compatibility
export const useAuthenticationStore = useAuthStore;
