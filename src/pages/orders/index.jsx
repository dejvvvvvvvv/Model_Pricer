import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const mockOrders = [
        {
            id: "ORD-2025-001",
            date: "2024-07-20",
            status: "printing",
            total: 450,
            items: [
                { name: 'Miniaturní robot', quantity: 2, price: 225 },
            ]
        },
        {
            id: "ORD-2025-002",
            date: "2024-07-18",
            status: "completed",
            total: 180,
            items: [
                { name: 'Náhradní díl ventilátoru', quantity: 1, price: 180 },
            ]
        },
        {
            id: "ORD-2025-003",
            date: "2024-07-21",
            status: "pending",
            total: 320,
            items: [
                { name: 'Dekorativní váza', quantity: 1, price: 320 },
            ]
        },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your 3D printing orders.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
                <div className="flex space-x-4">
                    <button onClick={() => setActiveTab('all')} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>All</button>
                    <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'pending' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>Pending</button>
                    <button onClick={() => setActiveTab('printing')} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'printing' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>In Progress</button>
                    <button onClick={() => setActiveTab('completed')} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'completed' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>Completed</button>
                </div>
            </div>
            <div>
                {loading ? (
                    <div className="p-4 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <table className="w-full text-sm text-left text-muted-foreground">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Order ID</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Total</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="bg-card border-b border-border hover:bg-muted/50">
                                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${{
                                            pending: 'bg-yellow-100 text-yellow-800',
                                            printing: 'bg-blue-100 text-blue-800',
                                            completed: 'bg-green-100 text-green-800',
                                        }[order.status]}`}>{order.status}</span>
                                    </td>
                                    <td className="px-6 py-4">{order.total} Kč</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => navigate(`/orders/${order.id}`)} className="font-medium text-primary hover:underline">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
