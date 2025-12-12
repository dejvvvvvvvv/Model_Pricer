import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ filters, onFiltersChange, isOpen, onToggle, resultCount }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const materialOptions = [
    { id: 'pla', label: 'PLA', count: 45 },
    { id: 'abs', label: 'ABS', count: 32 },
    { id: 'petg', label: 'PETG', count: 28 },
    { id: 'tpu', label: 'TPU (Flexible)', count: 15 },
    { id: 'wood', label: 'Wood Fill', count: 12 },
    { id: 'metal', label: 'Metal Fill', count: 8 }
  ];

  const qualityOptions = [
    { id: '5', label: '5 hvězd', count: 18 },
    { id: '4', label: '4+ hvězd', count: 35 },
    { id: '3', label: '3+ hvězd', count: 52 },
    { id: '2', label: '2+ hvězd', count: 67 }
  ];

  const locationOptions = [
    { id: 'ostrava', label: 'Ostrava', count: 25 },
    { id: 'brno', label: 'Brno', count: 18 },
    { id: 'praha', label: 'Praha', count: 22 },
    { id: 'other', label: 'Ostatní města', count: 15 }
  ];

  const handleFilterChange = (category, value, checked) => {
    const newFilters = { ...localFilters };
    
    if (category === 'materials' || category === 'quality' || category === 'location') {
      if (!newFilters?.[category]) newFilters[category] = [];
      
      if (checked) {
        newFilters[category] = [...newFilters?.[category], value];
      } else {
        newFilters[category] = newFilters?.[category]?.filter(item => item !== value);
      }
    } else {
      newFilters[category] = value;
    }
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRangeChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      materials: [],
      bedSizeMin: '',
      bedSizeMax: '',
      priceMin: '',
      priceMax: '',
      quality: [],
      location: [],
      multicolor: false,
      expressAvailable: false,
      availableNow: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isExpanded, setIsExpanded] = useState(defaultOpen);
    
    return (
      <div className="border-b border-border pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left mb-4 hover:text-primary transition-micro"
        >
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="text-muted-foreground"
          />
        </button>
        {isExpanded && children}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={onToggle}
          iconName="Filter"
          iconPosition="left"
          className="w-full"
        >
          Filtry ({resultCount} tiskáren)
        </Button>
      </div>
      {/* Filter Panel */}
      <div className={`
        lg:block lg:static lg:w-80 lg:bg-transparent lg:shadow-none
        ${isOpen ? 'block' : 'hidden'}
        fixed inset-0 z-50 bg-card lg:z-auto
        lg:border-0 border-r border-border
        overflow-y-auto
      `}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-border bg-card sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Filtry</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            iconName="X"
          />
        </div>

        <div className="p-6 lg:p-0">
          {/* Results Count - Desktop */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Filtry</h2>
            <span className="text-sm text-muted-foreground">{resultCount} tiskáren</span>
          </div>

          {/* Clear All Filters */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="RotateCcw"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Vymazat vše
            </Button>
          </div>

          {/* Material Compatibility */}
          <FilterSection title="Kompatibilní materiály">
            <div className="space-y-3">
              {materialOptions?.map(material => (
                <div key={material?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={material?.label}
                    checked={localFilters?.materials?.includes(material?.id) || false}
                    onChange={(e) => handleFilterChange('materials', material?.id, e?.target?.checked)}
                  />
                  <span className="text-xs text-muted-foreground">({material?.count})</span>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Bed Size Range */}
          <FilterSection title="Velikost tiskové plochy (mm)">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters?.bedSizeMin || ''}
                  onChange={(e) => handleRangeChange('bedSizeMin', e?.target?.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters?.bedSizeMax || ''}
                  onChange={(e) => handleRangeChange('bedSizeMax', e?.target?.value)}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Běžné velikosti: 200×200, 300×300, 400×400
              </div>
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Cena za hodinu (Kč)">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters?.priceMin || ''}
                  onChange={(e) => handleRangeChange('priceMin', e?.target?.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters?.priceMax || ''}
                  onChange={(e) => handleRangeChange('priceMax', e?.target?.value)}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Průměrná cena: 150-400 Kč/hod
              </div>
            </div>
          </FilterSection>

          {/* Quality Rating */}
          <FilterSection title="Hodnocení kvality">
            <div className="space-y-3">
              {qualityOptions?.map(quality => (
                <div key={quality?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={quality?.label}
                    checked={localFilters?.quality?.includes(quality?.id) || false}
                    onChange={(e) => handleFilterChange('quality', quality?.id, e?.target?.checked)}
                  />
                  <span className="text-xs text-muted-foreground">({quality?.count})</span>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Location */}
          <FilterSection title="Lokalita">
            <div className="space-y-3">
              {locationOptions?.map(location => (
                <div key={location?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={location?.label}
                    checked={localFilters?.location?.includes(location?.id) || false}
                    onChange={(e) => handleFilterChange('location', location?.id, e?.target?.checked)}
                  />
                  <span className="text-xs text-muted-foreground">({location?.count})</span>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Special Features */}
          <FilterSection title="Speciální funkce">
            <div className="space-y-4">
              <Checkbox
                label="Vícebarevný tisk"
                description="Tiskárny s více extrudery"
                checked={localFilters?.multicolor || false}
                onChange={(e) => handleFilterChange('multicolor', e?.target?.checked)}
              />
              <Checkbox
                label="Expresní tisk"
                description="Dokončení do 24 hodin"
                checked={localFilters?.expressAvailable || false}
                onChange={(e) => handleFilterChange('expressAvailable', e?.target?.checked)}
              />
              <Checkbox
                label="Dostupné nyní"
                description="Okamžitě k dispozici"
                checked={localFilters?.availableNow || false}
                onChange={(e) => handleFilterChange('availableNow', e?.target?.checked)}
              />
            </div>
          </FilterSection>

          {/* Mobile Apply Button */}
          <div className="lg:hidden mt-8 pt-6 border-t border-border">
            <Button
              variant="default"
              fullWidth
              onClick={onToggle}
            >
              Zobrazit výsledky ({resultCount})
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default FilterPanel;