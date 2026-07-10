import { Outlet } from 'react-router-dom';

export function PosLayout() {
  return (
    <div className="min-h-screen bg-emerald-950 text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Officer</p>
            <h1 className="text-xl font-bold">POS Mode</h1>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-emerald-100">Phase 0</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6 text-slate-950">
        <Outlet />
      </main>
    </div>
  );
}