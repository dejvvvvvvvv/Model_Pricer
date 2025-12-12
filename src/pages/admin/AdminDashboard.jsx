import React from 'react';
import Icon from '../../components/AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  // Mock data
  const stats = {
    materials: 6,
    fees: 3,
    timeRate: 150,
    presets: 2
  };

  const recentActivity = language === 'cs' ? [
    { id: 1, text: 'Materiál "PETG" - cena aktualizována na 0.65 Kč/g', type: 'update', time: 'před 2 hodinami' },
    { id: 2, text: 'Nový poplatek "Expresní doručení" přidán', type: 'add', time: 'před 5 hodinami' },
    { id: 3, text: 'Hodinová sazba změněna na 150 Kč/h', type: 'update', time: 'před 1 dnem' },
    { id: 4, text: 'Preset "high_quality.ini" nahrán', type: 'add', time: 'před 2 dny' },
  ] : [
    { id: 1, text: 'Material "PETG" price updated to 0.65 Kč/g', type: 'update', time: '2 hours ago' },
    { id: 2, text: 'New fee "Express delivery" added', type: 'add', time: '5 hours ago' },
    { id: 3, text: 'Time rate changed to 150 Kč/h', type: 'update', time: '1 day ago' },
    { id: 4, text: 'Preset "high_quality.ini" uploaded', type: 'add', time: '2 days ago' },
  ];

  const statCards = [
    { label: t('admin.dashboard.stats.materials'), value: stats.materials, icon: 'Package', color: '#2563EB', change: '+2 this month' },
    { label: t('admin.dashboard.stats.fees'), value: stats.fees, icon: 'Receipt', color: '#10B981', change: '+1 this week' },
    { label: t('admin.dashboard.stats.timeRate'), value: `${stats.timeRate} Kč/h`, icon: 'Clock', color: '#F59E0B', change: 'Updated 1d ago' },
    { label: t('admin.dashboard.stats.presets'), value: stats.presets, icon: 'Layers', color: '#8B5CF6', change: 'No changes' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{t('admin.dashboard.title')}</h1>
          <p className="subtitle">{t('admin.dashboard.subtitle')}</p>
        </div>
        <button className="btn-refresh">
          <Icon name="RefreshCw" size={18} />
          {t('admin.dashboard.refresh')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <Icon name={stat.icon} size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h2 className="stat-value">{stat.value}</h2>
              <p className="stat-change">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h3>{t('admin.dashboard.activity')}</h3>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-dot ${activity.type}`}></div>
              <div className="activity-content">
                <p>{activity.text}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3>{t('admin.dashboard.quickActions')}</h3>
        <div className="quick-actions">
          <button className="action-btn">
            <Icon name="Plus" size={18} />
            {t('admin.dashboard.addMaterial')}
          </button>
          <button className="action-btn">
            <Icon name="Plus" size={18} />
            {t('admin.dashboard.addFee')}
          </button>
          <button className="action-btn">
            <Icon name="Upload" size={18} />
            {t('admin.dashboard.uploadPreset')}
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          max-width: 1400px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
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

        .btn-refresh {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-refresh:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 16px;
          transition: all 0.2s;
        }

        .stat-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #6B7280;
          font-weight: 500;
        }

        .stat-value {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }

        .stat-change {
          margin: 0;
          font-size: 12px;
          color: #9CA3AF;
        }

        .dashboard-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .dashboard-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          padding-bottom: 12px;
          border-bottom: 1px solid #E5E7EB;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .activity-dot.update {
          background: #3B82F6;
        }

        .activity-dot.add {
          background: #10B981;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
        }

        .activity-time {
          font-size: 12px;
          color: #9CA3AF;
        }

        .quick-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #1D4ED8;
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
