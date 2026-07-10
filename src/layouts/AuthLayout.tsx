import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">
            Smart Billiard POS
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">Operational Dashboard</h1>
        </div>
        <Outlet />
      </div>
    </main>
  );
}
