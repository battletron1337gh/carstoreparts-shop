import { Category } from '@/types/database';

export const sampleCategories: Category[] = [
  { id: '1', slug: 'remmen', name: 'Remmen', description: 'Remblokken, remschijven, remtrommels en meer.', parent_id: null, sort_order: 1 },
  { id: '2', slug: 'filters', name: 'Filters', description: 'Oliefilters, luchtfilters, interieurfilters.', parent_id: null, sort_order: 2 },
  { id: '3', slug: 'banden', name: 'Banden', description: 'Zomer-, winter- en all-season banden.', parent_id: null, sort_order: 3 },
  { id: '4', slug: 'verlichting', name: 'Verlichting', description: 'Lampen, koplampen, achterlichten.', parent_id: null, sort_order: 4 },
  { id: '5', slug: 'ruitenwissers', name: 'Ruitenwissers', description: 'Ruitenwissers voor alle merken.', parent_id: null, sort_order: 5 },
  { id: '6', slug: 'accus', name: "Accu's", description: 'Startaccu’s voor personenauto’s.', parent_id: null, sort_order: 6 },
  { id: '7', slug: 'olie', name: 'Olie & vloeistoffen', description: 'Motorolie, koelvloeistof, ruitensproeiervloeistof.', parent_id: null, sort_order: 7 },
  { id: '8', slug: 'airco', name: 'Airco', description: 'Airco-onderdelen en vloeistoffen.', parent_id: null, sort_order: 8 },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return sampleCategories.find((c) => c.slug === slug);
}
