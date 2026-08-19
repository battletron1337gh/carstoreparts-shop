import { Button } from "@/components/ui/button";
import { KentekenSearch } from "@/components/kenteken-search";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            CarStore Parts
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-black">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gray-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Auto-onderdelen & banden
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Zoek op kenteken, bandenmaat, OEM-nummer, artikelnummer of categorie. Voor particulier en bedrijf.
            </p>

            <div className="max-w-xl mx-auto bg-white rounded-lg p-3">
              <KentekenSearch />
            </div>

            <p className="text-gray-400 text-sm mt-4">
              Of blader door <Link href="/categorie/remmen" className="underline">remmen</Link>,{' '}
              <Link href="/categorie/filters" className="underline">filters</Link>,{' '}
              <Link href="/categorie/banden" className="underline">banden</Link> en meer.
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Populaire categorieën</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Remmen', 'Filters', 'Banden', 'Verlichting', 'Ruitenwissers', 'Accu\'s', 'Olie', 'Airco'].map((cat) => (
              <div
                key={cat}
                className="border rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition"
              >
                {cat}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} CarStore Parts — onderdeel van CarStore Cuijk
        </div>
      </footer>
    </div>
  );
}
