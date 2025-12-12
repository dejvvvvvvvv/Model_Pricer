import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendedPrinters = ({ printers, onViewPrinter, onContactHost }) => {
  const formatPrice = (price) => {
    return `${price} Kč/g`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Star" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Doporučené tiskárny</h2>
        </div>
        <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
          Zobrazit vše
        </Button>
      </div>
      <div className="space-y-4">
        {printers?.map((printer) => (
          <div
            key={printer?.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-micro cursor-pointer"
            onClick={() => onViewPrinter(printer?.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={printer?.image}
                  alt={printer?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground truncate">{printer?.name}</h3>
                    <p className="text-sm text-muted-foreground">od {printer?.hostName}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-semibold text-foreground">{formatPrice(printer?.pricePerGram)}</p>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={12} className="text-warning fill-current" />
                      <span className="text-xs text-muted-foreground">{printer?.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-xs text-muted-foreground">
                    <Icon name="MapPin" size={12} className="inline mr-1" />
                    {printer?.location}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <Icon name="Clock" size={12} className="inline mr-1" />
                    {printer?.estimatedTime}
                  </span>
                  {printer?.isExpress && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                      <Icon name="Zap" size={10} className="mr-1" />
                      Express
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {printer?.materials?.slice(0, 3)?.map((material, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                    >
                      {material}
                    </span>
                  ))}
                  {printer?.materials?.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{printer?.materials?.length - 3} dalších
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      printer?.isAvailable ? 'bg-success' : 'bg-error'
                    }`} />
                    <span className="text-xs text-muted-foreground">
                      {printer?.isAvailable ? 'Dostupná' : 'Nedostupná'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MessageCircle"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onContactHost(printer?.hostId);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onViewPrinter(printer?.id);
                      }}
                    >
                      Vybrat
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {printers?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Printer" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">Žádné doporučení</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Nahrajte svůj první model pro personalizovaná doporučení
          </p>
          <Button variant="outline" iconName="Upload" iconPosition="left">
            Nahrát model
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendedPrinters;