-- CarStore Parts — Supabase schema
-- Richt zich op eigen voorraad, B2C + B2B, zonder kentekenmatching in MVP.

-- Extensies
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Rollen voor admin/warehouse
CREATE TYPE app_role AS ENUM ('admin', 'warehouse');

-- Profielen gekoppeld aan Supabase Auth users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role app_role NOT NULL DEFAULT 'warehouse',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categorieën (hiërarchisch later uitbreidbaar)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Producten
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  ean TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  price_sell NUMERIC(12,2) NOT NULL DEFAULT 0,
  price_buy NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_rate NUMERIC(5,2) NOT NULL DEFAULT 21,
  stock_quantity INT NOT NULL DEFAULT 0,
  stock_location TEXT,
  weight_kg NUMERIC(8,3),
  brand TEXT,
  supplier TEXT,
  supplier_article_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- OEM-nummers (meerdere per product)
CREATE TABLE product_oem_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  oem_number TEXT NOT NULL,
  UNIQUE(product_id, oem_number)
);

-- Extra leveranciersartikelnummers (meerdere per product)
CREATE TABLE product_article_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  supplier TEXT NOT NULL,
  article_number TEXT NOT NULL,
  price_buy NUMERIC(12,2),
  UNIQUE(product_id, supplier, article_number)
);

-- Bandenmaten (voor bandenproducten)
CREATE TABLE tire_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  width INT NOT NULL,
  profile INT NOT NULL,
  inch TEXT NOT NULL,
  load_index TEXT,
  speed_index TEXT,
  season TEXT CHECK (season IN ('summer', 'winter', 'all_season')),
  runflat BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(product_id, width, profile, inch, season)
);

-- Voorraadmutaties
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'sale', 'return', 'correction')),
  reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bestellingen
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_type TEXT NOT NULL DEFAULT 'b2c' CHECK (customer_type IN ('b2c', 'b2b')),
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  vat_number TEXT,
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT NOT NULL DEFAULT 'NL',
  total_excl NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_incl NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  mollie_payment_id TEXT,
  mollie_payment_status TEXT,
  sendcloud_parcel_id TEXT,
  track_trace_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bestelregels
CREATE TABLE order_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  sku TEXT NOT NULL,
  title TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price_excl NUMERIC(12,2) NOT NULL,
  vat_rate NUMERIC(5,2) NOT NULL,
  line_total_excl NUMERIC(12,2) NOT NULL
);

-- Indexes voor snel zoeken
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_oem_numbers ON product_oem_numbers(oem_number);
CREATE INDEX idx_article_numbers ON product_article_numbers(article_number);
CREATE INDEX idx_tire_sizes ON tire_sizes(width, profile, inch);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_oem_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_article_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tire_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_lines ENABLE ROW LEVEL SECURITY;

-- Helper: is admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: iedereen mag eigen profiel lezen, admins alles
CREATE POLICY "profiles_select_own_or_admin" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());

-- Categories: publiek lezen, admin alles
CREATE POLICY "categories_select_public" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_all" ON categories FOR ALL USING (is_admin());

-- Products: publiek lezen actieve producten, admin alles
CREATE POLICY "products_select_public" ON products FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "products_admin_all" ON products FOR ALL USING (is_admin());

-- OEM / article / tire: publiek lezen, admin alles
CREATE POLICY "oem_select_public" ON product_oem_numbers FOR SELECT USING (true);
CREATE POLICY "oem_admin_all" ON product_oem_numbers FOR ALL USING (is_admin());

CREATE POLICY "article_select_public" ON product_article_numbers FOR SELECT USING (true);
CREATE POLICY "article_admin_all" ON product_article_numbers FOR ALL USING (is_admin());

CREATE POLICY "tire_select_public" ON tire_sizes FOR SELECT USING (true);
CREATE POLICY "tire_admin_all" ON tire_sizes FOR ALL USING (is_admin());

-- Stock movements: admin/warehouse lezen en schrijven
CREATE POLICY "stock_select_staff" ON stock_movements FOR SELECT USING (is_admin() OR EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
));
CREATE POLICY "stock_insert_staff" ON stock_movements FOR INSERT WITH CHECK (is_admin() OR EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
));

-- Orders: klant mag eigen orders lezen, admin alles
CREATE POLICY "orders_select_own_or_admin" ON orders
  FOR SELECT USING (email = auth.jwt()->>'email' OR is_admin());
CREATE POLICY "orders_insert_public" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE USING (is_admin());

CREATE POLICY "order_lines_select_own_or_admin" ON order_lines
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_lines.order_id AND orders.email = auth.jwt()->>'email')
    OR is_admin()
  );
CREATE POLICY "order_lines_insert_public" ON order_lines FOR INSERT WITH CHECK (true);
CREATE POLICY "order_lines_update_admin" ON order_lines FOR UPDATE USING (is_admin());

-- Trigger: update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Product-car compatibility (kenteken-based matching)
CREATE TABLE product_compatibilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  type TEXT,
  year_from INT,
  year_to INT,
  fuel_type TEXT,
  engine_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compatibilities_product ON product_compatibilities(product_id);
CREATE INDEX idx_compatibilities_search ON product_compatibilities(brand, model, type);

ALTER TABLE product_compatibilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "compatibilities_select_public" ON product_compatibilities FOR SELECT USING (true);
CREATE POLICY "compatibilities_admin_all" ON product_compatibilities FOR ALL USING (is_admin());
