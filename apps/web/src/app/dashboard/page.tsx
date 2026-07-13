"use client"

import { useEffect, useState } from "react"

type Snapshot = { price: number; sold: number | null; scrapedAt: string }
type Product = {
  id: string; name: string; marketplace: string; price: number; store: string; url: string
  snapshots: Snapshot[]
}
type Stats = { total: number; avgPrice: number; drops: number }

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, avgPrice: 0, drops: 0 })
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(d => { setProducts(d.products); setStats(d.stats) })
  }, [])

  const groups: Record<string, Product[]> = {}
  for (const p of products) {
    if (!groups[p.name]) groups[p.name] = []
    groups[p.name].push(p)
  }

  const filtered = Object.entries(groups).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">Pasara</h1>
        <input
          className="border rounded-lg px-3 py-1.5 text-sm w-72"
          placeholder="Cari produk..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex gap-4">
          <StatCard label="Produk dipantau" value={stats.total} />
          <StatCard label="Rata-rata harga" value={`Rp${stats.avgPrice.toLocaleString()}`} />
          <StatCard label="Produk unik" value={Object.keys(groups).length} />
        </div>

        {filtered.map(([name, variants]) => {
          const minPrice = Math.min(...variants.map(v => v.price))
          const maxPrice = Math.max(...variants.map(v => v.price))
          const range = maxPrice - minPrice || 1
          return (
            <div key={name} className="bg-white rounded-xl border overflow-hidden">
              <div className="px-5 py-3 font-semibold border-b bg-slate-50">{name}</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500 text-xs">
                    <th className="px-5 py-2 font-medium">Marketplace</th>
                    <th className="px-5 py-2 font-medium">Toko</th>
                    <th className="px-5 py-2 font-medium">Harga</th>
                    <th className="px-5 py-2 font-medium">Selisih</th>
                    <th className="px-5 py-2 font-medium">7d</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map(v => {
                    const delta = v.price - minPrice
                    const trend = trend7d(v.snapshots)
                    return (
                      <tr key={v.id} className="border-b last:border-0">
                        <td className="px-5 py-3 capitalize font-medium">{v.marketplace}</td>
                        <td className="px-5 py-3 text-slate-600">{v.store}</td>
                        <td className="px-5 py-3">
                          <span className={v.price === minPrice ? "font-bold text-green-600" : ""}>
                            Rp{v.price.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {delta === 0
                            ? <span className="text-green-600 text-xs font-medium">Termurah</span>
                            : <span className="text-red-500 text-xs">+Rp{delta.toLocaleString()}</span>
                          }
                        </td>
                        <td className="px-5 py-3">
                          {trend === "up" && <span className="text-red-500 text-xs">↑ naik</span>}
                          {trend === "down" && <span className="text-green-600 text-xs">↓ turun</span>}
                          {trend === "flat" && <span className="text-slate-400 text-xs">—</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {/* bar chart */}
              <div className="flex gap-1 p-4 pt-3">
                {variants.map(v => {
                  const pct = ((v.price - minPrice) / range) * 100
                  return (
                    <div key={v.id} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-orange-100 rounded-t relative" style={{ height: 40 }}>
                        <div
                          className="absolute bottom-0 w-full bg-orange-500 rounded-t transition-all"
                          style={{ height: `${Math.max(100 - pct, 5)}%`, minHeight: 4 }}
                        />
                      </div>
                      <span className="text-[10px] font-medium capitalize">{v.marketplace}</span>
                      <span className="text-[10px] text-slate-500">Rp{v.price.toLocaleString()}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border px-5 py-4 flex-1">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  )
}

function trend7d(snapshots: Snapshot[]): "up" | "down" | "flat" {
  const sorted = snapshots.sort((a, b) => new Date(a.scrapedAt).getTime() - new Date(b.scrapedAt).getTime())
  if (sorted.length < 2) return "flat"
  const first = sorted[0].price
  const last = sorted[sorted.length - 1].price
  const diff = ((last - first) / first) * 100
  if (diff > 3) return "up"
  if (diff < -3) return "down"
  return "flat"
}
