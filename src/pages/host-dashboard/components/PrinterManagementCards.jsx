import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PrinterManagementCards = () => {
  const [printers, setPrinters] = useState([
    {
      id: 1,
      name: 'Prusa i3 MK3S+',
      status: 'active',
      utilization: 85,
      currentJob: 'Prototyp telefonu',
      completionTime: '2h 15min',
      totalJobs: 127,
      rating: 4.8,
      materials: ['PLA', 'PETG', 'ABS'],
      bedSize: '250×210×210mm',
      lastMaintenance: '5. prosince 2024'
    },
    {
      id: 2,
      name: 'Ender 3 V2',
      status: 'printing',
      utilization: 92,
      currentJob: 'Díly pro dron',
      completionTime: '4h 32min',
      totalJobs: 89,
      rating: 4.6,
      materials: ['PLA', 'ABS'],
      bedSize: '220×220×250mm',
      lastMaintenance: '28. listopadu 2024'
    },
    {
      id: 3,
      name: 'Artillery Sidewinder X2',
      status: 'maintenance',
      utilization: 0,
      currentJob: null,
      completionTime: null,
      totalJobs: 156,
      rating: 4.9,
      materials: ['PLA', 'PETG', 'ABS', 'TPU'],
      bedSize: '300×300×400mm',
      lastMaintenance: '12. prosince 2024'
    },
    {
      id: 4,
      name: 'Bambu Lab X1 Carbon',
      status: 'paused',
      utilization: 78,
      currentJob: null,
      completionTime: null,
      totalJobs: 203,
      rating: 4.9,
      materials: ['PLA', 'PETG', 'ABS', 'ASA', 'PC'],
      bedSize: '256×256×256mm',
      lastMaintenance: '1. prosince 2024'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case'printing':
        return 'text-success bg-success/20';
      case 'paused':
        return 'text-warning bg-warning/20';
      case 'maintenance':
        return 'text-error bg-error/20';
      default:
        return 'text-muted-foreground bg-muted/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktivní';
      case 'printing':
        return 'Tiskne';
      case 'paused':
        return 'Pozastaveno';
      case 'maintenance':
        return 'Údržba';
      default:
        return 'Neznámý';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'printing':
        return 'Play';
      case 'paused':
        return 'Pause';
      case 'maintenance':
        return 'Wrench';
      default:
        return 'Circle';
    }
  };

  const togglePrinterStatus = (printerId) => {
    setPrinters(printers?.map(printer => {
      if (printer?.id === printerId) {
        const newStatus = printer?.status === 'active' ? 'paused' : 'active';
        return { ...printer, status: newStatus };
      }
      return printer;
    }));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Správa tiskáren</h2>
        <Button variant="default" size="sm" iconName="Plus" iconPosition="left">
          Přidat tiskárnu
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {printers?.map((printer) => (
          <div key={printer?.id} className="bg-muted/30 rounded-lg p-4 border border-border/50">
            {/* Printer Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground mb-1">{printer?.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(printer?.status)}`}>
                    <Icon name={getStatusIcon(printer?.status)} size={12} />
                    <span>{getStatusText(printer?.status)}</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm text-muted-foreground">{printer?.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => togglePrinterStatus(printer?.id)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-micro rounded-lg hover:bg-muted"
                  disabled={printer?.status === 'maintenance'}
                >
                  <Icon name={printer?.status === 'active' ? 'Pause' : 'Play'} size={16} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-micro rounded-lg hover:bg-muted">
                  <Icon name="Settings" size={16} />
                </button>
              </div>
            </div>

            {/* Current Job */}
            {printer?.currentJob && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Aktuální zakázka</span>
                  <span className="text-xs text-primary font-medium">{printer?.completionTime}</span>
                </div>
                <div className="text-sm text-muted-foreground">{printer?.currentJob}</div>
                <div className="mt-2 bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.random() * 40 + 30}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Printer Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Využití</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full transition-all duration-300"
                      style={{ width: `${printer?.utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{printer?.utilization}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Celkem zakázek</div>
                <div className="text-sm font-medium text-foreground">{printer?.totalJobs}</div>
              </div>
            </div>

            {/* Printer Specs */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Rozměr lože:</span>
                <span className="text-foreground font-medium">{printer?.bedSize}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Materiály:</span>
                <div className="flex items-center space-x-1">
                  {printer?.materials?.map((material, index) => (
                    <span key={index} className="bg-muted text-foreground px-2 py-1 rounded text-xs">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Poslední údržba:</span>
                <span className="text-foreground font-medium">{printer?.lastMaintenance}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="Calendar" iconPosition="left" className="flex-1">
                Naplánovat údržbu
              </Button>
              <Button variant="ghost" size="sm" iconName="BarChart3" iconPosition="left" className="flex-1">
                Statistiky
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{printers?.length}</div>
            <div className="text-sm text-muted-foreground">Celkem tiskáren</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {printers?.filter(p => p?.status === 'active' || p?.status === 'printing')?.length}
            </div>
            <div className="text-sm text-muted-foreground">Aktivní</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(printers?.reduce((acc, p) => acc + p?.utilization, 0) / printers?.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Průměrné využití</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {printers?.reduce((acc, p) => acc + p?.totalJobs, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Celkem zakázek</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterManagementCards;