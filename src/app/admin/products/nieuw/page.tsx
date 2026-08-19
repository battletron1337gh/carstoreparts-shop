import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminNewProductPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">CarStore Parts Admin</Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin/products" className="text-sm text-gray-600 hover:text-black">← Terug naar producten</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Nieuw product</h1>

        <form className="max-w-2xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <Input placeholder="Bijv. CSP-001" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">EAN</label>
              <Input placeholder="8712345678901" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Titel</label>
            <Input placeholder="Product titel" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Omschrijving</label>
            <textarea
              rows={4}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Korte omschrijving van het product"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Inkoopprijs (excl.)</label>
              <Input type="number" step="0.01" placeholder="0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Verkoopprijs (excl.)</label>
              <Input type="number" step="0.01" placeholder="0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">BTW %</label>
              <Input type="number" defaultValue="21" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Voorraad</label>
              <Input type="number" defaultValue="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Locatie in magazijn</label>
              <Input placeholder="Bijv. A-12-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Merk</label>
              <Input placeholder="Bosch, Valeo, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Leverancier</label>
              <Input placeholder="Excluparts, PartsPoint, etc." />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="submit">Opslaan</Button>
            <Link href="/admin/products">
              <Button variant="outline">Annuleren</Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
