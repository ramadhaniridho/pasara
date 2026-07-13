import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">Pasara</span>
          <Link
            href="/dashboard"
            className="text-sm px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Pantau pasar kompetitor.
          <br />
          <span className="text-orange-500">Otomatis.</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-xl">
          Pasara scraping harga, stok, dan tren produk dari marketplace. Dashboard realtime, insight AI, notifikasi otomatis.
          Satu orang, satu sistem.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Mulai Pantau
          </Link>
          <a
            href="https://github.com/ramadhaniridho/pasara"
            className="px-6 py-3 rounded-xl border text-slate-700 font-medium hover:bg-slate-100 transition"
          >
            GitHub →
          </a>
        </div>
      </main>

      <footer className="border-t py-6 text-sm text-slate-500 text-center">
        Pasara • Ramadhani Ridho
      </footer>
    </div>
  )
}
