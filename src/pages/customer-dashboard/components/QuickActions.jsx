import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Nahrát nový model',
      description: 'Nahrajte STL/OBJ soubor pro tisk',
      icon: 'Upload',
      color: 'bg-primary text-primary-foreground',
      action: () => navigate('/model-upload'),
      primary: true
    },
    {
      title: 'Procházet tiskárny',
      description: 'Najděte nejlepší tiskárnu pro váš projekt',
      icon: 'Printer',
      color: 'bg-secondary text-secondary-foreground',
      action: () => navigate('/printer-catalog'),
      primary: false
    },
    {
      title: 'Express tisk',
      description: 'Rychlý tisk do 24 hodin',
      icon: 'Zap',
      color: 'bg-accent text-accent-foreground',
      action: () => navigate('/printer-catalog?express=true'),
      primary: false,
      badge: 'RYCHLE'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-2">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Rocket" size={20} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Rychlé akce</h2>
      </div>
      <div className="space-y-4">
        {quickActions?.map((action, index) => (
          <div
            key={index}
            className={`relative rounded-lg p-4 cursor-pointer transition-micro hover-scale ${
              action?.primary ? 'bg-primary/5 border border-primary/20' : 'bg-muted/50 hover:bg-muted'
            }`}
            onClick={action?.action}
          >
            {action?.badge && (
              <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                {action?.badge}
              </span>
            )}
            
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action?.color}`}>
                <Icon name={action?.icon} size={24} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">{action?.title}</h3>
                <p className="text-sm text-muted-foreground">{action?.description}</p>
              </div>
              
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Potřebujete pomoc?</h3>
            <p className="text-sm text-muted-foreground">Kontaktujte naši podporu</p>
          </div>
          <Button variant="outline" size="sm" iconName="HelpCircle" iconPosition="left">
            Podpora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;