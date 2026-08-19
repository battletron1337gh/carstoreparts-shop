import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, sampleCategories } from '@/lib/data/categories';

export function generateStaticParams() {
  return sampleCategories.map((c) => ({ slug: c.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">CarStore Parts</Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-black">Home</Link>
            <Link href="/admin" className="text-sm text-gray-600 hover:text-black">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        <p className="text-gray-600 mb-8">{category.description}</p>

        <div className="border rounded-lg p-12 text-center text-gray-500">
          Producten voor deze categorie worden geladen vanuit Supabase.
          <br />
          <span className="text-sm">(Nu nog placeholder — schema staat klaar.)</span>
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
