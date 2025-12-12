import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const [filter, setFilter] = useState('all'); // all, unread, orders, system

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_update':
        return 'Package';
      case 'payment':
        return 'CreditCard';
      case 'printer':
        return 'Printer';
      case 'system':
        return 'Settings';
      case 'promotion':
        return 'Tag';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order_update':
        return 'text-primary bg-primary/10';
      case 'payment':
        return 'text-success bg-success/10';
      case 'printer':
        return 'text-warning bg-warning/10';
      case 'system':
        return 'text-muted-foreground bg-muted';
      case 'promotion':
        return 'text-accent bg-accent/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Právě teď';
    if (diffInMinutes < 60) return `před ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `před ${Math.floor(diffInMinutes / 60)} h`;
    return notificationTime?.toLocaleDateString('cs-CZ');
  };

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'unread') return !notification?.isRead;
    if (filter === 'orders') return notification?.type === 'order_update';
    if (filter === 'system') return notification?.type === 'system';
    return true;
  });

  const unreadCount = notifications?.filter(n => !n?.isRead)?.length;

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Oznámení</h2>
          {unreadCount > 0 && (
            <span className="bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            iconName="CheckCheck"
            iconPosition="left"
            onClick={onMarkAllAsRead}
          >
            Označit vše
          </Button>
        )}
      </div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {[
          { key: 'all', label: 'Vše', count: notifications?.length },
          { key: 'unread', label: 'Nepřečtené', count: unreadCount },
          { key: 'orders', label: 'Objednávky', count: notifications?.filter(n => n?.type === 'order_update')?.length },
          { key: 'system', label: 'Systém', count: notifications?.filter(n => n?.type === 'system')?.length }
        ]?.map(tab => (
          <button
            key={tab?.key}
            onClick={() => setFilter(tab?.key)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-micro ${
              filter === tab?.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab?.label}
            {tab?.count > 0 && (
              <span className="ml-1 text-xs">({tab?.count})</span>
            )}
          </button>
        ))}
      </div>
      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications?.length > 0 ? (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-4 rounded-lg border transition-micro cursor-pointer ${
                notification?.isRead
                  ? 'border-border bg-card hover:bg-muted/50' :'border-primary/20 bg-primary/5 hover:bg-primary/10'
              }`}
              onClick={() => onMarkAsRead(notification?.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification?.type)}`}>
                  <Icon name={getNotificationIcon(notification?.type)} size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`font-medium ${notification?.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification?.title}
                    </h4>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {formatTime(notification?.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification?.message}
                  </p>

                  {notification?.actionUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ArrowRight"
                      iconPosition="right"
                      onClick={(e) => {
                        e?.stopPropagation();
                        window.location.href = notification?.actionUrl;
                      }}
                    >
                      {notification?.actionText || 'Zobrazit detail'}
                    </Button>
                  )}
                </div>

                {!notification?.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">Žádná oznámení</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'unread' ?'Všechna oznámení jsou přečtená' :'Zatím nemáte žádná oznámení'
              }
            </p>
          </div>
        )}
      </div>
      {filteredNotifications?.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <Button variant="ghost" size="sm" iconName="MoreHorizontal">
            Zobrazit starší oznámení
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;