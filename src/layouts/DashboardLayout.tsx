import { Outlet } from 'react-router-dom';

const navItems = ['Dashboard', 'Sessions', 'Tables', 'Payments', 'Receipts', 'Audit Logs'];

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-6 lg:block">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Smart</p>
          <h1 className="mt-1 text-xl font-bold text-slate-950">Billiard POS</h1>
        </div>
        <nav className="mt-10 space-y-1">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <p className="text-sm text-slate-500">Frontend bootstrap ready</p>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}