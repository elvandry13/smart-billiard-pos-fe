import type { Role } from '@/types/auth';

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  allowedRoles: Role[];
}

export const navigationItems: NavigationItem[] = [
  // Super Admin
  {
    label: 'Tenants',
    path: '/tenants',
    icon: 'building',
    allowedRoles: ['super_admin'],
  },
  {
    label: 'Outlets',
    path: '/outlets',
    icon: 'store',
    allowedRoles: ['super_admin'],
  },

  // Admin & Owner
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'chart',
    allowedRoles: ['owner', 'admin'],
  },
  {
    label: 'Users',
    path: '/users',
    icon: 'users',
    allowedRoles: ['super_admin', 'admin'],
  },

  // All authenticated
  {
    label: 'Sessions',
    path: '/sessions',
    icon: 'clock',
    allowedRoles: ['owner', 'admin', 'officer'],
  },
  {
    label: 'Tables',
    path: '/tables',
    icon: 'layout',
    allowedRoles: ['admin', 'officer'],
  },

  // Admin only
  {
    label: 'Pricing Rules',
    path: '/pricing-rules',
    icon: 'tag',
    allowedRoles: ['admin'],
  },
  {
    label: 'Additional Fees',
    path: '/additional-fees',
    icon: 'plus-circle',
    allowedRoles: ['admin'],
  },
  {
    label: 'Audit Logs',
    path: '/audit-logs',
    icon: 'file-text',
    allowedRoles: ['admin'],
  },

  // Admin & Officer
  {
    label: 'Packages',
    path: '/packages',
    icon: 'package',
    allowedRoles: ['admin', 'officer'],
  },
  {
    label: 'Shifts',
    path: '/shifts',
    icon: 'calendar',
    allowedRoles: ['admin', 'officer'],
  },
  {
    label: 'Payments',
    path: '/payments',
    icon: 'credit-card',
    allowedRoles: ['admin', 'officer'],
  },
  {
    label: 'Receipts',
    path: '/receipts',
    icon: 'receipt',
    allowedRoles: ['admin', 'officer'],
  },
];

/**
 * Filter navigation items berdasarkan role user
 */
export function getNavigationItemsByRole(role: Role): NavigationItem[] {
  return navigationItems.filter((item) => item.allowedRoles.includes(role));
}

/**
 * Badge label untuk role
 */
export function getRoleBadgeLabel(role: Role): string {
  const labels: Record<Role, string> = {
    super_admin: 'Super Admin',
    owner: 'Owner',
    admin: 'Admin',
    officer: 'Officer',
  };
  return labels[role];
}
