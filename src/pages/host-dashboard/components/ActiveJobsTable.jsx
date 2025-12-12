import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveJobsTable = () => {
  const [jobs, setJobs] = useState([
    {
      id: 'ORD-2024-001',
      customer: 'Jan Novák',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      model: 'Prototyp telefonu',
      printer: 'Prusa i3 MK3S+',
      material: 'PLA',
      color: 'Černá',
      progress: 75,
      status: 'printing',
      estimatedCompletion: '2h 15min',
      startTime: '10:30',
      priority: 'normal',
      price: 450,
      quantity: 1,
      weight: '45g',
      printTime: '3h 20min'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Marie Svobodová',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      model: 'Díly pro dron (4ks)',
      printer: 'Ender 3 V2',
      material: 'PETG',
      color: 'Červená',
      progress: 45,
      status: 'printing',
      estimatedCompletion: '4h 32min',
      startTime: '08:45',
      priority: 'express',
      price: 680,
      quantity: 4,
      weight: '120g',
      printTime: '6h 45min'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Petr Dvořák',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      model: 'Náhradní díl',
      printer: 'Bambu Lab X1',
      material: 'ABS',
      color: 'Bílá',
      progress: 0,
      status: 'queued',
      estimatedCompletion: '1h 45min',
      startTime: null,
      priority: 'normal',
      price: 280,
      quantity: 1,
      weight: '25g',
      printTime: '1h 45min'
    },
    {
      id: 'ORD-2024-004',
      customer: 'Anna Krásná',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      model: 'Dekorativní váza',
      printer: 'Artillery Sidewinder',
      material: 'PLA',
      color: 'Zlatá',
      progress: 100,
      status: 'completed',
      estimatedCompletion: 'Dokončeno',
      startTime: '06:00',
      priority: 'normal',
      price: 320,
      quantity: 1,
      weight: '80g',
      printTime: '4h 15min'
    },
    {
      id: 'ORD-2024-005',
      customer: 'Tomáš Veselý',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      model: 'Miniaturní figurky (6ks)',
      printer: 'Prusa i3 MK3S+',
      material: 'Resin',
      color: 'Šedá',
      progress: 20,
      status: 'printing',
      estimatedCompletion: '5h 10min',
      startTime: '11:15',
      priority: 'normal',
      price: 890,
      quantity: 6,
      weight: '35g',
      printTime: '6h 30min'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'printing':
        return 'text-primary bg-primary/20';
      case 'queued':
        return 'text-warning bg-warning/20';
      case 'completed':
        return 'text-success bg-success/20';
      case 'paused':
        return 'text-muted-foreground bg-muted/20';
      default:
        return 'text-muted-foreground bg-muted/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'printing':
        return 'Tiskne';
      case 'queued':
        return 'Ve frontě';
      case 'completed':
        return 'Dokončeno';
      case 'paused':
        return 'Pozastaveno';
      default:
        return 'Neznámý';
    }
  };

  const getPriorityColor = (priority) => {
    return priority === 'express' ? 'text-error bg-error/20' : 'text-muted-foreground bg-muted/20';
  };

  const updateJobStatus = (jobId, newStatus) => {
    setJobs(jobs?.map(job => 
      job?.id === jobId ? { ...job, status: newStatus } : job
    ));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Aktivní zakázky</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Aktualizováno před 2 min</span>
          </div>
          <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
            Obnovit
          </Button>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Zakázka</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Zákazník</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Model</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tiskárna</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Pokrok</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Dokončení</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Akce</th>
            </tr>
          </thead>
          <tbody>
            {jobs?.map((job) => (
              <tr key={job?.id} className="border-b border-border/50 hover:bg-muted/30 transition-micro">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{job?.id}</span>
                    {job?.priority === 'express' && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(job?.priority)}`}>
                        Express
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{job?.price} Kč</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={job?.customerAvatar} alt={job?.customer} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{job?.customer}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-foreground">{job?.model}</div>
                  <div className="text-xs text-muted-foreground">
                    {job?.material} • {job?.color} • {job?.quantity}ks • {job?.weight}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-foreground">{job?.printer}</div>
                  <div className="text-xs text-muted-foreground">
                    {job?.startTime ? `Začátek: ${job?.startTime}` : 'Neplánováno'}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-background rounded-full h-2 min-w-[60px]">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job?.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-foreground min-w-[35px]">{job?.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job?.status)}`}>
                    {getStatusText(job?.status)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-foreground">{job?.estimatedCompletion}</div>
                  <div className="text-xs text-muted-foreground">Celkem: {job?.printTime}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1">
                    {job?.status === 'printing' && (
                      <button
                        onClick={() => updateJobStatus(job?.id, 'paused')}
                        className="p-2 text-muted-foreground hover:text-foreground transition-micro rounded-lg hover:bg-muted"
                        title="Pozastavit"
                      >
                        <Icon name="Pause" size={16} />
                      </button>
                    )}
                    {job?.status === 'paused' && (
                      <button
                        onClick={() => updateJobStatus(job?.id, 'printing')}
                        className="p-2 text-muted-foreground hover:text-foreground transition-micro rounded-lg hover:bg-muted"
                        title="Pokračovat"
                      >
                        <Icon name="Play" size={16} />
                      </button>
                    )}
                    <button className="p-2 text-muted-foreground hover:text-foreground transition-micro rounded-lg hover:bg-muted" title="Zpráva zákazníkovi">
                      <Icon name="MessageCircle" size={16} />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-foreground transition-micro rounded-lg hover:bg-muted" title="Detail zakázky">
                      <Icon name="Eye" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {jobs?.map((job) => (
          <div key={job?.id} className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">{job?.id}</span>
                {job?.priority === 'express' && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(job?.priority)}`}>
                    Express
                  </span>
                )}
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job?.status)}`}>
                {getStatusText(job?.status)}
              </span>
            </div>

            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={job?.customerAvatar} alt={job?.customer} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{job?.customer}</div>
                <div className="text-xs text-muted-foreground">{job?.model}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{job?.price} Kč</div>
                <div className="text-xs text-muted-foreground">{job?.estimatedCompletion}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-1 bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${job?.progress}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-foreground">{job?.progress}%</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>{job?.printer}</span>
              <span>{job?.material} • {job?.color}</span>
            </div>

            <div className="flex items-center space-x-2">
              {job?.status === 'printing' && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Pause"
                  iconPosition="left"
                  onClick={() => updateJobStatus(job?.id, 'paused')}
                  className="flex-1"
                >
                  Pozastavit
                </Button>
              )}
              {job?.status === 'paused' && (
                <Button
                  variant="default"
                  size="sm"
                  iconName="Play"
                  iconPosition="left"
                  onClick={() => updateJobStatus(job?.id, 'printing')}
                  className="flex-1"
                >
                  Pokračovat
                </Button>
              )}
              <Button variant="ghost" size="sm" iconName="MessageCircle" />
              <Button variant="ghost" size="sm" iconName="Eye" />
            </div>
          </div>
        ))}
      </div>
      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-foreground">{jobs?.filter(j => j?.status === 'printing')?.length}</div>
            <div className="text-xs text-muted-foreground">Aktivní tisky</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">{jobs?.filter(j => j?.status === 'queued')?.length}</div>
            <div className="text-xs text-muted-foreground">Ve frontě</div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">{jobs?.filter(j => j?.status === 'completed')?.length}</div>
            <div className="text-xs text-muted-foreground">Dokončeno dnes</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">
              {jobs?.reduce((acc, job) => acc + job?.price, 0)?.toLocaleString()} Kč
            </div>
            <div className="text-xs text-muted-foreground">Celková hodnota</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveJobsTable;