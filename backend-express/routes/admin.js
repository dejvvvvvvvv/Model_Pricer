// Admin API Routes
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// ============================================
// PRICING ENDPOINTS
// ============================================

// Get pricing configuration
router.get('/pricing/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const config = await db.getPricingConfig(customerId);
    
    if (!config) {
      return res.status(404).json({ error: 'Pricing config not found' });
    }
    
    res.json(config);
  } catch (error) {
    console.error('[Admin API] Get pricing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update pricing configuration
router.post('/pricing/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { materialPrices, timeRate } = req.body;
    
    await db.updatePricingConfig(customerId, { materialPrices, timeRate });
    
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Update pricing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// FEES ENDPOINTS
// ============================================

// Get fees
router.get('/fees/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const fees = await db.getFees(customerId);
    res.json(fees);
  } catch (error) {
    console.error('[Admin API] Get fees error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update fees
router.post('/fees/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { fees } = req.body;
    
    await db.updateFees(customerId, fees);
    
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Update fees error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// BRANDING ENDPOINTS
// ============================================

// Get branding configuration
router.get('/branding/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const branding = await db.getBranding(customerId);
    res.json(branding);
  } catch (error) {
    console.error('[Admin API] Get branding error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update branding configuration
router.post('/branding/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const branding = req.body;
    
    await db.updateBranding(customerId, branding);
    
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Update branding error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PARAMETERS ENDPOINTS
// ============================================

// Get print parameters
router.get('/parameters/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const params = await db.getPrintParameters(customerId);
    
    if (!params) {
      return res.status(404).json({ error: 'Parameters not found' });
    }
    
    res.json(params);
  } catch (error) {
    console.error('[Admin API] Get parameters error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update print parameters
router.post('/parameters/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { mainValues, visibility, maxSize } = req.body;
    
    await db.updatePrintParameters(customerId, { mainValues, visibility, maxSize });
    
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Update parameters error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PRESETS ENDPOINTS
// ============================================

// Get presets
router.get('/presets/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const presets = await db.getPresets(customerId);
    res.json(presets);
  } catch (error) {
    console.error('[Admin API] Get presets error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update presets
router.post('/presets/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { presets } = req.body;
    
    await db.updatePresets(customerId, presets);
    
    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Update presets error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CUSTOMERS ENDPOINTS
// ============================================

// Get all customers
router.get('/customers', async (req, res) => {
  try {
    // TODO: Implement getCustomers in database.js
    res.json([
      { id: 'test-customer-1', name: 'Test Tiskárna s.r.o.', email: 'test@tiskarna.cz' }
    ]);
  } catch (error) {
    console.error('[Admin API] Get customers error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
