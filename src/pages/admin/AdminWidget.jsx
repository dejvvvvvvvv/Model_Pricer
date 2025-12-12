import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminWidget = () => {
  const { t, language } = useLanguage();
  const [config, setConfig] = useState({
    widgetType: 'full',
    theme: 'light',
    primaryColor: '#2563EB',
    width: 'fixed',
    fixedWidth: 800
  });

  const [copied, setCopied] = useState(false);

  const generateEmbedCode = () => {
    return `<script src="https://commun-printing.com/widget.js"></script>
<div id="3d-print-calculator"
     data-customer="test-customer-1"
     data-theme="${config.theme}"
     data-color="${config.primaryColor}"
     data-width="${config.width === 'fixed' ? config.fixedWidth + 'px' : 'auto'}">
</div>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="admin-widget">
      <div className="page-header">
        <div>
          <h1>{t('admin.widget.title')}</h1>
          <p className="subtitle">{t('admin.widget.subtitle')}</p>
        </div>
      </div>

      {/* Configuration */}
      <div className="widget-section">
        <h3>{t('admin.widget.configuration')}</h3>
        <div className="config-grid">
          <div className="config-group">
            <label>{t('admin.widget.widgetType')}</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  checked={config.widgetType === 'full'}
                  onChange={() => setConfig({ ...config, widgetType: 'full' })}
                />
                <span>Full Calculator</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  checked={config.widgetType === 'price'}
                  onChange={() => setConfig({ ...config, widgetType: 'price' })}
                />
                <span>Price Only</span>
              </label>
            </div>
          </div>

          <div className="config-group">
            <label>Theme:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  checked={config.theme === 'light'}
                  onChange={() => setConfig({ ...config, theme: 'light' })}
                />
                <span>Light</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  checked={config.theme === 'dark'}
                  onChange={() => setConfig({ ...config, theme: 'dark' })}
                />
                <span>Dark</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  checked={config.theme === 'auto'}
                  onChange={() => setConfig({ ...config, theme: 'auto' })}
                />
                <span>Auto</span>
              </label>
            </div>
          </div>

          <div className="config-group">
            <label>Primary Color:</label>
            <div className="color-input-group">
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
              />
              <div className="color-swatch" style={{ backgroundColor: config.primaryColor }}></div>
            </div>
          </div>

          <div className="config-group">
            <label>Width:</label>
            <div className="width-config">
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    checked={config.width === 'auto'}
                    onChange={() => setConfig({ ...config, width: 'auto' })}
                  />
                  <span>Auto</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    checked={config.width === 'fixed'}
                    onChange={() => setConfig({ ...config, width: 'fixed' })}
                  />
                  <span>Fixed:</span>
                </label>
              </div>
              {config.width === 'fixed' && (
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={config.fixedWidth}
                    onChange={(e) => setConfig({ ...config, fixedWidth: parseInt(e.target.value) })}
                  />
                  <span>px</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="widget-section">
        <h3>Preview</h3>
        <div className="preview-container">
          <div className="preview-widget" style={{ 
            maxWidth: config.width === 'fixed' ? `${config.fixedWidth}px` : '100%',
            backgroundColor: config.theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: config.theme === 'dark' ? '#F9FAFB' : '#111827'
          }}>
            <div className="preview-content">
              <h4>3D Print Calculator</h4>
              <p>Widget Preview</p>
              <button style={{ backgroundColor: config.primaryColor }}>
                Calculate Price
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embed Code */}
      <div className="widget-section">
        <div className="section-header">
          <h3>Embed Code</h3>
          <button className="btn-copy" onClick={handleCopy}>
            <Icon name={copied ? "Check" : "Copy"} size={16} />
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
        <div className="code-block">
          <pre>{generateEmbedCode()}</pre>
        </div>
      </div>

      {/* Instructions */}
      <div className="widget-section">
        <h3>Instructions</h3>
        <ol className="instructions-list">
          <li>Copy the embed code above</li>
          <li>Paste it into your website's HTML</li>
          <li>The calculator will appear automatically</li>
        </ol>
        <a href="#" className="docs-link">
          <Icon name="BookOpen" size={16} />
          Full documentation →
        </a>
      </div>

      <style jsx>{`
        .admin-widget {
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

        .widget-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .widget-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          padding-bottom: 12px;
          border-bottom: 1px solid #E5E7EB;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #E5E7EB;
        }

        .section-header h3 {
          margin: 0;
          padding: 0;
          border: none;
        }

        .config-grid {
          display: grid;
          gap: 24px;
        }

        .config-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .radio-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
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

        .color-input-group {
          display: flex;
          gap: 12px;
          align-items: center;
          max-width: 200px;
        }

        .color-input-group input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          font-size: 14px;
        }

        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          flex-shrink: 0;
        }

        .width-config {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 150px;
        }

        .input-with-unit input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          font-size: 14px;
        }

        .input-with-unit span {
          font-size: 14px;
          color: #6B7280;
        }

        .preview-container {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 24px;
          display: flex;
          justify-content: center;
        }

        .preview-widget {
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 32px;
          width: 100%;
          transition: all 0.3s;
        }

        .preview-content {
          text-align: center;
        }

        .preview-content h4 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .preview-content p {
          margin: 0 0 16px 0;
          font-size: 14px;
          opacity: 0.7;
        }

        .preview-content button {
          padding: 12px 24px;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-copy {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-copy:hover {
          background: #1D4ED8;
        }

        .code-block {
          background: #1F2937;
          border-radius: 8px;
          padding: 20px;
          overflow-x: auto;
        }

        .code-block pre {
          margin: 0;
          font-family: 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #F9FAFB;
        }

        .instructions-list {
          margin: 0 0 16px 0;
          padding-left: 24px;
        }

        .instructions-list li {
          margin-bottom: 8px;
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
        }

        .docs-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #2563EB;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .docs-link:hover {
          color: #1D4ED8;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default AdminWidget;
