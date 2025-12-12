import React from 'react';
import Icon from '../../components/AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminPresets = () => {
  const { t, language } = useLanguage();
  const mockPresets = [
    { id: 1, name: 'test_config.ini', isDefault: true, uploadedAt: '2025-12-01 14:30', size: '12.5 KB' },
    { id: 2, name: 'high_quality.ini', isDefault: false, uploadedAt: '2025-12-02 10:15', size: '14.2 KB' },
  ];

  return (
    <div className="admin-presets">
      <div className="page-header">
        <div>
          <h1>{t('admin.presets.title')}</h1>
          <p className="subtitle">{t('admin.presets.subtitle')}</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="preset-section">
        <h3>{t('admin.presets.uploadNew')}</h3>
        <div className="upload-area">
          <Icon name="FileText" size={32} />
          <p>{t('admin.presets.dragDrop')}</p>
          <p className="upload-hint">{t('admin.presets.orClick')}</p>
        </div>
        <div className="upload-actions">
          <button className="btn-secondary">{language === 'cs' ? 'Vybrat soubor' : 'Choose File'}</button>
          <button className="btn-primary">{t('common.upload')}</button>
        </div>
      </div>

      {/* Existing Presets */}
      <div className="preset-section">
        <h3>{t('admin.presets.existing')}</h3>
        <div className="presets-list">
          {mockPresets.map((preset) => (
            <div key={preset.id} className="preset-card">
              <div className="preset-header">
                <div className="preset-icon">
                  <Icon name="FileText" size={24} />
                </div>
                <div className="preset-info">
                  <div className="preset-title">
                    <span>{preset.name}</span>
                    {preset.isDefault && (
                      <span className="default-badge">
                        <Icon name="Star" size={12} />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="preset-meta">
                    <span>Uploaded: {preset.uploadedAt}</span>
                    <span>•</span>
                    <span>Size: {preset.size}</span>
                  </div>
                </div>
              </div>
              <div className="preset-actions">
                {!preset.isDefault && (
                  <button className="btn-action">
                    <Icon name="Star" size={16} />
                    Set as Default
                  </button>
                )}
                <button className="btn-action">
                  <Icon name="Download" size={16} />
                  Download
                </button>
                <button className="btn-action danger">
                  <Icon name="Trash2" size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .admin-presets {
          max-width: 900px;
        }

        .page-header {
          margin-bottom: 32px;
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

        .preset-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .preset-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          padding-bottom: 12px;
          border-bottom: 1px solid #E5E7EB;
        }

        .upload-area {
          background: #F9FAFB;
          border: 2px dashed #D1D5DB;
          border-radius: 12px;
          padding: 48px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 16px;
          color: #6B7280;
        }

        .upload-area:hover {
          border-color: #2563EB;
          background: #EFF6FF;
          color: #2563EB;
        }

        .upload-area p {
          margin: 12px 0 0 0;
          font-size: 14px;
        }

        .upload-hint {
          font-size: 12px !important;
          color: #9CA3AF !important;
        }

        .upload-actions {
          display: flex;
          gap: 12px;
        }

        .presets-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preset-card {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s;
        }

        .preset-card:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-color: #D1D5DB;
        }

        .preset-header {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .preset-icon {
          width: 48px;
          height: 48px;
          background: #F9FAFB;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B7280;
          flex-shrink: 0;
        }

        .preset-info {
          flex: 1;
        }

        .preset-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .preset-title > span:first-child {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .default-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: #FEF3C7;
          color: #92400E;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .preset-meta {
          display: flex;
          gap: 8px;
          font-size: 13px;
          color: #6B7280;
        }

        .preset-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action:hover {
          background: #F9FAFB;
          border-color: #9CA3AF;
        }

        .btn-action.danger {
          color: #DC2626;
          border-color: #DC2626;
        }

        .btn-action.danger:hover {
          background: #FEF2F2;
        }

        .btn-primary {
          padding: 10px 24px;
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
          padding: 10px 24px;
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
      `}</style>
    </div>
  );
};

export default AdminPresets;
