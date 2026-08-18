import { Button } from "@/components/ui/button";
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
              Zoek op bandenmaat, OEM-nummer, artikelnummer of categorie. Voor particulier en bedrijf.
            </p>

            <div className="max-w-3xl mx-auto bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Zoek op OEM, artikelnummer of bandenmaat..."
                className="flex-1 px-4 py-3 text-gray-900 rounded-md outline-none"
              />
              <Button size="lg" className="px-8">
                Zoeken
              </Button>
            </div>
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
