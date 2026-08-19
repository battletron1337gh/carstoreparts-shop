import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">CarStore Parts</Link>
          <nav className="flex items-center gap-4">
            <Link href="/winkelwagen" className="text-sm text-gray-600 hover:text-black">Terug naar winkelwagen</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Factuur- & bezorgadres</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Voornaam" />
              <Input placeholder="Achternaam" />
            </div>
            <Input placeholder="E-mail" />
            <Input placeholder="Telefoon" />
            <Input placeholder="Adres" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Postcode" />
              <Input placeholder="Plaats" />
            </div>

            <h2 className="text-xl font-semibold mt-8">Bedrijf (optioneel)</h2>
            <Input placeholder="Bedrijfsnaam" />
            <Input placeholder="BTW-nummer" />
          </div>

          <div className="border rounded-lg p-6 bg-gray-50 h-fit">
            <h2 className="text-xl font-semibold mb-4">Besteloverzicht</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotaal</span>
              <span>€ 0,00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Verzendkosten</span>
              <span>€ 0,00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>BTW</span>
              <span>€ 0,00</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
              <span>Totaal</span>
              <span>€ 0,00</span>
            </div>
            <Button className="w-full mt-6" size="lg" disabled>
              Betalen met iDEAL
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Betaling via Mollie komt na koppeling.
            </p>
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
