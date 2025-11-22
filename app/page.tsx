export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Dev Design Kit
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Next.js + shadcn/ui + Tailwind CSS
        </p>
        <div className="flex justify-center gap-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Next.js</h2>
            <p className="text-sm text-muted-foreground">
              React framework for production
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">shadcn/ui</h2>
            <p className="text-sm text-muted-foreground">
              Beautiful UI components
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Tailwind CSS</h2>
            <p className="text-sm text-muted-foreground">
              Utility-first CSS framework
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

