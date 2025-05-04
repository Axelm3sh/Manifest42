import {defineStore} from 'pinia';
import type {RoleId, User, UserId} from '../../shared/data-models';

/* ------------------------------------------------------------------ *
 *  Data-driven permission catalogue
 * ------------------------------------------------------------------ */
const BASE_PERMISSIONS = ['view_dashboard', 'view_inventory'] as const;

const PERMISSIONS_BY_ROLE: Record<
  RoleId | 'admin' | 'manager' | 'analyst' | 'logistics',
  readonly string[]
> = {
  admin: [
    ...BASE_PERMISSIONS,
    'manage_users',
    'manage_roles',
    'manage_settings',
    'view_all_reports',
    'edit_inventory',
    'approve_changes',
    'manage_ai_settings'
  ],
  manager: [
    ...BASE_PERMISSIONS,
    'view_reports',
    'edit_inventory',
    'approve_changes',
    'adjust_ai_parameters'
  ],
  analyst: [
    ...BASE_PERMISSIONS,
    'view_reports',
    'create_reports',
    'view_analytics',
    'run_simulations'
  ],
  logistics: [
    ...BASE_PERMISSIONS,
    'update_inventory',
    'view_shipping',
    'create_shipping_orders',
    'view_logistics_reports'
  ]
} as const;

/* Utility to create a branded UserId */
const makeUserId = (seed: number = Date.now()): UserId =>
  (`user-${seed}` as UserId);

export const useAuthStore = defineStore('auth', {
  /* ---------------------------------------------------------------- *
   *  STATE
   * ---------------------------------------------------------------- */
  state: () => ({
    user: null as User | null,
    token: (localStorage.getItem('auth_token') ?? null) as string | null,
    isAuthenticated: false,
    role: null as RoleId | null,
    permissions: [] as string[],
    loginError: null as string | null,
    isLoading: false
  }),

  /* ---------------------------------------------------------------- *
   *  GETTERS
   * ---------------------------------------------------------------- */
  getters: {
    isLoggedIn: state => state.isAuthenticated && Boolean(state.token),
    userRole:   state => state.role,
    userId:     state => state.user?.userId ?? null as UserId | null,

    isAdmin:     state => state.role === 'admin',
    isManager:   state => state.role === 'manager',
    isAnalyst:   state => state.role === 'analyst',
    isLogistics: state => state.role === 'logistics',

    hasPermission: state => (perm: string) =>
      state.permissions.includes(perm)
  },

  /* ---------------------------------------------------------------- *
   *  ACTIONS
   * ---------------------------------------------------------------- */
  actions: {
    /* --------------------------- LOGIN ---------------------------- */
    async login(credentials: { username: string; password: string }) {
      this.isLoading = true;
      this.loginError = null;

      try {
        /* simulate network latency */
        await new Promise(res => setTimeout(res, 800));

        /* derive role from username convention */
        const uname = credentials.username.toLowerCase();
        const derivedRole: RoleId =
          (uname.includes('admin')     ? 'admin' :
           uname.includes('manager')   ? 'manager' :
           uname.includes('logistics') ? 'logistics' :
                                         'analyst') as RoleId;

        /* lookup permissions */
        const perms = PERMISSIONS_BY_ROLE[derivedRole] ?? BASE_PERMISSIONS;

        /* build User domain model */
        this.user = {
          userId: makeUserId(),
          userName: credentials.username,
          profilePictureUrl: undefined,
          passwordHash: 'mock',            // NEVER store plain text in prod!
          roleId: derivedRole,
          settings: {
            notificationPreferences: {
              inApp: true,
              email: false,
              frequency: 'Immediate',
              showInventoryAlerts: true,
              showAiInsights: true,
              showSystemNotifications: true,
              enableSoundAlerts: false,
              enableDesktopNotifications: false,
              autoHideAfter: 5
            },
            inventoryRefreshIntervalSec: 60,
            themePreference: 'system'
          }
        };

        /* update session flags */
        this.token           = `mock-jwt-${Date.now()}`;
        this.isAuthenticated = true;
        this.role            = derivedRole;
        this.permissions     = [...perms];

        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_role', derivedRole);

        return { success: true };
      } catch (err: any) {
        this.loginError = err?.message ?? 'Login failed';
        return { success: false, error: this.loginError };
      } finally {
        this.isLoading = false;
      }
    },

    /* --------------------------- LOGOUT --------------------------- */
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.role = null;
      this.permissions = [];

      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
    },

    /* ------------------------ SESSION RESTORE -------------------- */
    async checkSession() {
      const token = localStorage.getItem('auth_token');
      const savedRole = localStorage.getItem('user_role') as RoleId | null;

      if (!token) {
        this.logout();
        return false;
      }

      /* For a real app: validate the JWT with the backend here */
      this.isAuthenticated = true;
      this.token = token;

      const role = savedRole ?? ('analyst' as RoleId);

      /* lightweight placeholder user */
      this.user = {
        userId: makeUserId(1),
        userName: 'user',
        profilePictureUrl: undefined,
        passwordHash: 'mock',
        roleId: role,
        settings: {
          notificationPreferences: {
            inApp: true,
            email: false,
            frequency: 'Immediate',
            showInventoryAlerts: true,
            showAiInsights: true,
            showSystemNotifications: true,
            enableSoundAlerts: false,
            enableDesktopNotifications: false,
            autoHideAfter: 5
          },
          inventoryRefreshIntervalSec: 60,
          themePreference: 'system'
        }
      };

      this.role = role;
      this.permissions = PERMISSIONS_BY_ROLE[role] ?? BASE_PERMISSIONS;
      return true;
    }
  }
});

/* ----------------------------------------------------------------------------
 *  Alias kept for backward compatibility
 * ------------------------------------------------------------------------- */
export const useAuthenticationStore = useAuthStore;