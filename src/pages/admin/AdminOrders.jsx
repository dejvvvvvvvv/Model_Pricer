import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminOrders = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const mockOrders = [
    { id: '001234', timestamp: '2025-12-08 11:00', filename: 'xyz_calibration_cube.stl', material: 'PLA', time: '1h 0m', weight: '15.5g', price: 75.50 },
    { id: '001233', timestamp: '2025-12-07 15:30', filename: 'benchy.stl', material: 'PETG', time: '2h 15m', weight: '28.3g', price: 142.80 },
    { id: '001232', timestamp: '2025-12-07 10:20', filename: 'phone_stand.stl', material: 'PLA', time: '45m', weight: '12.1g', price: 62.30 },
    { id: '001231', timestamp: '2025-12-06 14:45', filename: 'gear_assembly.stl', material: 'ABS', time: '3h 30m', weight: '42.7g', price: 198.50 },
  ];

  return (
    <div className="admin-orders">
      <div className="page-header">
        <div>
          <h1>{t('admin.orders.title')}</h1>
          <p className="subtitle">{t('admin.orders.subtitle')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h3>{t('admin.orders.filters')}</h3>
        <div className="filters-row">
          <div className="search-box">
            <Icon name="Search" size={18} />
            <input
              type="text"
              placeholder={t('admin.orders.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select">
            <option>Date Range</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <select className="filter-select">
            <option>Material</option>
            <option>PLA</option>
            <option>ABS</option>
            <option>PETG</option>
          </select>
          <button className="btn-clear">Clear</button>
        </div>
      </div>

      {/* Order History */}
      <div className="orders-section">
        <h3>Order History</h3>
        <div className="orders-list">
          {mockOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">#{order.id}</span>
                <span className="order-date">{order.timestamp}</span>
              </div>
              <div className="order-filename">{order.filename}</div>
              <div className="order-details">
                <span>Material: {order.material}</span>
                <span>•</span>
                <span>Time: {order.time}</span>
                <span>•</span>
                <span>{order.weight}</span>
              </div>
              <div className="order-footer">
                <span className="order-price">{order.price.toFixed(2)} Kč</span>
                <button className="btn-view">
                  <Icon name="Eye" size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <Icon name="ChevronLeft" size={16} />
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-orders {
          max-width: 1000px;
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

        .filters-section,
        .orders-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filters-section h3,
        .orders-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          padding-bottom: 12px;
          border-bottom: 1px solid #E5E7EB;
        }

        .filters-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          background: white;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #111827;
        }

        .search-box input::placeholder {
          color: #9CA3AF;
        }

        .filter-select {
          padding: 10px 12px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 14px;
          color: #374151;
          background: white;
          cursor: pointer;
        }

        .btn-clear {
          padding: 10px 20px;
          background: white;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-clear:hover {
          background: #F9FAFB;
          border-color: #9CA3AF;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .order-card {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
        }

        .order-card:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-color: #D1D5DB;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .order-id {
          font-size: 14px;
          font-weight: 600;
          color: #6B7280;
        }

        .order-date {
          font-size: 13px;
          color: #9CA3AF;
        }

        .order-filename {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }

        .order-details {
          display: flex;
          gap: 8px;
          font-size: 13px;
          color: #6B7280;
          margin-bottom: 12px;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-price {
          font-size: 18px;
          font-weight: 700;
          color: #2563EB;
        }

        .btn-view {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #2563EB;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #2563EB;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view:hover {
          background: #EFF6FF;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #E5E7EB;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #F9FAFB;
          border-color: #9CA3AF;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 14px;
          color: #6B7280;
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
