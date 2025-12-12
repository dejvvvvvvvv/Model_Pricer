import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { API_BASE_URL } from '../../config/api';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminBranding = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const customerId = 'test-customer-1'; // TODO: Get from auth/context

  // State for branding data
  const [branding, setBranding] = useState({
    businessName: '',
    tagline: '',
    logo: null,
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

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/branding/${customerId}`);
      const data = await response.json();
      setBranding(data);
    } catch (error) {
      console.error('Failed to load branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      console.log('[AdminBranding] Saving branding:', branding);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/branding/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding)
      });

      if (response.ok) {
        alert('✅ Branding saved successfully!');
        await loadBranding();
      } else {
        const error = await response.text();
        console.error('[AdminBranding] Save failed:', error);
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save branding:', error);
      alert('❌ Failed to save branding');
    } finally {
      setSaving(false);
    }
  };

  const colorPresets = [
    { name: 'Blue', primary: '#2563EB', secondary: '#10B981', background: '#FFFFFF' },
    { name: 'Green', primary: '#10B981', secondary: '#F59E0B', background: '#FFFFFF' },
    { name: 'Purple', primary: '#7C3AED', secondary: '#EC4899', background: '#FFFFFF' },
    { name: 'Orange', primary: '#F97316', secondary: '#10B981', background: '#FFFFFF' }
  ];

  const fonts = ['Inter', 'Roboto', 'Poppins', 'Open Sans'];

  const handleColorPreset = (preset) => {
    setBranding({
      ...branding,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.background
    });
  };

  return (
    <div className="admin-branding">
      <div className="page-header">
        <div>
          <h1>{t('admin.branding.title')}</h1>
          <p className="subtitle">{t('admin.branding.subtitle')}</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">{t('common.reset')}</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>

      <div className="branding-grid">
        {/* Left Column */}
        <div className="branding-column">
          {/* Business Information */}
          <div className="branding-section">
            <h3>{t('admin.branding.businessInfo')}</h3>
            <div className="form-group">
              <label>{t('admin.branding.businessName')}</label>
              <input
                type="text"
                value={branding.businessName}
                onChange={(e) => setBranding({ ...branding, businessName: e.target.value })}
                placeholder={t('admin.branding.businessNamePlaceholder')}
                maxLength={50}
              />
              <p className="help-text">{t('admin.branding.businessNameHelp')}</p>
            </div>
            <div className="form-group">
              <label>{t('admin.branding.tagline')}</label>
              <input
                type="text"
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                placeholder={t('admin.branding.taglinePlaceholder')}
                maxLength={100}
              />
            </div>
          </div>

          {/* Logo */}
          <div className="branding-section">
            <h3>{t('admin.branding.logo')}</h3>
            {branding.logo && (
              <div className="current-logo">
                <div className="logo-preview">
                  <Icon name="Image" size={48} />
                </div>
                <div className="logo-info">
                  <p>200x200px</p>
                  <p>PNG, JPG, SVG</p>
                </div>
              </div>
            )}
            <div className="upload-area">
              <Icon name="Upload" size={32} />
              <p>{t('admin.branding.dragDrop')}</p>
              <p className="upload-hint">{t('admin.branding.orClick')}</p>
              <p className="upload-hint">{t('admin.branding.recommended')}</p>
            </div>
            <div className="upload-actions">
              <button className="btn-secondary">{t('admin.branding.chooseFile')}</button>
              <button className="btn-primary">{t('common.upload')}</button>
              {branding.logo && <button className="btn-danger">{t('admin.branding.removeLogo')}</button>}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="branding-section">
            <h3>{t('admin.branding.colorScheme')}</h3>
            <div className="form-group">
              <label>{t('admin.branding.primaryColor')}</label>
              <div className="color-input-group">
                <input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                />
                <div className="color-swatch" style={{ backgroundColor: branding.primaryColor }}></div>
              </div>
              <p className="help-text">{t('admin.branding.primaryColorHelp')}</p>
            </div>
            <div className="form-group">
              <label>{t('admin.branding.secondaryColor')}</label>
              <div className="color-input-group">
                <input
                  type="text"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                />
                <div className="color-swatch" style={{ backgroundColor: branding.secondaryColor }}></div>
              </div>
              <p className="help-text">{t('admin.branding.secondaryColorHelp')}</p>
            </div>
            <div className="form-group">
              <label>{t('admin.branding.backgroundColor')}</label>
              <div className="color-input-group">
                <input
                  type="text"
                  value={branding.backgroundColor}
                  onChange={(e) => setBranding({ ...branding, backgroundColor: e.target.value })}
                />
                <div className="color-swatch" style={{ backgroundColor: branding.backgroundColor }}></div>
              </div>
              <p className="help-text">{t('admin.branding.backgroundColorHelp')}</p>
            </div>
            <div className="form-group">
              <label>{t('admin.branding.presets')}</label>
              <div className="color-presets">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    className="preset-btn"
                    onClick={() => handleColorPreset(preset)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="branding-section">
            <h3>{t('admin.branding.typography')}</h3>
            <div className="form-group">
              <label>{t('admin.branding.fontFamily')}</label>
              <div className="font-options">
                {fonts.map((font) => (
                  <label key={font} className="radio-label">
                    <input
                      type="radio"
                      name="font"
                      checked={branding.fontFamily === font}
                      onChange={() => setBranding({ ...branding, fontFamily: font })}
                    />
                    <span>{font} {font === 'Inter' && '(Default)'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Calculator Settings */}
          <div className="branding-section">
            <h3>{t('admin.branding.calculatorSettings')}</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={branding.showLogo}
                  onChange={(e) => setBranding({ ...branding, showLogo: e.target.checked })}
                />
                <span>{t('admin.branding.showLogo')}</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={branding.showBusinessName}
                  onChange={(e) => setBranding({ ...branding, showBusinessName: e.target.checked })}
                />
                <span>{t('admin.branding.showBusinessName')}</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={branding.showTagline}
                  onChange={(e) => setBranding({ ...branding, showTagline: e.target.checked })}
                />
                <span>{t('admin.branding.showTagline')}</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={branding.showPoweredBy}
                  onChange={(e) => setBranding({ ...branding, showPoweredBy: e.target.checked })}
                />
                <span>{t('admin.branding.showPoweredBy')}</span>
              </label>
            </div>
            <div className="form-group">
              <label>{t('admin.branding.cornerRadius')} {branding.cornerRadius}px</label>
              <input
                type="range"
                min="0"
                max="24"
                step="2"
                value={branding.cornerRadius}
                onChange={(e) => setBranding({ ...branding, cornerRadius: parseInt(e.target.value) })}
                className="slider"
              />
              <div className="slider-labels">
                <span>0px (Sharp)</span>
                <span>24px (Rounded)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="branding-column">
          <div className="branding-section sticky-preview">
            <h3>{t('admin.branding.livePreview')}</h3>
            <div className="calculator-preview" style={{ backgroundColor: branding.backgroundColor }}>
              <div className="preview-header">
                {branding.showLogo && (
                  <div className="preview-logo">
                    <Icon name="Image" size={32} />
                  </div>
                )}
                <div>
                  {branding.showBusinessName && (
                    <h4 style={{ fontFamily: branding.fontFamily }}>{branding.businessName}</h4>
                  )}
                  {branding.showTagline && (
                    <p style={{ fontFamily: branding.fontFamily }}>{branding.tagline}</p>
                  )}
                </div>
              </div>
              <div className="preview-divider"></div>
              <div className="preview-form" style={{ fontFamily: branding.fontFamily }}>
                <div className="preview-field">
                  <label>{t('admin.branding.uploadModel')}</label>
                  <div className="preview-input" style={{ borderRadius: `${branding.cornerRadius}px` }}>
                    Choose File
                  </div>
                </div>
                <div className="preview-field">
                  <label>{t('admin.branding.material')}</label>
                  <div className="preview-select" style={{ borderRadius: `${branding.cornerRadius}px` }}>
                    PLA ▼
                  </div>
                </div>
                <button 
                  className="preview-button" 
                  style={{ 
                    backgroundColor: branding.primaryColor,
                    borderRadius: `${branding.cornerRadius}px`
                  }}
                >
                  {t('admin.branding.calculatePrice')}
                </button>
              </div>
              {branding.showPoweredBy && (
                <div className="preview-footer">
                  <small>Powered by Commun Printing</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-branding {
          max-width: 1400px;
        }

        .page-header {
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #111827;
        }

        .subtitle {
          margin: 0;
          font-size: 14px;
          color: #6B7280;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .branding-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .branding-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .branding-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .branding-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          padding-bottom: 12px;
          border-bottom: 1px solid #E5E7EB;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        input[type="text"] {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          font-size: 14px;
          color: #111827;
          transition: all 0.2s;
        }

        input[type="text"]:focus {
          outline: none;
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .help-text {
          margin: 6px 0 0 0;
          font-size: 12px;
          color: #6B7280;
        }

        .current-logo {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .logo-preview {
          width: 120px;
          height: 120px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F9FAFB;
          color: #9CA3AF;
        }

        .logo-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }

        .logo-info p {
          margin: 0;
          font-size: 13px;
          color: #6B7280;
        }

        .upload-area {
          background: #F9FAFB;
          border: 2px dashed #D1D5DB;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 16px;
        }

        .upload-area:hover {
          border-color: #2563EB;
          background: #EFF6FF;
        }

        .upload-area p {
          margin: 8px 0 0 0;
          font-size: 14px;
          color: #374151;
        }

        .upload-hint {
          font-size: 12px !important;
          color: #9CA3AF !important;
        }

        .upload-actions {
          display: flex;
          gap: 12px;
        }

        .color-input-group {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .color-input-group input {
          flex: 1;
        }

        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          flex-shrink: 0;
        }

        .color-presets {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .preset-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-btn:hover {
          background: #F9FAFB;
          border-color: #2563EB;
          color: #2563EB;
        }

        .font-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .radio-label input[type="radio"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .radio-label span {
          font-size: 14px;
          color: #374151;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .checkbox-label span {
          font-size: 14px;
          color: #374151;
        }

        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #E5E7EB;
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563EB;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563EB;
          cursor: pointer;
          border: none;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
        }

        .slider-labels span {
          font-size: 12px;
          color: #6B7280;
        }

        .sticky-preview {
          position: sticky;
          top: 24px;
        }

        .calculator-preview {
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 24px;
          min-height: 400px;
        }

        .preview-header {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 16px;
        }

        .preview-logo {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: #F9FAFB;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9CA3AF;
        }

        .preview-header h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .preview-header p {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #6B7280;
        }

        .preview-divider {
          height: 1px;
          background: #E5E7EB;
          margin: 16px 0;
        }

        .preview-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preview-field label {
          margin-bottom: 6px;
          font-size: 13px;
        }

        .preview-input,
        .preview-select {
          padding: 10px 12px;
          border: 1px solid #D1D5DB;
          font-size: 14px;
          color: #6B7280;
        }

        .preview-button {
          padding: 12px 24px;
          color: white;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
        }

        .preview-footer {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #E5E7EB;
          text-align: center;
        }

        .preview-footer small {
          font-size: 11px;
          color: #9CA3AF;
        }

        .page-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-primary {
          padding: 12px 32px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #1D4ED8;
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
        }

        .btn-secondary {
          padding: 12px 24px;
          background: white;
          color: #374151;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #F9FAFB;
          border-color: #9CA3AF;
        }

        .btn-danger {
          padding: 12px 24px;
          background: white;
          color: #DC2626;
          border: 1px solid #DC2626;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-danger:hover {
          background: #FEF2F2;
        }

        @media (max-width: 1024px) {
          .branding-grid {
            grid-template-columns: 1fr;
          }

          .sticky-preview {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminBranding;
