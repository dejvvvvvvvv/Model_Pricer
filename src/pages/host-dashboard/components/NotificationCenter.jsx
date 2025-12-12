import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new_order',
      title: 'Nová objednávka',
      message: 'Jan Novák objednal prototyp telefonu',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      read: false,
      priority: 'high',
      actionRequired: true,
      orderId: 'ORD-2024-001'
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Údržba tiskárny',
      message: 'Artillery Sidewinder X2 vyžaduje údržbu',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      read: false,
      priority: 'medium',
      actionRequired: true,
      printerId: 3
    },
    {
      id: 3,
      type: 'payout',
      title: 'Výplata zpracována',
      message: 'Výplata 7,800 Kč byla úspěšně odeslána',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: true,
      priority: 'low',
      actionRequired: false,
      amount: 7800
    },
    {
      id: 4,
      type: 'print_completed',
      title: 'Tisk dokončen',
      message: 'Dekorativní váza pro Annu Krásnou je hotová',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      priority: 'medium',
      actionRequired: true,
      orderId: 'ORD-2024-004'
    },
    {
      id: 5,
      type: 'rating',
      title: 'Nové hodnocení',
      message: 'Petr Dvořák vás ohodnotil 5 hvězdičkami',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      read: true,
      priority: 'low',
      actionRequired: false,
      rating: 5
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_order':
        return 'ShoppingCart';
      case 'maintenance':
        return 'Wrench';
      case 'payout':
        return 'DollarSign';
      case 'print_completed':
        return 'CheckCircle';
      case 'rating':
        return 'Star';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error bg-error/20';
    if (priority === 'medium') return 'text-warning bg-warning/20';
    
    switch (type) {
      case 'new_order':
        return 'text-primary bg-primary/20';
      case 'maintenance':
        return 'text-warning bg-warning/20';
      case 'payout':
        return 'text-success bg-success/20';
      case 'print_completed':
        return 'text-success bg-success/20';
      case 'rating':
        return 'text-accent bg-accent/20';
      default:
        return 'text-muted-foreground bg-muted/20';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Právě teď';
    if (minutes < 60) return `před ${minutes} min`;
    if (hours < 24) return `před ${hours} h`;
    return `před ${days} dny`;
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications?.map(notification =>
      notification?.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications?.map(notification => ({ ...notification, read: true })));
  };

  const removeNotification = (notificationId) => {
    setNotifications(notifications?.filter(notification => notification?.id !== notificationId));
  };

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-foreground">Oznámení</h2>
          {unreadCount > 0 && (
            <span className="bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Označit vše jako přečtené
            </Button>
          )}
          <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
            Nastavení
          </Button>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Žádná nová oznámení</p>
          </div>
        ) : (
          notifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-4 rounded-lg border transition-micro hover:bg-muted/30 ${
                notification?.read 
                  ? 'bg-muted/10 border-border/50' :'bg-card border-border shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification?.type, notification?.priority)}`}>
                  <Icon name={getNotificationIcon(notification?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${notification?.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notification?.title}
                      </h3>
                      <p className={`text-sm mt-1 ${notification?.read ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {notification?.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification?.timestamp)}
                        </span>
                        {notification?.priority === 'high' && (
                          <span className="text-xs bg-error/20 text-error px-2 py-1 rounded-full">
                            Vysoká priorita
                          </span>
                        )}
                        {notification?.actionRequired && (
                          <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">
                            Vyžaduje akci
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification?.read && (
                        <button
                          onClick={() => markAsRead(notification?.id)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-micro rounded"
                          title="Označit jako přečtené"
                        >
                          <Icon name="Check" size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification?.id)}
                        className="p-1 text-muted-foreground hover:text-error transition-micro rounded"
                        title="Odstranit oznámení"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {notification?.actionRequired && (
                    <div className="mt-3 flex items-center space-x-2">
                      {notification?.type === 'new_order' && (
                        <>
                          <Button variant="default" size="sm">
                            Zobrazit objednávku
                          </Button>
                          <Button variant="outline" size="sm">
                            Kontaktovat zákazníka
                          </Button>
                        </>
                      )}
                      {notification?.type === 'maintenance' && (
                        <>
                          <Button variant="default" size="sm">
                            Naplánovat údržbu
                          </Button>
                          <Button variant="outline" size="sm">
                            Pozastavit tiskárnu
                          </Button>
                        </>
                      )}
                      {notification?.type === 'print_completed' && (
                        <>
                          <Button variant="default" size="sm">
                            Označit jako připraveno
                          </Button>
                          <Button variant="outline" size="sm">
                            Kontaktovat zákazníka
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">
              {notifications?.filter(n => n?.type === 'new_order' && !n?.read)?.length}
            </div>
            <div className="text-xs text-muted-foreground">Nové objednávky</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {notifications?.filter(n => n?.actionRequired && !n?.read)?.length}
            </div>
            <div className="text-xs text-muted-foreground">Vyžaduje akci</div>
          </div>
          <div>
            <div className="text-lg font-bold text-error">
              {notifications?.filter(n => n?.priority === 'high' && !n?.read)?.length}
            </div>
            <div className="text-xs text-muted-foreground">Vysoká priorita</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;