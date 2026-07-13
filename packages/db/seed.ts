import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const products = [
  // Food & beverage
  { name: "Kopi Arabica Gayo 250g", marketplace: "tokopedia", price: 45000, url: "https://tokopedia.com/p/1", store: "KopiNusantara" },
  { name: "Kopi Arabica Gayo 250g", marketplace: "shopee", price: 42000, url: "https://shopee.co.id/p/1", store: "KopiLokal" },
  { name: "Matcha Premium 100g", marketplace: "tokopedia", price: 35000, url: "https://tokopedia.com/p/2", store: "TehNusantara" },
  { name: "Matcha Premium 100g", marketplace: "shopee", price: 38000, url: "https://shopee.co.id/p/2", store: "GreenJoy" },
  // Elektronik
  { name: "Keyboard Mechanical MX", marketplace: "tokopedia", price: 275000, url: "https://tokopedia.com/p/3", store: "TechGadget" },
  { name: "Keyboard Mechanical MX", marketplace: "shopee", price: 259000, url: "https://shopee.co.id/p/3", store: "GadgetMurah" },
  { name: "Mouse Wireless Ergo", marketplace: "tokopedia", price: 185000, url: "https://tokopedia.com/p/4", store: "TechGadget" },
  { name: "Mouse Wireless Ergo", marketplace: "shopee", price: 175000, url: "https://shopee.co.id/p/4", store: "GadgetMurah" },
  { name: "USB-C Hub 7in1", marketplace: "tokopedia", price: 125000, url: "https://tokopedia.com/p/5", store: "TechGadget" },
  // Fashion
  { name: "Sepatu Running Air 42", marketplace: "tokopedia", price: 350000, url: "https://tokopedia.com/p/6", store: "SportZone" },
  { name: "Sepatu Running Air 42", marketplace: "shopee", price: 325000, url: "https://shopee.co.id/p/5", store: "OlahragaShop" },
  { name: "Jaket Hoodie Pria", marketplace: "tokopedia", price: 150000, url: "https://tokopedia.com/p/7", store: "FashionIndo" },
  // Home & living
  { name: "Lampu LED Smart WiFi", marketplace: "tokopedia", price: 85000, url: "https://tokopedia.com/p/8", store: "HomeSmart" },
  { name: "Lampu LED Smart WiFi", marketplace: "shopee", price: 79000, url: "https://shopee.co.id/p/6", store: "TechHome" },
  { name: "Diffuser Aromatherapy", marketplace: "tokopedia", price: 65000, url: "https://tokopedia.com/p/9", store: "HomeSmart" },
  // Accessories
  { name: "TWS Earbuds ANC", marketplace: "tokopedia", price: 220000, url: "https://tokopedia.com/p/10", store: "AudioPro" },
  { name: "TWS Earbuds ANC", marketplace: "shopee", price: 205000, url: "https://shopee.co.id/p/7", store: "AudioMurah" },
  { name: "Charger GaN 65W", marketplace: "tokopedia", price: 180000, url: "https://tokopedia.com/p/11", store: "TechGadget" },
  { name: "Charger GaN 65W", marketplace: "shopee", price: 165000, url: "https://shopee.co.id/p/8", store: "GadgetMurah" },
  { name: "Power Bank 20000mAh", marketplace: "tokopedia", price: 140000, url: "https://tokopedia.com/p/12", store: "BatteryLife" },
]

async function main() {
  // hapus data lama kalo ada
  await prisma.priceSnapshot.deleteMany()
  await prisma.product.deleteMany()

  for (const p of products) {
    const product = await prisma.product.create({ data: p })
    // seed 14 hari history harga — fluktuasi ringan
    const priceHistory = [p.price]
    for (let i = 0; i < 13; i++) {
      const last = priceHistory[i]
      const delta = last * (Math.random() * 0.1 - 0.05) // -5% ~ +5%
      priceHistory.push(Math.round(last + delta))
    }
    for (let i = 0; i < 14; i++) {
      await prisma.priceSnapshot.create({
        data: {
          productId: product.id,
          price: priceHistory[i],
          sold: Math.floor(Math.random() * 500),
          scrapedAt: new Date(Date.now() - (13 - i) * 86400000),
        },
      })
    }
  }
  console.log(`✅ seeded ${products.length} products with 14d price history`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
