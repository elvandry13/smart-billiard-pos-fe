interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-700">Phase 0 Scaffold</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
    </section>
  );
}
