import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuthState } from '@/shared/hooks/useAuthState';
import { useLogoutMutation } from '@/features/auth/hooks';
import { LoadingState } from '@/shared/components/LoadingState';

export function PosLayout() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthState();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  if (isLoading) {
    return <LoadingState message="Memuat..." />;
  }

  if (!user) {
    return <LoadingState message="Memuat..." />;
  }

  const displayName = user.first_name
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : user.username;

  const tenantName = user.tenant?.name;
  const outletName = user.outlet?.name;

  return (
    <div className="min-h-screen bg-emerald-950 text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Officer
              </p>
              <h1 className="text-xl font-bold">POS Mode</h1>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-sm font-medium text-white">{displayName}</p>
              <p className="text-xs text-emerald-300">
                {tenantName && outletName ? `${tenantName} • ${outletName}` : tenantName || outletName || ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-emerald-100 transition hover:bg-white/10"
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
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-emerald-100 transition hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
            >
              {logoutMutation.isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
      <main className="mx-auto max-w-7xl p-6 text-slate-950">
        <Outlet />
      </main>
    </div>
  );
}
