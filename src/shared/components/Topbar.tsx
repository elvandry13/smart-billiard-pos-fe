import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '@/features/profile/types';
import { getRoleBadgeLabel } from '@/lib/navigation';
import { useLogoutMutation } from '@/features/auth/hooks';

interface TopbarProps {
  user: UserProfile;
}

export function Topbar({ user }: TopbarProps) {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const displayName = user.first_name
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : user.username;

  const tenantName = user.tenant?.name;
  const outletName = user.outlet?.name;

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-900">{displayName}</span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
              {getRoleBadgeLabel(user.role)}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
            {tenantName && <span>{tenantName}</span>}
            {tenantName && outletName && <span>•</span>}
            {outletName && <span>{outletName}</span>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </button>

          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            {logoutMutation.isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
