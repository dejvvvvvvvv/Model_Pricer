import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PrinterModal = ({ printer, isOpen, onClose, onSelect }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !printer) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === printer?.images?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? printer?.images?.length - 1 : prev - 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Přehled', icon: 'Info' },
    { id: 'specifications', label: 'Specifikace', icon: 'Settings' },
    { id: 'samples', label: 'Ukázky prací', icon: 'Image' },
    { id: 'reviews', label: 'Hodnocení', icon: 'Star' },
    { id: 'host', label: 'O hostiteli', icon: 'User' }
  ];

  const sampleWorks = [
    {
      id: 1,
      title: "Miniaturní figurka",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop",
      material: "PLA",
      printTime: "4h 30min",
      complexity: "Vysoká"
    },
    {
      id: 2,
      title: "Funkční díl",
      image: "https://images.unsplash.com/photo-1565191999001-551c187427bb?w=300&h=300&fit=crop",
      material: "ABS",
      printTime: "2h 15min",
      complexity: "Střední"
    },
    {
      id: 3,
      title: "Dekorativní váza",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      material: "PETG",
      printTime: "6h 45min",
      complexity: "Nízká"
    }
  ];

  const reviews = [
    {
      id: 1,
      author: "Tomáš K.",
      rating: 5,
      date: "15. listopadu 2024",
      comment: "Výborná kvalita tisku, rychlé dodání. Tiskárna je perfektně seřízená a výsledky jsou přesně podle očekávání."
    },
    {
      id: 2,
      author: "Marie S.",
      rating: 4,
      date: "8. listopadu 2024",
      comment: "Velmi spokojená s výsledkem. Komunikace s hostitelem byla skvělá, jen trochu delší doba tisku než očekáváno."
    },
    {
      id: 3,
      author: "Pavel N.",
      rating: 5,
      date: "2. listopadu 2024",
      comment: "Profesionální přístup, kvalitní materiály. Určitě budu využívat znovu pro další projekty."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{printer?.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Icon name="User" size={16} />
              <span>{printer?.host?.name}</span>
              <span>•</span>
              <Icon name="MapPin" size={16} />
              <span>{printer?.location}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Image Gallery */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-64 lg:h-full bg-muted">
              <Image
                src={printer?.images?.[currentImageIndex]}
                alt={printer?.name}
                className="w-full h-full object-cover"
              />
              
              {printer?.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <Icon name="ChevronLeft" size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <Icon name="ChevronRight" size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {printer?.images?.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-border">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
                    ${activeTab === tab?.id 
                      ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">{printer?.pricePerHour} Kč</div>
                      <div className="text-sm text-muted-foreground">za hodinu</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(printer?.rating)}
                      </div>
                      <div className="text-sm text-muted-foreground">{printer?.reviewCount} hodnocení</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold mb-3">Funkce</h3>
                    <div className="flex flex-wrap gap-2">
                      {printer?.features?.multicolor && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          <Icon name="Palette" size={14} />
                          Vícebarevný tisk
                        </span>
                      )}
                      {printer?.features?.express && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
                          <Icon name="Zap" size={14} />
                          Express tisk
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-success/10 text-success text-sm rounded-full">
                        <Icon name="Shield" size={14} />
                        Ověřená kvalita
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold mb-3">Popis</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {printer?.description}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Tisková plocha</span>
                      <span className="font-medium">{printer?.bedSize}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Výška tisku</span>
                      <span className="font-medium">{printer?.maxHeight}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Rozlišení vrstvy</span>
                      <span className="font-medium">{printer?.layerResolution}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Rychlost tisku</span>
                      <span className="font-medium">{printer?.printSpeed}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Podporované materiály</span>
                      <span className="font-medium">{printer?.materials?.join(', ')}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Počet extruderů</span>
                      <span className="font-medium">{printer?.extruders}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'samples' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Ukázky prací</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {sampleWorks?.map(work => (
                      <div key={work?.id} className="flex gap-4 p-4 bg-muted rounded-lg">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-background">
                          <Image
                            src={work?.image}
                            alt={work?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{work?.title}</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>Materiál: {work?.material}</div>
                            <div>Doba tisku: {work?.printTime}</div>
                            <div>Složitost: {work?.complexity}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Hodnocení zákazníků</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(printer?.rating)}
                      </div>
                      <span className="font-medium">{printer?.rating}</span>
                      <span className="text-muted-foreground">({printer?.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {reviews?.map(review => (
                      <div key={review?.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review?.author}</span>
                            <div className="flex items-center gap-1">
                              {renderStars(review?.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review?.date}</span>
                        </div>
                        <p className="text-muted-foreground">{review?.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'host' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="User" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{printer?.host?.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Calendar" size={14} />
                        <span>Člen od {printer?.host?.memberSince}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{printer?.host?.completedOrders}</div>
                      <div className="text-sm text-muted-foreground">Dokončených zakázek</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{printer?.host?.responseTime}</div>
                      <div className="text-sm text-muted-foreground">Doba odezvy</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">O hostiteli</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {printer?.host?.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">{printer?.pricePerHour} Kč/hod</div>
                  <div className="text-sm text-muted-foreground">
                    {printer?.availability === 'available' ? 'Dostupná nyní' : 'Momentálně nedostupná'}
                  </div>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => onSelect(printer)}
                  disabled={printer?.availability !== 'available'}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Vybrat tiskárnu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterModal;