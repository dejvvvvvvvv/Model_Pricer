-- Database Schema for 3D Print Calculator Admin System
-- SQLite compatible

-- ============================================
-- CUSTOMERS (SaaS zákazníci = firmy)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PRICING CONFIGURATION
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_configs (
  customer_id TEXT PRIMARY KEY,
  
  -- Material prices (Kč/gram)
  material_prices TEXT NOT NULL,  -- JSON: { "pla": 6, "abs": 7, "petg": 8, "tpu": 10 }
  
  -- Time rate (Kč/hour)
  time_rate REAL NOT NULL DEFAULT 150,
  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ============================================
-- FLEXIBLE FEES
-- ============================================
CREATE TABLE IF NOT EXISTS fees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT NOT NULL,
  
  name TEXT NOT NULL,              -- "Montáž", "Lakování", "Energie", "Postprocessing"
  
  -- Calculation type
  calculation_type TEXT NOT NULL CHECK(calculation_type IN (
    'fixed',        -- Fixní částka (např. +40 Kč)
    'per_gram',     -- Z hmotnosti (např. 0.5 Kč/gram)
    'per_minute',   -- Z času (např. 0.1 Kč/minuta)
    'per_hour',     -- Z času (např. 5 Kč/hodina)
    'per_kwh'       -- Z energie (např. 5 Kč/kWh)
  )),
  
  amount REAL NOT NULL,            -- Částka v Kč
  
  -- Application type
  application_type TEXT NOT NULL CHECK(application_type IN (
    'per_model',        -- Poplatek za každý model
    'once_per_order',   -- Jednorázový poplatek za celou objednávku
    'custom'            -- Vlastní/pokročilý
  )),
  
  enabled BOOLEAN DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ============================================
-- PRINT PARAMETERS
-- ============================================
CREATE TABLE IF NOT EXISTS print_parameters (
  customer_id TEXT PRIMARY KEY,
  
  -- Hlavní (výchozí) hodnoty parametrů
  main_nozzle_diameter REAL DEFAULT 0.4,
  main_layer_height REAL DEFAULT 0.2,
  main_infill INTEGER DEFAULT 20,
  main_walls INTEGER DEFAULT 3,
  main_speed REAL DEFAULT 50,
  
  -- Viditelnost parametrů pro zákazníka
  show_nozzle_selector BOOLEAN DEFAULT 1,
  show_layer_height_selector BOOLEAN DEFAULT 1,
  show_infill_selector BOOLEAN DEFAULT 1,
  show_walls_selector BOOLEAN DEFAULT 1,
  show_speed_selector BOOLEAN DEFAULT 0,
  show_supports_selector BOOLEAN DEFAULT 1,
  
  -- Maximální rozměry modelu (mm)
  max_size_x REAL DEFAULT 240,
  max_size_y REAL DEFAULT 240,
  max_size_z REAL DEFAULT 200,
  
  -- Tiskárna (skrytý parametr pro admin)
  printer_profile TEXT DEFAULT 'Generic FDM',
  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ============================================
-- BRANDING (Customization)
-- ============================================
CREATE TABLE IF NOT EXISTS branding (
  customer_id TEXT PRIMARY KEY,
  
  business_name TEXT,
  tagline TEXT,
  logo_url TEXT,
  
  primary_color TEXT DEFAULT '#2563EB',
  secondary_color TEXT DEFAULT '#10B981',
  background_color TEXT DEFAULT '#FFFFFF',
  
  font_family TEXT DEFAULT 'Inter',
  
  show_logo BOOLEAN DEFAULT 1,
  show_business_name BOOLEAN DEFAULT 1,
  show_tagline BOOLEAN DEFAULT 1,
  show_powered_by BOOLEAN DEFAULT 0,
  
  corner_radius INTEGER DEFAULT 12,
  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ============================================
-- PRESETS (Profily kvality tisku)
-- ============================================
CREATE TABLE IF NOT EXISTS presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT NOT NULL,
  
  name TEXT NOT NULL,              -- "Basic Details", "Mid Details", "Most Details"
  
  -- Parametry presetu
  nozzle_diameter REAL,
  layer_height REAL,
  infill INTEGER,
  walls INTEGER,
  speed REAL,
  supports BOOLEAN DEFAULT 0,
  brim BOOLEAN DEFAULT 0,
  raft BOOLEAN DEFAULT 0,
  
  display_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT 1,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ============================================
-- ORDERS (Uložené kalkulace/objednávky)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT NOT NULL,
  
  total_price REAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ============================================
-- ORDER MODELS (Modely v objednávce)
-- ============================================
CREATE TABLE IF NOT EXISTS order_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,         -- Cesta k uloženému STL souboru
  
  -- Zvolené parametry (JSON)
  parameters TEXT NOT NULL,        -- { "nozzle": 0.4, "layerHeight": 0.2, "infill": 20, ... }
  
  -- Výsledky slicingu
  print_time REAL NOT NULL,        -- minutes
  material_weight REAL NOT NULL,   -- grams
  layers INTEGER NOT NULL,
  volume REAL,                     -- mm³ (optional)
  
  -- Cena
  model_price REAL NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES pro rychlejší dotazy
-- ============================================
CREATE INDEX IF NOT EXISTS idx_fees_customer ON fees(customer_id);
CREATE INDEX IF NOT EXISTS idx_presets_customer ON presets(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_models_order ON order_models(order_id);

-- ============================================
-- SEED DATA (testovací zákazník)
-- ============================================
INSERT OR IGNORE INTO customers (id, name, email) VALUES 
  ('test-customer-1', 'Test Tiskárna s.r.o.', 'test@tiskarna.cz');

INSERT OR IGNORE INTO pricing_configs (customer_id, material_prices, time_rate) VALUES 
  ('test-customer-1', '{"pla": 6, "abs": 7, "petg": 8, "tpu": 10}', 150);

INSERT OR IGNORE INTO print_parameters (customer_id) VALUES 
  ('test-customer-1');

INSERT OR IGNORE INTO fees (customer_id, name, calculation_type, amount, application_type, display_order) VALUES 
  ('test-customer-1', 'Montáž', 'fixed', 60, 'per_model', 1),
  ('test-customer-1', 'Lakování', 'fixed', 80, 'per_model', 2),
  ('test-customer-1', 'Energie', 'per_hour', 5, 'per_model', 3),
  ('test-customer-1', 'Poplatek za přípravu', 'fixed', 40, 'once_per_order', 4);

INSERT OR IGNORE INTO presets (customer_id, name, nozzle_diameter, layer_height, infill, walls, speed, display_order) VALUES 
  ('test-customer-1', 'Basic Details', 0.4, 0.3, 15, 2, 60, 1),
  ('test-customer-1', 'Mid Details', 0.4, 0.2, 20, 3, 50, 2),
  ('test-customer-1', 'Most Details', 0.4, 0.1, 40, 4, 40, 3);
