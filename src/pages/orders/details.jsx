import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockOrder = {
        id: id,
        date: "2024-07-20",
        status: "printing",
        total: 450,
        items: [
            { name: 'Miniaturní robot', quantity: 2, price: 225 },
        ],
        shippingAddress: "123 Main St, Anytown, USA 12345",
        paymentMethod: "Credit Card ending in 1234",
    };

    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 500);
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="max-w-7xl mx-auto px-6 py-8">
            <button onClick={() => navigate('/orders')} className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <Icon name="ChevronLeft" size={16} />
                <span>Back to Orders</span>
            </button>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Details</h1>
            <p className="text-muted-foreground">
              Order ID: {id}
            </p>
          </div>

          {loading ? (
            <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-4">Order Information</h2>
                        <p><strong>Date:</strong> {order.date}</p>
                        <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-medium rounded-full ${{
                            pending: 'bg-yellow-100 text-yellow-800',
                            printing: 'bg-blue-100 text-blue-800',
                            completed: 'bg-green-100 text-green-800',
                        }[order.status]}`}>{order.status}</span></p>
                        <p><strong>Total:</strong> {order.total} Kč</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-4">Shipping & Payment</h2>
                        <p><strong>Address:</strong> {order.shippingAddress}</p>
                        <p><strong>Payment:</strong> {order.paymentMethod}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Items</h2>
                    <ul className="divide-y divide-border">
                        {order.items.map((item, index) => (
                            <li key={index} className="py-2 flex justify-between">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>{item.price * item.quantity} Kč</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;