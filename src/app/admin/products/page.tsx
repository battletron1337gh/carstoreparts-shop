import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">CarStore Parts Admin</Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-black">Dashboard</Link>
            <Link href="/admin/orders" className="text-sm text-gray-600 hover:text-black">Orders</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Producten</h1>
          <Link href="/admin/products/nieuw">
            <Button>+ Nieuw product</Button>
          </Link>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">SKU</th>
                <th className="text-left p-3">Titel</th>
                <th className="text-left p-3">Prijs</th>
                <th className="text-left p-3">Voorraad</th>
                <th className="text-left p-3">Actief</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 text-gray-400" colSpan={5}>Nog geen producten. Klik op "Nieuw product" om te starten.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
