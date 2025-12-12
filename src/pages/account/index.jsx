import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const AccountPage = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock data pro vývoj
  const [profileData, setProfileData] = useState({
    firstName: 'Jan',
    lastName: 'Novák',
    email: 'jan.novak@example.com',
    phone: '+420 123 456 789',
    company: 'ModelPricer s.r.o.',
    ico: '12345678',
    dic: 'CZ12345678',
    address: 'Hlavní 123',
    city: 'Praha',
    zip: '110 00',
    country: 'Česká republika'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    alert(language === 'cs' ? '✅ Profil uložen! (Mock - zatím nepropojeno s backendem)' : '✅ Profile saved! (Mock - not connected to backend yet)');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(language === 'cs' ? '❌ Hesla se neshodují!' : '❌ Passwords do not match!');
      return;
    }
    console.log('Changing password');
    alert(language === 'cs' ? '✅ Heslo změněno! (Mock - zatím nepropojeno s backendem)' : '✅ Password changed! (Mock - not connected to backend yet)');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const t = {
    // Page header
    'account.title': language === 'cs' ? 'Nastavení účtu' : 'Account Settings',
    'account.subtitle': language === 'cs' ? 'Spravujte informace o účtu a předvolby' : 'Manage your account information and preferences',
    
    // Tabs
    'tab.profile': language === 'cs' ? 'Profil' : 'Profile',
    'tab.company': language === 'cs' ? 'Firma' : 'Company Info',
    'tab.security': language === 'cs' ? 'Zabezpečení' : 'Security',
    'tab.billing': language === 'cs' ? 'Fakturace' : 'Billing',
    
    // Profile tab
    'profile.title': language === 'cs' ? 'Osobní informace' : 'Personal Information',
    'profile.firstName': language === 'cs' ? 'Jméno' : 'First Name',
    'profile.lastName': language === 'cs' ? 'Příjmení' : 'Last Name',
    'profile.email': language === 'cs' ? 'Emailová adresa' : 'Email Address',
    'profile.phone': language === 'cs' ? 'Telefonní číslo' : 'Phone Number',
    
    // Company tab
    'company.title': language === 'cs' ? 'Informace o firmě' : 'Company Information',
    'company.name': language === 'cs' ? 'Název firmy' : 'Company Name',
    'company.ico': language === 'cs' ? 'IČO' : 'Company ID (IČO)',
    'company.dic': language === 'cs' ? 'DIČ' : 'VAT ID (DIČ)',
    'company.address': language === 'cs' ? 'Adresa' : 'Address',
    'company.city': language === 'cs' ? 'Město' : 'City',
    'company.zip': language === 'cs' ? 'PSČ' : 'ZIP Code',
    'company.country': language === 'cs' ? 'Země' : 'Country',
    
    // Security tab
    'security.title': language === 'cs' ? 'Změnit heslo' : 'Change Password',
    'security.current': language === 'cs' ? 'Současné heslo' : 'Current Password',
    'security.new': language === 'cs' ? 'Nové heslo' : 'New Password',
    'security.confirm': language === 'cs' ? 'Potvrdit nové heslo' : 'Confirm New Password',
    'security.2fa.title': language === 'cs' ? 'Dvoufaktorové ověření' : 'Two-Factor Authentication',
    'security.2fa.desc': language === 'cs' ? 'Přidejte další vrstvu zabezpečení k vašemu účtu' : 'Add an extra layer of security to your account',
    'security.2fa.enable': language === 'cs' ? 'Zapnout 2FA' : 'Enable 2FA',
    'security.sessions.title': language === 'cs' ? 'Aktivní relace' : 'Active Sessions',
    'security.sessions.desc': language === 'cs' ? 'Spravujte zařízení, na kterých jste přihlášeni' : 'Manage devices where you\'re currently logged in',
    'security.sessions.current': language === 'cs' ? 'Aktuální relace' : 'Current session',
    
    // Billing tab
    'billing.title': language === 'cs' ? 'Fakturace a předplatné' : 'Billing & Subscription',
    'billing.plan.title': language === 'cs' ? 'Aktuální tarif' : 'Current Plan',
    'billing.plan.name': language === 'cs' ? 'Professional tarif' : 'Professional Plan',
    'billing.plan.change': language === 'cs' ? 'Změnit tarif' : 'Change Plan',
    'billing.plan.cancel': language === 'cs' ? 'Zrušit předplatné' : 'Cancel Subscription',
    'billing.payment.title': language === 'cs' ? 'Platební metody' : 'Payment Methods',
    'billing.payment.add': language === 'cs' ? 'Přidat platební metodu' : 'Add Payment Method',
    'billing.payment.expires': language === 'cs' ? 'Platnost do' : 'Expires',
    'billing.payment.edit': language === 'cs' ? 'Upravit' : 'Edit',
    'billing.payment.remove': language === 'cs' ? 'Odebrat' : 'Remove',
    'billing.history.title': language === 'cs' ? 'Historie faktur' : 'Billing History',
    'billing.history.download': language === 'cs' ? 'Stáhnout PDF' : 'Download PDF',
    
    // Common
    'common.cancel': language === 'cs' ? 'Zrušit' : 'Cancel',
    'common.save': language === 'cs' ? 'Uložit změny' : 'Save Changes',
    'common.change': language === 'cs' ? 'Změnit heslo' : 'Change Password',
  };

  return (
    <div className="account-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>{t['account.title']}</h1>
            <p className="subtitle">{t['account.subtitle']}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <Icon name="User" size={18} />
            <span>{t['tab.profile']}</span>
          </button>
          <button
            className={`tab ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => setActiveTab('company')}
          >
            <Icon name="Building" size={18} />
            <span>{t['tab.company']}</span>
          </button>
          <button
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Icon name="Lock" size={18} />
            <span>{t['tab.security']}</span>
          </button>
          <button
            className={`tab ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            <Icon name="CreditCard" size={18} />
            <span>{t['tab.billing']}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="content-section">
              <h2>{t['profile.title']}</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>{t['profile.firstName']}</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    placeholder={t['profile.firstName']}
                  />
                </div>
                <div className="form-group">
                  <label>{t['profile.lastName']}</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    placeholder={t['profile.lastName']}
                  />
                </div>
                <div className="form-group full-width">
                  <label>{t['profile.email']}</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    placeholder={t['profile.email']}
                  />
                </div>
                <div className="form-group full-width">
                  <label>{t['profile.phone']}</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    placeholder={t['profile.phone']}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-secondary">{t['common.cancel']}</button>
                <button className="btn-primary" onClick={handleSaveProfile}>
                  {t['common.save']}
                </button>
              </div>
            </div>
          )}

          {/* COMPANY TAB */}
          {activeTab === 'company' && (
            <div className="content-section">
              <h2>{t['company.title']}</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>{t['company.name']}</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleProfileChange('company', e.target.value)}
                    placeholder={t['company.name']}
                  />
                </div>
                <div className="form-group">
                  <label>{t['company.ico']}</label>
                  <input
                    type="text"
                    value={profileData.ico}
                    onChange={(e) => handleProfileChange('ico', e.target.value)}
                    placeholder={t['company.ico']}
                  />
                </div>
                <div className="form-group">
                  <label>{t['company.dic']}</label>
                  <input
                    type="text"
                    value={profileData.dic}
                    onChange={(e) => handleProfileChange('dic', e.target.value)}
                    placeholder={t['company.dic']}
                  />
                </div>
                <div className="form-group full-width">
                  <label>{t['company.address']}</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    placeholder={t['company.address']}
                  />
                </div>
                <div className="form-group">
                  <label>{t['company.city']}</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => handleProfileChange('city', e.target.value)}
                    placeholder={t['company.city']}
                  />
                </div>
                <div className="form-group">
                  <label>{t['company.zip']}</label>
                  <input
                    type="text"
                    value={profileData.zip}
                    onChange={(e) => handleProfileChange('zip', e.target.value)}
                    placeholder={t['company.zip']}
                  />
                </div>
                <div className="form-group full-width">
                  <label>{t['company.country']}</label>
                  <select
                    value={profileData.country}
                    onChange={(e) => handleProfileChange('country', e.target.value)}
                  >
                    <option>Česká republika</option>
                    <option>Slovensko</option>
                    <option>Polsko</option>
                    <option>Německo</option>
                    <option>Rakousko</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-secondary">{t['common.cancel']}</button>
                <button className="btn-primary" onClick={handleSaveProfile}>
                  {t['common.save']}
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="content-section">
              <h2>{t['security.title']}</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>{t['security.current']}</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder={t['security.current']}
                  />
                </div>
                <div className="form-group full-width">
                  <label>{t['security.new']}</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder={t['security.new']}
                  />
                </div>
                <div className="form-group full-width">
                  <label>{t['security.confirm']}</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder={t['security.confirm']}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-secondary">{t['common.cancel']}</button>
                <button className="btn-primary" onClick={handleChangePassword}>
                  {t['common.change']}
                </button>
              </div>

              <div className="security-info">
                <h3>{t['security.2fa.title']}</h3>
                <p>{t['security.2fa.desc']}</p>
                <button className="btn-outline">{t['security.2fa.enable']}</button>
              </div>

              <div className="security-info">
                <h3>{t['security.sessions.title']}</h3>
                <p>{t['security.sessions.desc']}</p>
                <div className="session-list">
                  <div className="session-item">
                    <div className="session-icon">
                      <Icon name="Monitor" size={20} />
                    </div>
                    <div className="session-details">
                      <strong>Windows PC - Chrome</strong>
                      <span>{language === 'cs' ? 'Praha, Česká republika • Aktivní nyní' : 'Prague, Czech Republic • Active now'}</span>
                    </div>
                    <button className="btn-text">{t['security.sessions.current']}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="content-section">
              <h2>{t['billing.title']}</h2>
              
              <div className="billing-card">
                <div className="billing-header">
                  <div>
                    <h3>{t['billing.plan.title']}</h3>
                    <p className="plan-name">{t['billing.plan.name']}</p>
                  </div>
                  <div className="plan-price">
                    <span className="price">1,299 {language === 'cs' ? 'Kč' : 'CZK'}</span>
                    <span className="period">/{language === 'cs' ? 'měsíc' : 'month'}</span>
                  </div>
                </div>
                <div className="billing-features">
                  <div className="feature">
                    <Icon name="Check" size={16} />
                    <span>{language === 'cs' ? 'Neomezené kalkulace' : 'Unlimited calculations'}</span>
                  </div>
                  <div className="feature">
                    <Icon name="Check" size={16} />
                    <span>{language === 'cs' ? 'Pokročilý branding' : 'Advanced branding'}</span>
                  </div>
                  <div className="feature">
                    <Icon name="Check" size={16} />
                    <span>{language === 'cs' ? 'Prioritní podpora' : 'Priority support'}</span>
                  </div>
                  <div className="feature">
                    <Icon name="Check" size={16} />
                    <span>{language === 'cs' ? 'API přístup' : 'API access'}</span>
                  </div>
                </div>
                <div className="billing-actions">
                  <button className="btn-outline">{t['billing.plan.change']}</button>
                  <button className="btn-text-danger">{t['billing.plan.cancel']}</button>
                </div>
              </div>

              <div className="payment-methods">
                <h3>{t['billing.payment.title']}</h3>
                <div className="payment-card">
                  <div className="card-icon">
                    <Icon name="CreditCard" size={24} />
                  </div>
                  <div className="card-details">
                    <strong>Visa {language === 'cs' ? 'končící na' : 'ending in'} 4242</strong>
                    <span>{t['billing.payment.expires']} 12/2025</span>
                  </div>
                  <div className="card-actions">
                    <button className="btn-text">{t['billing.payment.edit']}</button>
                    <button className="btn-text">{t['billing.payment.remove']}</button>
                  </div>
                </div>
                <button className="btn-outline">
                  <Icon name="Plus" size={16} />
                  {t['billing.payment.add']}
                </button>
              </div>

              <div className="billing-history">
                <h3>{t['billing.history.title']}</h3>
                <div className="invoice-list">
                  <div className="invoice-item">
                    <div className="invoice-date">{language === 'cs' ? '1. prosince 2024' : 'Dec 1, 2024'}</div>
                    <div className="invoice-amount">1,299 {language === 'cs' ? 'Kč' : 'CZK'}</div>
                    <button className="btn-text">{t['billing.history.download']}</button>
                  </div>
                  <div className="invoice-item">
                    <div className="invoice-date">{language === 'cs' ? '1. listopadu 2024' : 'Nov 1, 2024'}</div>
                    <div className="invoice-amount">1,299 {language === 'cs' ? 'Kč' : 'CZK'}</div>
                    <button className="btn-text">{t['billing.history.download']}</button>
                  </div>
                  <div className="invoice-item">
                    <div className="invoice-date">{language === 'cs' ? '1. října 2024' : 'Oct 1, 2024'}</div>
                    <div className="invoice-amount">1,299 {language === 'cs' ? 'Kč' : 'CZK'}</div>
                    <button className="btn-text">{t['billing.history.download']}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .account-page {
          min-height: calc(100vh - 64px);
          background: #f9fafb;
          padding: 40px 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .page-header {
          margin-bottom: 32px;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .subtitle {
          font-size: 14px;
          color: #6B7280;
          margin: 0;
        }

        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #E5E7EB;
          margin-bottom: 32px;
          overflow-x: auto;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: #6B7280;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab:hover {
          color: #111827;
        }

        .tab.active {
          color: #2563EB;
          border-bottom-color: #2563EB;
        }

        .tab-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .content-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 24px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        input, select {
          padding: 10px 12px;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          font-size: 14px;
          color: #111827;
          transition: all 0.2s;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-primary, .btn-secondary, .btn-outline, .btn-text, .btn-text-danger {
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #2563EB;
          color: white;
          border: none;
        }

        .btn-primary:hover {
          background: #1D4ED8;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #D1D5DB;
        }

        .btn-secondary:hover {
          background: #F9FAFB;
        }

        .btn-outline {
          background: white;
          color: #2563EB;
          border: 1px solid #2563EB;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-outline:hover {
          background: #EFF6FF;
        }

        .btn-text {
          background: none;
          color: #2563EB;
          border: none;
          padding: 4px 8px;
        }

        .btn-text:hover {
          text-decoration: underline;
        }

        .btn-text-danger {
          background: none;
          color: #DC2626;
          border: none;
          padding: 4px 8px;
        }

        .btn-text-danger:hover {
          text-decoration: underline;
        }

        .security-info {
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid #E5E7EB;
        }

        .security-info h3 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .security-info p {
          font-size: 14px;
          color: #6B7280;
          margin: 0 0 16px 0;
        }

        .session-list {
          margin-top: 16px;
        }

        .session-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #F9FAFB;
          border-radius: 8px;
        }

        .session-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B7280;
        }

        .session-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .session-details strong {
          font-size: 14px;
          color: #111827;
        }

        .session-details span {
          font-size: 12px;
          color: #6B7280;
        }

        .billing-card {
          background: #F9FAFB;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .billing-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .billing-header h3 {
          font-size: 14px;
          font-weight: 500;
          color: #6B7280;
          margin: 0 0 4px 0;
        }

        .plan-name {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .plan-price {
          text-align: right;
        }

        .price {
          font-size: 32px;
          font-weight: 700;
          color: #2563EB;
        }

        .period {
          font-size: 14px;
          color: #6B7280;
        }

        .billing-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
        }

        .billing-actions {
          display: flex;
          gap: 12px;
        }

        .payment-methods, .billing-history {
          margin-top: 32px;
        }

        .payment-methods h3, .billing-history h3 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .payment-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #F9FAFB;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B7280;
        }

        .card-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-details strong {
          font-size: 14px;
          color: #111827;
        }

        .card-details span {
          font-size: 12px;
          color: #6B7280;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .invoice-list {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
        }

        .invoice-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid #E5E7EB;
        }

        .invoice-item:last-child {
          border-bottom: none;
        }

        .invoice-date {
          font-size: 14px;
          color: #374151;
        }

        .invoice-amount {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full-width {
            grid-column: 1;
          }

          .billing-features {
            grid-template-columns: 1fr;
          }

          .tabs {
            overflow-x: scroll;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountPage;
