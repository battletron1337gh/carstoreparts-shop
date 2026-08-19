import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">CarStore Parts</Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-black">Verder winkelen</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Winkelwagen</h1>

        <div className="border rounded-lg p-8 text-center text-gray-500">
          Je winkelwagen is nog leeg.
          <br />
          <span className="text-sm">(Winkelwagen-logica komt na Supabase-koppeling.)</span>
        </div>

        <div className="mt-8 flex justify-end">
          <Button size="lg" disabled>Ga verder naar checkout</Button>
        </div>
      </main>

      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} CarStore Parts
        </div>
      </footer>
    </div>
  );
}
