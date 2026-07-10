import { Outlet } from 'react-router-dom';
import { useAuthState } from '@/shared/hooks/useAuthState';
import { SidebarNav } from '@/shared/components/SidebarNav';
import { Topbar } from '@/shared/components/Topbar';
import { LoadingState } from '@/shared/components/LoadingState';

export function DashboardLayout() {
  const { user, isLoading } = useAuthState();

  if (isLoading) {
    return <LoadingState message="Memuat..." />;
  }

  if (!user) {
    return <LoadingState message="Memuat..." />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Smart</p>
          <h1 className="mt-1 text-xl font-bold text-slate-950">Billiard POS</h1>
        </div>
        <SidebarNav role={user.role} />
      </aside>
      <div className="lg:pl-72">
        <Topbar user={user} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
