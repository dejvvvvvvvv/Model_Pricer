// Admin Fees Configuration Page
import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { API_BASE_URL } from '../../config/api';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminFees = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fees, setFees] = useState([]);

  const customerId = 'test-customer-1'; // TODO: Get from auth/context

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/fees/${customerId}`);
      const data = await response.json();
      
      // Map database snake_case to frontend camelCase
      const mappedFees = (data || []).map(fee => ({
        id: fee.id,
        name: fee.name || '',
        calculationType: fee.calculation_type || 'fixed',
        amount: fee.amount || 0,
        applicationType: fee.application_type || 'per_model',
        enabled: fee.enabled === 1 || fee.enabled === true
      }));
      
      setFees(mappedFees);
    } catch (error) {
      console.error('Failed to load fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFee = () => {
    setFees(prev => [...prev, {
      id: Date.now(), // Temporary ID
      name: '',
      calculationType: 'fixed',
      amount: 0,
      applicationType: 'per_model',
      enabled: true
    }]);
  };

  const updateFee = (index, field, value) => {
    setFees(prev => prev.map((fee, i) => 
      i === index ? { ...fee, [field]: value } : fee
    ));
  };

  const deleteFee = (index) => {
    // Direct deletion without confirm for now
    setFees(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/fees/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fees })
      });

      if (response.ok) {
        alert('✅ Fees saved successfully!');
        loadFees(); // Reload to get proper IDs
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save fees:', error);
      alert('❌ Failed to save fees');
    } finally {
      setSaving(false);
    }
  };

  const getCalculationTypeLabel = (type) => {
    const labels = {
      'fixed': 'Fixed Amount',
      'per_gram': 'Per Gram',
      'per_minute': 'Per Minute',
      'per_hour': 'Per Hour',
      'per_kwh': 'Per kWh'
    };
    return labels[type] || type;
  };

  const getCalculationTypeUnit = (type) => {
    const units = {
      'fixed': 'Kč',
      'per_gram': 'Kč/g',
      'per_minute': 'Kč/min',
      'per_hour': 'Kč/h',
      'per_kwh': 'Kč/kWh'
    };
    return units[type] || 'Kč';
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
          <h1>{t('admin.fees.title')}</h1>
          <p className="subtitle">{t('admin.fees.subtitle')}</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={addFee}>
            <Icon name="Plus" size={18} />
            {t('admin.fees.addFee')}
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={saving}
          >
            <Icon name="Save" size={18} />
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>

      {fees.length === 0 ? (
        <div className="empty-state">
          <Icon name="Receipt" size={48} />
          <h3>{language === 'cs' ? 'Žádné poplatky nenakonfigurovány' : 'No fees configured'}</h3>
          <p>{language === 'cs' ? 'Klikněte na "Přidat poplatek" pro vytvoření prvního poplatku' : 'Click "Add Fee" to create your first fee'}</p>
        </div>
      ) : (
        <div className="fees-list">
          {fees.map((fee, index) => (
            <div key={fee.id || index} className="fee-card">
              <div className="fee-card-header">
                <input
                  type="text"
                  className="fee-name-input"
                  placeholder="Fee name (e.g., Montáž, Lakování)"
                  value={fee.name}
                  onChange={(e) => updateFee(index, 'name', e.target.value)}
                />
                <div className="fee-card-actions">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={fee.enabled}
                      onChange={(e) => updateFee(index, 'enabled', e.target.checked)}
                    />
                    <span className="toggle-label">Enabled</span>
                  </label>
                  <button 
                    className="btn-icon btn-danger"
                    onClick={() => deleteFee(index)}
                    title="Delete fee"
                  >
                    <Icon name="Trash2" size={18} />
                  </button>
                </div>
              </div>

              <div className="fee-card-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Calculation Type</label>
                    <select
                      value={fee.calculationType}
                      onChange={(e) => updateFee(index, 'calculationType', e.target.value)}
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="per_gram">Per Gram</option>
                      <option value="per_minute">Per Minute</option>
                      <option value="per_hour">Per Hour</option>
                      <option value="per_kwh">Per kWh</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Amount</label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={fee.amount}
                        onChange={(e) => updateFee(index, 'amount', parseFloat(e.target.value) || 0)}
                      />
                      <span className="unit">{getCalculationTypeUnit(fee.calculationType)}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Application</label>
                    <select
                      value={fee.applicationType}
                      onChange={(e) => updateFee(index, 'applicationType', e.target.value)}
                    >
                      <option value="per_model">Per Model</option>
                      <option value="once_per_order">Once Per Order</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div className="fee-preview">
                  <Icon name="Info" size={16} />
                  <span>
                    {fee.calculationType === 'fixed' && `Fixed charge of ${fee.amount} Kč`}
                    {fee.calculationType === 'per_gram' && `${fee.amount} Kč per gram of material`}
                    {fee.calculationType === 'per_minute' && `${fee.amount} Kč per minute of print time`}
                    {fee.calculationType === 'per_hour' && `${fee.amount} Kč per hour of print time`}
                    {fee.calculationType === 'per_kwh' && `${fee.amount} Kč per kWh of energy`}
                    {' • '}
                    {fee.applicationType === 'per_model' && 'Applied to each model'}
                    {fee.applicationType === 'once_per_order' && 'Applied once per order'}
                    {fee.applicationType === 'custom' && 'Custom application'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

        .header-actions {
          display: flex;
          gap: 12px;
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
          padding: 8px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .btn-icon:hover {
          background: #f5f5f5;
        }

        .btn-danger:hover {
          background: #ffebee;
          color: #c62828;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          color: #999;
        }

        .empty-state h3 {
          margin: 16px 0 8px 0;
          color: #666;
        }

        .fees-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .fee-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .fee-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          gap: 16px;
        }

        .fee-name-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
        }

        .fee-name-input:focus {
          outline: none;
          border-color: #1976d2;
        }

        .fee-card-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .toggle input {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .toggle-label {
          font-size: 14px;
          color: #666;
        }

        .fee-card-body {
          padding: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
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

        .form-group select,
        .form-group input {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group select:focus,
        .form-group input:focus {
          outline: none;
          border-color: #1976d2;
        }

        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-with-unit input {
          flex: 1;
        }

        .unit {
          font-size: 14px;
          color: #666;
          min-width: 60px;
        }

        .fee-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f5f5f5;
          border-radius: 6px;
          font-size: 13px;
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

export default AdminFees;
