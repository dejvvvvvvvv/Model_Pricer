import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <h1>{t('home.hero.title')}</h1>
              <h2>{t('home.hero.subtitle')}</h2>
              <div className="hero-buttons">
                <Link to="/register" className="btn-primary">{t('home.hero.cta.primary')}</Link>
                <Link to="/model-upload" className="btn-secondary">{t('home.hero.cta.secondary')}</Link>
              </div>
              <p className="hero-note">{t('home.hero.note')}</p>
            </div>
            <div className="hero-right">
              <div className="mockup-card">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="mockup-title">3D Print Calculator</span>
                </div>
                <div className="mockup-content">
                  <div className="upload-area">
                    <Icon name="Upload" size={32} />
                    <p>Upload STL Model</p>
                  </div>
                  <div className="params">
                    <div className="param-row">
                      <span>Material:</span>
                      <span>PLA</span>
                    </div>
                    <div className="param-row">
                      <span>Quality:</span>
                      <span>0.2mm</span>
                    </div>
                  </div>
                  <div className="price-display">
                    <span className="price-label">Total Price:</span>
                    <span className="price-value">$45</span>
                  </div>
                  <button className="mockup-btn">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="container">
          <p className="trust-main">{t('home.trust.main')}</p>
          <p className="trust-sub">{t('home.trust.sub')}</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">{t('home.how.title')}</h2>
          <p className="section-subtitle">{t('home.how.subtitle')}</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>{t('home.how.step1.title')}</h3>
              <p>{t('home.how.step1.desc')}</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>{t('home.how.step2.title')}</h3>
              <p>{t('home.how.step2.desc')}</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>{t('home.how.step3.title')}</h3>
              <p>{t('home.how.step3.desc')}</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>{t('home.how.step4.title')}</h3>
              <p>{t('home.how.step4.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">{t('home.features.title')}</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">
                <Icon name="Cpu" size={32} />
              </div>
              <h3>{t('home.features.slicer.title')}</h3>
              <p>{t('home.features.slicer.desc')}</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">
                <Icon name="DollarSign" size={32} />
              </div>
              <h3>{t('home.features.pricing.title')}</h3>
              <p>{t('home.features.pricing.desc')}</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">
                <Icon name="Layers" size={32} />
              </div>
              <h3>{t('home.features.presets.title')}</h3>
              <p>{t('home.features.presets.desc')}</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">
                <Icon name="Maximize2" size={32} />
              </div>
              <h3>{t('home.features.limits.title')}</h3>
              <p>{t('home.features.limits.desc')}</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">
                <Icon name="Palette" size={32} />
              </div>
              <h3>{t('home.features.branding.title')}</h3>
              <p>{t('home.features.branding.desc')}</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">
                <Icon name="ShoppingCart" size={32} />
              </div>
              <h3>{t('home.features.cart.title')}</h3>
              <p>{t('home.features.cart.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO PREVIEW */}
      <section className="demo-preview">
        <div className="container">
          <h2 className="section-title">{t('home.demo.title')}</h2>
          <p className="section-subtitle">{t('home.demo.subtitle')}</p>
          <div className="demo-container">
            <div className="demo-widget">
              <h3>Demo Calculator</h3>
              <div className="demo-upload">
                <Icon name="Upload" size={48} />
                <p>Upload STL Model</p>
              </div>
              <div className="demo-params">
                <select>
                  <option>Material: PLA</option>
                  <option>Material: PETG</option>
                  <option>Material: ABS</option>
                </select>
                <select>
                  <option>Quality: 0.2mm</option>
                  <option>Quality: 0.1mm</option>
                  <option>Quality: 0.3mm</option>
                </select>
              </div>
              <div className="demo-price">
                <span>Estimated Price:</span>
                <span className="price">$45</span>
              </div>
            </div>
          </div>
          <div className="demo-cta">
            <Link to="/register" className="btn-primary-large">{t('home.demo.cta')}</Link>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="pricing-teaser">
        <div className="container">
          <h2>{t('home.pricing.title')}</h2>
          <p>{t('home.pricing.subtitle')}</p>
          <Link to="/pricing" className="btn-white">{t('home.pricing.cta')}</Link>
        </div>
      </section>

      {/* FOR WHOM */}
      <section className="for-whom">
        <div className="container">
          <h2 className="section-title">{t('home.audience.title')}</h2>
          <div className="audience-grid">
            <div className="audience-box">
              <div className="audience-icon">
                <Icon name="Printer" size={40} />
              </div>
              <h3>{t('home.audience.printers.title')}</h3>
              <p>{t('home.audience.printers.desc')}</p>
            </div>
            <div className="audience-box">
              <div className="audience-icon">
                <Icon name="Lightbulb" size={40} />
              </div>
              <h3>{t('home.audience.studios.title')}</h3>
              <p>{t('home.audience.studios.desc')}</p>
            </div>
            <div className="audience-box">
              <div className="audience-icon">
                <Icon name="Store" size={40} />
              </div>
              <h3>{t('home.audience.shops.title')}</h3>
              <p>{t('home.audience.shops.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="container">
          <h2 className="section-title">{t('home.faq.title')}</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>{t('home.faq.q1')}</h3>
              <p>{t('home.faq.a1')}</p>
            </div>
            <div className="faq-item">
              <h3>{t('home.faq.q2')}</h3>
              <p>{t('home.faq.a2')}</p>
            </div>
            <div className="faq-item">
              <h3>{t('home.faq.q3')}</h3>
              <p>{t('home.faq.a3')}</p>
            </div>
          </div>
          <div className="faq-cta">
            <Link to="/support">{t('home.faq.more')}</Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          width: 100%;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* HERO */
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 120px 0 80px 0;
          margin-top: -64px;
          padding-top: 184px;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-left h1 {
          font-size: 48px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 24px 0;
        }

        .hero-left h2 {
          font-size: 20px;
          font-weight: 400;
          line-height: 1.6;
          margin: 0 0 32px 0;
          opacity: 0.95;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .btn-primary, .btn-secondary {
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .btn-primary {
          background: white;
          color: #667eea;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }

        .hero-note {
          font-size: 14px;
          opacity: 0.8;
        }

        .mockup-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .mockup-header {
          background: #f5f5f5;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mockup-dots {
          display: flex;
          gap: 6px;
        }

        .mockup-dots span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ddd;
        }

        .mockup-title {
          font-size: 13px;
          color: #666;
        }

        .mockup-content {
          padding: 32px;
          color: #333;
        }

        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          margin-bottom: 24px;
          color: #999;
        }

        .params {
          margin-bottom: 24px;
        }

        .param-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .price-display {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .price-value {
          font-size: 28px;
          font-weight: 700;
          color: #667eea;
        }

        .mockup-btn {
          width: 100%;
          padding: 14px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        /* TRUST BAR */
        .trust-bar {
          background: #f9fafb;
          padding: 40px 0;
          text-align: center;
        }

        .trust-main {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .trust-sub {
          font-size: 16px;
          color: #6B7280;
          margin: 0;
        }

        /* HOW IT WORKS */
        .how-it-works {
          padding: 80px 0;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin: 0 0 16px 0;
          color: #111827;
        }

        .section-subtitle {
          font-size: 18px;
          text-align: center;
          color: #6B7280;
          margin: 0 0 60px 0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        .step-card {
          text-align: center;
        }

        .step-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          margin: 0 auto 20px auto;
        }

        .step-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #111827;
        }

        .step-card p {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
        }

        /* FEATURES */
        .features {
          background: #f9fafb;
          padding: 80px 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .feature-box {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 20px;
        }

        .feature-box h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #111827;
        }

        .feature-box p {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
          margin: 0;
        }

        /* DEMO PREVIEW */
        .demo-preview {
          padding: 80px 0;
        }

        .demo-container {
          max-width: 600px;
          margin: 0 auto 40px auto;
        }

        .demo-widget {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 40px;
        }

        .demo-widget h3 {
          text-align: center;
          margin: 0 0 24px 0;
          font-size: 24px;
          color: #111827;
        }

        .demo-upload {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 60px;
          text-align: center;
          color: #9ca3af;
          margin-bottom: 24px;
        }

        .demo-params {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .demo-params select {
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .demo-price {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .demo-price .price {
          font-size: 28px;
          font-weight: 700;
          color: #667eea;
        }

        .demo-cta {
          text-align: center;
        }

        .btn-primary-large {
          padding: 18px 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .btn-primary-large:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        /* PRICING TEASER */
        .pricing-teaser {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }

        .pricing-teaser h2 {
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .pricing-teaser p {
          font-size: 18px;
          margin: 0 0 32px 0;
          opacity: 0.95;
        }

        .btn-white {
          padding: 16px 40px;
          background: white;
          color: #667eea;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .btn-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        /* FOR WHOM */
        .for-whom {
          padding: 80px 0;
        }

        .audience-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .audience-box {
          text-align: center;
          padding: 32px;
        }

        .audience-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 24px auto;
        }

        .audience-box h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #111827;
        }

        .audience-box p {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
        }

        /* FAQ */
        .faq {
          background: #f9fafb;
          padding: 80px 0;
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto 40px auto;
        }

        .faq-item {
          background: white;
          padding: 32px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .faq-item h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #111827;
        }

        .faq-item p {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
          margin: 0;
        }

        .faq-cta {
          text-align: center;
        }

        .faq-cta a {
          color: #667eea;
          font-weight: 600;
          text-decoration: none;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-left h1 {
            font-size: 32px;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .audience-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
