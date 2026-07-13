"use client"

import { useEffect, useState } from "react"

type Product = {
  id: string; name: string; marketplace: string; price: number; store: string; url: string
  snapshots: { price: number; sold: number | null; scrapedAt: string }[]
}

type Stats = { total: number; avgPrice: number; drops: number }

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, avgPrice: 0, drops: 0 })
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Product | null>(null)

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(d => { setProducts(d.products); setStats(d.stats) })
  }, [])

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">Pasara</h1>
        <input
          className="border rounded-lg px-3 py-1.5 text-sm w-64"
          placeholder="Cari produk..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>

      <div className="max-w-6xl mx-auto p-6 flex gap-6">
        {/* left — sidebar */}
        <div className="w-64 shrink-0 space-y-3">
          <StatCard label="Produk dipantau" value={stats.total} />
          <StatCard label="Rata-rata harga" value={`Rp${stats.avgPrice.toLocaleString()}`} />
          <StatCard label="Produk < Rp100K" value={stats.drops} />
        </div>

        {/* center — table */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-medium">Produk</th>
                  <th className="px-4 py-3 font-medium">Marketplace</th>
                  <th className="px-4 py-3 font-medium">Harga</th>
                  <th className="px-4 py-3 font-medium">Toko</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr
                    key={p.id}
                    className={`border-b last:border-0 cursor-pointer hover:bg-slate-50 ${selected?.id === p.id ? "bg-orange-50" : ""}`}
                    onClick={() => setSelected(p)}
                  >
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 capitalize">{p.marketplace}</td>
                    <td className="px-4 py-3">Rp{p.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500">{p.store}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* right — chart panel */}
        <div className="w-80 shrink-0">
          {selected ? <ChartPanel product={selected} /> : (
            <div className="bg-white rounded-xl border p-6 text-center text-slate-400 text-sm">
              Klik produk untuk lihat grafik harga
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  )
}

function ChartPanel({ product }: { product: Product }) {
  const chart = product.snapshots.map(s => ({ date: s.scrapedAt.slice(0, 10), price: s.price }))
  const maxP = Math.max(...chart.map(c => c.price))
  const minP = Math.min(...chart.map(c => c.price))
  const range = maxP - minP || 1

  return (
    <div className="bg-white rounded-xl border p-4">
      <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
      <p className="text-xs text-slate-500 mb-4 capitalize">{product.marketplace} — {product.store}</p>

      {/* bar chart */}
      <div className="flex items-end gap-[3px] h-32 mb-3">
        {chart.map((c, i) => {
          const h = ((c.price - minP) / range) * 100
          return (
            <div key={i} className="flex-1 bg-orange-400 rounded-t relative group" style={{ height: `${h}%` }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                Rp{c.price.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between text-xs text-slate-500">
        <span>Rp{minP.toLocaleString()}</span>
        <span>Rp{maxP.toLocaleString()}</span>
      </div>
    </div>
  )
}
