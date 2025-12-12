// Admin Pricing Configuration Page - Dynamic Materials
import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { API_BASE_URL } from '../../config/api';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminPricing = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [timeRate, setTimeRate] = useState(150);

  const customerId = 'test-customer-1'; // TODO: Get from auth/context

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/pricing/${customerId}`);
      const data = await response.json();
      
      if (data) {
        // Convert materialPrices object to array of materials
        const materialsArray = Object.entries(data.materialPrices || {}).map(([key, price]) => ({
          id: key,
          name: key.toUpperCase(),
          price: price,
          enabled: true
        }));
        
        setMaterials(materialsArray);
        setTimeRate(data.timeRate || 150);
      }
    } catch (error) {
      console.error('Failed to load pricing config:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = () => {
    setMaterials(prev => [...prev, {
      id: `material_${Date.now()}`,
      name: '',
      price: 0,
      enabled: true
    }]);
  };

  const updateMaterial = (index, field, value) => {
    setMaterials(prev => prev.map((mat, i) => 
      i === index ? { ...mat, [field]: value } : mat
    ));
  };

  const deleteMaterial = (index) => {
    // Direct deletion without confirm for now
    setMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Convert materials array back to object
      const materialPrices = {};
      materials.forEach(mat => {
        if (mat.name && mat.enabled) {
          const key = mat.name.toLowerCase().replace(/\s+/g, '_');
          materialPrices[key] = mat.price;
        }
      });
      
      const config = { materialPrices, timeRate };
      console.log('[AdminPricing] Saving config:', config);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/pricing/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        alert('✅ Pricing configuration saved!');
        await loadConfig();
      } else {
        const error = await response.text();
        console.error('[AdminPricing] Save failed:', error);
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save pricing config:', error);
      alert('❌ Failed to save pricing configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>{t('admin.pricing.title')}</h1>
          <p className="subtitle">{t('admin.pricing.subtitle')}</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={saving}
        >
          <Icon name="Save" size={18} />
          {saving ? t('common.saving') : t('common.save')}
        </button>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <div>
            <h2>{t('admin.pricing.materials')}</h2>
            <p className="card-description">
              Add and configure custom materials with their prices
            </p>
          </div>
          <button className="btn-secondary" onClick={addMaterial}>
            <Icon name="Plus" size={18} />
            {t('admin.pricing.addMaterial')}
          </button>
        </div>

        {materials.length === 0 ? (
          <div className="empty-state">
            <Icon name="Package" size={48} />
            <h3>{language === 'cs' ? 'Žádné materiály nenakonfigurovány' : 'No materials configured'}</h3>
            <p>{language === 'cs' ? 'Klikněte na "Přidat materiál" pro vytvoření prvního materiálu' : 'Click "Add Material" to create your first material'}</p>
          </div>
        ) : (
          <div className="materials-grid">
            {materials.map((material, index) => (
              <div key={material.id} className="material-card">
                <div className="material-card-header">
                  <input
                    type="text"
                    className="material-name-input"
                    placeholder={language === 'cs' ? 'Název materiálu (např. PLA, ABS)' : 'Material name (e.g., PLA, ABS)'}
                    value={material.name}
                    onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                  />
                  <div className="material-actions">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={material.enabled}
                        onChange={(e) => updateMaterial(index, 'enabled', e.target.checked)}
                      />
                      <span className="toggle-label">{t('admin.pricing.active')}</span>
                    </label>
                    <button 
                      className="btn-icon btn-danger"
                      onClick={() => deleteMaterial(index)}
                      title={language === 'cs' ? 'Smazat materiál' : 'Delete material'}
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                <div className="material-card-body">
                  <label>{t('admin.pricing.pricePerGram')}</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={material.price}
                      onChange={(e) => updateMaterial(index, 'price', parseFloat(e.target.value) || 0)}
                    />
                    <span className="unit">Kč/g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-card">
        <h2>{t('admin.pricing.timeRate')}</h2>
        <p className="card-description">
          {t('admin.pricing.timeRateDesc')}
        </p>

        <div className="form-group" style={{ maxWidth: '300px' }}>
          <label>Hourly Rate</label>
          <div className="input-with-unit">
            <input
              type="number"
              step="1"
              min="0"
              value={timeRate}
              onChange={(e) => setTimeRate(parseFloat(e.target.value) || 0)}
            />
            <span className="unit">Kč/hour</span>
          </div>
          <p className="help-text">
            This rate will be applied to the total print time
          </p>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          max-width: 1200px;
        }

        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .admin-page-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .subtitle {
          margin: 4px 0 0 0;
          color: #666;
          font-size: 14px;
        }

        .admin-card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .admin-card h2 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .card-description {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .materials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .material-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .material-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .material-card-header {
          padding: 12px;
          background: #f5f5f5;
          border-bottom: 1px solid #e0e0e0;
        }

        .material-name-input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .material-name-input:focus {
          outline: none;
          border-color: #1976d2;
        }

        .material-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .material-card-body {
          padding: 12px;
        }

        .material-card-body label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #666;
          margin-bottom: 6px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-with-unit input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .input-with-unit input:focus {
          outline: none;
          border-color: #1976d2;
        }

        .unit {
          font-size: 14px;
          color: #666;
          min-width: 50px;
        }

        .help-text {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #999;
        }

        .toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .toggle input {
          width: 14px;
          height: 14px;
          cursor: pointer;
        }

        .toggle-label {
          font-size: 13px;
          color: #666;
        }

        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #1976d2;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1565c0;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #1976d2;
          border: 1px solid #1976d2;
        }

        .btn-secondary:hover {
          background: #e3f2fd;
        }

        .btn-icon {
          padding: 6px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .btn-icon:hover {
          background: #f0f0f0;
        }

        .btn-danger:hover {
          background: #ffebee;
          color: #c62828;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #999;
        }

        .empty-state h3 {
          margin: 12px 0 6px 0;
          color: #666;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default AdminPricing;
