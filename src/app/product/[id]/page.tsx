import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function generateStaticParams() {
  return [{ id: 'voorbeeld' }];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  await params;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">CarStore Parts</Link>
          <nav className="flex items-center gap-4">
            <Link href="/winkelwagen" className="text-sm text-gray-600 hover:text-black">Winkelwagen</Link>
            <Link href="/admin" className="text-sm text-gray-600 hover:text-black">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center text-gray-400">
            Productafbeelding
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Product titel</h1>
            <p className="text-gray-600 mb-4">SKU: DEMO-001</p>
            <p className="text-2xl font-semibold mb-6">€ 49,95 incl. BTW</p>
            <p className="text-gray-600 mb-6">
              Productomschrijving komt hier. Na koppeling met Supabase wordt dit dynamisch ingeladen.
            </p>
            <Button size="lg">In winkelwagen</Button>
          </div>
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
