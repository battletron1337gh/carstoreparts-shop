export type AppRole = 'admin' | 'warehouse';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  sku: string;
  ean: string | null;
  title: string;
  description: string | null;
  category_id: string | null;
  price_sell: number;
  price_buy: number;
  vat_rate: number;
  stock_quantity: number;
  stock_location: string | null;
  weight_kg: number | null;
  brand: string | null;
  supplier: string | null;
  supplier_article_number: string | null;
  is_active: boolean;
}

export interface ProductCompatibility {
  id: string;
  product_id: string;
  brand: string;
  model: string;
  type: string | null;
  year_from: number | null;
  year_to: number | null;
  fuel_type: string | null;
  engine_code: string | null;
  notes: string | null;
  created_at: string;
}

export interface ProductWithDetails extends Product {
  oem_numbers: ProductOemNumber[];
  article_numbers: ProductArticleNumber[];
  tire_sizes: TireSize[];
  compatibilities: ProductCompatibility[];
  category: Category | null;
}

export interface ProductOemNumber {
  id: string;
  product_id: string;
  oem_number: string;
}

export interface ProductArticleNumber {
  id: string;
  product_id: string;
  supplier: string;
  article_number: string;
  price_buy: number | null;
}

export interface TireSize {
  id: string;
  product_id: string;
  width: number;
  profile: number;
  inch: string;
  load_index: string | null;
  speed_index: string | null;
  season: 'summer' | 'winter' | 'all_season' | null;
  runflat: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer_type: 'b2c' | 'b2b';
  email: string;
  phone: string | null;
  company_name: string | null;
  vat_number: string | null;
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string;
  total_excl: number;
  vat_amount: number;
  total_incl: number;
  shipping_cost: number;
  mollie_payment_id: string | null;
  mollie_payment_status: string | null;
  sendcloud_parcel_id: string | null;
  track_trace_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface OrderLine {
  id: string;
  order_id: string;
  product_id: string | null;
  sku: string;
  title: string;
  quantity: number;
  unit_price_excl: number;
  vat_rate: number;
  line_total_excl: number;
}

export interface CartItem {
  product_id: string;
  sku: string;
  title: string;
  quantity: number;
  unit_price_excl: number;
  vat_rate: number;
}
