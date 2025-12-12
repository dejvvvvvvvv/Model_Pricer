const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3001;

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Configure CORS to allow frontend on port 4028
app.use(cors({
  origin: ['http://localhost:4028', 'http://localhost:9002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Initialize database
const db = require('./db/database');
db.initialize().then(() => {
  console.log('[Server] Database initialized');
}).catch(err => {
  console.error('[Server] Database initialization failed:', err);
});

// Initialize PrusaSlicer
const prusaSlicer = require('./prusaSlicerWrapper');
prusaSlicer.initialize().then(() => {
  console.log('[Server] PrusaSlicer initialized');
}).catch(err => {
  console.error('[Server] PrusaSlicer initialization failed:', err);
  console.warn('[Server] Falling back to estimation algorithm');
});

// Import routes
const adminRoutes = require('./routes/admin');

// Material densities (g/cm³)
const MATERIAL_DENSITIES = {
  pla: 1.24,
  abs: 1.04,
  petg: 1.27,
  tpu: 1.21,
  wood: 1.28,
  carbon: 1.30,
};

// Quality to layer height mapping
const QUALITY_TO_LAYER_HEIGHT = {
  nozzle_08: 0.4,
  nozzle_06: 0.3,
  nozzle_04: 0.2,
  draft: 0.3,
  standard: 0.2,
  fine: 0.15,
  ultra: 0.1,
};

/**
 * Slice model using PrusaSlicer CLI
 */
app.post('/api/slice', upload.single('model'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const config = JSON.parse(req.body.config || '{}');
    
    console.log('[Slice API] Request:', { filename: file.originalname, config });

    // Map quality to layer height if not explicitly set
    const qualityMap = {
      'draft': 0.3,
      'standard': 0.2,
      'fine': 0.15,
      'ultra': 0.1
    };

    const slicingConfig = {
      quality: config.quality || 'standard',
      material: config.material || 'pla',
      layerHeight: config.layerHeight || qualityMap[config.quality] || 0.2,
      infill: config.infill,
      walls: config.walls,
      supports: config.supports,
      speed: config.speed,
      nozzleDiameter: config.nozzleDiameter,
      brim: config.brim,
      raft: config.raft
    };

    console.log('[Slice API] Using PrusaSlicer with config:', slicingConfig);

    // Use PrusaSlicer for accurate slicing
    const result = await prusaSlicer.slice(file.buffer, slicingConfig);

    console.log('[Slice API] PrusaSlicer result:', result);

    res.json({
      time: result.time,
      material: result.material,
      layers: result.layers,
      success: true,
      message: 'Sliced with PrusaSlicer'
    });

  } catch (error) {
    console.error('[Slice API] Slicing error:', error);
    
    // Return error with retry flag
    res.status(500).json({ 
      error: error.message,
      retryable: true,
      message: 'Slicing failed. Please try again or contact support if the problem persists.'
    });
  }
});

// Admin API routes
app.use('/api/admin', adminRoutes);

// Základní API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'slicing-api' });
});

app.listen(port, () => {
  console.log(`Slicing API server running on http://localhost:${port}`);
});
