import Link from 'next/link';

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">CarStore Parts Admin</Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-black">Dashboard</Link>
            <Link href="/admin/products" className="text-sm text-gray-600 hover:text-black">Producten</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Ordernummer</th>
                <th className="text-left p-3">Klant</th>
                <th className="text-left p-3">Totaal</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Datum</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 text-gray-400" colSpan={5}>Nog geen orders.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
