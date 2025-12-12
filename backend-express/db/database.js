// Database helper for SQLite operations
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'calculator.db');

class Database {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize database and create tables
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        console.log('[DB] Connected to SQLite database');
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        this.db.exec(schema, (err) => {
          if (err) {
            reject(err);
            return;
          }
          console.log('[DB] Schema initialized');
          resolve();
        });
      });
    });
  }

  /**
   * Get customer by ID
   */
  async getCustomer(customerId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM customers WHERE id = ?',
        [customerId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  /**
   * Get pricing configuration for customer
   */
  async getPricingConfig(customerId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM pricing_configs WHERE customer_id = ?',
        [customerId],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            // Parse JSON material_prices
            resolve({
              customerId: row.customer_id,
              materialPrices: JSON.parse(row.material_prices),
              timeRate: row.time_rate
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Update pricing configuration
   */
  async updatePricingConfig(customerId, { materialPrices, timeRate }) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO pricing_configs (customer_id, material_prices, time_rate, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [customerId, JSON.stringify(materialPrices), timeRate],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Get all fees for customer
   */
  async getFees(customerId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM fees WHERE customer_id = ? ORDER BY display_order',
        [customerId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  /**
   * Update fees for customer
   */
  async updateFees(customerId, fees) {
    return new Promise((resolve, reject) => {
      // Delete existing fees
      this.db.run('DELETE FROM fees WHERE customer_id = ?', [customerId], (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Insert new fees
        const stmt = this.db.prepare(
          `INSERT INTO fees (customer_id, name, calculation_type, amount, application_type, enabled, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );

        fees.forEach((fee, index) => {
          stmt.run(
            customerId,
            fee.name,
            fee.calculationType,
            fee.amount,
            fee.applicationType,
            fee.enabled ? 1 : 0,
            index
          );
        });

        stmt.finalize((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  /**
   * Get print parameters for customer
   */
  async getPrintParameters(customerId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM print_parameters WHERE customer_id = ?',
        [customerId],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve({
              mainValues: {
                nozzleDiameter: row.main_nozzle_diameter,
                layerHeight: row.main_layer_height,
                infill: row.main_infill,
                walls: row.main_walls,
                speed: row.main_speed
              },
              visibility: {
                showNozzle: row.show_nozzle_selector === 1,
                showLayerHeight: row.show_layer_height_selector === 1,
                showInfill: row.show_infill_selector === 1,
                showWalls: row.show_walls_selector === 1,
                showSpeed: row.show_speed_selector === 1,
                showSupports: row.show_supports_selector === 1
              },
              maxSize: {
                x: row.max_size_x,
                y: row.max_size_y,
                z: row.max_size_z
              },
              printerProfile: row.printer_profile
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Update print parameters
   */
  async updatePrintParameters(customerId, { mainValues, visibility, maxSize }) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO print_parameters (
          customer_id, 
          main_nozzle_diameter, main_layer_height, main_infill, main_walls, main_speed,
          show_nozzle_selector, show_layer_height_selector, show_infill_selector, 
          show_walls_selector, show_speed_selector, show_supports_selector,
          max_size_x, max_size_y, max_size_z,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          customerId,
          mainValues.nozzleDiameter, mainValues.layerHeight, mainValues.infill, mainValues.walls, mainValues.speed,
          visibility.showNozzle ? 1 : 0, visibility.showLayerHeight ? 1 : 0, visibility.showInfill ? 1 : 0,
          visibility.showWalls ? 1 : 0, visibility.showSpeed ? 1 : 0, visibility.showSupports ? 1 : 0,
          maxSize.x, maxSize.y, maxSize.z
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Get branding configuration for customer
   */
  async getBranding(customerId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM branding WHERE customer_id = ?',
        [customerId],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve({
              businessName: row.business_name,
              tagline: row.tagline,
              logoUrl: row.logo_url,
              primaryColor: row.primary_color,
              secondaryColor: row.secondary_color,
              backgroundColor: row.background_color,
              fontFamily: row.font_family,
              showLogo: row.show_logo === 1,
              showBusinessName: row.show_business_name === 1,
              showTagline: row.show_tagline === 1,
              showPoweredBy: row.show_powered_by === 1,
              cornerRadius: row.corner_radius
            });
          } else {
            // Return defaults if no branding exists
            resolve({
              businessName: '',
              tagline: '',
              logoUrl: null,
              primaryColor: '#2563EB',
              secondaryColor: '#10B981',
              backgroundColor: '#FFFFFF',
              fontFamily: 'Inter',
              showLogo: true,
              showBusinessName: true,
              showTagline: true,
              showPoweredBy: false,
              cornerRadius: 12
            });
          }
        }
      );
    });
  }

  /**
   * Update branding configuration
   */
  async updateBranding(customerId, branding) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO branding (
          customer_id, business_name, tagline, logo_url,
          primary_color, secondary_color, background_color,
          font_family, show_logo, show_business_name, show_tagline, show_powered_by,
          corner_radius, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          customerId,
          branding.businessName,
          branding.tagline,
          branding.logoUrl,
          branding.primaryColor,
          branding.secondaryColor,
          branding.backgroundColor,
          branding.fontFamily,
          branding.showLogo ? 1 : 0,
          branding.showBusinessName ? 1 : 0,
          branding.showTagline ? 1 : 0,
          branding.showPoweredBy ? 1 : 0,
          branding.cornerRadius
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Get presets for customer
   */
  async getPresets(customerId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM presets WHERE customer_id = ? AND enabled = 1 ORDER BY display_order',
        [customerId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  /**
   * Update presets for customer
   */
  async updatePresets(customerId, presets) {
    return new Promise((resolve, reject) => {
      // Delete existing presets
      this.db.run('DELETE FROM presets WHERE customer_id = ?', [customerId], (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Insert new presets
        const stmt = this.db.prepare(
          `INSERT INTO presets (customer_id, name, nozzle_diameter, layer_height, infill, walls, speed, supports, brim, raft, enabled, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );

        presets.forEach((preset, index) => {
          stmt.run(
            customerId,
            preset.name,
            preset.nozzleDiameter,
            preset.layerHeight,
            preset.infill,
            preset.walls,
            preset.speed,
            preset.supports ? 1 : 0,
            preset.brim ? 1 : 0,
            preset.raft ? 1 : 0,
            preset.enabled ? 1 : 0,
            index
          );
        });

        stmt.finalize((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  /**
   * Create new order
   */
  async createOrder(customerId, models, totalPrice) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO orders (customer_id, total_price) VALUES (?, ?)',
        [customerId, totalPrice],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          const orderId = this.lastID;

          // Insert order models
          const stmt = db.db.prepare(
            `INSERT INTO order_models (order_id, filename, file_path, parameters, print_time, material_weight, layers, volume, model_price)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          );

          models.forEach(model => {
            stmt.run(
              orderId,
              model.filename,
              model.filePath,
              JSON.stringify(model.parameters),
              model.printTime,
              model.materialWeight,
              model.layers,
              model.volume,
              model.price
            );
          });

          stmt.finalize((err) => {
            if (err) reject(err);
            else resolve(orderId);
          });
        }
      );
    });
  }

  /**
   * Get orders for customer
   */
  async getOrders(customerId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT o.*, 
          (SELECT COUNT(*) FROM order_models WHERE order_id = o.id) as model_count
         FROM orders o
         WHERE o.customer_id = ?
         ORDER BY o.created_at DESC`,
        [customerId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      console.log('[DB] Database connection closed');
    }
  }
}

// Singleton instance
const db = new Database();

module.exports = db;
