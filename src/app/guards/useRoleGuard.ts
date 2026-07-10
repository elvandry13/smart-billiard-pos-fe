import { Role } from '@/types/auth';
import { useAuthState } from '@/shared/hooks/useAuthState';

/**
 * Hook untuk cek apakah user memiliki akses ke route tertentu
 * Bisa digunakan di komponen untuk conditional rendering
 */
export function useRoleGuard(allowedRoles: Role[]): {
  hasAccess: boolean;
  isLoading: boolean;
  userRole: Role | null;
} {
  const { user, isLoading } = useAuthState();

  return {
    hasAccess: user ? allowedRoles.includes(user.role) : false,
    isLoading,
    userRole: user?.role ?? null,
  };
}
