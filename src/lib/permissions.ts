import { Role } from '@/types/auth';

export const defaultRouteByRole: Record<Role, string> = {
  super_admin: '/tenants',
  owner: '/dashboard',
  admin: '/dashboard',
  officer: '/pos',
};

export const routeRoles: Record<string, Role[]> = {
  '/dashboard': ['owner', 'admin'],
  '/pos': ['officer'],
  '/sessions': ['owner', 'admin', 'officer'],
  '/tables': ['admin', 'officer'],
  '/pricing-rules': ['admin'],
  '/additional-fees': ['admin'],
  '/packages': ['admin', 'officer'],
  '/users': ['super_admin', 'admin'],
  '/tenants': ['super_admin'],
  '/outlets': ['super_admin'],
  '/shifts': ['admin', 'officer'],
  '/payments': ['admin', 'officer'],
  '/receipts': ['admin', 'officer'],
  '/audit-logs': ['admin'],
  '/profile': ['super_admin', 'owner', 'admin', 'officer'],
};

export function canAccessRoute(role: Role, path: string) {
  return routeRoles[path]?.includes(role) ?? false;
}