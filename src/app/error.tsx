"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container-page flex min-h-[60vh] flex-col items-start justify-center py-20">
      <h1 className="section-title">Algo deu errado</h1>
      <p className="mt-3 text-muted">Não foi possível carregar esta página agora. Tente novamente em instantes.</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-6">Tentar novamente</button>
    </main>
  );
}
