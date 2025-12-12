import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderCard = ({ order, onViewDetails, onContactHost, onReorder }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'printing':
        return 'text-primary bg-primary/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'printing':
        return 'Printer';
      case 'pending':
        return 'Clock';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-2 hover-scale transition-micro">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{order?.modelName}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status)}`}>
              <Icon name={getStatusIcon(order?.status)} size={12} className="mr-1" />
              {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Objednávka #{order?.id}</p>
          <p className="text-sm text-muted-foreground">Vytvořeno: {formatDate(order?.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-foreground">{order?.totalPrice} Kč</p>
          <p className="text-sm text-muted-foreground">{order?.quantity}x kusů</p>
        </div>
      </div>
      {order?.printer && (
        <div className="bg-muted rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Printer" size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{order?.printer?.name}</h4>
              <p className="text-sm text-muted-foreground">Hostitel: {order?.printer?.hostName}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-muted-foreground">
                  <Icon name="MapPin" size={12} className="inline mr-1" />
                  {order?.printer?.location}
                </span>
                <span className="text-xs text-muted-foreground">
                  <Icon name="Star" size={12} className="inline mr-1" />
                  {order?.printer?.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {order?.estimatedCompletion && (
        <div className="flex items-center space-x-2 mb-4 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Odhadované dokončení: {formatDate(order?.estimatedCompletion)}</span>
        </div>
      )}
      {order?.trackingInfo && (
        <div className="bg-primary/5 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Truck" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Sledování zásilky</span>
          </div>
          <p className="text-sm text-muted-foreground">{order?.trackingInfo}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          iconName="Eye"
          iconPosition="left"
          onClick={() => onViewDetails(order?.id)}
        >
          Detail
        </Button>
        
        {order?.printer && (
          <Button
            variant="outline"
            size="sm"
            iconName="MessageCircle"
            iconPosition="left"
            onClick={() => onContactHost(order?.printer?.hostId)}
          >
            Kontakt
          </Button>
        )}
        
        {order?.status === 'completed' && (
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={() => onReorder(order?.id)}
          >
            Znovu objednat
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;