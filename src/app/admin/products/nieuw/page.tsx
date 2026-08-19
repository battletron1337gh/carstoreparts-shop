'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { lookupRdwVehicle, normalizeKenteken } from '@/lib/rdw';
import { sampleCategories } from '@/lib/data/categories';
import { ProductCompatibility } from '@/types/database';

interface CompatibilityRow extends ProductCompatibility {
  // local temp id for React keys
  localId: string;
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    sku: '',
    ean: '',
    title: '',
    description: '',
    category_id: '',
    price_buy: '',
    price_sell: '',
    vat_rate: '21',
    stock_quantity: '0',
    stock_location: '',
    brand: '',
    supplier: '',
    supplier_article_number: '',
    is_active: true,
  });

  const [compatibilities, setCompatibilities] = useState<CompatibilityRow[]>([]);
  const [kentekenInput, setKentekenInput] = useState('');
  const [kentekenLoading, setKentekenLoading] = useState(false);

  function updateForm(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function addCompatibilityFromKenteken(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = normalizeKenteken(kentekenInput);
    if (normalized.length < 4) {
      setError('Voer een geldig kenteken in');
      return;
    }
    setKentekenLoading(true);
    try {
      const vehicle = await lookupRdwVehicle(kentekenInput);
      if (!vehicle) {
        setError('Geen voertuig gevonden voor dit kenteken');
        return;
      }
      const typeValue = [vehicle.type, vehicle.variant, vehicle.uitvoering]
        .filter(Boolean)
        .join(' / ');
      setCompatibilities((prev) => [
        ...prev,
        {
          localId: crypto.randomUUID(),
          id: '',
          product_id: '',
          brand: vehicle.brand,
          model: vehicle.model,
          type: typeValue || null,
          year_from: vehicle.year,
          year_to: vehicle.year,
          fuel_type: vehicle.fuelType || null,
          engine_code: '',
          notes: '',
          created_at: '',
        },
      ]);
      setKentekenInput('');
    } catch {
      setError('Kenteken lookup mislukt. Probeer het later opnieuw.');
    } finally {
      setKentekenLoading(false);
    }
  }

  function addEmptyCompatibility() {
    setCompatibilities((prev) => [
      ...prev,
      {
        localId: crypto.randomUUID(),
        id: '',
        product_id: '',
        brand: '',
        model: '',
        type: null,
        year_from: null,
        year_to: null,
        fuel_type: null,
        engine_code: '',
        notes: '',
        created_at: '',
      },
    ]);
  }

  function updateCompatibility(localId: string, field: keyof CompatibilityRow, value: string | number | null) {
    setCompatibilities((prev) =>
      prev.map((c) => (c.localId === localId ? { ...c, [field]: value } : c))
    );
  }

  function removeCompatibility(localId: string) {
    setCompatibilities((prev) => prev.filter((c) => c.localId !== localId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.sku || !form.title || !form.price_sell) {
      setError('SKU, titel en verkoopprijs zijn verplicht');
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          sku: form.sku.trim(),
          ean: form.ean.trim() || null,
          title: form.title.trim(),
          description: form.description.trim() || null,
          category_id: form.category_id || null,
          price_buy: parseFloat(form.price_buy || '0'),
          price_sell: parseFloat(form.price_sell),
          vat_rate: parseFloat(form.vat_rate),
          stock_quantity: parseInt(form.stock_quantity || '0', 10),
          stock_location: form.stock_location.trim() || null,
          brand: form.brand.trim() || null,
          supplier: form.supplier.trim() || null,
          supplier_article_number: form.supplier_article_number.trim() || null,
          is_active: form.is_active,
        })
        .select('id')
        .single();

      if (productError) throw productError;

      if (compatibilities.length > 0) {
        const rows = compatibilities.map((c) => ({
          product_id: product.id,
          brand: c.brand.trim(),
          model: c.model.trim(),
          type: c.type?.trim() || null,
          year_from: c.year_from,
          year_to: c.year_to,
          fuel_type: c.fuel_type?.trim() || null,
          engine_code: c.engine_code?.trim() || null,
          notes: c.notes?.trim() || null,
        }));

        const { error: compatError } = await supabase
          .from('product_compatibilities')
          .insert(rows);

        if (compatError) throw compatError;
      }

      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Opslaan mislukt. Controleer of Supabase is gekoppeld.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            CarStore Parts Admin
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin/products" className="text-sm text-gray-600 hover:text-black">
              ← Terug naar producten
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Nieuw product</h1>

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Basisgegevens</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">SKU *</label>
                <Input
                  value={form.sku}
                  onChange={(e) => updateForm('sku', e.target.value)}
                  placeholder="Bijv. CSP-001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">EAN</label>
                <Input
                  value={form.ean}
                  onChange={(e) => updateForm('ean', e.target.value)}
                  placeholder="8712345678901"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Titel *</label>
              <Input
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="Product titel"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Omschrijving</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Korte omschrijving van het product"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Categorie</label>
              <select
                value={form.category_id}
                onChange={(e) => updateForm('category_id', e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="">Geen categorie</option>
                {sampleCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Inkoopprijs (excl.)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price_buy}
                  onChange={(e) => updateForm('price_buy', e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Verkoopprijs (excl.) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price_sell}
                  onChange={(e) => updateForm('price_sell', e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">BTW %</label>
                <Input
                  type="number"
                  value={form.vat_rate}
                  onChange={(e) => updateForm('vat_rate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Voorraad</label>
                <Input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) => updateForm('stock_quantity', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Locatie in magazijn</label>
                <Input
                  value={form.stock_location}
                  onChange={(e) => updateForm('stock_location', e.target.value)}
                  placeholder="Bijv. A-12-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product merk</label>
                <Input
                  value={form.brand}
                  onChange={(e) => updateForm('brand', e.target.value)}
                  placeholder="Bosch, Valeo, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Leverancier</label>
                <Input
                  value={form.supplier}
                  onChange={(e) => updateForm('supplier', e.target.value)}
                  placeholder="Excluparts, PartsPoint, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Leveranciers artikelnr</label>
                <Input
                  value={form.supplier_article_number}
                  onChange={(e) => updateForm('supplier_article_number', e.target.value)}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateForm('is_active', e.target.checked)}
                className="rounded"
              />
              Product is actief
            </label>
          </section>

          <section className="space-y-4 border-t pt-6">
            <h2 className="text-lg font-semibold">Voertuigcompatibiliteit</h2>
            <p className="text-sm text-gray-600">
              Voeg een kenteken toe om merk, model en bouwjaar automatisch op te halen. Motorcode
              moet je handmatig invullen — die zit niet in de gratis RDW API.
            </p>

            <form onSubmit={addCompatibilityFromKenteken} className="flex gap-2">
              <Input
                placeholder="Kenteken invoeren"
                value={kentekenInput}
                onChange={(e) => setKentekenInput(e.target.value)}
                className="flex-1 uppercase"
                maxLength={10}
              />
              <Button type="submit" variant="outline" disabled={kentekenLoading}>
                {kentekenLoading ? 'Opzoeken...' : 'Auto toevoegen'}
              </Button>
            </form>

            <div className="space-y-3">
              {compatibilities.length === 0 && (
                <p className="text-sm text-gray-400">Nog geen voertuigen gekoppeld.</p>
              )}
              {compatibilities.map((c) => (
                <div key={c.localId} className="border rounded-lg p-4 bg-gray-50 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Merk</label>
                      <Input
                        value={c.brand}
                        onChange={(e) => updateCompatibility(c.localId, 'brand', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Model</label>
                      <Input
                        value={c.model}
                        onChange={(e) => updateCompatibility(c.localId, 'model', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Type / variant</label>
                      <Input
                        value={c.type || ''}
                        onChange={(e) =>
                          updateCompatibility(c.localId, 'type', e.target.value || null)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Brandstof</label>
                      <Input
                        value={c.fuel_type || ''}
                        onChange={(e) =>
                          updateCompatibility(c.localId, 'fuel_type', e.target.value || null)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Bouwjaar van</label>
                      <Input
                        type="number"
                        value={c.year_from ?? ''}
                        onChange={(e) =>
                          updateCompatibility(
                            c.localId,
                            'year_from',
                            e.target.value ? parseInt(e.target.value, 10) : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Bouwjaar tot</label>
                      <Input
                        type="number"
                        value={c.year_to ?? ''}
                        onChange={(e) =>
                          updateCompatibility(
                            c.localId,
                            'year_to',
                            e.target.value ? parseInt(e.target.value, 10) : null
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1">Motorcode</label>
                      <Input
                        value={c.engine_code || ''}
                        onChange={(e) =>
                          updateCompatibility(c.localId, 'engine_code', e.target.value || null)
                        }
                        placeholder="Handmatig invullen"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCompatibility(c.localId)}
                      >
                        Verwijderen
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addEmptyCompatibility}>
              + Handmatig compatibiliteit toevoegen
            </Button>
          </section>

          <div className="pt-4 flex gap-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Opslaan...' : 'Opslaan'}
            </Button>
            <Link href="/admin/products">
              <Button variant="outline" type="button">
                Annuleren
              </Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
