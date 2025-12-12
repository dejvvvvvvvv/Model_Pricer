import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const Pricing = () => {
  const { t, language } = useLanguage();
  
  const plans = [
    {
      name: t('pricing.plan.starter'),
      price: '499',
      period: t('pricing.monthly'),
      description: language === 'cs' ? 'Pro začínající tiskárny a jednotlivce' : 'For starting print shops and individuals',
      features: language === 'cs' ? [
        'Až 100 kalkulací měsíčně',
        'Základní branding (barvy, logo)',
        'Email podpora',
        '1 uživatel',
        'Základní statistiky'
      ] : [
        'Up to 100 calculations/month',
        'Basic branding (colors, logo)',
        'Email support',
        '1 user',
        'Basic statistics'
      ],
      cta: language === 'cs' ? 'Začít zdarma' : 'Start Free',
      highlighted: false
    },
    {
      name: t('pricing.plan.professional'),
      price: '1,299',
      period: t('pricing.monthly'),
      description: language === 'cs' ? 'Pro profesionální tiskárny a studia' : 'For professional print shops and studios',
      features: language === 'cs' ? [
        'Neomezené kalkulace',
        'Pokročilé branding (fonty, layout)',
        'Prioritní podpora',
        'Až 5 uživatelů',
        'Pokročilé statistiky a reporty',
        'API přístup',
        'Vlastní domény'
      ] : [
        'Unlimited calculations',
        'Advanced branding (fonts, layout)',
        'Priority support',
        'Up to 5 users',
        'Advanced statistics and reports',
        'API access',
        'Custom domains'
      ],
      cta: language === 'cs' ? 'Vyzkoušet zdarma' : 'Try Free',
      highlighted: true
    },
    {
      name: t('pricing.plan.enterprise'),
      price: t('pricing.custom'),
      period: '',
      description: language === 'cs' ? 'Pro velké tiskárny a e-shopy' : 'For large print shops and e-shops',
      features: language === 'cs' ? [
        'Vše z Professional',
        'White-label řešení',
        'Dedikovaný account manager',
        'Neomezený počet uživatelů',
        'SLA 99.9%',
        'Custom integrace',
        'On-premise možnost'
      ] : [
        'Everything from Professional',
        'White-label solution',
        'Dedicated account manager',
        'Unlimited users',
        'SLA 99.9%',
        'Custom integrations',
        'On-premise option'
      ],
      cta: language === 'cs' ? 'Kontaktovat' : 'Contact Us',
      highlighted: false
    }
  ];

  const faqs = language === 'cs' ? [
    {
      q: 'Můžu změnit tarif kdykoliv?',
      a: 'Ano, můžeš kdykoliv upgradovat nebo downgradovat svůj tarif.'
    },
    {
      q: 'Platí se předem?',
      a: 'Ano, platba probíhá vždy na začátku měsíce.'
    },
    {
      q: 'Nabízíte roční slevu?',
      a: 'Ano, při roční platbě získáš 20% slevu.'
    },
    {
      q: 'Co když překročím limit kalkulací?',
      a: 'Systém tě upozorní a můžeš upgradovat nebo dokoupit extra balíček.'
    }
  ] : [
    {
      q: 'Can I change my plan anytime?',
      a: 'Yes, you can upgrade or downgrade your plan at any time.'
    },
    {
      q: 'Do I pay in advance?',
      a: 'Yes, payment is always made at the beginning of the month.'
    },
    {
      q: 'Do you offer annual discounts?',
      a: 'Yes, you get 20% off with annual payment.'
    },
    {
      q: 'What if I exceed the calculation limit?',
      a: 'The system will notify you and you can upgrade or purchase an extra package.'
    }
  ];

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="container">
          <h1>{t('pricing.hero.title')}</h1>
          <p>{t('pricing.hero.subtitle')}</p>
        </div>
      </section>

      <section className="pricing-plans">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`plan-card ${plan.highlighted ? 'highlighted' : ''}`}>
                {plan.highlighted && <div className="popular-badge">{t('pricing.popular')}</div>}
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="amount">{plan.price}</span>
                  {plan.period && <span className="period"> {language === 'cs' ? 'Kč' : '$'}/{plan.period}</span>}
                </div>
                <p className="description">{plan.description}</p>
                <ul className="features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
                <Link to="/register" className={`plan-cta ${plan.highlighted ? 'primary' : 'secondary'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2>{language === 'cs' ? 'Často kladené otázky' : 'Frequently Asked Questions'}</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .pricing-page {
          width: 100%;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .pricing-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 120px 0 80px 0;
          text-align: center;
        }

        .pricing-hero h1 {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .pricing-hero p {
          font-size: 20px;
          opacity: 0.95;
        }

        .pricing-plans {
          padding: 80px 0;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .plan-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 40px;
          position: relative;
          transition: all 0.3s;
        }

        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }

        .plan-card.highlighted {
          border-color: #667eea;
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .plan-card h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 16px 0;
          color: #111827;
        }

        .price {
          margin-bottom: 16px;
        }

        .amount {
          font-size: 48px;
          font-weight: 700;
          color: #667eea;
        }

        .period {
          font-size: 16px;
          color: #6B7280;
        }

        .description {
          color: #6B7280;
          margin-bottom: 24px;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
        }

        .features li {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          color: #374151;
        }

        .plan-cta {
          display: block;
          width: 100%;
          padding: 14px;
          text-align: center;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .plan-cta.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .plan-cta.secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .plan-cta:hover {
          transform: translateY(-2px);
        }

        .faq-section {
          background: #f9fafb;
          padding: 80px 0;
        }

        .faq-section h2 {
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin: 0 0 60px 0;
          color: #111827;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 900px;
          margin: 0 auto;
        }

        .faq-item h4 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #111827;
        }

        .faq-item p {
          color: #6B7280;
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .plans-grid {
            grid-template-columns: 1fr;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Pricing;
