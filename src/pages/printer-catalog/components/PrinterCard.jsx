import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PrinterCard = ({ printer, viewMode = 'grid', onSelect, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === printer?.images?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? printer?.images?.length - 1 : prev - 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < Math.floor(rating) ? 'Star' : 'Star'}
        size={14}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'text-success bg-success/10';
      case 'busy': return 'text-warning bg-warning/10';
      case 'offline': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getAvailabilityText = (status) => {
    switch (status) {
      case 'available': return 'Dostupná';
      case 'busy': return 'Zaneprázdněná';
      case 'offline': return 'Offline';
      default: return 'Neznámý';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-200 hover-scale">
        <div className="flex gap-6">
          {/* Image */}
          <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={printer?.images?.[currentImageIndex]}
              alt={printer?.name}
              className="w-full h-full object-cover"
            />
            {printer?.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <Icon name="ChevronLeft" size={12} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <Icon name="ChevronRight" size={12} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {printer?.images?.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{printer?.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="User" size={14} />
                  <span>{printer?.host?.name}</span>
                  <span>•</span>
                  <Icon name="MapPin" size={14} />
                  <span>{printer?.location}</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(printer?.availability)}`}>
                {getAvailabilityText(printer?.availability)}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Tisková plocha</div>
                <div className="text-sm font-medium">{printer?.bedSize}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Materiály</div>
                <div className="text-sm font-medium">{printer?.materials?.slice(0, 2)?.join(', ')}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Hodnocení</div>
                <div className="flex items-center gap-1">
                  {renderStars(printer?.rating)}
                  <span className="text-sm font-medium ml-1">({printer?.reviewCount})</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Cena</div>
                <div className="text-lg font-bold text-primary">{printer?.pricePerHour} Kč/hod</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {printer?.features?.multicolor && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    <Icon name="Palette" size={12} />
                    Vícebarevný
                  </span>
                )}
                {printer?.features?.express && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                    <Icon name="Zap" size={12} />
                    Express
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(printer)}
                >
                  Detail
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onSelect(printer)}
                  disabled={printer?.availability !== 'available'}
                >
                  Vybrat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 hover-scale">
      {/* Image Gallery */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={printer?.images?.[currentImageIndex]}
          alt={printer?.name}
          className="w-full h-full object-cover"
        />
        
        {/* Availability Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(printer?.availability)}`}>
          {getAvailabilityText(printer?.availability)}
        </div>

        {/* Image Navigation */}
        {printer?.images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {printer?.images?.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Features Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {printer?.features?.multicolor && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
              <Icon name="Palette" size={12} />
              Vícebarevný
            </span>
          )}
          {printer?.features?.express && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
              <Icon name="Zap" size={12} />
              Express
            </span>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">{printer?.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="User" size={14} />
            <span className="line-clamp-1">{printer?.host?.name}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tisková plocha:</span>
            <span className="font-medium">{printer?.bedSize}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Materiály:</span>
            <span className="font-medium">{printer?.materials?.slice(0, 2)?.join(', ')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Lokalita:</span>
            <span className="font-medium flex items-center gap-1">
              <Icon name="MapPin" size={12} />
              {printer?.location}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {renderStars(printer?.rating)}
          </div>
          <span className="text-sm font-medium">{printer?.rating}</span>
          <span className="text-sm text-muted-foreground">({printer?.reviewCount})</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">{printer?.pricePerHour} Kč</div>
            <div className="text-xs text-muted-foreground">za hodinu</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(printer)}
              iconName="Eye"
            />
            <Button
              variant="default"
              size="sm"
              onClick={() => onSelect(printer)}
              disabled={printer?.availability !== 'available'}
            >
              Vybrat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterCard;